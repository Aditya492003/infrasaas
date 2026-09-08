import React, { useState } from 'react';
import { 
  Sparkles, 
  Layers, 
  ArrowRight, 
  ArrowLeft, 
  Server, 
  Flame, 
  Radio, 
  Zap, 
  Check, 
  Cpu, 
  Database,
  Sliders,
  Play
} from 'lucide-react';
import { generateArchitectureFromPrompt, BLUEPRINT_TEMPLATES } from '../data/aiArchitect';
import logoImg from '../assets/logo.png';

export const NewProject = ({ onSelectProject, onNavigateHome }) => {
  const [projectName, setProjectName] = useState('My Cloud Architecture');
  const [aiPrompt, setAiPrompt] = useState(
    'E-commerce application for 30,000 users with Redis caching, PostgreSQL database, and object storage for product images.'
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState('');

  // Handle starting with a blank canvas
  const handleStartBlank = () => {
    const blankData = BLUEPRINT_TEMPLATES.find(t => t.id === 'blank').generator();
    onSelectProject({
      name: projectName.trim() || 'Untitled Architecture',
      nodes: blankData.nodes,
      edges: blankData.edges,
      workload: blankData.workload
    });
  };

  // Handle AI generation
  const handleGenerateAI = () => {
    if (!aiPrompt.trim()) return;

    setIsGenerating(true);
    setGenerationStep('Analyzing requirements & traffic expectations...');

    setTimeout(() => {
      setGenerationStep('Synthesizing multi-tier topology & network routing...');
    }, 400);

    setTimeout(() => {
      setGenerationStep('Provisioning compute, database, and cache nodes...');
    }, 800);

    setTimeout(() => {
      const generated = generateArchitectureFromPrompt(aiPrompt);
      setIsGenerating(false);

      onSelectProject({
        name: projectName.trim() || 'AI Generated Architecture',
        nodes: generated.nodes,
        edges: generated.edges,
        workload: generated.workload
      });
    }, 1200);
  };

  // Handle picking a blueprint template
  const handleSelectTemplate = (template) => {
    const data = template.generator();
    onSelectProject({
      name: template.title,
      nodes: data.nodes,
      edges: data.edges,
      workload: data.workload
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col select-none">
      {/* Navigation Header */}
      <header className="h-16 border-b border-slate-200 bg-white px-6 sm:px-12 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onNavigateHome}
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 pr-3 border-r border-slate-200 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back</span>
          </button>
          <div className="flex items-center gap-2">
            <img src={logoImg} alt="InfraLab Logo" className="w-7 h-7 object-contain rounded-md shadow-xs" />
            <span className="font-bold text-sm text-slate-900 tracking-tight">InfraLab</span>
          </div>
        </div>

        <div className="text-xs text-slate-500">
          New Project Setup
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-12 flex flex-col space-y-8">
        {/* Title Section */}
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="text-3xl font-extrabold text-slate-950 tracking-tight">
            Create New Architecture
          </h1>
          <p className="text-sm text-slate-600 mt-2 leading-relaxed">
            Start with a completely blank canvas to drag-and-drop components manually, or describe your system to generate a tailored topology with AI.
          </p>
        </div>

        {/* Project Name Field */}
        <div className="max-w-md mx-auto w-full">
          <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
            Project Name
          </label>
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="e.g. Production E-Commerce Store"
            className="w-full bg-white border border-slate-300 rounded-lg px-3.5 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-xs"
          />
        </div>

        {/* Two Main Options: Blank Canvas vs AI Generation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">

          {/* Card 1: Start with Plain / Blank Canvas */}
          <div className="bg-white border-2 border-slate-200 hover:border-slate-300 rounded-2xl p-6 shadow-sm flex flex-col justify-between transition-all group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 group-hover:bg-slate-900 group-hover:text-white transition-colors shadow-xs">
                <Layers className="w-6 h-6" />
              </div>

              <div>
                <div className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full mb-2">
                  Manual Design
                </div>
                <h2 className="text-xl font-bold text-slate-900">
                  Start with Blank Canvas
                </h2>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                  Start with a clean slate. Drag and drop servers, load balancers, and databases from the component library, connect them together, and build your own design.
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-xs text-slate-600 space-y-1.5">
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Includes client traffic source</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Full freedom to build custom architecture</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Both Architect and Beginner modes supported</span>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <button
                type="button"
                onClick={handleStartBlank}
                className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 active:bg-black text-white font-semibold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Launch Blank Canvas</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Card 2: Generate with AI */}
          <div className="bg-gradient-to-b from-indigo-50/40 to-white border-2 border-indigo-300 hover:border-indigo-400 rounded-2xl p-6 shadow-sm flex flex-col justify-between transition-all relative overflow-hidden">
            {/* Top Badge */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-100">
                  <Sparkles className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-100 border border-indigo-200 px-2.5 py-0.5 rounded-full">
                  AI Generator
                </span>
              </div>

              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Generate with AI
                </h2>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                  Describe what your app does. InfraSim will design the optimal cloud services, connections, and realistic baseline traffic.
                </p>
              </div>

              {/* AI Prompt Input */}
              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                  Describe your application requirements:
                </label>
                <textarea
                  rows={3}
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="e.g. Video streaming platform with 50,000 users, CDN caching, and S3 storage..."
                  className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-xs resize-none"
                />

                {/* Prompt Presets */}
                <div className="flex items-center gap-1.5 flex-wrap pt-1">
                  <button
                    type="button"
                    onClick={() => setAiPrompt('E-commerce store for 50,000 flash sale users with Redis cache, PostgreSQL, and 4 servers.')}
                    className="text-[10px] text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 px-2 py-0.5 rounded-md transition-colors"
                  >
                    Flash Sale Store
                  </button>
                  <button
                    type="button"
                    onClick={() => setAiPrompt('Video streaming application with CDN edge caching, object storage, and microservices.')}
                    className="text-[10px] text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 px-2 py-0.5 rounded-md transition-colors"
                  >
                    Video Streaming
                  </button>
                  <button
                    type="button"
                    onClick={() => setAiPrompt('Fintech microservices with API gateway, Kafka event broker, and MongoDB.')}
                    className="text-[10px] text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 px-2 py-0.5 rounded-md transition-colors"
                  >
                    Fintech Kafka
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <button
                type="button"
                onClick={handleGenerateAI}
                disabled={isGenerating}
                className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:bg-indigo-400 text-white font-semibold text-xs rounded-xl shadow-md shadow-indigo-100 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
                <span>{isGenerating ? generationStep : 'Generate Architecture with AI'}</span>
              </button>
            </div>
          </div>

        </div>

        {/* Section: Starter Blueprints */}
        <div className="pt-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Or Pick a Pre-built Starter Blueprint
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Popular cloud architecture templates ready for immediate load testing.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {BLUEPRINT_TEMPLATES.filter(t => t.id !== 'blank').map(blueprint => {
              const IconComp = blueprint.icon === 'Flame' ? Flame : blueprint.icon === 'Radio' ? Radio : blueprint.icon === 'Zap' ? Zap : Server;

              return (
                <div
                  key={blueprint.id}
                  onClick={() => handleSelectTemplate(blueprint)}
                  className="bg-white border border-slate-200 hover:border-indigo-400 hover:shadow-md rounded-xl p-4 cursor-pointer transition-all flex flex-col justify-between group text-left"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 group-hover:bg-indigo-50 group-hover:text-indigo-600 text-slate-700 flex items-center justify-center transition-colors">
                        <IconComp className="w-4 h-4" />
                      </div>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${blueprint.badgeColor}`}>
                        {blueprint.badge}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {blueprint.title}
                    </h4>

                    <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-3">
                      {blueprint.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] font-semibold text-indigo-600">
                    <span>Use Blueprint</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </main>
    </div>
  );
};
