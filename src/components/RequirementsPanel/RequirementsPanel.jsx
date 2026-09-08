import React, { useState } from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  Plus, 
  Check, 
  FileCode,
  AlertTriangle,
  Cpu
} from 'lucide-react';
import { getComponentDef } from '../../data/infrastructureTypes';
import { inspectProjectManifest } from '../../simulation/manifestInspector';

export const RequirementsPanel = ({ onAddSuggestedNodes, onOpenAiAssistant }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tab, setTab] = useState('text'); // 'text' | 'manifest'
  const [requirementsText, setRequirementsText] = useState(
    'I am building a SaaS application for 20,000 users. Users upload PDFs, the backend processes them asynchronously, and reports are stored in a database and file store for later download.'
  );

  // Manifest inspection state
  const [manifestText, setManifestText] = useState(
    `{\n  "name": "ai-pdf-service",\n  "dependencies": {\n    "express": "^4.18.2",\n    "puppeteer": "^21.0.0",\n    "sharp": "^0.32.0",\n    "@tensorflow/tfjs": "^4.10.0"\n  }\n}`
  );
  const [manifestFilename, setManifestFilename] = useState('package.json');
  const [manifestReport, setManifestReport] = useState(null);

  const [suggestions, setSuggestions] = useState([]);
  const [hasAnalyzed, setHasAnalyzed] = useState(false);

  // Analyze text requirements
  const analyzeRequirements = () => {
    const text = requirementsText.toLowerCase();
    const detected = [];

    if (text.includes('user') || text.includes('saas') || text.includes('api') || text.includes('web')) {
      detected.push(
        { type: 'load_balancer', name: 'Load Balancer', reason: 'Distributes traffic across web & API instances' },
        { type: 'server', name: 'Application Server', reason: 'Executes core application business logic' }
      );
    }
    if (text.includes('database') || text.includes('sql') || text.includes('data') || text.includes('postgres')) {
      detected.push({ type: 'postgresql', name: 'PostgreSQL', reason: 'ACID transactional data persistence' });
    }
    if (text.includes('upload') || text.includes('pdf') || text.includes('file') || text.includes('image')) {
      detected.push({ type: 'object_storage', name: 'Object Storage', reason: 'Scalable cloud object store for uploaded documents' });
    }
    if (text.includes('process') || text.includes('async') || text.includes('queue') || text.includes('worker')) {
      detected.push(
        { type: 'queue', name: 'SQS Queue', reason: 'Buffers background processing tasks' },
        { type: 'container', name: 'Background Worker', reason: 'Processes queued jobs off the main request thread' }
      );
    }
    if (text.includes('cache') || text.includes('fast') || text.includes('redis')) {
      detected.push({ type: 'redis', name: 'Redis Cache', reason: 'Low-latency in-memory cache' });
    }

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

  // Inspect Project Manifest
  const handleInspectManifest = () => {
    const report = inspectProjectManifest(manifestText, manifestFilename);
    setManifestReport(report);
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
            Requirements & Manifest AI
          </span>
        </div>
        <div className="flex items-center gap-1 text-slate-400">
          <span className="text-[10px] bg-indigo-50 text-indigo-700 font-semibold px-1.5 py-0.5 rounded">
            Analyzer
          </span>
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {/* Expanded Body */}
      {isOpen && (
        <div className="p-3 text-xs space-y-3 max-h-[520px] overflow-y-auto">
          {/* Tab Selection */}
          <div className="flex bg-slate-100 p-1 rounded-md">
            <button
              type="button"
              onClick={() => setTab('text')}
              className={`flex-1 py-1 text-[11px] font-semibold rounded transition-all ${
                tab === 'text' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Text Description
            </button>
            <button
              type="button"
              onClick={() => setTab('manifest')}
              className={`flex-1 py-1 text-[11px] font-semibold rounded transition-all flex items-center justify-center gap-1 ${
                tab === 'manifest' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <FileCode className="w-3 h-3 text-indigo-600" />
              <span>Manifest / Lockfile</span>
            </button>
          </div>

          {tab === 'text' ? (
            <>
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

              <button
                type="button"
                onClick={analyzeRequirements}
                className="w-full py-1.5 px-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Analyze Requirements</span>
              </button>

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
            </>
          ) : (
            <>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                    Paste package.json / requirements.txt / poetry.lock
                  </label>
                  <select
                    value={manifestFilename}
                    onChange={(e) => setManifestFilename(e.target.value)}
                    className="text-[10px] bg-slate-100 border border-slate-200 rounded px-1.5 py-0.5"
                  >
                    <option value="package.json">package.json</option>
                    <option value="package-lock.json">package-lock.json</option>
                    <option value="requirements.txt">requirements.txt</option>
                    <option value="poetry.lock">poetry.lock</option>
                  </select>
                </div>
                <textarea
                  rows={5}
                  value={manifestText}
                  onChange={(e) => setManifestText(e.target.value)}
                  placeholder="Paste contents of package.json or requirements.txt..."
                  className="w-full text-xs font-mono text-slate-800 bg-slate-50 border border-slate-200 rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white resize-none"
                />
              </div>

              <button
                type="button"
                onClick={handleInspectManifest}
                className="w-full py-1.5 px-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Cpu className="w-3.5 h-3.5 text-indigo-400" />
                <span>Inspect Manifest Dependencies</span>
              </button>

              {manifestReport && (
                <div className="pt-2 border-t border-slate-200 space-y-2">
                  <div className="text-[11px] font-bold text-slate-800 flex items-center justify-between">
                    <span>Heuristic Flags ({manifestReport.totalFlags})</span>
                    <span className="text-[10px] font-normal text-slate-500">{manifestReport.filename}</span>
                  </div>

                  {manifestReport.flags.length === 0 ? (
                    <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded text-emerald-800 text-[11px]">
                      No memory-intensive heavy libraries flagged. Standard web runtime specs apply.
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      {manifestReport.flags.map(flag => (
                        <div key={flag.name} className="p-2 bg-amber-50 border border-amber-200 rounded text-[11px]">
                          <div className="font-bold text-amber-900 flex items-center justify-between">
                            <span>📦 {flag.name}</span>
                            <span className="text-[9px] uppercase tracking-wider font-semibold px-1 bg-amber-200 rounded text-amber-800">
                              {flag.category}
                            </span>
                          </div>
                          <p className="text-[10px] text-amber-800 mt-1 leading-tight">{flag.note}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Caveat Disclaimer */}
                  <div className="p-2 bg-slate-100 border border-slate-200 rounded text-[10px] text-slate-600 flex items-start gap-1.5 leading-relaxed">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <span>{manifestReport.disclaimer}</span>
                  </div>

                  {onOpenAiAssistant && (
                    <button
                      type="button"
                      onClick={onOpenAiAssistant}
                      className="w-full py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Ask LLM Advisor for Sizing Advice</span>
                    </button>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};
