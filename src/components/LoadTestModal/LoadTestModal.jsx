import React, { useState, useMemo } from 'react';
import { X, Copy, Check, Download, Zap, BarChart2, Cpu, CheckCircle2 } from 'lucide-react';
import { generateK6Script, generateLocustScript, evaluateBenchmarkAccuracy } from '../../simulation/loadTestBench';

export const LoadTestModal = ({ isOpen, onClose, nodes, workload, simulationResult }) => {
  const [tab, setTab] = useState('k6'); // 'k6' | 'locust' | 'validate'
  const [copied, setCopied] = useState(false);
  const [targetHost, setTargetHost] = useState('https://api.yourdomain.com');

  // Validation Form inputs
  const [measuredRps, setMeasuredRps] = useState(workload?.requestsPerSecond || 1200);
  const [measuredLatencyMs, setMeasuredLatencyMs] = useState(simulationResult?.avgLatencyMs || 45);
  const [measuredErrorRatePct, setMeasuredErrorRatePct] = useState(simulationResult?.errorRatePct || 0.2);

  const k6Code = useMemo(() => generateK6Script(nodes, workload, { targetHost }), [nodes, workload, targetHost]);
  const locustCode = useMemo(() => generateLocustScript(nodes, workload, { targetHost }), [nodes, workload, targetHost]);

  const benchmarkReport = useMemo(() => {
    return evaluateBenchmarkAccuracy(simulationResult || {}, {
      measuredRps,
      measuredLatencyMs,
      measuredErrorRatePct
    });
  }, [simulationResult, measuredRps, measuredLatencyMs, measuredErrorRatePct]);

  if (!isOpen) return null;

  const currentCode = tab === 'k6' ? k6Code : locustCode;
  const currentFilename = tab === 'k6' ? 'k6_script.js' : 'locustfile.py';

  const handleCopy = () => {
    navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([currentCode], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = currentFilename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base tracking-tight">Load Testing & Benchmark Validator</h3>
              <p className="text-xs text-slate-400">Export k6/Locust scripts & validate simulation predictions against real load tests</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="px-6 pt-3 bg-slate-100 border-b border-slate-200 flex items-center justify-between">
          <div className="flex gap-2">
            <button
              onClick={() => setTab('k6')}
              className={`px-4 py-2 text-xs font-bold rounded-t-lg transition-all flex items-center gap-2 ${
                tab === 'k6' ? 'bg-slate-950 text-emerald-400 border-t-2 border-emerald-500' : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span>⚡ k6 Script (JS)</span>
            </button>
            <button
              onClick={() => setTab('locust')}
              className={`px-4 py-2 text-xs font-bold rounded-t-lg transition-all flex items-center gap-2 ${
                tab === 'locust' ? 'bg-slate-950 text-amber-400 border-t-2 border-amber-500' : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span>🦗 Locust Script (Python)</span>
            </button>
            <button
              onClick={() => setTab('validate')}
              className={`px-4 py-2 text-xs font-bold rounded-t-lg transition-all flex items-center gap-2 ${
                tab === 'validate' ? 'bg-white text-indigo-700 border-t-2 border-indigo-600 shadow-xs' : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              <BarChart2 className="w-3.5 h-3.5" />
              <span>📊 Compare vs Real Benchmark</span>
            </button>
          </div>

          {tab !== 'validate' && (
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs text-slate-500">Target Endpoint:</span>
              <input
                type="text"
                value={targetHost}
                onChange={(e) => setTargetHost(e.target.value)}
                className="text-xs font-mono px-2 py-1 bg-white border border-slate-300 rounded focus:outline-none w-56"
              />
            </div>
          )}
        </div>

        {/* Tab Contents */}
        {tab === 'validate' ? (
          <div className="p-6 bg-slate-50 flex-1 overflow-auto flex flex-col gap-6">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <h4 className="font-bold text-sm text-slate-900 mb-2 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-indigo-600" />
                <span>Enter Real Benchmark Test Results</span>
              </h4>
              <p className="text-xs text-slate-500 mb-4">
                Run the generated k6 or Locust test against your real deployed setup, then enter your measured numbers below to evaluate InfraSaaS prediction accuracy.
              </p>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Measured RPS</label>
                  <input
                    type="number"
                    value={measuredRps}
                    onChange={(e) => setMeasuredRps(e.target.value)}
                    className="w-full text-xs p-2 bg-slate-50 border border-slate-300 rounded font-mono focus:bg-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Measured Latency (ms)</label>
                  <input
                    type="number"
                    value={measuredLatencyMs}
                    onChange={(e) => setMeasuredLatencyMs(e.target.value)}
                    className="w-full text-xs p-2 bg-slate-50 border border-slate-300 rounded font-mono focus:bg-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Measured Error Rate (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={measuredErrorRatePct}
                    onChange={(e) => setMeasuredErrorRatePct(e.target.value)}
                    className="w-full text-xs p-2 bg-slate-50 border border-slate-300 rounded font-mono focus:bg-white focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Benchmark Comparison Results Card */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Model Accuracy Rating</span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-2xl font-black text-slate-900">{benchmarkReport.accuracyPct}%</span>
                    <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${benchmarkReport.badgeColor}`}>
                      {benchmarkReport.rating}
                    </span>
                  </div>
                </div>
                <CheckCircle2 className="w-8 h-8 text-emerald-500" />
              </div>

              {/* Side-by-side Table */}
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 bg-slate-50">
                    <th className="p-2 font-semibold">Metric</th>
                    <th className="p-2 font-semibold">Simulator Prediction</th>
                    <th className="p-2 font-semibold">Real Measured Value</th>
                    <th className="p-2 font-semibold">Variance Delta</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  <tr>
                    <td className="p-2 font-sans font-semibold text-slate-800">Average Latency</td>
                    <td className="p-2 text-indigo-600 font-bold">{benchmarkReport.metrics.simLatency} ms</td>
                    <td className="p-2 text-slate-900 font-bold">{benchmarkReport.metrics.realLatency} ms</td>
                    <td className="p-2 text-slate-600">
                      {benchmarkReport.metrics.latencyDeltaMs >= 0 ? `+${benchmarkReport.metrics.latencyDeltaMs}` : benchmarkReport.metrics.latencyDeltaMs} ms
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2 font-sans font-semibold text-slate-800">Error Rate</td>
                    <td className="p-2 text-indigo-600 font-bold">{benchmarkReport.metrics.simErrorRate}%</td>
                    <td className="p-2 text-slate-900 font-bold">{benchmarkReport.metrics.realErrorRate}%</td>
                    <td className="p-2 text-slate-600">
                      {(benchmarkReport.metrics.realErrorRate - benchmarkReport.metrics.simErrorRate).toFixed(1)}%
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2 font-sans font-semibold text-slate-800">Throughput (RPS)</td>
                    <td className="p-2 text-indigo-600 font-bold">{benchmarkReport.metrics.simRps} req/s</td>
                    <td className="p-2 text-slate-900 font-bold">{benchmarkReport.metrics.realRps} req/s</td>
                    <td className="p-2 text-slate-600">
                      {(benchmarkReport.metrics.realRps - benchmarkReport.metrics.simRps).toFixed(0)} req/s
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="p-4 bg-slate-950 flex-1 overflow-auto font-mono text-xs text-slate-200">
            <pre className="leading-relaxed whitespace-pre-wrap">{currentCode}</pre>
          </div>
        )}

        {/* Footer Actions */}
        {tab !== 'validate' && (
          <div className="px-6 py-3 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <div>
              <span>File: <strong className="text-white">{currentFilename}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded font-medium border border-slate-700"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                <span>{copied ? 'Copied!' : 'Copy Script'}</span>
              </button>
              <button
                onClick={handleDownload}
                className="flex items-center gap-1.5 px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-semibold transition-all shadow-sm shadow-emerald-900"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download {currentFilename}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
