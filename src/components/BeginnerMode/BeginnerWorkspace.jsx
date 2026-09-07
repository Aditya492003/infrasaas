import React, { useState } from 'react';
import { 
  Users, 
  Split, 
  Server, 
  Database, 
  Flame, 
  HardDrive, 
  HelpCircle, 
  ArrowRight, 
  Plus, 
  Check, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles,
  Zap,
  TrendingUp,
  Clock,
  ShieldCheck,
  AlertCircle,
  Lightbulb,
  X
} from 'lucide-react';

export const BeginnerWorkspace = ({
  nodes,
  workload,
  setWorkload,
  simulationResult,
  onRunSimulation,
  isSimulating,
  onRemediate,
  onUpdateNodeConfig,
  onAddComponent
}) => {
  const [activeConcept, setActiveConcept] = useState(null);

  // Identify nodes in the architecture
  const serverNodes = nodes.filter(n => ['server', 'vm', 'container'].includes(n.data?.type));
  const dbNode = nodes.find(n => ['postgresql', 'mysql', 'mongodb'].includes(n.data?.type));
  const redisNode = nodes.find(n => n.data?.type === 'redis');
  const lbNode = nodes.find(n => n.data?.type === 'load_balancer');
  const storageNode = nodes.find(n => n.data?.type === 'object_storage');

  // Total compute instances across server nodes
  const totalServers = serverNodes.reduce((acc, s) => acc + (Number(s.data?.config?.instances) || 1), 0);

  // Status metrics
  const status = simulationResult?.status || 'idle';
  const bottleneck = simulationResult?.bottleneck;
  const avgLatency = simulationResult?.systemMetrics?.averageLatency || 45;

  // Cloud learning concepts for beginners
  const CONCEPTS = {
    visitors: {
      title: "📱 Step 1: The Visitors (Traffic)",
      subtitle: "The real people using your website or app",
      explanation: "Every time someone visits your app, their phone or laptop sends 'requests' (like asking for a webpage, logging in, or loading photos). If 50,000 people click at the exact same second, your servers must answer all 50,000 requests without making them wait!",
      analogies: "Think of visitors as hungry customers walking into a restaurant at the same time."
    },
    loadBalancer: {
      title: "🚦 Step 2: Traffic Cop (Load Balancer)",
      subtitle: "Prevents any single server from getting crushed",
      explanation: "A Load Balancer sits in front of your servers. Instead of sending all 10,000 visitors to Server 1 (which would immediately crash), the Load Balancer hands 3,333 people to Server 1, 3,333 to Server 2, and 3,334 to Server 3.",
      analogies: "Like a restaurant host greeting customers at the door and seating them across different tables evenly."
    },
    servers: {
      title: "🧑‍🍳 Step 3: Application Workers (Servers)",
      subtitle: "Computers that calculate things and run your code",
      explanation: "Servers do the heavy lifting: running your JavaScript code, checking user passwords, calculating checkout totals, and creating the HTML to send back to the user.",
      analogies: "Like the chefs in the kitchen. If you only have 1 chef and 1,000 orders arrive, food will take 3 hours to come out. Hiring 5 chefs gets orders cooked 5x faster!"
    },
    cache: {
      title: "⚡ Step 4: Speed Booster (Redis Cache)",
      subtitle: "The ultra-fast cheat sheet in memory",
      explanation: "Reading from a database is slow because it reads from disks. Redis stores frequent answers directly in computer memory (RAM). When a user asks 'What are today's top 10 products?', the server checks Redis in 0.001 seconds instead of bothering the database.",
      analogies: "Like having today's daily menu memorized on a sticky note instead of walking back to the file cabinet every single time someone asks."
    },
    database: {
      title: "🗄️ Step 5: The Filing Cabinet (Database)",
      subtitle: "Where all your customer records and passwords live permanently",
      explanation: "Databases (like PostgreSQL) store everything safely on disk. Even if the server turns off, database data is never lost. However, searching through millions of rows takes time. If too many workers query the database at once, the database gets clogged.",
      analogies: "Like a secure bank vault with filing cabinets. Only one person can look in a drawer at a time, so lines form quickly if you don't use a cache."
    },
    storage: {
      title: "📦 Step 6: File Locker (Object Storage / S3)",
      subtitle: "Where uploaded photos, PDFs, and files are stored",
      explanation: "Databases are terrible for storing big files like user profile pictures or videos. Object Storage stores huge files cheaply and reliably, delivering them directly to users.",
      analogies: "Like a dedicated shipping warehouse for bulky packages."
    }
  };

  // Plain-English latency / speed assessment
  const getSpeedRating = () => {
    if (avgLatency > 1500) return { label: "Catastrophic Delay 🚨", color: "text-rose-600 bg-rose-50 border-rose-200", desc: `~${(avgLatency / 1000).toFixed(1)}s delay! Users think your site is down and will abandon it.` };
    if (avgLatency > 400) return { label: "Sluggish ⚠️", color: "text-amber-700 bg-amber-50 border-amber-200", desc: `~${avgLatency}ms delay. Noticeable lag when clicking buttons.` };
    return { label: "Lightning Fast ⚡", color: "text-emerald-700 bg-emerald-50 border-emerald-200", desc: `~${avgLatency}ms delay. Everything feels instant and snappy!` };
  };

  const speedRating = getSpeedRating();

  // Helper to adjust server count
  const handleAdjustServers = (delta) => {
    if (!serverNodes[0]) return;
    const current = Number(serverNodes[0].data?.config?.instances) || 1;
    const updated = Math.max(1, current + delta);
    onUpdateNodeConfig(serverNodes[0].id, {
      ...serverNodes[0].data.config,
      instances: updated
    });
  };

  // Helper to upgrade DB
  const handleUpgradeDb = (tier) => {
    if (!dbNode) return;
    const configs = {
      small: { instanceType: 'db.t3.small', maxConnections: 100, iops: 1500 },
      medium: { instanceType: 'db.t3.medium', maxConnections: 200, iops: 3000 },
      large: { instanceType: 'db.r5.large', maxConnections: 400, iops: 6000 },
    };
    onUpdateNodeConfig(dbNode.id, {
      ...dbNode.data.config,
      ...configs[tier]
    });
  };

  return (
    <div className="flex-1 h-full overflow-y-auto bg-slate-50/70 p-6 select-none flex flex-col items-center">
      <div className="w-full max-w-5xl space-y-6">

        {/* Friendly Welcome Banner */}
        <div className="bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-indigo-100 rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-700 uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Beginner Mode Active</span>
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              How Cloud Deployments Work Under Pressure
            </h2>
            <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
              New to cloud servers? Think of your infrastructure as a busy restaurant: <strong>Visitors</strong> are customers, <strong>Load Balancers</strong> are hosts, <strong>Servers</strong> are kitchen chefs, and the <strong>Database</strong> is the recipe vault.
            </p>
          </div>

          <button
            type="button"
            onClick={onRunSimulation}
            disabled={isSimulating}
            className="flex-shrink-0 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold text-xs rounded-lg shadow-sm flex items-center gap-2 transition-all cursor-pointer"
          >
            <Zap className="w-4 h-4 fill-white" />
            <span>{isSimulating ? "Simulating..." : "Test Traffic Now"}</span>
          </button>
        </div>

        {/* Live System Health Gauge Card */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Overall Experience For Your Users
              </div>
              <div className="text-base font-bold text-slate-900 mt-0.5 flex items-center gap-2">
                <span>Site Status:</span>
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${speedRating.color}`}>
                  {speedRating.label}
                </span>
              </div>
            </div>

            <div className="text-xs text-slate-600 sm:text-right max-w-sm">
              <span className="font-semibold text-slate-800">User Experience: </span>
              {speedRating.desc}
            </div>
          </div>

          {/* Plain-English Bottleneck Explanation */}
          {bottleneck ? (
            <div className="mt-4 p-4 rounded-lg bg-amber-50/70 border border-amber-200 text-xs">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="space-y-2 flex-1">
                  <div className="font-bold text-amber-950 text-sm">
                    {bottleneck.nodeType === 'postgresql' || bottleneck.nodeType === 'mysql'
                      ? "🚨 The Filing Cabinet (Database) is Clogged!"
                      : `⚠️ ${bottleneck.nodeName} is Getting Overloaded!`}
                  </div>
                  <p className="text-amber-900 leading-relaxed">
                    {bottleneck.nodeType === 'postgresql' || bottleneck.nodeType === 'mysql'
                      ? `Your ${totalServers} servers are asking the database for data too quickly (${bottleneck.metricValue} load). When a database gets overwhelmed, requests pile up in a queue, causing everyone's screen to freeze!`
                      : bottleneck.message}
                  </p>

                  <div className="pt-2 flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-amber-950">Quick Fixes:</span>
                    {!redisNode && (
                      <button
                        type="button"
                        onClick={() => onRemediate('add_redis')}
                        className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded text-xs transition-colors flex items-center gap-1.5 shadow-xs"
                      >
                        <Flame className="w-3.5 h-3.5" />
                        <span>Add Speed Booster (Redis Cache)</span>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => onRemediate('upgrade_db')}
                      className="px-3 py-1.5 bg-white hover:bg-slate-50 border border-amber-300 text-amber-950 font-semibold rounded text-xs transition-colors flex items-center gap-1.5"
                    >
                      <Database className="w-3.5 h-3.5 text-amber-700" />
                      <span>Get a Heavy-Duty Database</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-4 p-3 rounded-lg bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>
                <strong>System is stable!</strong> All workers and the database have plenty of breathing room for this traffic level.
              </span>
            </div>
          )}
        </div>

        {/* Visual Pipeline: The Journey of a Click */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                The Journey of a User's Request
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Click on any stage to see what it actually does and why it matters in real life.
              </p>
            </div>
            <span className="text-[10px] text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded font-medium">
              Click cards to learn
            </span>
          </div>

          {/* Visual Cards Flow */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 pt-2">

            {/* 1. Visitors */}
            <div 
              onClick={() => setActiveConcept('visitors')}
              className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/60 hover:bg-indigo-50/40 hover:border-indigo-200 cursor-pointer transition-all text-left relative group"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center shadow-xs">
                  <Users className="w-4 h-4" />
                </div>
                <HelpCircle className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600" />
              </div>
              <div className="text-xs font-bold text-slate-900">1. Visitors</div>
              <div className="text-[10px] text-slate-500 mt-0.5">The Audience</div>
              <div className="mt-3 pt-2 border-t border-slate-200 font-mono text-[11px] font-bold text-slate-700">
                {workload.concurrentUsers.toLocaleString()} online
              </div>
            </div>

            {/* 2. Load Balancer */}
            <div 
              onClick={() => setActiveConcept('loadBalancer')}
              className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/60 hover:bg-indigo-50/40 hover:border-indigo-200 cursor-pointer transition-all text-left relative group"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center shadow-xs">
                  <Split className="w-4 h-4" />
                </div>
                <HelpCircle className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600" />
              </div>
              <div className="text-xs font-bold text-slate-900">2. Traffic Cop</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Load Balancer</div>
              <div className="mt-3 pt-2 border-t border-slate-200 font-mono text-[11px] font-bold text-slate-700">
                Splits {workload.requestsPerSecond} req/s
              </div>
            </div>

            {/* 3. Servers */}
            <div 
              onClick={() => setActiveConcept('servers')}
              className={`p-3.5 rounded-lg border cursor-pointer transition-all text-left relative group ${
                simulationResult?.nodeMetrics[serverNodes[0]?.id]?.status === 'critical'
                  ? 'border-rose-300 bg-rose-50/50'
                  : simulationResult?.nodeMetrics[serverNodes[0]?.id]?.status === 'warning'
                  ? 'border-amber-300 bg-amber-50/50'
                  : 'border-slate-200 bg-slate-50/60 hover:border-indigo-200 hover:bg-indigo-50/40'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center shadow-xs">
                  <Server className="w-4 h-4" />
                </div>
                <HelpCircle className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600" />
              </div>
              <div className="text-xs font-bold text-slate-900">3. Kitchen Chefs</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Application Servers</div>
              <div className="mt-3 pt-2 border-t border-slate-200 font-mono text-[11px] font-bold text-slate-700">
                {totalServers} active servers
              </div>
            </div>

            {/* 4. Redis Cache */}
            <div 
              onClick={() => setActiveConcept('cache')}
              className={`p-3.5 rounded-lg border cursor-pointer transition-all text-left relative group ${
                redisNode ? 'border-orange-200 bg-orange-50/40' : 'border-dashed border-slate-300 bg-slate-50/30'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shadow-xs ${
                  redisNode ? 'bg-orange-500 text-white' : 'bg-slate-200 text-slate-500'
                }`}>
                  <Flame className="w-4 h-4" />
                </div>
                <HelpCircle className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600" />
              </div>
              <div className="text-xs font-bold text-slate-900">4. Cheat Sheet</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Redis Cache</div>
              <div className="mt-3 pt-2 border-t border-slate-200 font-mono text-[11px] font-semibold text-slate-700">
                {redisNode ? '⚡ Active (70% saved)' : '❌ Not Installed'}
              </div>
            </div>

            {/* 5. Database */}
            <div 
              onClick={() => setActiveConcept('database')}
              className={`p-3.5 rounded-lg border cursor-pointer transition-all text-left relative group ${
                simulationResult?.nodeMetrics[dbNode?.id]?.status === 'critical'
                  ? 'border-rose-400 bg-rose-50/80 ring-2 ring-rose-200'
                  : simulationResult?.nodeMetrics[dbNode?.id]?.status === 'warning'
                  ? 'border-amber-400 bg-amber-50/80'
                  : 'border-slate-200 bg-slate-50/60 hover:border-indigo-200 hover:bg-indigo-50/40'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shadow-xs">
                  <Database className="w-4 h-4" />
                </div>
                <HelpCircle className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600" />
              </div>
              <div className="text-xs font-bold text-slate-900">5. Filing Vault</div>
              <div className="text-[10px] text-slate-500 mt-0.5">PostgreSQL Database</div>
              <div className="mt-3 pt-2 border-t border-slate-200 font-mono text-[11px] font-bold text-slate-700">
                {simulationResult?.nodeMetrics[dbNode?.id]?.connections || 'Ready'}
              </div>
            </div>

          </div>
        </div>

        {/* Interactive Beginner Server Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Control Panel 1: Team & Hardware Sizing */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              🛠️ Server Operations Controls
            </h4>

            {/* Server Stepper */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-800">
                How many Chefs (Servers) do you want?
              </label>
              <p className="text-[11px] text-slate-500">
                More servers share the computing load evenly.
              </p>
              <div className="flex items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => handleAdjustServers(-1)}
                  disabled={totalServers <= 1}
                  className="w-9 h-9 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 disabled:opacity-40 font-bold text-slate-700 flex items-center justify-center"
                >
                  -
                </button>
                <div className="flex-1 text-center font-mono font-bold text-slate-900 text-sm bg-slate-50 py-1.5 rounded-lg border border-slate-200">
                  {totalServers} Servers Working
                </div>
                <button
                  type="button"
                  onClick={() => handleAdjustServers(1)}
                  className="w-9 h-9 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 font-bold text-slate-700 flex items-center justify-center"
                >
                  +
                </button>
              </div>
            </div>

            {/* Database Size Selector */}
            <div className="space-y-1.5 pt-2 border-t border-slate-100">
              <label className="block text-xs font-semibold text-slate-800">
                How strong should the Database be?
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleUpgradeDb('small')}
                  className={`p-2 rounded-lg text-xs font-medium border text-left transition-all ${
                    dbNode?.data?.config?.instanceType === 'db.t3.small'
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-900 font-bold'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div>Small</div>
                  <div className="text-[10px] text-slate-400 font-normal">100 conn</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleUpgradeDb('medium')}
                  className={`p-2 rounded-lg text-xs font-medium border text-left transition-all ${
                    dbNode?.data?.config?.instanceType === 'db.t3.medium'
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-900 font-bold'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div>Medium</div>
                  <div className="text-[10px] text-slate-400 font-normal">200 conn</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleUpgradeDb('large')}
                  className={`p-2 rounded-lg text-xs font-medium border text-left transition-all ${
                    dbNode?.data?.config?.instanceType === 'db.r5.large'
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-900 font-bold'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div>Heavy Duty</div>
                  <div className="text-[10px] text-slate-400 font-normal">400 conn</div>
                </button>
              </div>
            </div>

            {/* Redis Toggle Button */}
            <div className="space-y-1.5 pt-2 border-t border-slate-100 flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-slate-800">Speed Booster (Redis Cache)</div>
                <div className="text-[11px] text-slate-500">Shields database from repeated questions</div>
              </div>
              {redisNode ? (
                <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 font-bold text-xs rounded-full flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Installed
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => onRemediate('add_redis')}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-lg transition-colors flex items-center gap-1 shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Install Redis</span>
                </button>
              )}
            </div>
          </div>

          {/* Control Panel 2: Workload Traffic Scenarios */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              👥 Traffic Scenarios (Workload Stress)
            </h4>

            {/* Scenario Preset Buttons */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-800">
                Choose a real-world scenario:
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setWorkload({ concurrentUsers: 5000, requestsPerSecond: 600, trafficMultiplier: 1, requestSize: 100 })}
                  className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-left transition-colors"
                >
                  <div className="font-semibold text-xs text-slate-800">☕ Normal Morning</div>
                  <div className="text-[10px] text-slate-500">5,000 users • 600 req/s</div>
                </button>

                <button
                  type="button"
                  onClick={() => setWorkload({ concurrentUsers: 15000, requestsPerSecond: 1800, trafficMultiplier: 1, requestSize: 100 })}
                  className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-left transition-colors"
                >
                  <div className="font-semibold text-xs text-slate-800">🍕 Lunch Rush</div>
                  <div className="text-[10px] text-slate-500">15,000 users • 1,800 req/s</div>
                </button>

                <button
                  type="button"
                  onClick={() => setWorkload({ concurrentUsers: 45000, requestsPerSecond: 4500, trafficMultiplier: 2, requestSize: 100 })}
                  className="p-2.5 rounded-lg border border-amber-200 bg-amber-50/50 hover:bg-amber-100/50 text-left transition-colors"
                >
                  <div className="font-semibold text-xs text-amber-900">🚀 Viral Launch</div>
                  <div className="text-[10px] text-amber-700">45,000 users • 4,500 req/s</div>
                </button>

                <button
                  type="button"
                  onClick={() => setWorkload({ concurrentUsers: 85000, requestsPerSecond: 8000, trafficMultiplier: 3, requestSize: 100 })}
                  className="p-2.5 rounded-lg border border-rose-200 bg-rose-50/50 hover:bg-rose-100/50 text-left transition-colors"
                >
                  <div className="font-semibold text-xs text-rose-900">🔥 Black Friday Sale</div>
                  <div className="text-[10px] text-rose-700">85,000 users • Extreme Load</div>
                </button>
              </div>
            </div>

            {/* Slider with instant feedback */}
            <div className="space-y-1.5 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-800">
                <span>Or drag custom users:</span>
                <span className="font-mono text-indigo-600">{workload.concurrentUsers.toLocaleString()} Users</span>
              </div>
              <input
                type="range"
                min="1000"
                max="100000"
                step="2000"
                value={workload.concurrentUsers}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setWorkload(prev => ({
                    ...prev,
                    concurrentUsers: val,
                    requestsPerSecond: Math.max(100, Math.round(val * 0.12))
                  }));
                }}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>Quiet (1k)</span>
                <span>Medium (50k)</span>
                <span>Stampede (100k)</span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Learning Concept Modal Explainer */}
      {activeConcept && CONCEPTS[activeConcept] && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 border border-slate-200 text-left relative">
            <button
              type="button"
              onClick={() => setActiveConcept(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1 rounded-md"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-base font-bold text-slate-900">
              {CONCEPTS[activeConcept].title}
            </div>
            <div className="text-xs font-medium text-indigo-600 mt-0.5">
              {CONCEPTS[activeConcept].subtitle}
            </div>

            <div className="mt-4 text-xs text-slate-700 leading-relaxed space-y-3">
              <p>{CONCEPTS[activeConcept].explanation}</p>
              
              <div className="p-3 bg-indigo-50/70 border border-indigo-100 rounded-lg text-indigo-950">
                <div className="flex items-center gap-1.5 font-bold text-[11px] text-indigo-700 mb-1">
                  <Lightbulb className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Real-World Analogy</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  {CONCEPTS[activeConcept].analogies}
                </p>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setActiveConcept(null)}
                className="px-4 py-1.5 bg-slate-900 text-white font-semibold text-xs rounded-lg hover:bg-slate-800 transition-colors"
              >
                Got it!
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
