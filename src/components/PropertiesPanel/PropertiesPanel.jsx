import React, { useState, useEffect } from 'react';
import { 
  Settings2, 
  Trash2, 
  Check, 
  Layers, 
  Server, 
  Database, 
  Split, 
  HardDrive,
  Flame,
  Info
} from 'lucide-react';
import { INSTANCE_SPECS } from '../../simulation/resourceModels';

export const PropertiesPanel = ({ selectedNode, onUpdateNodeConfig, onDeleteNode }) => {
  const [formData, setFormData] = useState({});
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Sync form state when selectedNode changes
  useEffect(() => {
    if (selectedNode?.data?.config) {
      setFormData({
        name: selectedNode.data.name || '',
        ...selectedNode.data.config
      });
      setSavedSuccess(false);
    } else {
      setFormData({});
    }
  }, [selectedNode]);

  if (!selectedNode || selectedNode.data?.type === 'client') {
    return (
      <aside className="w-72 h-full bg-white border-l border-slate-200 flex flex-col flex-shrink-0 select-none z-10">
        <div className="p-3 border-b border-slate-200">
          <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Properties</h2>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-slate-400">
          <Settings2 className="w-8 h-8 text-slate-300 mb-2 stroke-[1.5]" />
          <p className="text-xs font-medium text-slate-600">No component selected</p>
          <p className="text-[11px] text-slate-400 mt-1 max-w-[180px]">
            Click on any service on the canvas to configure its specs and capacity.
          </p>
        </div>
      </aside>
    );
  }

  const { type } = selectedNode.data;

  const handleChange = (key, value) => {
    setFormData(prev => {
      const updated = { ...prev, [key]: value };

      // Automatically update vcpu & memory if instance type changed
      if (key === 'instanceType' && INSTANCE_SPECS[value]) {
        updated.vcpu = INSTANCE_SPECS[value].vcpu;
        updated.memory = INSTANCE_SPECS[value].memory;
      }
      return updated;
    });
  };

  const handleApply = (e) => {
    e.preventDefault();
    onUpdateNodeConfig(selectedNode.id, formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 1500);
  };

  return (
    <aside className="w-72 h-full bg-white border-l border-slate-200 flex flex-col flex-shrink-0 select-none z-10">
      {/* Header */}
      <div className="p-3 border-b border-slate-200 flex items-center justify-between">
        <div>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            {selectedNode.data.category || 'Component'}
          </div>
          <h2 className="text-xs font-bold text-slate-900 leading-tight">
            {selectedNode.data.name}
          </h2>
        </div>
        <button
          type="button"
          onClick={() => onDeleteNode(selectedNode.id)}
          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
          title="Delete component"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Form Content */}
      <form onSubmit={handleApply} className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
        {/* Name input */}
        <div className="space-y-1">
          <label className="block text-[10px] font-semibold text-slate-600 uppercase tracking-wider">
            Component Name
          </label>
          <input
            type="text"
            value={formData.name || ''}
            onChange={(e) => handleChange('name', e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white"
          />
        </div>

        {/* Server / VM Properties */}
        {['server', 'vm'].includes(type) && (
          <>
            <div className="space-y-1">
              <label className="block text-[10px] font-semibold text-slate-600 uppercase tracking-wider">
                Instance Type
              </label>
              <select
                value={formData.instanceType || 't3.medium'}
                onChange={(e) => handleChange('instanceType', e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="t3.micro">t3.micro (2 vCPU, 1 GB)</option>
                <option value="t3.small">t3.small (2 vCPU, 2 GB)</option>
                <option value="t3.medium">t3.medium (2 vCPU, 4 GB)</option>
                <option value="t3.large">t3.large (2 vCPU, 8 GB)</option>
                <option value="t3.xlarge">t3.xlarge (4 vCPU, 16 GB)</option>
                <option value="c5.xlarge">c5.xlarge (4 vCPU, 8 GB - Compute)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] font-semibold text-slate-600 uppercase tracking-wider">
                Instances (Replicas)
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleChange('instances', Math.max(1, (Number(formData.instances) || 1) - 1))}
                  className="w-8 h-8 rounded border border-slate-200 bg-slate-50 hover:bg-slate-100 flex items-center justify-center font-bold text-slate-700"
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={formData.instances || 1}
                  onChange={(e) => handleChange('instances', Math.max(1, parseInt(e.target.value) || 1))}
                  className="flex-1 text-center bg-slate-50 border border-slate-200 rounded py-1.5 text-xs font-semibold text-slate-800"
                />
                <button
                  type="button"
                  onClick={() => handleChange('instances', (Number(formData.instances) || 1) + 1)}
                  className="w-8 h-8 rounded border border-slate-200 bg-slate-50 hover:bg-slate-100 flex items-center justify-center font-bold text-slate-700"
                >
                  +
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded border border-slate-200/80">
              <div>
                <span className="text-[10px] text-slate-400 block">vCPU per node</span>
                <span className="font-semibold text-slate-700">{formData.vcpu || 2} vCPU</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Memory per node</span>
                <span className="font-semibold text-slate-700">{formData.memory || 4} GB</span>
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] font-semibold text-slate-600 uppercase tracking-wider">
                Region
              </label>
              <select
                value={formData.region || 'Mumbai'}
                onChange={(e) => handleChange('region', e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="Mumbai">ap-south-1 (Mumbai)</option>
                <option value="us-east-1">us-east-1 (N. Virginia)</option>
                <option value="eu-west-1">eu-west-1 (Ireland)</option>
                <option value="ap-southeast-1">ap-southeast-1 (Singapore)</option>
              </select>
            </div>
          </>
        )}

        {/* PostgreSQL / Database Properties */}
        {['postgresql', 'mysql', 'mongodb'].includes(type) && (
          <>
            <div className="space-y-1">
              <label className="block text-[10px] font-semibold text-slate-600 uppercase tracking-wider">
                Database Instance
              </label>
              <select
                value={formData.instanceType || 'db.t3.medium'}
                onChange={(e) => handleChange('instanceType', e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="db.t3.small">db.t3.small (2 vCPU, 2 GB, 100 Conn)</option>
                <option value="db.t3.medium">db.t3.medium (4 vCPU, 16 GB, 200 Conn)</option>
                <option value="db.r5.large">db.r5.large (2 vCPU, 16 GB, 400 Conn)</option>
                <option value="db.r5.xlarge">db.r5.xlarge (4 vCPU, 32 GB, 800 Conn)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] font-semibold text-slate-600 uppercase tracking-wider">
                Max Connections
              </label>
              <input
                type="number"
                min="50"
                max="5000"
                step="50"
                value={formData.maxConnections || 200}
                onChange={(e) => handleChange('maxConnections', parseInt(e.target.value) || 200)}
                className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 text-xs text-slate-800"
              />
            </div>

            <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded border border-slate-200/80">
              <div>
                <span className="text-[10px] text-slate-400 block">Allocated IOPS</span>
                <span className="font-semibold text-slate-700">{formData.iops || 3000} IOPS</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Storage Size</span>
                <span className="font-semibold text-slate-700">{formData.storage || 100} GB</span>
              </div>
            </div>
          </>
        )}

        {/* Load Balancer Properties */}
        {type === 'load_balancer' && (
          <>
            <div className="space-y-1">
              <label className="block text-[10px] font-semibold text-slate-600 uppercase tracking-wider">
                Algorithm
              </label>
              <select
                value={formData.algorithm || 'Round Robin'}
                onChange={(e) => handleChange('algorithm', e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="Round Robin">Round Robin</option>
                <option value="Least Connections">Least Connections</option>
                <option value="IP Hash">IP Hash Sticky</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] font-semibold text-slate-600 uppercase tracking-wider">
                Request Capacity (RPS)
              </label>
              <input
                type="number"
                min="1000"
                max="100000"
                step="1000"
                value={formData.requestCapacity || 10000}
                onChange={(e) => handleChange('requestCapacity', parseInt(e.target.value) || 10000)}
                className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 text-xs text-slate-800"
              />
            </div>
          </>
        )}

        {/* Object Storage Properties */}
        {type === 'object_storage' && (
          <>
            <div className="space-y-1">
              <label className="block text-[10px] font-semibold text-slate-600 uppercase tracking-wider">
                Capacity (GB)
              </label>
              <input
                type="number"
                min="100"
                max="50000"
                step="500"
                value={formData.capacity || 1000}
                onChange={(e) => handleChange('capacity', parseInt(e.target.value) || 1000)}
                className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 text-xs text-slate-800"
              />
            </div>

            <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded border border-slate-200/80">
              <div>
                <span className="text-[10px] text-slate-400 block">Read Throughput</span>
                <span className="font-semibold text-slate-700">{formData.readThroughput || 500} MB/s</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Write Throughput</span>
                <span className="font-semibold text-slate-700">{formData.writeThroughput || 250} MB/s</span>
              </div>
            </div>
          </>
        )}

        {/* Redis Properties */}
        {type === 'redis' && (
          <>
            <div className="space-y-1">
              <label className="block text-[10px] font-semibold text-slate-600 uppercase tracking-wider">
                Cache Instance Type
              </label>
              <select
                value={formData.nodeType || 'cache.t3.medium'}
                onChange={(e) => handleChange('nodeType', e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="cache.t3.micro">cache.t3.micro (0.5 GB RAM)</option>
                <option value="cache.t3.medium">cache.t3.medium (3.2 GB RAM)</option>
                <option value="cache.r5.large">cache.r5.large (13.0 GB RAM)</option>
              </select>
            </div>
            <div className="p-2 bg-amber-50 rounded border border-amber-200/80 text-[11px] text-amber-800 flex items-start gap-2">
              <Info className="w-3.5 h-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
              <span>Redis caches active database queries, shielding PostgreSQL by absorbing up to 70% query load.</span>
            </div>
          </>
        )}

        {/* Apply Button */}
        <div className="pt-2">
          <button
            type="submit"
            className={`w-full py-2 px-3 rounded text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
              savedSuccess
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-900 text-white hover:bg-slate-800 active:bg-slate-950'
            }`}
          >
            {savedSuccess ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Applied Changes</span>
              </>
            ) : (
              <span>Apply Changes</span>
            )}
          </button>
        </div>
      </form>
    </aside>
  );
};
