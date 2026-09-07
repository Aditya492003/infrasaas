export const DEFAULT_NODES = [
  {
    id: 'client-1',
    type: 'client',
    position: { x: 380, y: 20 },
    data: {
      label: 'Traffic Source',
      type: 'client',
      name: 'Global Clients',
      config: {
        description: 'Web & Mobile Users'
      }
    }
  },
  {
    id: 'cdn-1',
    type: 'infrastructure',
    position: { x: 380, y: 140 },
    data: {
      type: 'cdn',
      name: 'Cloud CDN',
      category: 'network',
      config: {
        requestCapacity: 20000,
        bandwidth: '5 Gbps',
        cacheHitRate: 80
      }
    }
  },
  {
    id: 'lb-1',
    type: 'infrastructure',
    position: { x: 380, y: 260 },
    data: {
      type: 'load_balancer',
      name: 'Load Balancer',
      category: 'network',
      config: {
        algorithm: 'Round Robin',
        requestCapacity: 10000,
        connectionCapacity: 50000
      }
    }
  },
  {
    id: 'server-1',
    type: 'infrastructure',
    position: { x: 130, y: 390 },
    data: {
      type: 'server',
      name: 'Server 1',
      category: 'compute',
      config: {
        instanceType: 't3.medium',
        instances: 1,
        vcpu: 2,
        memory: 4,
        region: 'Mumbai'
      }
    }
  },
  {
    id: 'server-2',
    type: 'infrastructure',
    position: { x: 380, y: 390 },
    data: {
      type: 'server',
      name: 'Server 2',
      category: 'compute',
      config: {
        instanceType: 't3.medium',
        instances: 1,
        vcpu: 2,
        memory: 4,
        region: 'Mumbai'
      }
    }
  },
  {
    id: 'server-3',
    type: 'infrastructure',
    position: { x: 630, y: 390 },
    data: {
      type: 'server',
      name: 'Server 3',
      category: 'compute',
      config: {
        instanceType: 't3.medium',
        instances: 1,
        vcpu: 2,
        memory: 4,
        region: 'Mumbai'
      }
    }
  },
  {
    id: 'db-1',
    type: 'infrastructure',
    position: { x: 260, y: 550 },
    data: {
      type: 'postgresql',
      name: 'PostgreSQL',
      category: 'database',
      config: {
        instanceType: 'db.t3.medium',
        vcpu: 4,
        memory: 16,
        storage: 100,
        maxConnections: 200,
        iops: 3000
      }
    }
  },
  {
    id: 'storage-1',
    type: 'infrastructure',
    position: { x: 500, y: 550 },
    data: {
      type: 'object_storage',
      name: 'Object Storage',
      category: 'storage',
      config: {
        capacity: 1000,
        readThroughput: 500,
        writeThroughput: 250
      }
    }
  }
];

export const DEFAULT_EDGES = [
  { id: 'e-client-cdn', source: 'client-1', target: 'cdn-1', animated: true },
  { id: 'e-cdn-lb', source: 'cdn-1', target: 'lb-1', animated: true },
  { id: 'e-lb-s1', source: 'lb-1', target: 'server-1', animated: true },
  { id: 'e-lb-s2', source: 'lb-1', target: 'server-2', animated: true },
  { id: 'e-lb-s3', source: 'lb-1', target: 'server-3', animated: true },
  { id: 'e-s1-db', source: 'server-1', target: 'db-1' },
  { id: 'e-s2-db', source: 'server-2', target: 'db-1' },
  { id: 'e-s3-db', source: 'server-3', target: 'db-1' },
  { id: 'e-s2-storage', source: 'server-2', target: 'storage-1' },
  { id: 'e-s3-storage', source: 'server-3', target: 'storage-1' },
];
