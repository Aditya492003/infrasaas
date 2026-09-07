export const COMPONENT_CATEGORIES = [
  {
    id: 'compute',
    name: 'COMPUTE',
    items: [
      {
        type: 'server',
        name: 'Server',
        icon: 'Server',
        description: 'Compute instance cluster',
        category: 'compute',
        defaultConfig: {
          instanceType: 't3.medium',
          instances: 3,
          vcpu: 2,
          memory: 4,
          region: 'Mumbai'
        }
      },
      {
        type: 'vm',
        name: 'VM',
        icon: 'Monitor',
        description: 'Dedicated virtual machine',
        category: 'compute',
        defaultConfig: {
          instanceType: 'Standard_D2s_v3',
          instances: 2,
          vcpu: 2,
          memory: 8,
          region: 'Mumbai'
        }
      },
      {
        type: 'container',
        name: 'Container',
        icon: 'Box',
        description: 'Managed container cluster',
        category: 'compute',
        defaultConfig: {
          taskCount: 4,
          cpu: '1 vCPU',
          memory: '2 GB',
          platform: 'Fargate'
        }
      },
      {
        type: 'serverless',
        name: 'Serverless',
        icon: 'Zap',
        description: 'On-demand function runtime',
        category: 'compute',
        defaultConfig: {
          runtime: 'Node.js 20',
          memory: 512,
          concurrency: 1000,
          timeout: 15
        }
      }
    ]
  },
  {
    id: 'network',
    name: 'NETWORK',
    items: [
      {
        type: 'load_balancer',
        name: 'Load Balancer',
        icon: 'Split',
        description: 'High availability traffic distributor',
        category: 'network',
        defaultConfig: {
          algorithm: 'Round Robin',
          requestCapacity: 10000,
          connectionCapacity: 50000
        }
      },
      {
        type: 'api_gateway',
        name: 'API Gateway',
        icon: 'DoorOpen',
        description: 'API endpoint routing & throttling',
        category: 'network',
        defaultConfig: {
          rateLimit: 5000,
          burstLimit: 10000
        }
      },
      {
        type: 'cdn',
        name: 'CDN',
        icon: 'Globe',
        description: 'Global edge distribution & caching',
        category: 'network',
        defaultConfig: {
          requestCapacity: 20000,
          bandwidth: '5 Gbps',
          cacheHitRate: 80
        }
      }
    ]
  },
  {
    id: 'database',
    name: 'DATABASE',
    items: [
      {
        type: 'postgresql',
        name: 'PostgreSQL',
        icon: 'Database',
        description: 'Relational ACID SQL database',
        category: 'database',
        defaultConfig: {
          instanceType: 'db.t3.medium',
          vcpu: 4,
          memory: 16,
          storage: 100,
          maxConnections: 200,
          iops: 3000
        }
      },
      {
        type: 'mysql',
        name: 'MySQL',
        icon: 'Database',
        description: 'High-speed relational database',
        category: 'database',
        defaultConfig: {
          instanceType: 'db.m5.large',
          vcpu: 2,
          memory: 8,
          storage: 100,
          maxConnections: 150,
          iops: 2500
        }
      },
      {
        type: 'mongodb',
        name: 'MongoDB',
        icon: 'Layers',
        description: 'Document-oriented NoSQL database',
        category: 'database',
        defaultConfig: {
          clusterTier: 'M30',
          memory: 8,
          storage: 50,
          maxConnections: 500
        }
      },
      {
        type: 'redis',
        name: 'Redis',
        icon: 'Flame',
        description: 'In-memory key-value cache',
        category: 'database',
        defaultConfig: {
          nodeType: 'cache.t3.medium',
          memory: 3.2,
          maxConnections: 1000,
          evictionPolicy: 'allkeys-lru'
        }
      }
    ]
  },
  {
    id: 'storage',
    name: 'STORAGE',
    items: [
      {
        type: 'object_storage',
        name: 'Object Storage',
        icon: 'HardDrive',
        description: 'Scalable blob/asset storage',
        category: 'storage',
        defaultConfig: {
          capacity: 1000,
          readThroughput: 500,
          writeThroughput: 250
        }
      },
      {
        type: 'block_storage',
        name: 'Block Storage',
        icon: 'Disc',
        description: 'Low-latency EBS persistent volume',
        category: 'storage',
        defaultConfig: {
          volumeType: 'gp3',
          size: 500,
          iops: 3000,
          throughput: 125
        }
      },
      {
        type: 'file_storage',
        name: 'File Storage',
        icon: 'FolderTree',
        description: 'Shared NFS cloud filesystem',
        category: 'storage',
        defaultConfig: {
          size: 1000,
          throughputMode: 'Bursting',
          provisionedThroughput: 100
        }
      }
    ]
  },
  {
    id: 'messaging',
    name: 'MESSAGING',
    items: [
      {
        type: 'queue',
        name: 'Queue',
        icon: 'ListOrdered',
        description: 'Asynchronous SQS message queue',
        category: 'messaging',
        defaultConfig: {
          messageRetention: 4,
          maxMessageSize: 256,
          visibilityTimeout: 30
        }
      },
      {
        type: 'message_broker',
        name: 'Message Broker',
        icon: 'Radio',
        description: 'Distributed event streaming pub/sub',
        category: 'messaging',
        defaultConfig: {
          brokerType: 'Kafka',
          partitions: 6,
          replicationFactor: 3
        }
      }
    ]
  }
];

export const ALL_COMPONENTS = COMPONENT_CATEGORIES.flatMap(cat => cat.items);

export const getComponentDef = (type) => {
  return ALL_COMPONENTS.find(item => item.type === type) || {
    type,
    name: type,
    icon: 'Cpu',
    description: 'Infrastructure Service',
    category: 'compute',
    defaultConfig: {}
  };
};
