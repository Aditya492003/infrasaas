import React, { useState } from 'react';
import { 
  Play, 
  RotateCcw, 
  RotateCw, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Save, 
  Check, 
  Sparkles,
  ArrowLeft,
  Share2,
  RefreshCw,
  Menu,
  GraduationCap
} from 'lucide-react';

export const TopBar = ({
  architectureName,
  setArchitectureName,
  onRunSimulation,
  isSimulating,
  hasSimulated,
  systemStatus,
  onFitView,
  onZoomIn,
  onZoomOut,
  onResetArchitecture,
  onOpenAiAssistant,
  onNavigateLanding,
  onNavigateNewProject,
  onOpenNavSidebar,
  onOpenTutorial,
  mode = 'architect',
  setMode
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  return (
    <header className="h-14 bg-white border-b border-slate-200 px-4 flex items-center justify-between select-none z-20 flex-shrink-0">
      {/* Left: Menu Drawer Trigger, Branding & Architecture Title */}
      <div className="flex items-center gap-2.5">
        <button
          type="button"
          onClick={onOpenNavSidebar}
          className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
          title="Open Menu (Recent Creations, Pricing, Templates)"
        >
          <Menu className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={onNavigateLanding}
          className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 pl-1 pr-2 border-r border-slate-200 transition-colors"
          title="Back to Landing Page"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Home</span>
        </button>

        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-sm">
            IS
          </div>
          <span className="font-bold text-sm text-slate-900 tracking-tight">InfraSim</span>
        </div>

        <span className="text-slate-300">/</span>

        {/* Editable Architecture Title */}
        {isEditingTitle ? (
          <input
            type="text"
            value={architectureName}
            onChange={(e) => setArchitectureName(e.target.value)}
            onBlur={() => setIsEditingTitle(false)}
            onKeyDown={(e) => e.key === 'Enter' && setIsEditingTitle(false)}
            autoFocus
            className="text-xs font-medium text-slate-800 bg-slate-100 border border-indigo-400 rounded px-2 py-0.5 focus:outline-none"
          />
        ) : (
          <button
            type="button"
            onClick={() => setIsEditingTitle(true)}
            className="text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 px-2 py-1 rounded transition-colors"
            title="Click to rename"
          >
            {architectureName}
          </button>
        )}

        {/* Global status badge */}
        {hasSimulated && (
          <div className="ml-2 flex items-center gap-1.5">
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 ${
                systemStatus === 'critical'
                  ? 'bg-rose-100 text-rose-800 border border-rose-200'
                  : systemStatus === 'warning'
                  ? 'bg-amber-100 text-amber-800 border border-amber-200'
                  : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${
                systemStatus === 'critical' ? 'bg-rose-500 animate-ping' : systemStatus === 'warning' ? 'bg-amber-500' : 'bg-emerald-500'
              }`} />
              {systemStatus}
            </span>
          </div>
        )}
      </div>

      {/* Center: Mode Switcher & Canvas Controls */}
      <div className="flex items-center gap-3">
        {/* Beginner vs Architect Mode Toggle */}
        <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 shadow-inner">
          <button
            type="button"
            onClick={() => setMode('architect')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-all ${
              mode === 'architect'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>🛠️ Architect Mode</span>
          </button>
          <button
            type="button"
            onClick={() => setMode('beginner')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-all ${
              mode === 'beginner'
                ? 'bg-white text-emerald-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>🐣 Beginner Mode</span>
            <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1 py-0.2 rounded font-bold">Simple</span>
          </button>
        </div>

        {/* Canvas Zoom & Fit controls (when in Architect mode) */}
        {mode === 'architect' && (
          <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-md p-1">
            <button
              type="button"
              onClick={onZoomOut}
              className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-white rounded transition-all"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={onZoomIn}
              className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-white rounded transition-all"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <div className="w-[1px] h-3.5 bg-slate-200 mx-0.5" />
            <button
              type="button"
              onClick={onFitView}
              className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-white rounded transition-all"
              title="Fit View"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
            <div className="w-[1px] h-3.5 bg-slate-200 mx-0.5" />
            <button
              type="button"
              onClick={onResetArchitecture}
              className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-white rounded transition-all"
              title="Reset to Default Architecture"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Right: Tutorial, AI Assistant, New Project, Save, and Primary Simulate Button */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onOpenTutorial}
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded border border-indigo-200 transition-colors"
          title="Open Beginner Cloud Architecture Tutorial"
        >
          <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />
          <span>Tutorial</span>
        </button>

        <button
          type="button"
          onClick={onOpenAiAssistant}
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded border border-slate-200 transition-colors"
          title="Open AI Architecture Assistant"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span>Ask AI Why</span>
        </button>

        <button
          type="button"
          onClick={onNavigateNewProject}
          className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-indigo-600 hover:bg-slate-100 rounded border border-slate-200 transition-colors"
          title="Create New Project (Blank or AI)"
        >
          <span className="text-indigo-600 font-bold">+</span>
          <span>New Project</span>
        </button>

        <button
          type="button"
          onClick={handleSave}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded border border-slate-200 transition-colors"
        >
          {saveSuccess ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-emerald-700">Saved</span>
            </>
          ) : (
            <>
              <Save className="w-3.5 h-3.5 text-slate-500" />
              <span>Save</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={onRunSimulation}
          disabled={isSimulating}
          className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded shadow-sm shadow-indigo-200 transition-all cursor-pointer"
        >
          <Play className={`w-3.5 h-3.5 fill-white ${isSimulating ? 'animate-spin' : ''}`} />
          <span>{isSimulating ? 'Simulating...' : '▶ Simulate'}</span>
        </button>
      </div>
    </header>
  );
};
