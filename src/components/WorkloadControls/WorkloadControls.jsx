import React from 'react';
import { Play, Activity, Users, Zap, Gauge, HardDrive } from 'lucide-react';

export const WorkloadControls = ({
  workload,
  setWorkload,
  onRunSimulation,
  isSimulating,
  liveWhatIf,
  setLiveWhatIf
}) => {
  const updateField = (field, value) => {
    setWorkload(prev => ({
      ...prev,
      [field]: Number(value)
    }));
  };

  return (
    <div className="h-20 bg-white border-t border-slate-200 px-6 flex items-center justify-between gap-6 z-20 flex-shrink-0 select-none shadow-sm">
      {/* Title & Live Toggle */}
      <div className="flex items-center gap-4 flex-shrink-0">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 uppercase tracking-wider">
            <Activity className="w-3.5 h-3.5 text-indigo-600" />
            <span>Simulation Workload</span>
          </div>
          <div className="text-[10px] text-slate-400">Configure synthetic traffic variables</div>
        </div>

        {/* Live What-If Toggle */}
        <label className="flex items-center gap-2 cursor-pointer bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1 text-[11px] font-medium text-slate-700 hover:bg-slate-100 transition-colors">
          <input
            type="checkbox"
            checked={liveWhatIf}
            onChange={(e) => setLiveWhatIf(e.target.checked)}
            className="w-3.5 h-3.5 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
          />
          <span>Live What-If</span>
          {liveWhatIf && (
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          )}
        </label>
      </div>

      {/* Sliders Grid */}
      <div className="flex-1 max-w-4xl grid grid-cols-4 gap-6 items-center">
        {/* 1. Concurrent Users */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-500 flex items-center gap-1">
              <Users className="w-3 h-3 text-slate-400" />
              Users
            </span>
            <span className="font-mono font-bold text-slate-800">
              {workload.concurrentUsers >= 1000 
                ? `${(workload.concurrentUsers / 1000).toFixed(0)}k` 
                : workload.concurrentUsers}
            </span>
          </div>
          <input
            type="range"
            min="1000"
            max="100000"
            step="1000"
            value={workload.concurrentUsers}
            onChange={(e) => updateField('concurrentUsers', e.target.value)}
            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
          />
          <div className="flex justify-between text-[9px] text-slate-400">
            <span>1K</span>
            <span>50K</span>
            <span>100K</span>
          </div>
        </div>

        {/* 2. Requests / Second */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-500 flex items-center gap-1">
              <Zap className="w-3 h-3 text-slate-400" />
              RPS
            </span>
            <span className="font-mono font-bold text-slate-800">
              {workload.requestsPerSecond.toLocaleString()} req/s
            </span>
          </div>
          <input
            type="range"
            min="100"
            max="10000"
            step="100"
            value={workload.requestsPerSecond}
            onChange={(e) => updateField('requestsPerSecond', e.target.value)}
            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
          />
          <div className="flex justify-between text-[9px] text-slate-400">
            <span>100</span>
            <span>5,000</span>
            <span>10,000</span>
          </div>
        </div>

        {/* 3. Traffic Multiplier */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-500 flex items-center gap-1">
              <Gauge className="w-3 h-3 text-slate-400" />
              Traffic
            </span>
            <span className="font-mono font-bold text-slate-800">
              {workload.trafficMultiplier}×
            </span>
          </div>
          <input
            type="range"
            min="1"
            max="10"
            step="1"
            value={workload.trafficMultiplier}
            onChange={(e) => updateField('trafficMultiplier', e.target.value)}
            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
          />
          <div className="flex justify-between text-[9px] text-slate-400">
            <span>1×</span>
            <span>5×</span>
            <span>10×</span>
          </div>
        </div>

        {/* 4. Request Size */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-500 flex items-center gap-1">
              <HardDrive className="w-3 h-3 text-slate-400" />
              Payload
            </span>
            <span className="font-mono font-bold text-slate-800">
              {workload.requestSize >= 1000 
                ? `${(workload.requestSize / 1024).toFixed(1)} MB` 
                : `${workload.requestSize} KB`}
            </span>
          </div>
          <input
            type="range"
            min="10"
            max="2048"
            step="20"
            value={workload.requestSize}
            onChange={(e) => updateField('requestSize', e.target.value)}
            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
          />
          <div className="flex justify-between text-[9px] text-slate-400">
            <span>10 KB</span>
            <span>1 MB</span>
            <span>2 MB</span>
          </div>
        </div>
      </div>

      {/* Primary Run Simulation Button */}
      <div className="flex-shrink-0">
        <button
          type="button"
          onClick={onRunSimulation}
          disabled={isSimulating}
          className="h-10 px-5 bg-slate-900 hover:bg-slate-800 active:bg-black text-white font-semibold text-xs rounded-md shadow flex items-center gap-2 transition-all cursor-pointer"
        >
          <Play className={`w-4 h-4 fill-white ${isSimulating ? 'animate-spin' : ''}`} />
          <span>{isSimulating ? 'Simulating...' : '▶ Run Simulation'}</span>
        </button>
      </div>
    </div>
  );
};
