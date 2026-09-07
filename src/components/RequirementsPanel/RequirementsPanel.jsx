import React, { useState } from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  Plus, 
  Check, 
  FileText,
  Lightbulb
} from 'lucide-react';
import { getComponentDef } from '../../data/infrastructureTypes';

export const RequirementsPanel = ({ onAddSuggestedNodes }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [requirementsText, setRequirementsText] = useState(
    'I am building a SaaS application for 20,000 users. Users upload PDFs, the backend processes them asynchronously, and reports are stored in a database and file store for later download.'
  );
  const [suggestions, setSuggestions] = useState([]);
  const [hasAnalyzed, setHasAnalyzed] = useState(false);

  // Deterministic keyword-based parser structured so it can be swapped for an AI API later
  const analyzeRequirements = () => {
    const text = requirementsText.toLowerCase();
    const detected = [];

    // Rule 1: Users / API / SaaS
    if (text.includes('user') || text.includes('saas') || text.includes('api') || text.includes('web')) {
      detected.push({
        type: 'load_balancer',
        name: 'Load Balancer',
        reason: 'Distributes traffic across web & API instances'
      });
      detected.push({
        type: 'server',
        name: 'Application Server',
        reason: 'Executes core application business logic'
      });
    }

    // Rule 2: Database / SQL / Postgres
    if (text.includes('database') || text.includes('sql') || text.includes('data') || text.includes('records') || text.includes('postgres')) {
      detected.push({
        type: 'postgresql',
        name: 'PostgreSQL',
        reason: 'ACID transactional data persistence'
      });
    }

    // Rule 3: File / Uploads / PDFs / Images
    if (text.includes('upload') || text.includes('pdf') || text.includes('file') || text.includes('image') || text.includes('media')) {
      detected.push({
        type: 'object_storage',
        name: 'Object Storage',
        reason: 'Scalable cloud object store for uploaded documents'
      });
    }

    // Rule 4: Process / Asynchronous / Worker / Queue
    if (text.includes('process') || text.includes('async') || text.includes('queue') || text.includes('worker') || text.includes('background')) {
      detected.push({
        type: 'queue',
        name: 'SQS Queue',
        reason: 'Buffers background processing tasks'
      });
      detected.push({
        type: 'container',
        name: 'Background Worker',
        reason: 'Processes queued jobs off the main request thread'
      });
    }

    // Rule 5: Cache / Fast / Performance
    if (text.includes('cache') || text.includes('fast') || text.includes('redis') || text.includes('session')) {
      detected.push({
        type: 'redis',
        name: 'Redis Cache',
        reason: 'Low-latency in-memory cache for query acceleration'
      });
    }

    // Rule 6: Global / CDN
    if (text.includes('global') || text.includes('worldwide') || text.includes('cdn')) {
      detected.push({
        type: 'cdn',
        name: 'Cloud CDN',
        reason: 'Edge caching for static assets'
      });
    }

    // Fallback if very brief text
    if (detected.length === 0) {
      detected.push(
        { type: 'load_balancer', name: 'Load Balancer', reason: 'Recommended entrypoint' },
        { type: 'server', name: 'Application Server', reason: 'Compute tier' },
        { type: 'postgresql', name: 'PostgreSQL', reason: 'Primary database' }
      );
    }

    setSuggestions(detected);
    setHasAnalyzed(true);
  };

  const handleAddSingle = (item) => {
    const compDef = getComponentDef(item.type);
    onAddSuggestedNodes([{
      type: item.type,
      name: item.name,
      category: compDef.category,
      config: { ...compDef.defaultConfig }
    }]);
  };

  const handleAddAll = () => {
    const items = suggestions.map(item => {
      const compDef = getComponentDef(item.type);
      return {
        type: item.type,
        name: item.name,
        category: compDef.category,
        config: { ...compDef.defaultConfig }
      };
    });
    onAddSuggestedNodes(items);
  };

  return (
    <div className="absolute top-4 left-4 z-20 w-80 bg-white border border-slate-200 rounded-lg shadow-lg overflow-hidden transition-all duration-200">
      {/* Header / Toggle Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-2.5 bg-slate-50 hover:bg-slate-100 flex items-center justify-between text-left transition-colors border-b border-slate-200/80"
      >
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-600" />
          <span className="text-xs font-bold text-slate-800 tracking-tight">
            Application Requirements
          </span>
        </div>
        <div className="flex items-center gap-1 text-slate-400">
          <span className="text-[10px] bg-indigo-50 text-indigo-700 font-semibold px-1.5 py-0.5 rounded">
            AI Assistant
          </span>
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {/* Expanded Body */}
      {isOpen && (
        <div className="p-3 text-xs space-y-3 max-h-[480px] overflow-y-auto">
          <div>
            <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Describe your application...
            </label>
            <textarea
              rows={3}
              value={requirementsText}
              onChange={(e) => setRequirementsText(e.target.value)}
              placeholder="e.g. E-commerce API handling 50,000 flash sale users with Redis cache and PostgreSQL..."
              className="w-full text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white resize-none"
            />
          </div>

          {/* Quick preset buttons */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              type="button"
              onClick={() => setRequirementsText('SaaS app with 20,000 users. Users upload files, backend processes them, data stored in PostgreSQL.')}
              className="text-[10px] text-slate-600 bg-slate-100 hover:bg-slate-200 px-2 py-0.5 rounded transition-colors"
            >
              PDF SaaS
            </button>
            <button
              type="button"
              onClick={() => setRequirementsText('High-traffic e-commerce store with Redis caching, PostgreSQL database, and microservices.')}
              className="text-[10px] text-slate-600 bg-slate-100 hover:bg-slate-200 px-2 py-0.5 rounded transition-colors"
            >
              E-commerce
            </button>
            <button
              type="button"
              onClick={() => setRequirementsText('Realtime mobile API with CDN edge caching, load balancer, and asynchronous message broker.')}
              className="text-[10px] text-slate-600 bg-slate-100 hover:bg-slate-200 px-2 py-0.5 rounded transition-colors"
            >
              Realtime API
            </button>
          </div>

          <button
            type="button"
            onClick={analyzeRequirements}
            className="w-full py-1.5 px-3 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold rounded text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Analyze Requirements</span>
          </button>

          {/* Analysis Suggestions */}
          {hasAnalyzed && (
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                  Architecture Suggestions ({suggestions.length})
                </span>
                <button
                  type="button"
                  onClick={handleAddAll}
                  className="text-[10px] font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-2 py-0.5 rounded transition-colors"
                >
                  Add All
                </button>
              </div>

              <div className="space-y-1.5">
                {suggestions.map((item, idx) => (
                  <div
                    key={`${item.type}-${idx}`}
                    className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-200/80 text-[11px]"
                  >
                    <div className="min-w-0 pr-2">
                      <div className="font-semibold text-slate-800 flex items-center gap-1">
                        <Check className="w-3 h-3 text-emerald-600 flex-shrink-0" />
                        <span className="truncate">{item.name}</span>
                      </div>
                      <div className="text-[10px] text-slate-500 truncate mt-0.5">{item.reason}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleAddSingle(item)}
                      className="text-slate-600 hover:text-indigo-600 bg-white hover:bg-slate-100 border border-slate-200 px-2 py-1 rounded text-[10px] font-medium flex items-center gap-0.5 flex-shrink-0"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
