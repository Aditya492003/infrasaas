import React from 'react';
import { 
  ArrowRight, 
  Layers, 
  Activity, 
  AlertTriangle, 
  Sparkles, 
  Server, 
  Database, 
  Split, 
  Globe2,
  TrendingUp,
  Cpu,
  CheckCircle2,
  HardDrive
} from 'lucide-react';

import logoImg from '../assets/Gemini_Generated_Image_vfxl2kvfxl2kvfxl.png';

export const Landing = ({ onNavigateSimulator, onNavigateNewProject }) => {
  const scrollToDemo = () => {
    document.getElementById('architecture-preview')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
      {/* Minimal Navigation Bar */}
      <header className="h-16 border-b border-slate-200/80 bg-white/80 backdrop-blur-sm sticky top-0 z-30 px-6 sm:px-12 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <img src={logoImg} alt="InfraLab Logo" className="w-8 h-8 object-contain rounded-md shadow-xs" />
          <span className="font-bold text-base text-slate-900 tracking-tight">InfraLab</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onNavigateNewProject || onNavigateSimulator}
            className="px-3.5 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-md shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>New Project</span>
          </button>
          <button
            type="button"
            onClick={onNavigateSimulator}
            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-md shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span>Open Simulator</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-5xl mx-auto px-6 pt-16 pb-20 flex flex-col items-center text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-200 bg-indigo-50/60 text-indigo-700 text-xs font-medium mb-6">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span>Interactive Cloud Architecture & Deployment Simulator</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-950 tracking-tight max-w-3xl leading-[1.15]">
          Design your infrastructure. <br />
          <span className="text-indigo-600">Simulate the load.</span>
        </h1>

        {/* Subheading */}
        <p className="mt-5 text-lg text-slate-600 max-w-2xl leading-relaxed">
          Build cloud architectures visually and see how they behave before you deploy them.
        </p>

        {/* Hero Actions */}
        <div className="mt-8 flex flex-col sm:flex-row items-center gap-3">
          <button
            type="button"
            onClick={onNavigateNewProject || onNavigateSimulator}
            className="w-full sm:w-auto px-6 py-3 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-lg shadow-md shadow-indigo-100 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Start Simulating (Blank / AI)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={scrollToDemo}
            className="w-full sm:w-auto px-6 py-3 text-sm font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg shadow-xs transition-all flex items-center justify-center cursor-pointer"
          >
            See How It Works
          </button>
        </div>

        {/* Hero Architecture Preview Diagram with Live Simulated Metrics */}
        <div 
          id="architecture-preview"
          className="mt-16 w-full max-w-3xl bg-white border border-slate-200 rounded-xl shadow-lg p-6 sm:p-8 text-left relative overflow-hidden"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-400" />
              <div className="w-3 h-3 rounded-full bg-amber-400" />
              <div className="w-3 h-3 rounded-full bg-emerald-400" />
              <span className="ml-2 text-xs font-mono text-slate-400">preview-architecture.sim</span>
            </div>

            {/* Live Simulated Metric Pills */}
            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                CPU <span className="font-bold text-slate-900">68%</span>
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                Latency <span className="font-bold text-emerald-800">184ms</span>
              </span>
              <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                DB <span className="font-bold text-amber-800">82%</span>
              </span>
            </div>
          </div>

          {/* Diagram Flow */}
          <div className="flex flex-col items-center gap-3">
            {/* 1. Client */}
            <div className="w-48 bg-slate-900 text-white rounded-md p-2.5 flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-2">
                <Globe2 className="w-4 h-4 text-indigo-400" />
                <span className="text-xs font-semibold">Client Traffic</span>
              </div>
              <span className="text-[10px] font-mono text-indigo-300">10K users</span>
            </div>

            {/* Connector Arrow */}
            <div className="w-0.5 h-5 bg-slate-300" />

            {/* 2. Load Balancer */}
            <div className="w-56 bg-white border border-slate-200 rounded-md p-2.5 flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-2">
                <Split className="w-4 h-4 text-indigo-600" />
                <span className="text-xs font-semibold text-slate-800">Load Balancer</span>
              </div>
              <span className="text-[10px] font-mono text-slate-500">1,200 req/s</span>
            </div>

            {/* Connector Arrow */}
            <div className="w-0.5 h-5 bg-slate-300" />

            {/* 3. Server Cluster */}
            <div className="w-full grid grid-cols-3 gap-3">
              <div className="bg-white border border-slate-200 rounded-md p-2.5 shadow-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                    <Server className="w-3.5 h-3.5 text-slate-600" /> Server 1
                  </span>
                  <span className="text-[10px] font-mono font-bold text-slate-700">68% CPU</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1 overflow-hidden">
                  <div className="bg-indigo-500 h-full w-[68%]" />
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-md p-2.5 shadow-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                    <Server className="w-3.5 h-3.5 text-slate-600" /> Server 2
                  </span>
                  <span className="text-[10px] font-mono font-bold text-slate-700">67% CPU</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1 overflow-hidden">
                  <div className="bg-indigo-500 h-full w-[67%]" />
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-md p-2.5 shadow-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                    <Server className="w-3.5 h-3.5 text-slate-600" /> Server 3
                  </span>
                  <span className="text-[10px] font-mono font-bold text-slate-700">71% CPU</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1 overflow-hidden">
                  <div className="bg-indigo-500 h-full w-[71%]" />
                </div>
              </div>
            </div>

            {/* Connector Arrow */}
            <div className="w-0.5 h-5 bg-slate-300" />

            {/* 4. PostgreSQL Database */}
            <div className="w-64 bg-amber-50/60 border border-amber-300 rounded-md p-2.5 shadow-xs">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1.5">
                  <Database className="w-4 h-4 text-amber-600" />
                  <span className="text-xs font-semibold text-amber-950">PostgreSQL</span>
                </div>
                <span className="text-[10px] font-mono font-bold text-amber-800">82% CPU</span>
              </div>
              <div className="flex items-center justify-between text-[10px] text-amber-700">
                <span>Connections: 164 / 200</span>
                <span className="font-semibold text-amber-800">Warning State</span>
              </div>
            </div>
          </div>
        </div>

        {/* Small 4-Feature Section */}
        <section className="mt-28 w-full">
          <div className="text-center mb-12">
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600">Features</h2>
            <p className="mt-1 text-2xl font-bold text-slate-900 tracking-tight">
              Cloud Architecture Engineering
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-left">
            {/* Feature 1 */}
            <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-xs hover:border-slate-300 transition-all">
              <div className="w-9 h-9 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mb-3">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Visual Architecture</h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                Build your infrastructure using drag-and-drop components on an interactive canvas with intuitive handles and connections.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-xs hover:border-slate-300 transition-all">
              <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mb-3">
                <Activity className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Workload Simulation</h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                Increase users and traffic and see how the architecture responds. Observe real-time CPU, memory, and latency response curves.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-xs hover:border-slate-300 transition-all">
              <div className="w-9 h-9 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 mb-3">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Bottleneck Detection</h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                Identify overloaded servers, databases, network components, and storage before your real infrastructure experiences outages.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-xs hover:border-slate-300 transition-all">
              <div className="w-9 h-9 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mb-3">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">AI Assistance</h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                Use AI to translate natural language requirements into architectures and diagnose complex multi-tier bottleneck problems.
              </p>
            </div>
          </div>
        </section>

        {/* Bottom Call to Action */}
        <section className="mt-24 w-full bg-slate-900 text-white rounded-2xl p-8 sm:p-12 text-center shadow-md">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Build your first architecture
          </h2>
          <p className="mt-3 text-slate-400 text-sm max-w-md mx-auto">
            Try the interactive simulator with preloaded multi-tier architectures, live workload sliders, and bottleneck diagnostics.
          </p>
          <div className="mt-6 flex justify-center">
            <button
              type="button"
              onClick={onNavigateSimulator}
              className="px-6 py-3 text-sm font-semibold text-slate-950 bg-white hover:bg-slate-100 rounded-lg shadow transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Open Simulator</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>
      </main>

      {/* Minimal Footer */}
      <footer className="py-6 border-t border-slate-200 text-center text-xs text-slate-500">
        <p>© InfraLab — Interactive Cloud Infrastructure Simulator & AI Architecture Advisor</p>
      </footer>
    </div>
  );
};
