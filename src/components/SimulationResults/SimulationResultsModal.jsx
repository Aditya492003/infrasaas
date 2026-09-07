import React from 'react';
import { 
  AlertTriangle, 
  AlertCircle, 
  CheckCircle2, 
  ArrowUpRight, 
  Sparkles, 
  Plus, 
  TrendingUp, 
  X,
  Database,
  Server,
  Zap
} from 'lucide-react';

export const SimulationResultsModal = ({
  simulationResult,
  onRemediate,
  onOpenAiAssistant,
  onClose
}) => {
  if (!simulationResult) return null;

  const { systemMetrics, bottleneck, status } = simulationResult;

  const getStatusColor = () => {
    if (status === 'critical') return 'text-rose-600 bg-rose-50 border-rose-200';
    if (status === 'warning') return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-emerald-600 bg-emerald-50 border-emerald-200';
  };

  return (
    <div className="absolute top-4 right-4 z-20 w-84 bg-white border border-slate-200 rounded-lg shadow-xl overflow-hidden select-none animate-in fade-in slide-in-from-top-2 duration-200">
      {/* Header */}
      <div className="p-3 border-b border-slate-200 flex items-center justify-between bg-slate-50">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-indigo-600" />
          <span className="text-xs font-bold text-slate-900 tracking-tight">
            Simulation Results
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${getStatusColor()}`}>
            {status}
          </span>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 p-0.5 rounded"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="p-3 grid grid-cols-3 gap-2 border-b border-slate-100 bg-white">
        <div className="bg-slate-50 p-2 rounded border border-slate-100">
          <div className="text-[10px] text-slate-400">Throughput</div>
          <div className="text-xs font-bold font-mono text-slate-800 mt-0.5">
            {systemMetrics.throughput?.toLocaleString()} <span className="text-[9px] font-normal text-slate-500">req/s</span>
          </div>
        </div>

        <div className="bg-slate-50 p-2 rounded border border-slate-100">
          <div className="text-[10px] text-slate-400">Avg Latency</div>
          <div className={`text-xs font-bold font-mono mt-0.5 ${
            systemMetrics.averageLatency > 600 
              ? 'text-rose-600' 
              : systemMetrics.averageLatency > 150 
              ? 'text-amber-600' 
              : 'text-emerald-700'
          }`}>
            {systemMetrics.averageLatency} <span className="text-[9px] font-normal text-slate-500">ms</span>
          </div>
        </div>

        <div className="bg-slate-50 p-2 rounded border border-slate-100">
          <div className="text-[10px] text-slate-400">P95 Latency</div>
          <div className={`text-xs font-bold font-mono mt-0.5 ${
            systemMetrics.p95Latency > 1000 
              ? 'text-rose-600' 
              : systemMetrics.p95Latency > 300 
              ? 'text-amber-600' 
              : 'text-slate-800'
          }`}>
            {systemMetrics.p95Latency} <span className="text-[9px] font-normal text-slate-500">ms</span>
          </div>
        </div>
      </div>

      {/* Bottleneck Alert Box */}
      {bottleneck ? (
        <div className="p-3 bg-amber-50/50 border-b border-amber-100">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="min-w-0">
              <div className="text-xs font-bold text-amber-900 leading-tight">
                {bottleneck.nodeName} Bottleneck Detected
              </div>
              <div className="text-[11px] text-amber-800 mt-1 leading-relaxed">
                {bottleneck.message}
              </div>
              <div className="mt-2 text-[10px] font-mono text-amber-900 bg-white/80 p-1.5 rounded border border-amber-200/60 inline-flex items-center gap-2">
                <span>{bottleneck.metricLabel}:</span>
                <span className="font-bold">{bottleneck.metricValue}</span>
                <span className="text-amber-600 font-sans font-medium">({bottleneck.utilization}% load)</span>
              </div>
            </div>
          </div>

          {/* Remediation Action Buttons */}
          <div className="mt-3 pt-2 border-t border-amber-200/60 flex flex-wrap gap-1.5">
            {bottleneck.recommendations.map(rec => (
              <button
                key={rec.id}
                type="button"
                onClick={() => onRemediate(rec.action)}
                className="text-[10px] font-semibold text-slate-800 bg-white hover:bg-slate-100 border border-slate-300 px-2 py-1 rounded shadow-xs transition-colors flex items-center gap-1"
              >
                <ArrowUpRight className="w-3 h-3 text-indigo-600" />
                <span>{rec.label}</span>
              </button>
            ))}

            <button
              type="button"
              onClick={onOpenAiAssistant}
              className="text-[10px] font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 px-2 py-1 rounded transition-colors flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3 text-indigo-600" />
              <span>Ask AI Why</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="p-3 bg-emerald-50/40 text-[11px] text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>All architecture tiers operating within provisioned capacity. No bottlenecks identified.</span>
        </div>
      )}

      {/* Footer Disclaimer */}
      <div className="px-3 py-1.5 bg-slate-50 border-t border-slate-100 text-[9px] text-slate-400 text-center">
        Estimated simulation based on configured assumptions
      </div>
    </div>
  );
};
