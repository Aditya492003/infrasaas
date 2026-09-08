import React, { useState } from 'react';
import { 
  FolderGit2, 
  CreditCard, 
  Layers, 
  BookOpen, 
  X, 
  Sparkles, 
  ArrowUpRight, 
  Check, 
  Clock, 
  Server, 
  ShieldCheck, 
  ChevronRight,
  User,
  Plus
} from 'lucide-react';
import { BLUEPRINT_TEMPLATES } from '../../data/aiArchitect';
import logoImg from '../../assets/logo.png';

export const NavigationSidebar = ({ 
  isOpen, 
  onClose, 
  onLoadProject, 
  onNavigateNewProject 
}) => {
  const [activeTab, setActiveTab] = useState('recent'); // 'recent' | 'pricing' | 'blueprints' | 'guides'

  if (!isOpen) return null;

  // Mock list of recent projects
  const RECENT_PROJECTS = [
    {
      id: 'proj-1',
      name: 'Production E-Commerce API',
      timestamp: '2 hours ago',
      nodesCount: 7,
      status: 'healthy',
      traffic: '12,000 users',
      type: 'standard-3-tier'
    },
    {
      id: 'proj-2',
      name: 'PDF SaaS Document Processor',
      timestamp: 'Yesterday',
      nodesCount: 6,
      status: 'warning',
      traffic: '25,000 users',
      type: 'high-perf-cache'
    },
    {
      id: 'proj-3',
      name: 'Realtime Mobile Gateway',
      timestamp: '3 days ago',
      nodesCount: 8,
      status: 'critical',
      traffic: '60,000 users',
      type: 'event-microservices'
    },
    {
      id: 'proj-4',
      name: 'Serverless Node.js Microservices',
      timestamp: '1 week ago',
      nodesCount: 5,
      status: 'healthy',
      traffic: '8,000 users',
      type: 'serverless-api'
    }
  ];

  // Pricing tier definitions
  const PRICING_PLANS = [
    {
      id: 'free',
      name: 'Starter Explorer',
      price: '$0',
      period: 'forever free',
      current: true,
      description: 'Ideal for learning cloud concepts and testing small architectures.',
      features: [
        'Up to 15 nodes per canvas',
        'Deterministic simulation engine',
        'Beginner & Architect modes',
        'Local keyword requirements parser'
      ]
    },
    {
      id: 'pro',
      name: 'Pro Architect',
      price: '$29',
      period: 'per month',
      current: false,
      popular: true,
      description: 'For software engineers and DevOps architects testing production load.',
      features: [
        'Unlimited canvas nodes',
        'Export architecture to Terraform & Pulumi',
        'Real-time AWS / GCP cost simulation',
        'Chaos engineering failure injection',
        'Multi-region latency modeling'
      ]
    },
    {
      id: 'team',
      name: 'Team & Enterprise',
      price: '$99',
      period: 'per month',
      current: false,
      description: 'For engineering teams doing collaborative RFC architecture reviews.',
      features: [
        'Multiplayer collaborative canvas',
        'CI/CD deployment risk gates',
        'Custom hardware resource specs',
        'Dedicated cloud architect support'
      ]
    }
  ];

  const handleSelectRecent = (recent) => {
    const template = BLUEPRINT_TEMPLATES.find(t => t.id === recent.type) || BLUEPRINT_TEMPLATES[1];
    const data = template.generator();
    onLoadProject({
      name: recent.name,
      nodes: data.nodes,
      edges: data.edges,
      workload: data.workload
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex select-none animate-in fade-in duration-150">
      {/* Backdrop overlay */}
      <div 
        className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs transition-opacity" 
        onClick={onClose} 
      />

      {/* Slide-out Sidebar Drawer */}
      <div className="relative w-84 sm:w-96 bg-white h-full shadow-2xl border-r border-slate-200 flex flex-col z-10 animate-in slide-in-from-left duration-200">
        {/* Drawer Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <img src={logoImg} alt="InfraLab Logo" className="w-7 h-7 object-contain rounded-md shadow-xs" />
            <div>
              <h2 className="text-xs font-bold text-slate-900 tracking-tight">InfraLab Workspace</h2>
              <div className="text-[10px] text-slate-500">Navigation & App Hub</div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-md transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="grid grid-cols-4 p-2 gap-1 border-b border-slate-100 bg-white">
          <button
            type="button"
            onClick={() => setActiveTab('recent')}
            className={`py-2 px-1 rounded-md text-[11px] font-semibold flex flex-col items-center gap-1 transition-all ${
              activeTab === 'recent'
                ? 'bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-2xs'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <FolderGit2 className="w-3.5 h-3.5" />
            <span>Creations</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('pricing')}
            className={`py-2 px-1 rounded-md text-[11px] font-semibold flex flex-col items-center gap-1 transition-all ${
              activeTab === 'pricing'
                ? 'bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-2xs'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Pricing</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('blueprints')}
            className={`py-2 px-1 rounded-md text-[11px] font-semibold flex flex-col items-center gap-1 transition-all ${
              activeTab === 'blueprints'
                ? 'bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-2xs'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Templates</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('guides')}
            className={`py-2 px-1 rounded-md text-[11px] font-semibold flex flex-col items-center gap-1 transition-all ${
              activeTab === 'guides'
                ? 'bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-2xs'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Guides</span>
          </button>
        </div>

        {/* Tab Content Area */}
        <div className="flex-1 overflow-y-auto p-4 text-xs">
          {/* TAB 1: RECENT CREATIONS */}
          {activeTab === 'recent' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Recent Projects ({RECENT_PROJECTS.length})
                </span>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onNavigateNewProject();
                  }}
                  className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  <span>New</span>
                </button>
              </div>

              <div className="space-y-2">
                {RECENT_PROJECTS.map((proj) => (
                  <div
                    key={proj.id}
                    onClick={() => handleSelectRecent(proj)}
                    className="p-3 rounded-lg border border-slate-200 bg-slate-50/60 hover:bg-indigo-50/40 hover:border-indigo-200 cursor-pointer transition-all group text-left space-y-1.5 shadow-2xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors text-xs truncate">
                        {proj.name}
                      </div>
                      <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full uppercase ${
                        proj.status === 'healthy'
                          ? 'bg-emerald-100 text-emerald-800'
                          : proj.status === 'warning'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}>
                        {proj.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {proj.timestamp}
                      </span>
                      <span>{proj.nodesCount} nodes • {proj.traffic}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: PRICING & PLANS */}
          {activeTab === 'pricing' && (
            <div className="space-y-4 text-left">
              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Pricing Plans
                </span>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Predictable pricing for developers and engineering teams.
                </p>
              </div>

              <div className="space-y-3">
                {PRICING_PLANS.map((plan) => (
                  <div
                    key={plan.id}
                    className={`p-3.5 rounded-xl border transition-all text-left space-y-2.5 ${
                      plan.current
                        ? 'border-indigo-400 bg-indigo-50/30 ring-1 ring-indigo-200'
                        : plan.popular
                        ? 'border-slate-300 bg-white shadow-xs'
                        : 'border-slate-200 bg-slate-50/40'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-slate-900 text-xs">{plan.name}</div>
                      {plan.current ? (
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                          Active Plan
                        </span>
                      ) : plan.popular ? (
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
                          Popular
                        </span>
                      ) : null}
                    </div>

                    <div className="flex items-baseline gap-1">
                      <span className="text-lg font-extrabold text-slate-950">{plan.price}</span>
                      <span className="text-[10px] text-slate-400">{plan.period}</span>
                    </div>

                    <p className="text-[10px] text-slate-500 leading-relaxed">
                      {plan.description}
                    </p>

                    <div className="pt-2 border-t border-slate-100 space-y-1.5">
                      {plan.features.map((feat, i) => (
                        <div key={i} className="flex items-center gap-1.5 text-[10px] text-slate-600">
                          <Check className="w-3 h-3 text-emerald-600 flex-shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>

                    {!plan.current && (
                      <button
                        type="button"
                        onClick={() => alert(`Upgrading to ${plan.name} will be available in the upcoming cloud release!`)}
                        className="w-full mt-2 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-[11px] rounded-lg shadow-xs transition-colors flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <span>Select {plan.name}</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: BLUEPRINTS */}
          {activeTab === 'blueprints' && (
            <div className="space-y-3 text-left">
              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Standard Blueprints
                </span>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Quick-load battle-tested architecture topologies.
                </p>
              </div>

              <div className="space-y-2">
                {BLUEPRINT_TEMPLATES.filter(b => b.id !== 'blank').map((bp) => (
                  <div
                    key={bp.id}
                    onClick={() => {
                      const data = bp.generator();
                      onLoadProject({
                        name: bp.title,
                        nodes: data.nodes,
                        edges: data.edges,
                        workload: data.workload
                      });
                      onClose();
                    }}
                    className="p-3 rounded-lg border border-slate-200 bg-white hover:border-indigo-400 hover:shadow-xs cursor-pointer transition-all space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-semibold text-slate-900 text-xs">{bp.title}</div>
                      <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full ${bp.badgeColor}`}>
                        {bp.badge}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 line-clamp-2 leading-relaxed">
                      {bp.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: GUIDES */}
          {activeTab === 'guides' && (
            <div className="space-y-3 text-left">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Architecture Best Practices
              </span>

              <div className="space-y-2.5">
                <div className="p-3 rounded-lg bg-indigo-50/50 border border-indigo-100 space-y-1">
                  <div className="font-bold text-indigo-950 text-xs">1. Connection Pooling</div>
                  <p className="text-[11px] text-indigo-900 leading-relaxed">
                    Always use PgBouncer or server-side connection pools to prevent 1,000 application workers from exhausting database connection limits.
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-emerald-50/50 border border-emerald-100 space-y-1">
                  <div className="font-bold text-emerald-950 text-xs">2. Cache-Aside Strategy</div>
                  <p className="text-[11px] text-emerald-900 leading-relaxed">
                    Check Redis first before querying PostgreSQL. If it's a cache hit, return in 1ms; if it's a miss, fetch from DB and write to Redis.
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-amber-50/50 border border-amber-100 space-y-1">
                  <div className="font-bold text-amber-950 text-xs">3. Decouple with SQS Queues</div>
                  <p className="text-[11px] text-amber-900 leading-relaxed">
                    Never process slow jobs (like PDF rendering or sending emails) during the HTTP request thread. Push to a queue and let workers handle it.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Account / Workspace Footer */}
        <div className="p-3.5 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-slate-800 text-white flex items-center justify-center text-[10px] font-bold">
              AC
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-900 leading-tight">Aditya Chavan</div>
              <div className="text-[10px] text-slate-400">Free Explorer Plan</div>
            </div>
          </div>

          <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
            Online
          </span>
        </div>
      </div>
    </div>
  );
};
