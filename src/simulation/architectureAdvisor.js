/**
 * Intelligent Architecture Advisor & Connection Validator for InfraSim
 * Validates node relationships, detects nonsense/anti-pattern connections,
 * explains why components cannot connect directly, and recommends valid paths.
 */

/**
 * Rules matrix for validating edges between any two component categories/types.
 */
export function validateEdgeConnection(sourceNode, targetNode, allNodes = [], allEdges = []) {
  if (!sourceNode || !targetNode) return null;

  const sType = sourceNode.data?.type;
  const tType = targetNode.data?.type;
  const sName = sourceNode.data?.name || sType;
  const tName = targetNode.data?.name || tType;

  // 1. Client directly to Database
  if (sType === 'client' && ['postgresql', 'mysql', 'mongodb'].includes(tType)) {
    return {
      severity: 'critical',
      badge: 'Forbidden Connection',
      title: `Cannot Connect ${sName} Directly to ${tName}`,
      whyCantConnect: 'Web visitors cannot and should never open direct raw TCP connections to an SQL database. Exposing database port 5432/3306 to public clients leaks credentials, bypasses authentication, and invites immediate SQL injection.',
      whereTheyShouldConnect: [
        { path: 'Client ➔ Load Balancer ➔ Application Server ➔ Database', desc: 'Standard secure 3-tier web architecture' }
      ],
      quickFix: {
        label: 'Insert ALB & App Server',
        action: 'fix_client_db_direct',
        sourceId: sourceNode.id,
        targetId: targetNode.id
      }
    };
  }

  // 2. Client directly to Server (User's specific request: Website directly to Server with missing components)
  if (sType === 'client' && ['server', 'vm', 'container'].includes(tType)) {
    // Check if the target server has any database or storage
    const targetOutgoing = allEdges.filter(e => e.source === targetNode.id);
    const hasDatastore = targetOutgoing.some(e => {
      const dest = allNodes.find(n => n.id === e.target);
      return ['postgresql', 'mysql', 'mongodb', 'redis'].includes(dest?.data?.type);
    });

    const hasLoadBalancer = allNodes.some(n => ['load_balancer', 'api_gateway'].includes(n.data?.type));

    if (!hasDatastore || !hasLoadBalancer) {
      return {
        severity: 'warning',
        badge: 'Incomplete Website Pipeline',
        title: `Direct Client to ${tName} Needs Supporting Infrastructure`,
        whyCantConnect: `Connecting web clients directly to a lone ${tName} creates a Single Point of Failure (SPOF) with no SSL termination or health checks. Furthermore, your server currently has no Database attached—without a database, your server cannot persist user logins, accounts, or application state!`,
        whereTheyShouldConnect: [
          { path: 'Client ➔ Load Balancer ➔ Application Server', desc: 'Distributes traffic and provides SSL termination' },
          { path: 'Application Server ➔ PostgreSQL Database', desc: 'Stores persistent user accounts and application state' },
          { path: 'Application Server ➔ Redis Cache (Optional)', desc: 'Accelerates repeated queries in memory' }
        ],
        quickFix: {
          label: 'Add Load Balancer & Database',
          action: 'fix_client_server_direct',
          clientId: sourceNode.id,
          serverId: targetNode.id
        }
      };
    }
  }

  // 3. Client directly to Redis Cache
  if (sType === 'client' && tType === 'redis') {
    return {
      severity: 'critical',
      badge: 'Invalid Connection',
      title: `Cannot Connect ${sName} Directly to ${tName}`,
      whyCantConnect: 'Redis is an in-memory key-value cache designed for internal microsecond server queries. Redis has no public HTTP gateway, session management, or client authentication protocols. Public browsers cannot talk directly to Redis.',
      whereTheyShouldConnect: [
        { path: 'Client ➔ Server ➔ Redis Cache ➔ Database', desc: 'Application Server queries Redis first, then falls back to SQL' }
      ],
      quickFix: {
        label: 'Insert App Server',
        action: 'insert_server_for_redis',
        clientId: sourceNode.id,
        redisId: targetNode.id
      }
    };
  }

  // 4. Client directly to Message Queue
  if (sType === 'client' && ['queue', 'message_broker'].includes(tType)) {
    return {
      severity: 'warning',
      badge: 'Unmediated Queue Ingestion',
      title: `Cannot Ingest Raw Traffic from ${sName} into ${tName}`,
      whyCantConnect: 'Clients cannot push raw messages straight into message queues without payload validation, schema verification, and rate limiting. Otherwise, malicious users could flood the queue with garbage packets.',
      whereTheyShouldConnect: [
        { path: 'Client ➔ API Gateway / Server ➔ SQS Queue', desc: 'API validates incoming payload before publishing to queue' }
      ],
      quickFix: {
        label: 'Insert API Gateway',
        action: 'insert_api_gateway_for_queue',
        clientId: sourceNode.id,
        queueId: targetNode.id
      }
    };
  }

  // 5. CDN directly to Database
  if (sType === 'cdn' && ['postgresql', 'mysql', 'mongodb'].includes(tType)) {
    return {
      severity: 'critical',
      badge: 'Nonsense Connection',
      title: `Cannot Connect ${sName} Directly to ${tName}`,
      whyCantConnect: 'Content Delivery Networks (CDNs) are reverse proxies for caching HTTP assets (HTML, images, JS, JSON). CDNs do not speak database wire protocols and cannot parse SQL queries or handle relational transactions.',
      whereTheyShouldConnect: [
        { path: 'CDN ➔ Load Balancer ➔ Application Server', desc: 'CDN routes dynamic cache-misses to backend servers' },
        { path: 'CDN ➔ Object Storage (S3)', desc: 'CDN caches static images and media from object storage' }
      ],
      quickFix: {
        label: 'Route to Load Balancer',
        action: 'reroute_cdn_to_lb',
        cdnId: sourceNode.id,
        dbId: targetNode.id
      }
    };
  }

  // 6. Load Balancer directly to Database
  if (['load_balancer', 'api_gateway'].includes(sType) && ['postgresql', 'mysql', 'mongodb'].includes(tType)) {
    return {
      severity: 'critical',
      badge: 'Protocol Mismatch',
      title: `Cannot Route ${sName} Directly to ${tName}`,
      whyCantConnect: 'Application Load Balancers operate on Layer 7 HTTP/HTTPS. A relational database expects database connection handshakes (PostgreSQL port 5432). Routing web requests directly to a database without an application server will result in immediate 502 Bad Gateway errors.',
      whereTheyShouldConnect: [
        { path: 'Load Balancer ➔ Application Server ➔ Database', desc: 'App servers translate HTTP REST/GraphQL into SQL queries' }
      ],
      quickFix: {
        label: 'Insert Application Server',
        action: 'insert_server_between_lb_db',
        lbId: sourceNode.id,
        dbId: targetNode.id
      }
    };
  }

  // 7. Load Balancer directly to Redis
  if (['load_balancer', 'api_gateway'].includes(sType) && tType === 'redis') {
    return {
      severity: 'critical',
      badge: 'Protocol Incompatibility',
      title: `Cannot Balance HTTP Traffic from ${sName} into ${tName}`,
      whyCantConnect: 'Load Balancers distribute HTTP web traffic. Redis uses the RESP binary protocol. An Application Server is required to process HTTP requests and query Redis.',
      whereTheyShouldConnect: [
        { path: 'Load Balancer ➔ Application Server ➔ Redis Cache', desc: 'Compute servers query Redis for session tokens or cached items' }
      ],
      quickFix: {
        label: 'Insert Application Server',
        action: 'insert_server_between_lb_redis',
        lbId: sourceNode.id,
        redisId: targetNode.id
      }
    };
  }

  // 8. Queue directly to Database (No worker/consumer)
  if (['queue', 'message_broker'].includes(sType) && ['postgresql', 'mysql', 'mongodb'].includes(tType)) {
    return {
      severity: 'critical',
      badge: 'Passive Buffer Connection',
      title: `${sName} Cannot Write Directly to ${tName}`,
      whyCantConnect: 'Message Queues (like SQS or Kafka) are passive storage buffers. They cannot push data or execute SQL statements on their own. A worker (Server, Container, or Lambda function) must actively poll messages, deserialize them, and write them to the database.',
      whereTheyShouldConnect: [
        { path: 'Queue ➔ Background Worker (Container / Server) ➔ Database', desc: 'Worker consumes messages and writes records to database' }
      ],
      quickFix: {
        label: 'Insert Background Worker',
        action: 'insert_worker_between_queue_db',
        queueId: sourceNode.id,
        dbId: targetNode.id
      }
    };
  }

  // 9. Object Storage to Database
  if (['object_storage', 'block_storage', 'file_storage'].includes(sType) && ['postgresql', 'mysql', 'mongodb'].includes(tType)) {
    return {
      severity: 'warning',
      badge: 'Disconnected Storage Tiers',
      title: `Cannot Connect ${sName} Directly to ${tName}`,
      whyCantConnect: 'Object storage stores binary files (blobs), and databases store relational tables. Storage buckets cannot send queries to databases.',
      whereTheyShouldConnect: [
        { path: 'Application Server ➔ Database (Metadata)', desc: 'Store file metadata (IDs, URLs, timestamps) in SQL' },
        { path: 'Application Server ➔ Object Storage (Files)', desc: 'Store the actual heavy binary files in S3' }
      ],
      quickFix: {
        label: 'Route via App Server',
        action: 'reroute_storage_db',
        storageId: sourceNode.id,
        dbId: targetNode.id
      }
    };
  }

  // 10. Direct Database to Database connection
  if (['postgresql', 'mysql', 'mongodb'].includes(sType) && ['postgresql', 'mysql', 'mongodb'].includes(tType)) {
    return {
      severity: 'warning',
      badge: 'Split-Brain Architecture',
      title: `Direct Link Between ${sName} and ${tName}`,
      whyCantConnect: 'Connecting two independent primary databases directly creates split-brain synchronization issues. In cloud architectures, your Application Server should orchestrate data writes, or one database must be configured as an explicit read-replica.',
      whereTheyShouldConnect: [
        { path: 'Application Server ➔ Primary DB (Writes)', desc: 'Send mutating INSERT/UPDATE queries to Primary' },
        { path: 'Application Server ➔ Read Replica DB (Reads)', desc: 'Send SELECT queries to Read Replica to scale read throughput' }
      ],
      quickFix: {
        label: 'Connect via Server',
        action: 'fix_dual_db',
        sourceDbId: sourceNode.id,
        targetDbId: targetNode.id
      }
    };
  }

  return null;
}

/**
 * Main architecture analysis function
 */
export function analyzeArchitecture({ nodes = [], edges = [] }) {
  const suggestions = [];

  const clientNodes = nodes.filter(n => n.data?.type === 'client');
  const cdnNodes = nodes.filter(n => n.data?.type === 'cdn');
  const lbNodes = nodes.filter(n => ['load_balancer', 'api_gateway'].includes(n.data?.type));
  const computeNodes = nodes.filter(n => ['server', 'vm', 'container', 'serverless'].includes(n.data?.type));
  const dbNodes = nodes.filter(n => ['postgresql', 'mysql', 'mongodb'].includes(n.data?.type));
  const redisNodes = nodes.filter(n => n.data?.type === 'redis');
  const queueNodes = nodes.filter(n => ['queue', 'message_broker'].includes(n.data?.type));
  const storageNodes = nodes.filter(n => ['object_storage', 'block_storage', 'file_storage'].includes(n.data?.type));

  const isNodeConnected = (nodeId) => {
    return edges.some(e => e.source === nodeId || e.target === nodeId);
  };

  const incomingTo = (nodeId) => edges.filter(e => e.target === nodeId);
  const outgoingFrom = (nodeId) => edges.filter(e => e.source === nodeId);

  // A. Check every edge for invalid / nonsense connections
  edges.forEach(edge => {
    const sourceNode = nodes.find(n => n.id === edge.source);
    const targetNode = nodes.find(n => n.id === edge.target);

    const validation = validateEdgeConnection(sourceNode, targetNode, nodes, edges);
    if (validation) {
      suggestions.push({
        id: `invalid-edge-${edge.id}`,
        edgeId: edge.id,
        sourceNodeId: edge.source,
        targetNodeId: edge.target,
        sourceNodeName: sourceNode?.data?.name,
        targetNodeName: targetNode?.data?.name,
        ...validation
      });
    }
  });

  // B. Check for orphan/disconnected components
  nodes.forEach(node => {
    if (node.data?.type === 'client') return;
    if (!isNodeConnected(node.id)) {
      const type = node.data?.type;
      let recommendedConnect = 'Connect to an Application Server or Load Balancer.';
      if (['server', 'vm', 'container'].includes(type)) {
        recommendedConnect = 'Connect from Load Balancer (upstream) and to Database/Cache (downstream).';
      } else if (['postgresql', 'mysql', 'mongodb'].includes(type)) {
        recommendedConnect = 'Connect from an Application Server so backend code can execute queries.';
      } else if (type === 'redis') {
        recommendedConnect = 'Connect from an Application Server to serve cached keys in memory.';
      }

      suggestions.push({
        id: `orphan-${node.id}`,
        nodeId: node.id,
        nodeName: node.data?.name || 'Component',
        nodeType: node.data?.type,
        severity: 'warning',
        badge: 'Disconnected Component',
        title: `Unconnected ${node.data?.name || 'Component'}`,
        whyCantConnect: `This ${node.data?.name} is sitting on the canvas with 0 connections. In cloud infrastructure, an isolated service cannot receive requests or perform any workload.`,
        whereTheyShouldConnect: [
          { path: recommendedConnect, desc: 'Logical entrypoint & downstream pipeline' }
        ],
        quickFix: {
          label: `Connect ${node.data?.name}`,
          action: 'connect_orphan',
          targetId: node.id
        }
      });
    }
  });

  // C. Multiple Servers without a Load Balancer
  if (computeNodes.length >= 2 && lbNodes.length === 0) {
    suggestions.push({
      id: 'multi-server-no-lb',
      severity: 'warning',
      badge: 'Unbalanced Compute Tier',
      title: 'Multiple Servers Without a Load Balancer',
      whyCantConnect: `You have ${computeNodes.length} servers running without a Load Balancer. Incoming traffic cannot be divided evenly across IP addresses, causing one server to crash while others sit idle.`,
      whereTheyShouldConnect: [
        { path: 'Client ➔ Load Balancer ➔ Server 1, 2, 3', desc: 'Distributes traffic evenly with automated health checks' }
      ],
      quickFix: {
        label: 'Add Load Balancer',
        action: 'add_load_balancer'
      }
    });
  }

  // D. Standalone Redis Cache without Primary Database
  if (redisNodes.length > 0 && dbNodes.length === 0) {
    suggestions.push({
      id: 'redis-no-db',
      severity: 'warning',
      badge: 'Missing Primary Datastore',
      title: 'Redis Cache Used Without Primary Database',
      whyCantConnect: 'Redis is an in-memory ephemeral cache, not a durable database. If your application only uses Redis, all user data and passwords will be completely lost whenever the machine restarts.',
      whereTheyShouldConnect: [
        { path: 'Application Server ➔ Redis Cache ➔ PostgreSQL Primary', desc: 'Cache frequently read keys, persist state to durable disk' }
      ],
      quickFix: {
        label: 'Add PostgreSQL Primary',
        action: 'add_primary_db'
      }
    });
  }

  // E. Dangling Queue without Consumers/Workers
  queueNodes.forEach(queue => {
    const outgoing = outgoingFrom(queue.id);
    const hasConsumer = outgoing.some(e => {
      const target = nodes.find(n => n.id === e.target);
      return ['server', 'container', 'serverless'].includes(target?.data?.type);
    });

    if (!hasConsumer && incomingTo(queue.id).length > 0) {
      suggestions.push({
        id: `queue-no-worker-${queue.id}`,
        nodeId: queue.id,
        nodeName: queue.data?.name,
        severity: 'warning',
        badge: 'Dangling Message Buffer',
        title: `${queue.data?.name} Has No Background Worker`,
        whyCantConnect: 'Messages are being sent into this queue, but there is no Worker Server or Container pulling messages out. The queue will grow indefinitely until message memory overflows.',
        whereTheyShouldConnect: [
          { path: 'Queue ➔ Background Worker (Container) ➔ Database', desc: 'Worker polls messages and performs background tasks' }
        ],
        quickFix: {
          label: 'Add Background Worker',
          action: 'add_queue_worker',
          queueId: queue.id
        }
      });
    }
  });

  // F. Missing Compute Tier completely on non-empty canvas
  if (nodes.length > 1 && computeNodes.length === 0 && !nodes.some(n => n.data?.type === 'serverless')) {
    suggestions.push({
      id: 'no-compute-at-all',
      severity: 'critical',
      badge: 'No Compute Engine',
      title: 'Missing Application Compute Tier',
      whyCantConnect: 'Your architecture has networking or storage components but no compute layer (Servers or Containers). Your backend code and business logic have nowhere to execute.',
      whereTheyShouldConnect: [
        { path: 'Load Balancer ➔ Application Server ➔ Database', desc: 'Standard compute execution layer' }
      ],
      quickFix: {
        label: 'Add Application Server',
        action: 'add_basic_server'
      }
    });
  }

  // G. Performance Suggestion: High load on database without Redis
  if (dbNodes.length > 0 && redisNodes.length === 0 && computeNodes.length >= 3) {
    suggestions.push({
      id: 'suggest-redis-performance',
      severity: 'suggestion',
      badge: 'Performance Optimization',
      title: 'Consider Adding a Redis Query Cache',
      whyCantConnect: 'With multiple application servers querying a single database, database connections and CPU can quickly saturate under spike traffic. Adding Redis caching shields PostgreSQL by absorbing up to 70% of read queries.',
      whereTheyShouldConnect: [
        { path: 'Server ➔ Redis Cache ➔ PostgreSQL', desc: 'Cache repeated read queries to reduce database CPU by 70%' }
      ],
      quickFix: {
        label: 'Add Redis Cache',
        action: 'add_redis_cache'
      }
    });
  }

  return suggestions;
}
