import { getComponentDef } from './infrastructureTypes';

/**
 * Intelligent Architecture Scaffolder & AI Generator
 * Generates tailored node graphs, edges, and workload configurations based on user prompts.
 */
export function generateArchitectureFromPrompt(prompt = '', options = {}) {
  const text = prompt.toLowerCase();

  const nodes = [];
  const edges = [];
  let workload = {
    concurrentUsers: 10000,
    requestsPerSecond: 1200,
    trafficMultiplier: 1,
    requestSize: 100,
  };

  // 1. Always start with Client Traffic Source
  nodes.push({
    id: 'client-1',
    type: 'client',
    position: { x: 380, y: 30 },
    data: {
      type: 'client',
      name: 'Global Clients',
      config: { description: 'Web & Mobile Traffic' }
    }
  });

  let currentY = 150;
  let previousTierIds = ['client-1'];

  // Check if CDN is needed (media, streaming, e-commerce, global, assets)
  const wantsCdn = text.includes('cdn') || text.includes('stream') || text.includes('media') || text.includes('video') || text.includes('e-commerce') || text.includes('global') || text.includes('static');
  if (wantsCdn) {
    const cdnDef = getComponentDef('cdn');
    nodes.push({
      id: 'cdn-1',
      type: 'infrastructure',
      position: { x: 380, y: currentY },
      data: {
        type: 'cdn',
        name: 'Cloud CDN',
        category: 'network',
        config: { ...cdnDef.defaultConfig, cacheHitRate: 85 }
      }
    });
    edges.push({ id: 'e-client-cdn', source: 'client-1', target: 'cdn-1', animated: true });
    previousTierIds = ['cdn-1'];
    currentY += 120;
  }

  // Network Gateway / Load Balancer
  const isServerless = text.includes('serverless') || text.includes('lambda');
  const gatewayType = isServerless ? 'api_gateway' : 'load_balancer';
  const gatewayName = isServerless ? 'API Gateway' : 'Application Load Balancer';
  const gatewayDef = getComponentDef(gatewayType);

  nodes.push({
    id: 'gateway-1',
    type: 'infrastructure',
    position: { x: 380, y: currentY },
    data: {
      type: gatewayType,
      name: gatewayName,
      category: 'network',
      config: { ...gatewayDef.defaultConfig }
    }
  });

  previousTierIds.forEach(prevId => {
    edges.push({ id: `e-${prevId}-gateway`, source: prevId, target: 'gateway-1', animated: true });
  });
  previousTierIds = ['gateway-1'];
  currentY += 140;

  // Compute Tier
  const isMicroservices = text.includes('microservice') || text.includes('container') || text.includes('docker') || text.includes('k8s');
  const computeType = isServerless ? 'serverless' : isMicroservices ? 'container' : 'server';
  const computeCount = text.includes('high') || text.includes('viral') || text.includes('scale') ? 4 : 3;
  const computeIds = [];

  const startX = computeCount === 4 ? 60 : 130;
  const spacingX = computeCount === 4 ? 210 : 250;

  for (let i = 1; i <= computeCount; i++) {
    const sId = `compute-${i}`;
    computeIds.push(sId);
    const cDef = getComponentDef(computeType);
    const compName = isServerless 
      ? `Function Worker ${i}` 
      : isMicroservices 
      ? `Service Container ${i}` 
      : `App Server ${i}`;

    nodes.push({
      id: sId,
      type: 'infrastructure',
      position: { x: startX + (i - 1) * spacingX, y: currentY },
      data: {
        type: computeType,
        name: compName,
        category: 'compute',
        config: { 
          ...cDef.defaultConfig,
          instanceType: text.includes('heavy') ? 't3.large' : 't3.medium',
          instances: 1
        }
      }
    });

    edges.push({ id: `e-gw-${sId}`, source: 'gateway-1', target: sId, animated: true });
  }

  currentY += 160;

  // Caching Tier (Redis)
  const wantsRedis = text.includes('redis') || text.includes('cache') || text.includes('fast') || text.includes('flash') || text.includes('e-commerce') || text.includes('session');
  if (wantsRedis) {
    const redisDef = getComponentDef('redis');
    const redisId = 'redis-cache-1';
    nodes.push({
      id: redisId,
      type: 'infrastructure',
      position: { x: 480, y: currentY },
      data: {
        type: 'redis',
        name: 'Redis Cluster Cache',
        category: 'database',
        config: { ...redisDef.defaultConfig }
      }
    });

    // Connect middle compute to Redis
    computeIds.forEach((cId, idx) => {
      if (idx % 2 === 0) {
        edges.push({ id: `e-${cId}-redis`, source: cId, target: redisId });
      }
    });
  }

  // Database Tier
  const isNoSql = text.includes('mongo') || text.includes('nosql') || text.includes('document');
  const dbType = isNoSql ? 'mongodb' : text.includes('mysql') ? 'mysql' : 'postgresql';
  const dbDef = getComponentDef(dbType);
  const dbId = 'db-primary-1';

  nodes.push({
    id: dbId,
    type: 'infrastructure',
    position: { x: wantsRedis ? 220 : 380, y: currentY },
    data: {
      type: dbType,
      name: isNoSql ? 'MongoDB Cluster' : dbType === 'mysql' ? 'MySQL Primary' : 'PostgreSQL Primary',
      category: 'database',
      config: {
        ...dbDef.defaultConfig,
        instanceType: text.includes('enterprise') || text.includes('heavy') ? 'db.r5.large' : 'db.t3.medium',
        maxConnections: text.includes('scale') ? 400 : 200
      }
    }
  });

  computeIds.forEach(cId => {
    edges.push({ id: `e-${cId}-db`, source: cId, target: dbId });
  });

  // Storage / Queue additions
  const wantsStorage = text.includes('storage') || text.includes('upload') || text.includes('file') || text.includes('pdf') || text.includes('image') || text.includes('s3') || text.includes('video');
  if (wantsStorage) {
    const storageDef = getComponentDef('object_storage');
    const storageId = 'storage-vault-1';
    nodes.push({
      id: storageId,
      type: 'infrastructure',
      position: { x: 740, y: currentY },
      data: {
        type: 'object_storage',
        name: 'S3 Asset Vault',
        category: 'storage',
        config: { ...storageDef.defaultConfig }
      }
    });
    edges.push({ id: `e-${computeIds[computeIds.length - 1]}-storage`, source: computeIds[computeIds.length - 1], target: storageId });
  }

  const wantsQueue = text.includes('queue') || text.includes('kafka') || text.includes('async') || text.includes('event') || text.includes('process');
  if (wantsQueue) {
    const queueDef = getComponentDef(text.includes('kafka') ? 'message_broker' : 'queue');
    const qId = 'queue-stream-1';
    nodes.push({
      id: qId,
      type: 'infrastructure',
      position: { x: 380, y: currentY + 140 },
      data: {
        type: text.includes('kafka') ? 'message_broker' : 'queue',
        name: text.includes('kafka') ? 'Kafka Event Stream' : 'SQS Job Queue',
        category: 'messaging',
        config: { ...queueDef.defaultConfig }
      }
    });
    edges.push({ id: `e-db-queue`, source: dbId, target: qId });
  }

  // Configure workload according to intent
  if (text.includes('viral') || text.includes('flash') || text.includes('high traffic') || text.includes('100k')) {
    workload = {
      concurrentUsers: 50000,
      requestsPerSecond: 5500,
      trafficMultiplier: 2,
      requestSize: 120,
    };
  } else if (text.includes('mvp') || text.includes('small') || text.includes('starter')) {
    workload = {
      concurrentUsers: 2500,
      requestsPerSecond: 300,
      trafficMultiplier: 1,
      requestSize: 60,
    };
  } else {
    workload = {
      concurrentUsers: 15000,
      requestsPerSecond: 1600,
      trafficMultiplier: 1,
      requestSize: 100,
    };
  }

  return { nodes, edges, workload };
}

/**
 * Standard Pre-built Templates
 */
export const BLUEPRINT_TEMPLATES = [
  {
    id: 'blank',
    title: 'Blank Canvas',
    badge: 'Clean Slate',
    badgeColor: 'bg-slate-100 text-slate-700',
    description: 'Start with a completely empty canvas. Drag and drop services, customize specs, and design from scratch.',
    icon: 'Layers',
    prompt: '',
    generator: () => ({
      nodes: [
        {
          id: 'client-1',
          type: 'client',
          position: { x: 380, y: 50 },
          data: {
            type: 'client',
            name: 'Global Clients',
            config: { description: 'Traffic Source' }
          }
        }
      ],
      edges: [],
      workload: {
        concurrentUsers: 10000,
        requestsPerSecond: 1200,
        trafficMultiplier: 1,
        requestSize: 100,
      }
    })
  },
  {
    id: 'standard-3-tier',
    title: 'Standard 3-Tier Web Application',
    badge: 'Recommended',
    badgeColor: 'bg-indigo-100 text-indigo-700',
    description: 'The proven enterprise architecture: Cloud CDN, Load Balancer, 3 Application Servers, PostgreSQL database, and S3 Storage.',
    icon: 'Server',
    prompt: 'Production web application with CDN, load balancer, 3 application servers, postgresql database, and object storage.',
    generator: () => generateArchitectureFromPrompt('Production web app with cdn, load balancer, servers, postgresql, and storage')
  },
  {
    id: 'high-perf-cache',
    title: 'High-Throughput E-Commerce & Flash Sale',
    badge: 'High Traffic',
    badgeColor: 'bg-amber-100 text-amber-800',
    description: 'Built for extreme read traffic: includes Redis in-memory caching cluster to shield PostgreSQL from connection exhaustion.',
    icon: 'Flame',
    prompt: 'High traffic e-commerce store with Redis caching, PostgreSQL database, and 4 compute servers.',
    generator: () => generateArchitectureFromPrompt('High traffic e-commerce store with redis cache, postgresql database, and 4 servers')
  },
  {
    id: 'event-microservices',
    title: 'Event-Driven Microservices with Kafka',
    badge: 'Microservices',
    badgeColor: 'bg-purple-100 text-purple-700',
    description: 'API Gateway routing to containerized microservice tasks, MongoDB document store, and Kafka event streaming broker.',
    icon: 'Radio',
    prompt: 'Microservices architecture with API Gateway, container tasks, MongoDB, and Kafka event broker.',
    generator: () => generateArchitectureFromPrompt('Microservices architecture with api gateway, container tasks, mongodb, and kafka')
  },
  {
    id: 'serverless-api',
    title: 'Serverless Cloud API',
    badge: 'On-Demand',
    badgeColor: 'bg-emerald-100 text-emerald-800',
    description: 'Modern serverless stack: Edge CDN, API Gateway, Node.js Lambda functions, and managed MySQL database.',
    icon: 'Zap',
    prompt: 'Serverless API architecture with edge CDN, API gateway, lambda functions, and mysql.',
    generator: () => generateArchitectureFromPrompt('Serverless api with cdn, api gateway, lambda functions, and mysql')
  }
];
