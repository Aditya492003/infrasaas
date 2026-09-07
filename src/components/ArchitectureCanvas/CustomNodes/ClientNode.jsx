import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Users, Globe2 } from 'lucide-react';

export const ClientNode = memo(({ data, selected }) => {
  const { name = 'Global Clients', metrics = null } = data;

  return (
    <div 
      className={`w-[210px] bg-slate-900 text-white rounded-lg p-3 shadow-md border transition-all text-left select-none ${
        selected ? 'border-indigo-400 ring-2 ring-indigo-300' : 'border-slate-800'
      }`}
    >
      <div className="flex items-center gap-2 mb-2">
        <div className="w-6 h-6 rounded bg-slate-800 border border-slate-700 flex items-center justify-center text-indigo-400">
          <Globe2 className="w-3.5 h-3.5" />
        </div>
        <div className="truncate">
          <div className="text-xs font-semibold text-slate-100">{name}</div>
          <div className="text-[10px] text-slate-400">Traffic Source</div>
        </div>
      </div>

      <div className="bg-slate-800/80 rounded p-2 text-[11px] font-mono space-y-1">
        <div className="flex justify-between text-slate-300">
          <span className="text-slate-400 text-[10px] font-sans">Traffic Source:</span>
          <span>HTTP / WebSocket</span>
        </div>
        {metrics && (
          <>
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-400 text-[10px] font-sans">Active Users:</span>
              <span className="text-indigo-300 font-semibold">{metrics.metric1?.value || '—'}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-400 text-[10px] font-sans">Outbound RPS:</span>
              <span className="text-emerald-400 font-semibold">{metrics.metric2?.value || '—'}</span>
            </div>
          </>
        )}
      </div>

      <Handle type="source" position={Position.Bottom} className="!bg-indigo-400" />
    </div>
  );
});

ClientNode.displayName = 'ClientNode';
