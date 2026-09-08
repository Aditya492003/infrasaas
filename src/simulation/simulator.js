import { INSTANCE_SPECS, calculateLatency, getStatusFromUtilization } from './resourceModels.js';

/**
 * Deterministic Simulation Engine for InfraSim
 * Pure function: { nodes, edges, workload } -> { nodeMetrics, systemMetrics, bottleneck, status }
 */
export function runSimulation({ nodes = [], edges = [], workload = {} }) {
  const {
    concurrentUsers = 10000,
    requestsPerSecond = 1200,
    trafficMultiplier = 1,
    requestSize = 100, // KB
  } = workload;

  // Effective workload calculations
  const effectiveRps = Math.round(requestsPerSecond * trafficMultiplier);
  const effectiveUsers = Math.round(concurrentUsers * trafficMultiplier);
  const effectiveBandwidthMBps = (effectiveRps * requestSize) / 1024;

  const nodeMetrics = {};

  // Categorize nodes
  const clientNodes = nodes.filter(n => n.data?.type === 'client');
  const cdnNodes = nodes.filter(n => n.data?.type === 'cdn');
  const lbNodes = nodes.filter(n => n.data?.type === 'load_balancer');
  const computeNodes = nodes.filter(n => ['server', 'vm', 'container', 'serverless'].includes(n.data?.type));
  const dbNodes = nodes.filter(n => ['postgresql', 'mysql', 'mongodb'].includes(n.data?.type));
  const redisNodes = nodes.filter(n => n.data?.type === 'redis');
  const storageNodes = nodes.filter(n => ['object_storage', 'block_storage', 'file_storage'].includes(n.data?.type));
  const messagingNodes = nodes.filter(n => ['queue', 'message_broker'].includes(n.data?.type));

  // Check if Redis caching is connected to any compute/database
  const hasRedis = redisNodes.length > 0;
  const dbQueryMultiplier = hasRedis ? 0.75 : 2.5; // Redis reduces DB load by 70%

  // 1. Client Nodes
  clientNodes.forEach(node => {
    nodeMetrics[node.id] = {
      rps: effectiveRps,
      users: effectiveUsers,
      bandwidth: `${effectiveBandwidthMBps.toFixed(1)} MB/s`,
      status: 'healthy',
      utilization: 0,
      badgeText: `${effectiveUsers.toLocaleString()} Users`,
      metric1: { label: 'Active Users', value: effectiveUsers.toLocaleString() },
      metric2: { label: 'Generated RPS', value: `${effectiveRps.toLocaleString()}/s` }
    };
  });

  // 2. CDN Nodes
  cdnNodes.forEach(node => {
    const config = node.data?.config || {};
    const capacity = config.requestCapacity || 20000;
    const cacheHitRate = (config.cacheHitRate || 80) / 100;
    const handledRps = effectiveRps;
    const originRps = Math.round(effectiveRps * (1 - cacheHitRate * 0.4)); // 32% forwarded to origin
    const utilization = Math.min(100, Math.round((handledRps / capacity) * 100));
    const status = getStatusFromUtilization(utilization);

    nodeMetrics[node.id] = {
      rps: handledRps,
      originRps,
      cacheHitRate: `${Math.round(cacheHitRate * 100)}%`,
      utilization,
      status,
      metric1: { label: 'Edge RPS', value: `${handledRps.toLocaleString()}/s` },
      metric2: { label: 'Capacity', value: `${utilization}%` }
    };
  });

  // 3. Load Balancer Nodes
  lbNodes.forEach(node => {
    const config = node.data?.config || {};
    const capacity = config.requestCapacity || 10000;
    const utilization = Math.min(100, Math.round((effectiveRps / capacity) * 100));
    const status = getStatusFromUtilization(utilization);

    nodeMetrics[node.id] = {
      rps: effectiveRps,
      capacityPct: utilization,
      utilization,
      status,
      metric1: { label: 'Requests', value: `${effectiveRps.toLocaleString()}/s` },
      metric2: { label: 'Capacity', value: `${utilization}%` }
    };
  });

  // 7. Messaging Nodes
  messagingNodes.forEach(node => {
    const config = node.data?.config || {};
    const retention = config.messageRetention || 4;
    const msgQueueDepth = Math.round(effectiveRps * 2.5);
    const utilization = Math.min(100, Math.round((effectiveRps / 8000) * 100));
    const status = getStatusFromUtilization(utilization);

    nodeMetrics[node.id] = {
      rps: effectiveRps,
      queueDepth: msgQueueDepth,
      utilization,
      status,
      metric1: { label: 'In-Flight Messages', value: msgQueueDepth.toLocaleString() },
      metric2: { label: 'Retention', value: `${retention} hrs` }
    };
  });

  // 8. Security Nodes (WAF, KMS, Secrets Manager, IAM)
  const securityNodes = nodes.filter(n => ['waf', 'kms', 'secrets_manager', 'iam_identity'].includes(n.data?.type));
  securityNodes.forEach(node => {
    const type = node.data?.type;
    const config = node.data?.config || {};
    let utilization = 15;
    let label1 = 'Inspected RPS';
    let val1 = `${effectiveRps.toLocaleString()}/s`;
    let label2 = 'Rule Group';
    let val2 = config.ruleGroup || 'OWASP Top 10';

    if (type === 'waf') {
      const cap = config.requestLimit || 20000;
      utilization = Math.min(100, Math.round((effectiveRps / cap) * 100));
    } else if (type === 'kms') {
      label1 = 'Crypto Ops';
      val1 = `${Math.round(effectiveRps * 0.4)} ops/s`;
      label2 = 'Rotation';
      val2 = `${config.rotationYears || 1} Year`;
      utilization = Math.min(100, Math.round(((effectiveRps * 0.4) / 5000) * 100));
    } else if (type === 'secrets_manager') {
      label1 = 'Secret Vaults';
      val1 = `${config.secretCount || 10} Secrets`;
      label2 = 'Rotation Days';
      val2 = `${config.rotationDays || 30} Days`;
      utilization = 10;
    } else if (type === 'iam_identity') {
      label1 = 'Monthly Active Users';
      val1 = `${(config.monthlyActiveUsers || 50000).toLocaleString()}`;
      label2 = 'Auth Mode';
      val2 = config.mfaRequired ? 'OIDC + MFA' : 'OIDC Standard';
      utilization = Math.min(100, Math.round((effectiveUsers / 50000) * 100));
    }

    const status = getStatusFromUtilization(utilization);
    nodeMetrics[node.id] = {
      rps: effectiveRps,
      utilization,
      status,
      metric1: { label: label1, value: val1 },
      metric2: { label: label2, value: val2 }
    };
  });

  // 9. Analytics & AI Nodes (OpenSearch, Kinesis Stream, AI Inference)
  const analyticsNodes = nodes.filter(n => ['opensearch', 'kinesis_stream', 'ai_inference'].includes(n.data?.type));
  analyticsNodes.forEach(node => {
    const type = node.data?.type;
    const config = node.data?.config || {};
    let utilization = 25;
    let label1 = 'Ingest Rate';
    let val1 = `${effectiveRps.toLocaleString()} events/s`;
    let label2 = 'Cluster Size';
    let val2 = `${config.dataNodes || 3} Nodes`;

    if (type === 'opensearch') {
      const cap = (config.dataNodes || 3) * 1500;
      utilization = Math.min(100, Math.round((effectiveRps / cap) * 100));
      label1 = 'Query & Index RPS';
      val1 = `${Math.round(effectiveRps * 0.3)} qps`;
    } else if (type === 'kinesis_stream') {
      const shardCap = (config.shards || 4) * 1000;
      utilization = Math.min(100, Math.round((effectiveRps / shardCap) * 100));
      label1 = 'Stream Shards';
      val1 = `${config.shards || 4} Shards`;
      label2 = 'Retention';
      val2 = `${config.retentionHours || 24} hrs`;
    } else if (type === 'ai_inference') {
      const instanceCount = config.instanceCount || 1;
      const inferenceCap = instanceCount * 120; // 120 req/s per GPU
      utilization = Math.min(100, Math.round((effectiveRps / inferenceCap) * 100));
      label1 = 'LLM Tokens / s';
      val1 = `${(effectiveRps * 45).toLocaleString()} tok/s`;
      label2 = 'GPU Count';
      val2 = `${instanceCount} x ${config.accelerator || 'A10G'}`;
    }

    const status = getStatusFromUtilization(utilization);
    nodeMetrics[node.id] = {
      rps: effectiveRps,
      utilization,
      status,
      metric1: { label: label1, value: val1 },
      metric2: { label: label2, value: val2 }
    };
  });

  // 10. Observability & Monitoring Nodes (CloudWatch, Log Aggregator)
  const monitoringNodes = nodes.filter(n => ['cloudwatch_metrics', 'log_aggregator'].includes(n.data?.type));
  monitoringNodes.forEach(node => {
    const type = node.data?.type;
    const config = node.data?.config || {};
    let utilization = 15;
    let label1 = 'Tracked Metrics';
    let val1 = `${config.metricsCount || 100} Metrics`;
    let label2 = 'Alarms Active';
    let val2 = `${config.alarmCount || 15} Alarms`;

    if (type === 'log_aggregator') {
      label1 = 'Daily Log Volume';
      val1 = `${config.dailyLogVolumeGb || 50} GB/day`;
      label2 = 'Retention';
      val2 = `${config.retentionDays || 30} Days`;
      utilization = Math.min(100, Math.round(((config.dailyLogVolumeGb || 50) / 200) * 100));
    }

    const status = getStatusFromUtilization(utilization);
    nodeMetrics[node.id] = {
      rps: effectiveRps,
      utilization,
      status,
      metric1: { label: label1, value: val1 },
      metric2: { label: label2, value: val2 }
    };
  });

  // 4. Compute Nodes (Servers, VMs, Containers)
  const computeCount = Math.max(computeNodes.length, 1);
  const rpsPerCompute = Math.round(effectiveRps / computeCount);
  const usersPerCompute = Math.round(effectiveUsers / computeCount);

  computeNodes.forEach(node => {
    const config = node.data?.config || {};
    const instanceType = config.instanceType || 't3.medium';
    const instanceCount = Number(config.instances) || 1;
    const spec = INSTANCE_SPECS[instanceType] || { vcpu: 2, memory: 4, maxRpsPerInstance: 1000 };

    const totalCapacityRps = instanceCount * spec.maxRpsPerInstance;
    const totalMemoryGB = instanceCount * (config.memory || spec.memory || 4);

    // CPU utilization calculation
    const cpu = Math.min(100, Math.round((rpsPerCompute / totalCapacityRps) * 100));

    // Memory utilization calculation (active user sessions memory footprint)
    const memoryUsedGB = (usersPerCompute * 0.0004); // ~0.4 MB per active user state
    const memory = Math.min(100, Math.max(15, Math.round((memoryUsedGB / totalMemoryGB) * 100)));

    const maxUtil = Math.max(cpu, memory);
    const status = getStatusFromUtilization(maxUtil);

    nodeMetrics[node.id] = {
      cpu,
      memory,
      rps: rpsPerCompute,
      instances: instanceCount,
      utilization: maxUtil,
      status,
      metric1: { label: 'CPU', value: `${cpu}%` },
      metric2: { label: 'Memory', value: `${memory}%` },
      metric3: { label: 'RPS', value: `${rpsPerCompute.toLocaleString()}/s` }
    };
  });

  // 5. Database Nodes (PostgreSQL, MySQL, MongoDB)
  const dbCount = Math.max(dbNodes.length, 1);
  const queriesPerDb = Math.round((effectiveRps * dbQueryMultiplier) / dbCount);

  dbNodes.forEach(node => {
    const config = node.data?.config || {};
    const instanceType = config.instanceType || 'db.t3.medium';
    const spec = INSTANCE_SPECS[instanceType] || { maxConnections: 200, maxQps: 2500 };

    const maxConnections = Number(config.maxConnections) || spec.maxConnections || 200;
    const maxQps = spec.maxQps || 2500;

    // Database CPU increases with query volume
    const cpu = Math.min(100, Math.round((queriesPerDb / maxQps) * 100));

    // Database active connections scaling with concurrent user pool
    const estimatedConn = Math.round((effectiveUsers * 0.018) / (hasRedis ? 2.2 : 1.0));
    const activeConnections = Math.min(maxConnections, Math.max(12, estimatedConn));
    const connUtilization = Math.min(100, Math.round((activeConnections / maxConnections) * 100));

    const maxUtil = Math.max(cpu, connUtilization);
    const status = getStatusFromUtilization(maxUtil);

    nodeMetrics[node.id] = {
      cpu,
      connections: `${activeConnections}/${maxConnections}`,
      activeConnections,
      maxConnections,
      connUtilization,
      queriesPerSec: queriesPerDb,
      utilization: maxUtil,
      status,
      metric1: { label: 'CPU', value: `${cpu}%` },
      metric2: { label: 'Connections', value: `${activeConnections}/${maxConnections}` }
    };
  });

  // 6. Redis Nodes
  redisNodes.forEach(node => {
    const config = node.data?.config || {};
    const cacheCapacity = 45000;
    const cacheRps = Math.round(effectiveRps * 1.8);
    const cpu = Math.min(100, Math.max(5, Math.round((cacheRps / cacheCapacity) * 100)));
    const memory = Math.min(100, Math.max(12, Math.round((effectiveUsers * 0.00015 / 3.2) * 100)));
    const maxUtil = Math.max(cpu, memory);

    nodeMetrics[node.id] = {
      cpu,
      memory,
      rps: cacheRps,
      hitRate: '88%',
      utilization: maxUtil,
      status: getStatusFromUtilization(maxUtil),
      metric1: { label: 'Hit Rate', value: '88%' },
      metric2: { label: 'Memory', value: `${memory}%` }
    };
  });

  // 7. Storage Nodes (Object Storage, Block Storage, File Storage)
  storageNodes.forEach(node => {
    const config = node.data?.config || {};
    const maxThroughput = Number(config.readThroughput || 500); // MB/s
    const storageThroughput = Math.round(effectiveBandwidthMBps * 0.35); // 35% static asset/file requests
    const throughputUtil = Math.min(100, Math.round((storageThroughput / maxThroughput) * 100));
    const status = getStatusFromUtilization(throughputUtil);

    nodeMetrics[node.id] = {
      throughput: `${storageThroughput} MB/s`,
      utilization: throughputUtil,
      status,
      metric1: { label: 'Throughput', value: `${storageThroughput} MB/s` },
      metric2: { label: 'Capacity', value: `${throughputUtil}%` }
    };
  });

  // 8. Messaging Nodes (Queue, Message Broker)
  messagingNodes.forEach(node => {
    const queueDepth = Math.round(effectiveRps * 0.15);
    const queueCapacity = 5000;
    const util = Math.min(100, Math.round((queueDepth / queueCapacity) * 100));
    const status = getStatusFromUtilization(util);

    nodeMetrics[node.id] = {
      queueDepth,
      utilization: util,
      status,
      metric1: { label: 'Queue Depth', value: `${queueDepth} msg/s` },
      metric2: { label: 'Capacity', value: `${util}%` }
    };
  });

  // Find system-wide maximum utilization & isolate bottleneck
  let highestUtil = 0;
  let bottleneckNode = null;

  nodes.forEach(node => {
    const metrics = nodeMetrics[node.id];
    if (metrics && metrics.utilization > highestUtil && node.data?.type !== 'client') {
      highestUtil = metrics.utilization;
      bottleneckNode = node;
    }
  });

  // Compute System-wide status
  let systemStatus = 'healthy';
  if (highestUtil >= 95) {
    systemStatus = 'critical';
  } else if (highestUtil >= 80) {
    systemStatus = 'warning';
  }

  // System Latency via nonlinear curve
  const baseLatency = 45; // ms
  const averageLatency = calculateLatency(baseLatency, highestUtil);
  const p95Latency = Math.round(averageLatency * 1.72);

  // Throttled throughput under severe saturation
  let deliveredThroughput = effectiveRps;
  if (highestUtil >= 98) {
    deliveredThroughput = Math.round(effectiveRps * 0.65);
  } else if (highestUtil >= 95) {
    deliveredThroughput = Math.round(effectiveRps * 0.88);
  }

  // Bottleneck diagnostic details
  let bottleneck = null;
  if (bottleneckNode && highestUtil >= 75) {
    const bType = bottleneckNode.data?.type;
    const bName = bottleneckNode.data?.name || 'Service';
    const bMetrics = nodeMetrics[bottleneckNode.id];

    let message = '';
    let metricLabel = 'Utilization';
    let metricValue = `${highestUtil}%`;
    const recommendations = [];

    if (bType === 'postgresql' || bType === 'mysql' || bType === 'mongodb') {
      metricLabel = bMetrics.cpu > bMetrics.connUtilization ? 'DB CPU' : 'Connections';
      metricValue = bMetrics.cpu > bMetrics.connUtilization ? `${bMetrics.cpu}%` : `${bMetrics.connections}`;
      message = `${bName} is currently the primary bottleneck. Database CPU and connection utilization are approaching their configured limits. Increasing application servers alone will not improve overall throughput.`;
      recommendations.push(
        { id: 'upgrade_db', label: 'Increase DB Capacity', action: 'upgrade_db' },
        { id: 'add_redis', label: 'Add Redis Cache', action: 'add_redis' }
      );
    } else if (['server', 'vm', 'container'].includes(bType)) {
      metricLabel = 'Server CPU';
      metricValue = `${bMetrics.cpu}%`;
      message = `${bName} is operating near compute saturation (${bMetrics.cpu}% CPU). Traffic per node is exceeding the provisioned instance threshold.`;
      recommendations.push(
        { id: 'scale_servers', label: 'Scale Server Replicas (+2)', action: 'scale_servers' },
        { id: 'upgrade_server_type', label: 'Upgrade to t3.xlarge', action: 'upgrade_server_type' }
      );
    } else if (bType === 'load_balancer') {
      metricLabel = 'LB Capacity';
      metricValue = `${bMetrics.capacityPct}%`;
      message = `Load Balancer request capacity is saturated. Scale up the load balancer tier or configure multi-region routing.`;
      recommendations.push(
        { id: 'upgrade_lb', label: 'Upgrade Load Balancer Tier', action: 'upgrade_lb' }
      );
    } else {
      message = `${bName} has reached ${highestUtil}% capacity and is throttling downstream flow.`;
      recommendations.push(
        { id: 'scale_component', label: `Scale ${bName}`, action: 'scale_component' }
      );
    }

    bottleneck = {
      nodeId: bottleneckNode.id,
      nodeName: bName,
      nodeType: bType,
      metricLabel,
      metricValue,
      utilization: highestUtil,
      message,
      recommendations
    };
  }

  const systemMetrics = {
    throughput: deliveredThroughput,
    targetRps: effectiveRps,
    averageLatency,
    p95Latency,
    status: systemStatus,
    highestUtilization: highestUtil,
    concurrentUsers: effectiveUsers
  };

  return {
    nodeMetrics,
    systemMetrics,
    bottleneck,
    status: systemStatus
  };
}
