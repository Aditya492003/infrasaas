// Hardware specs, capacity definitions, and conversion curves

export const INSTANCE_SPECS = {
  // Compute Instances
  't3.micro': { vcpu: 2, memory: 1, maxRpsPerInstance: 300 },
  't3.small': { vcpu: 2, memory: 2, maxRpsPerInstance: 600 },
  't3.medium': { vcpu: 2, memory: 4, maxRpsPerInstance: 1000 },
  't3.large': { vcpu: 2, memory: 8, maxRpsPerInstance: 1800 },
  't3.xlarge': { vcpu: 4, memory: 16, maxRpsPerInstance: 3500 },
  'c5.xlarge': { vcpu: 4, memory: 8, maxRpsPerInstance: 4200 },
  'Standard_D2s_v3': { vcpu: 2, memory: 8, maxRpsPerInstance: 1200 },

  // Database Instances
  'db.t3.small': { vcpu: 2, memory: 2, maxConnections: 100, maxIops: 1500, maxQps: 1200 },
  'db.t3.medium': { vcpu: 4, memory: 16, maxConnections: 200, maxIops: 3000, maxQps: 2500 },
  'db.r5.large': { vcpu: 2, memory: 16, maxConnections: 400, maxIops: 6000, maxQps: 5000 },
  'db.r5.xlarge': { vcpu: 4, memory: 32, maxConnections: 800, maxIops: 12000, maxQps: 9000 },
  'db.m5.large': { vcpu: 2, memory: 8, maxConnections: 150, maxIops: 2500, maxQps: 2200 },
  'M30': { vcpu: 2, memory: 8, maxConnections: 500, maxIops: 3000, maxQps: 3000 },

  // Redis Cache Instances
  'cache.t3.micro': { memory: 0.5, maxConnections: 500, maxRps: 15000 },
  'cache.t3.medium': { memory: 3.2, maxConnections: 1000, maxRps: 45000 },
  'cache.r5.large': { memory: 13.0, maxConnections: 5000, maxRps: 120000 },
};

/**
 * Nonlinear latency curve based on utilization percentage [0-100]
 * < 70%   => baseline latency (30 - 60ms)
 * 70-85%  => gradually increasing latency (60 - 150ms)
 * 85-95%  => high latency (150 - 600ms)
 * > 95%   => severe latency / critical knee (600 - 3200ms)
 */
export function calculateLatency(baseLatencyMs, maxUtilizationPct) {
  const u = Math.min(Math.max(maxUtilizationPct / 100, 0), 0.999);
  
  if (u < 0.70) {
    return Math.round(baseLatencyMs * (1 + 0.3 * (u / 0.70)));
  } else if (u < 0.85) {
    const factor = (u - 0.70) / 0.15;
    return Math.round(baseLatencyMs * (1.3 + factor * 1.5));
  } else if (u < 0.95) {
    const factor = (u - 0.85) / 0.10;
    return Math.round(baseLatencyMs * (2.8 + factor * 4.5));
  } else {
    // Severe hockey-stick queueing saturation
    const factor = (u - 0.95) / 0.05;
    return Math.round(baseLatencyMs * (7.3 + factor * 25));
  }
}

/**
 * Evaluate health status based on utilization percentage
 */
export function getStatusFromUtilization(utilizationPct) {
  if (utilizationPct >= 95) return 'critical';
  if (utilizationPct >= 80) return 'warning';
  return 'healthy';
}
