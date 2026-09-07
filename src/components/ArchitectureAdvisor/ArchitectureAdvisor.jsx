import React, { useState } from 'react';
import { 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  Info, 
  ChevronUp, 
  ChevronDown, 
  ArrowRight, 
  Wrench, 
  X,
  Sparkles,
  Lightbulb
} from 'lucide-react';

export const ArchitectureAdvisor = ({ suggestions = [], onApplyFix }) => {
  const [isOpen, setIsOpen] = useState(false);

  const criticalCount = suggestions.filter(s => s.severity === 'critical').length;
  const warningCount = suggestions.filter(s => s.severity === 'warning').length;
  const tipCount = suggestions.filter(s => s.severity === 'suggestion').length;

  const totalIssues = suggestions.length;

  return (
    <div className="absolute bottom-4 left-4 z-20 select-none">
      {/* Collapsed Badge Button */}
      {!isOpen ? (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold shadow-md border transition-all duration-200 cursor-pointer ${
            criticalCount > 0
              ? 'bg-rose-50 border-rose-300 text-rose-800 hover:bg-rose-100 ring-2 ring-rose-200'
              : warningCount > 0
              ? 'bg-amber-50 border-amber-300 text-amber-900 hover:bg-amber-100 ring-2 ring-amber-200'
              : tipCount > 0
              ? 'bg-indigo-50 border-indigo-200 text-indigo-800 hover:bg-indigo-100'
              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          {criticalCount > 0 ? (
            <ShieldAlert className="w-4 h-4 text-rose-600 animate-pulse" />
          ) : warningCount > 0 ? (
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          )}

          <span>
            {totalIssues === 0
              ? 'Architecture Healthy'
              : `${totalIssues} Architecture ${totalIssues === 1 ? 'Notice' : 'Notices'}`}
          </span>

          {totalIssues > 0 && (
            <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
              criticalCount > 0 ? 'bg-rose-200 text-rose-900' : 'bg-amber-200 text-amber-900'
            }`}>
              {totalIssues}
            </span>
          )}

          <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
        </button>
      ) : (
        /* Expanded Flyout Card */
        <div className="w-96 max-w-[90vw] bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-150 flex flex-col max-h-[460px]">
          {/* Header */}
          <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                <Lightbulb className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900 tracking-tight">Architecture Advisor</h3>
                <p className="text-[10px] text-slate-500">Component compatibility & topology guardrails</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-slate-700 p-1 rounded transition-colors"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          {/* Suggestions List */}
          <div className="p-3 overflow-y-auto space-y-3 flex-1 text-xs">
            {totalIssues === 0 ? (
              <div className="py-6 text-center text-slate-500 space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                <div className="font-semibold text-slate-800 text-xs">Clean Architecture!</div>
                <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
                  No anti-patterns or orphan components detected. All services have logical connections and entrypoints.
                </p>
              </div>
            ) : (
              suggestions.map((item) => (
                <div
                  key={item.id}
                  className={`p-3 rounded-lg border text-left space-y-2 transition-all ${
                    item.severity === 'critical'
                      ? 'bg-rose-50/50 border-rose-200'
                      : item.severity === 'warning'
                      ? 'bg-amber-50/50 border-amber-200'
                      : 'bg-indigo-50/40 border-indigo-200'
                  }`}
                >
                  {/* Badge & Title */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                        item.severity === 'critical'
                          ? 'bg-rose-100 text-rose-800'
                          : item.severity === 'warning'
                          ? 'bg-amber-100 text-amber-900'
                          : 'bg-indigo-100 text-indigo-800'
                      }`}>
                        {item.badge}
                      </span>
                      <h4 className="text-xs font-bold text-slate-900 mt-1">
                        {item.title}
                      </h4>
                    </div>
                  </div>

                  {/* Why they cannot connect directly / Why this is problematic */}
                  <div className="text-[11px] text-slate-700 leading-relaxed bg-white/80 p-2.5 rounded-lg border border-slate-200/70 space-y-1">
                    <span className="font-bold text-slate-900 block text-[10px] uppercase tracking-wider text-rose-700">
                      {item.whyCantConnect ? '🚫 Why They Cannot Connect Directly:' : '⚠️ Why this is problematic:'}
                    </span>
                    <p className="text-[11px] leading-relaxed text-slate-800">
                      {item.whyCantConnect || item.reason}
                    </p>
                  </div>

                  {/* Suggested Valid Connection Pathways */}
                  {item.whereTheyShouldConnect && item.whereTheyShouldConnect.length > 0 && (
                    <div className="space-y-1.5 pt-1">
                      <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
                        ✅ Where They Should Connect Instead:
                      </span>
                      <div className="space-y-1">
                        {item.whereTheyShouldConnect.map((pathObj, idx) => (
                          <div 
                            key={idx} 
                            className="bg-emerald-50/70 border border-emerald-200/80 rounded-md p-2 text-[10px] text-left space-y-0.5"
                          >
                            <div className="font-mono font-bold text-emerald-900 flex items-center gap-1.5">
                              <ArrowRight className="w-3 h-3 text-emerald-600 flex-shrink-0" />
                              <span>{pathObj.path}</span>
                            </div>
                            {pathObj.desc && (
                              <div className="text-emerald-700/90 pl-4.5 text-[9px] font-sans">
                                {pathObj.desc}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Quick Fix Button */}
                  {item.quickFix && (
                    <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-200/60">
                      <span className="text-[10px] text-slate-500 italic truncate max-w-[180px]">
                        1-Click Architectural Fix Available
                      </span>
                      <button
                        type="button"
                        onClick={() => onApplyFix(item.quickFix)}
                        className="px-3 py-1.5 bg-slate-900 hover:bg-indigo-600 active:bg-black text-white text-[10px] font-bold rounded-lg shadow-xs transition-all flex items-center gap-1.5 flex-shrink-0 cursor-pointer"
                      >
                        <Wrench className="w-3 h-3 text-amber-400" />
                        <span>{item.quickFix.label}</span>
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Footer note */}
          <div className="p-2 bg-slate-50 border-t border-slate-200 text-[10px] text-slate-400 text-center">
            Advises against missing tiers, isolated nodes, and anti-patterns.
          </div>
        </div>
      )}
    </div>
  );
};
