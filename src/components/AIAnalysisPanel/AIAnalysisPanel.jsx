import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  X, 
  Send, 
  Bot, 
  User, 
  ArrowUpRight,
  Settings,
  Cpu
} from 'lucide-react';
import { requestLlmArchitectureAnalysis } from '../../simulation/llmAdvisor';

export const AIAnalysisPanel = ({
  isOpen,
  onClose,
  nodes = [],
  edges = [],
  workload = {},
  simulationResult,
  onRemediate
}) => {
  const [messages, setMessages] = useState([]);
  const [inputQuestion, setInputQuestion] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [provider, setProvider] = useState('auto'); // 'auto' | 'gemini' | 'ollama'
  const [apiKey, setApiKey] = useState('');
  const [isLlmLoading, setIsLlmLoading] = useState(false);
  const [activeProviderName, setActiveProviderName] = useState('Built-in AI Synthesizer');

  // Trigger LLM Architecture Reasoning when panel opens or simulation results change
  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    setIsLlmLoading(true);

    requestLlmArchitectureAnalysis({
      nodes,
      edges,
      workload,
      simulationResult,
      llmConfig: { provider, apiKey }
    }).then(res => {
      if (!isMounted) return;
      setIsLlmLoading(false);
      if (res && res.reasoning) {
        setActiveProviderName(res.provider || 'AI Architecture Engine');
        setMessages([
          {
            sender: 'ai',
            text: res.reasoning
          }
        ]);
      }
    }).catch(err => {
      if (!isMounted) return;
      setIsLlmLoading(false);
    });

    return () => { isMounted = false; };
  }, [isOpen, simulationResult, provider, apiKey]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputQuestion.trim()) return;

    const userText = inputQuestion;
    setInputQuestion('');

    const newMsgs = [...messages, { sender: 'user', text: userText }];
    setMessages(newMsgs);

    const q = userText.toLowerCase();
    let aiResponse = '';

    if (q.includes('redis') || q.includes('cache')) {
      aiResponse = "Adding Redis in front of your database intercepts repetitive read queries. In InfraSaaS, introducing Redis typically reduces database query volume by ~70%, preventing DB connection pool exhaustion.";
    } else if (q.includes('scale') || q.includes('server')) {
      aiResponse = "Horizontal server scaling distributes incoming HTTP requests across more workers. However, if your database or message queue is already saturated, scaling servers will actually increase database contention.";
    } else if (q.includes('latency')) {
      aiResponse = `Current average latency is ${simulationResult?.systemMetrics?.averageLatency || 45}ms. Latency follows a non-linear queueing curve once any tier crosses 85% utilization.`;
    } else {
      aiResponse = `Based on your current topology graph and workload: ${simulationResult?.bottleneck ? `${simulationResult.bottleneck.nodeName} is limiting capacity.` : 'The system has adequate headroom.'} Try adjusting the workload sliders to observe where degradation begins.`;
    }

    setMessages([...newMsgs, { sender: 'ai', text: aiResponse }]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-white border-l border-slate-200 shadow-2xl z-50 flex flex-col select-none animate-in slide-in-from-right duration-200">
      {/* Header */}
      <div className="p-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-indigo-500 flex items-center justify-center text-white">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div>
            <h2 className="text-xs font-bold leading-tight flex items-center gap-1.5">
              <span>LLM Architecture Advisor</span>
              <span className="text-[9px] bg-indigo-400/20 text-indigo-300 border border-indigo-400/30 px-1.5 py-0.2 rounded font-mono">
                {activeProviderName}
              </span>
            </h2>
            <div className="text-[10px] text-slate-400">Deep Graph & Simulation Reasoning</div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setShowSettings(!showSettings)}
            className="p-1 text-slate-400 hover:text-white rounded transition-colors"
            title="Configure LLM Provider (Free Gemini Key / Ollama)"
          >
            <Settings className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Settings Dropdown Panel */}
      {showSettings && (
        <div className="p-3 bg-slate-800 text-white border-b border-slate-700 text-xs space-y-2">
          <div className="font-bold flex items-center gap-1 text-indigo-300">
            <Cpu className="w-3.5 h-3.5" />
            <span>LLM Provider Setup (100% Free)</span>
          </div>
          <div>
            <label className="block text-[11px] text-slate-300 mb-1">Select Engine:</label>
            <select
              value={provider}
              onChange={(e) => setProvider(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded p-1 text-xs text-white focus:outline-none"
            >
              <option value="auto">Built-in AI Synthesizer (Free, Local)</option>
              <option value="gemini">Google Gemini 1.5 Flash (Free API Key)</option>
              <option value="ollama">Localhost Ollama (http://localhost:11434)</option>
            </select>
          </div>
          {provider === 'gemini' && (
            <div>
              <label className="block text-[11px] text-slate-300 mb-1">Gemini API Key:</label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full bg-slate-900 border border-slate-700 rounded p-1 text-xs text-white font-mono"
              />
            </div>
          )}
        </div>
      )}

      {/* Message Chat Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
        {isLlmLoading && (
          <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-lg text-indigo-800 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600 animate-spin" />
            <span>LLM is reasoning about system topology and bottlenecks...</span>
          </div>
        )}

        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-2.5 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-bold ${
                msg.sender === 'user'
                  ? 'bg-slate-800 text-white'
                  : 'bg-indigo-100 text-indigo-700'
              }`}
            >
              {msg.sender === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
            </div>

            <div
              className={`p-3 rounded-lg max-w-[90%] leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-slate-900 text-white text-right'
                  : 'bg-slate-50 text-slate-800 border border-slate-200 whitespace-pre-line font-sans'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Input Field */}
      <form onSubmit={handleSend} className="p-3 border-t border-slate-200 bg-slate-50 flex items-center gap-2">
        <input
          type="text"
          value={inputQuestion}
          onChange={(e) => setInputQuestion(e.target.value)}
          placeholder="Ask why a component is struggling..."
          className="flex-1 bg-white border border-slate-200 rounded-md px-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
        <button
          type="submit"
          disabled={!inputQuestion.trim()}
          className="p-2 bg-indigo-600 disabled:bg-slate-300 text-white rounded-md transition-colors"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};
