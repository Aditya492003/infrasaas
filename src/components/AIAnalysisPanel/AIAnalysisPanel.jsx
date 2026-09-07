import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  X, 
  Send, 
  Bot, 
  User, 
  ArrowUpRight, 
  CheckCircle2, 
  AlertTriangle,
  Lightbulb
} from 'lucide-react';

export const AIAnalysisPanel = ({
  isOpen,
  onClose,
  simulationResult,
  onRemediate
}) => {
  const [messages, setMessages] = useState([]);
  const [inputQuestion, setInputQuestion] = useState('');

  // Generate dynamic contextual analysis based on the latest simulation state
  useEffect(() => {
    if (!isOpen) return;

    if (!simulationResult) {
      setMessages([
        {
          sender: 'ai',
          text: "Hello! I am the InfraSim Architecture Assistant. Run a simulation using the bottom workload controls, and I will analyze your graph for saturation points, queue build-ups, and architectural bottlenecks."
        }
      ]);
      return;
    }

    const { bottleneck, systemMetrics, status } = simulationResult;

    let responseText = '';
    let actionItems = [];

    if (bottleneck) {
      responseText = `${bottleneck.nodeName} is currently the primary bottleneck. Its ${bottleneck.metricLabel} has reached ${bottleneck.metricValue} (${bottleneck.utilization}% load). When this node saturates, downstream requests queue up, driving average latency to ${systemMetrics.averageLatency}ms (P95: ${systemMetrics.p95Latency}ms).\n\nAdding more compute or scaling other tiers alone will not improve system throughput because ${bottleneck.nodeName} is the hard constraint.`;
      
      if (bottleneck.nodeType === 'postgresql' || bottleneck.nodeType === 'mysql') {
        actionItems = [
          { id: 'upgrade_db', label: 'Upgrade Database to db.r5.large', action: 'upgrade_db' },
          { id: 'add_redis', label: 'Introduce Redis Query Cache', action: 'add_redis' }
        ];
      } else if (['server', 'vm', 'container'].includes(bottleneck.nodeType)) {
        actionItems = [
          { id: 'scale_servers', label: 'Scale Server Replicas (+2 instances)', action: 'scale_servers' },
          { id: 'upgrade_server_type', label: 'Upgrade Server to t3.xlarge', action: 'upgrade_server_type' }
        ];
      } else {
        actionItems = [
          { id: 'scale_component', label: `Scale ${bottleneck.nodeName}`, action: 'scale_component' }
        ];
      }
    } else {
      responseText = `Your current architecture is performing healthily under the configured load (${systemMetrics.throughput?.toLocaleString()} req/s). Peak tier utilization is only ${systemMetrics.highestUtilization}%, and latency remains nominal at ${systemMetrics.averageLatency}ms.`;
    }

    setMessages([
      {
        sender: 'user',
        text: "Why is my architecture behaving this way?"
      },
      {
        sender: 'ai',
        text: responseText,
        actions: actionItems
      }
    ]);
  }, [isOpen, simulationResult]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputQuestion.trim()) return;

    const userText = inputQuestion;
    setInputQuestion('');

    const newMsgs = [...messages, { sender: 'user', text: userText }];

    // Deterministic architecture assistant response
    let aiResponse = '';
    const q = userText.toLowerCase();

    if (q.includes('redis') || q.includes('cache')) {
      aiResponse = "Adding Redis in front of your database intercepts repetitive read queries. In InfraSim, introducing Redis typically reduces database query volume by ~70%, preventing DB connection pool exhaustion.";
    } else if (q.includes('scale') || q.includes('server')) {
      aiResponse = "Horizontal server scaling distributes incoming HTTP requests across more workers. However, if your database or message queue is already saturated, scaling servers will actually increase database contention.";
    } else if (q.includes('latency')) {
      aiResponse = `Current average latency is ${simulationResult?.systemMetrics?.averageLatency || 45}ms. Latency follows a hockey-stick curve once any tier crosses 85% utilization due to network queueing.`;
    } else {
      aiResponse = `Based on your current graph: ${simulationResult?.bottleneck ? `${simulationResult.bottleneck.nodeName} is limiting capacity.` : 'The system has adequate headroom.'} Try adjusting the workload sliders to observe where degradation begins.`;
    }

    setMessages([...newMsgs, { sender: 'ai', text: aiResponse }]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-white border-l border-slate-200 shadow-2xl z-50 flex flex-col select-none animate-in slide-in-from-right duration-200">
      {/* Header */}
      <div className="p-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-indigo-600 text-white flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div>
            <h2 className="text-xs font-bold text-slate-900 leading-tight">Architecture Assistant</h2>
            <div className="text-[10px] text-slate-500">Autonomous Infrastructure Diagnosis</div>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Message Chat Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
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
              className={`p-3 rounded-lg max-w-[85%] leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-slate-900 text-white text-right'
                  : 'bg-slate-50 text-slate-800 border border-slate-200 whitespace-pre-line'
              }`}
            >
              {msg.text}

              {/* Action Buttons */}
              {msg.actions && msg.actions.length > 0 && (
                <div className="mt-3 pt-2.5 border-t border-slate-200/80 space-y-1.5 text-left">
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Recommended Fixes:
                  </div>
                  {msg.actions.map(act => (
                    <button
                      key={act.id}
                      type="button"
                      onClick={() => onRemediate(act.action)}
                      className="w-full text-left text-[11px] font-medium text-slate-800 hover:text-indigo-600 bg-white hover:bg-slate-100 border border-slate-200 rounded p-1.5 transition-colors flex items-center justify-between"
                    >
                      <span>{act.label}</span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-indigo-600 flex-shrink-0" />
                    </button>
                  ))}
                </div>
              )}
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
