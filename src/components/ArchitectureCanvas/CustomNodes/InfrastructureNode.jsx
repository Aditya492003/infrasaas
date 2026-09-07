import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { 
  Server, 
  Monitor, 
  Box, 
  Zap, 
  Split, 
  DoorOpen, 
  Globe, 
  Database, 
  Layers, 
  Flame, 
  HardDrive, 
  Disc, 
  FolderTree, 
  ListOrdered, 
  Radio, 
  Cpu,
  AlertTriangle,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';

const ICON_MAP = {
  server: Server,
  vm: Monitor,
  container: Box,
  serverless: Zap,
  load_balancer: Split,
  api_gateway: DoorOpen,
  cdn: Globe,
  postgresql: Database,
  mysql: Database,
  mongodb: Layers,
  redis: Flame,
  object_storage: HardDrive,
  block_storage: Disc,
  file_storage: FolderTree,
  queue: ListOrdered,
  message_broker: Radio,
  cpu: Cpu
};

export const InfrastructureNode = memo(({ data, selected }) => {
  const { name, type, config = {}, metrics = null, isBottleneck = false } = data;
  const IconComponent = ICON_MAP[type] || Cpu;

  const status = metrics?.status || 'idle';

  // Subtitle generation based on component type
  const getSubtitle = () => {
    if (['server', 'vm'].includes(type)) {
      const instances = config.instances || 1;
      return `${config.instanceType || 't3.medium'} • ${instances} instance${instances > 1 ? 's' : ''}`;
    }
    if (type === 'container') {
      return `${config.taskCount || 4} tasks (${config.platform || 'Fargate'})`;
    }
    if (type === 'serverless') {
      return `${config.runtime || 'Node.js 20'} • ${config.memory || 512}MB`;
    }
    if (['postgresql', 'mysql'].includes(type)) {
      return `${config.instanceType || 'db.t3.medium'} • ${config.storage || 100}GB`;
    }
    if (type === 'mongodb') {
      return `${config.clusterTier || 'M30'} • ${config.storage || 50}GB`;
    }
    if (type === 'redis') {
      return `${config.nodeType || 'cache.t3.medium'} • ${config.memory || 3.2}GB`;
    }
    if (type === 'load_balancer') {
      return `${config.algorithm || 'Round Robin'}`;
    }
    if (type === 'cdn') {
      return `Cache: ${config.cacheHitRate || 80}% • ${config.bandwidth || '5 Gbps'}`;
    }
    if (type === 'object_storage') {
      return `${config.capacity || 1000} GB • S3 Tier`;
    }
    if (type === 'queue') {
      return `SQS • ${config.visibilityTimeout || 30}s timeout`;
    }
    return 'Managed Service';
  };

  // Status visual configurations
  const getStatusBorder = () => {
    if (selected) return 'border-indigo-600 ring-2 ring-indigo-100 shadow-md';
    if (status === 'critical') return 'border-rose-400 ring-1 ring-rose-200 bg-rose-50/20';
    if (status === 'warning') return 'border-amber-400 ring-1 ring-amber-200 bg-amber-50/20';
    return 'border-slate-200 hover:border-slate-300';
  };

  const getStatusBadge = () => {
    if (status === 'critical') {
      return (
        <span className="flex items-center gap-1 text-[10px] font-semibold text-rose-700 bg-rose-100 px-1.5 py-0.5 rounded">
          <AlertCircle className="w-3 h-3 text-rose-600 animate-pulse" />
          Critical
        </span>
      );
    }
    if (status === 'warning') {
      return (
        <span className="flex items-center gap-1 text-[10px] font-semibold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded">
          <AlertTriangle className="w-3 h-3 text-amber-600" />
          Warning
        </span>
      );
    }
    if (status === 'healthy') {
      return (
        <span className="flex items-center gap-1 text-[10px] font-medium text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
          Healthy
        </span>
      );
    }
    return null;
  };

  return (
    <div 
      className={`relative w-[210px] bg-white rounded-lg border transition-all duration-150 shadow-sm text-left select-none ${getStatusBorder()}`}
    >
      {/* React Flow Connection Handles */}
      <Handle type="target" position={Position.Top} className="!bg-slate-400" />
      <Handle type="source" position={Position.Bottom} className="!bg-slate-400" />
      <Handle type="target" position={Position.Left} id="left" className="!bg-slate-300" />
      <Handle type="source" position={Position.Right} id="right" className="!bg-slate-300" />

      {/* Bottleneck Marker Pin */}
      {isBottleneck && (
        <div className="absolute -top-3 -right-2 bg-rose-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-0.5 z-10">
          <span>Bottleneck</span>
        </div>
      )}

      {/* Node Header */}
      <div className="p-2.5 pb-2 border-b border-slate-100 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-6 h-6 rounded bg-slate-100 border border-slate-200/80 flex items-center justify-center flex-shrink-0 text-slate-700">
            <IconComponent className="w-3.5 h-3.5" />
          </div>
          <div className="truncate">
            <div className="text-xs font-semibold text-slate-800 truncate leading-tight">{name}</div>
            <div className="text-[10px] text-slate-500 truncate leading-tight mt-0.5">{getSubtitle()}</div>
          </div>
        </div>
        <div>
          {getStatusBadge()}
        </div>
      </div>

      {/* Metrics Section */}
      <div className="p-2.5 pt-2 text-[11px] space-y-1.5">
        {metrics == null ? (
          // Unsimulated State
          <div className="space-y-1 text-slate-400 font-mono text-[11px]">
            {['server', 'vm', 'container'].includes(type) ? (
              <>
                <div className="flex justify-between"><span>CPU</span><span>—</span></div>
                <div className="flex justify-between"><span>Memory</span><span>—</span></div>
              </>
            ) : ['postgresql', 'mysql', 'mongodb'].includes(type) ? (
              <>
                <div className="flex justify-between"><span>CPU</span><span>—</span></div>
                <div className="flex justify-between"><span>Connections</span><span>—</span></div>
              </>
            ) : type === 'load_balancer' ? (
              <>
                <div className="flex justify-between"><span>Requests</span><span>—</span></div>
                <div className="flex justify-between"><span>Capacity</span><span>—</span></div>
              </>
            ) : (
              <>
                <div className="flex justify-between"><span>Status</span><span>Idle</span></div>
                <div className="flex justify-between"><span>Load</span><span>—</span></div>
              </>
            )}
          </div>
        ) : (
          // Simulated State with deterministic metrics
          <div className="space-y-1.5 font-mono text-[11px]">
            {metrics.metric1 && (
              <div className="flex items-center justify-between text-slate-600">
                <span className="text-[10px] text-slate-500 font-sans">{metrics.metric1.label}</span>
                <span className="font-semibold text-slate-800">{metrics.metric1.value}</span>
              </div>
            )}
            {metrics.metric2 && (
              <div className="flex items-center justify-between text-slate-600">
                <span className="text-[10px] text-slate-500 font-sans">{metrics.metric2.label}</span>
                <span className="font-semibold text-slate-800">{metrics.metric2.value}</span>
              </div>
            )}
            {metrics.metric3 && (
              <div className="flex items-center justify-between text-slate-600">
                <span className="text-[10px] text-slate-500 font-sans">{metrics.metric3.label}</span>
                <span className="font-semibold text-slate-800">{metrics.metric3.value}</span>
              </div>
            )}

            {/* Subtle utilization progress bar */}
            {metrics.utilization !== undefined && (
              <div className="w-full bg-slate-100 rounded-full h-1 mt-1 overflow-hidden">
                <div 
                  className={`h-full transition-all duration-300 ${
                    status === 'critical' 
                      ? 'bg-rose-500' 
                      : status === 'warning' 
                      ? 'bg-amber-500' 
                      : 'bg-emerald-500'
                  }`}
                  style={{ width: `${Math.min(100, metrics.utilization)}%` }}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
});

InfrastructureNode.displayName = 'InfrastructureNode';
