import React, { useState } from 'react';
import { 
  GraduationCap, 
  X, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Sparkles, 
  Server, 
  Split, 
  Database, 
  Globe2, 
  Flame, 
  HardDrive,
  CheckCircle2,
  Play
} from 'lucide-react';

export const TutorialModal = ({ isOpen, onClose, onBuildTutorialArchitecture }) => {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const TUTORIAL_STEPS = [
    {
      stepNumber: 1,
      title: "The Anatomy of a Production Website",
      subtitle: "How modern websites handle thousands of visitors simultaneously",
      badge: "Core Concept",
      icon: Globe2,
      content: (
        <div className="space-y-3 text-xs text-slate-700 leading-relaxed">
          <p>
            When someone visits a website like Airbnb, Netflix, or Shopify, their browser doesn't talk to a single magical machine. Modern web apps use a <strong>multi-tier architecture</strong> to handle millions of clicks without crashing.
          </p>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
            <div className="font-semibold text-slate-900">The 4 Fundamental Layers:</div>
            <ul className="space-y-1.5 list-disc list-inside text-slate-600">
              <li><strong>Edge & Networking:</strong> Directs traffic and prevents denial-of-service.</li>
              <li><strong>Load Balancers:</strong> Distributes incoming traffic across healthy machines.</li>
              <li><strong>Application Compute:</strong> Servers running your code and APIs.</li>
              <li><strong>Datastores:</strong> Databases for permanent records and caches for speed.</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      stepNumber: 2,
      title: "Step 1: Avoid Single Points of Failure",
      subtitle: "Why you should never deploy just one server in production",
      badge: "High Availability",
      icon: Split,
      content: (
        <div className="space-y-3 text-xs text-slate-700 leading-relaxed">
          <p>
            If you run your entire website on just <strong>1 server</strong>, you create a <em>Single Point of Failure (SPOF)</em>. If that machine runs out of memory, restarts, or catches fire, your entire business goes offline!
          </p>
          <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-lg text-indigo-950 space-y-1.5">
            <div className="font-bold text-indigo-900 flex items-center gap-1.5">
              <Split className="w-4 h-4 text-indigo-600" />
              <span>The Solution: Application Load Balancer (ALB)</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              Place a Load Balancer in front of <strong>3 or more server replicas</strong>. If Server 1 crashes or gets busy, the Load Balancer instantly re-routes incoming visitors to Server 2 and 3 without any downtime.
            </p>
          </div>
        </div>
      )
    },
    {
      stepNumber: 3,
      title: "Step 2: The Database Bottleneck Trap",
      subtitle: "Why databases choke before servers do",
      badge: "Data Layer",
      icon: Database,
      content: (
        <div className="space-y-3 text-xs text-slate-700 leading-relaxed">
          <p>
            Servers are stateless (they can be created and destroyed in seconds). But your <strong>Database (PostgreSQL / MySQL)</strong> stores state on physical disk.
          </p>
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-950 space-y-2">
            <div className="font-bold text-amber-900">The Golden Rule of Cloud Architecture:</div>
            <p className="text-[11px] leading-relaxed">
              Adding 10 more servers to handle spike traffic will actually <strong>kill your database faster</strong> because all 10 servers will open hundreds of database connections at once.
            </p>
            <div className="text-[11px] font-semibold text-amber-900">
              💡 Fix: Always tune your database connection limits and keep queries indexed!
            </div>
          </div>
        </div>
      )
    },
    {
      stepNumber: 4,
      title: "Step 3: The 10x Speed Booster (Redis Caching)",
      subtitle: "How top tech companies handle millions of read requests",
      badge: "Performance",
      icon: Flame,
      content: (
        <div className="space-y-3 text-xs text-slate-700 leading-relaxed">
          <p>
            In most web apps, <strong>80% of database queries are identical</strong> (e.g. loading the homepage, fetching product lists, checking user permissions).
          </p>
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-950 space-y-2">
            <div className="font-bold text-emerald-900 flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-emerald-600" />
              <span>In-Memory Redis Caching</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              When you put <strong>Redis</strong> in front of PostgreSQL, answers are stored in high-speed RAM (taking 1 millisecond instead of 50ms). This absorbs up to <strong>70% of database query pressure</strong>, allowing your app to handle 5x more users with the same database!
            </p>
          </div>
        </div>
      )
    },
    {
      stepNumber: 5,
      title: "Step 4: Separating Heavy Files (Object Storage)",
      subtitle: "Why files never go into your SQL database",
      badge: "Asset Storage",
      icon: HardDrive,
      content: (
        <div className="space-y-3 text-xs text-slate-700 leading-relaxed">
          <p>
            Never store user uploaded photos, videos, or PDFs inside PostgreSQL. Doing so bloats database backups and hogs memory.
          </p>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1.5">
            <div className="font-bold text-slate-900">Use Cloud Object Storage (S3 / Blob):</div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Store large files in Object Storage and only save the <em>URL link</em> in your database. This keeps your database lightweight and lightning fast.
            </p>
          </div>
        </div>
      )
    },
    {
      stepNumber: 6,
      title: "Step 5: Testing Your Website Under Simulated Load",
      subtitle: "How to use InfraSim to find your system's breaking point",
      badge: "Simulation",
      icon: Play,
      content: (
        <div className="space-y-3 text-xs text-slate-700 leading-relaxed">
          <p>
            Now that you know the architecture, use InfraSim to test it:
          </p>
          <div className="p-3 bg-indigo-50/70 border border-indigo-200 rounded-lg text-indigo-950 space-y-2">
            <ol className="space-y-1.5 list-decimal list-inside text-[11px]">
              <li>Use the bottom <strong>Workload Sliders</strong> to increase users (1k → 50k).</li>
              <li>Click <strong>▶ Run Simulation</strong> to see the load distribute.</li>
              <li>Observe which node turns amber or red — that is your <strong>system bottleneck</strong>!</li>
              <li>Click the remediation buttons or Ask AI to fix the bottleneck!</li>
            </ol>
          </div>
        </div>
      )
    }
  ];

  const stepData = TUTORIAL_STEPS[currentStep];
  const StepIcon = stepData.icon;

  const handleBuild = () => {
    onBuildTutorialArchitecture();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 select-none animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-xl w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">
                Beginner's Masterclass
              </div>
              <h3 className="text-sm font-bold text-slate-900">
                How to Build Cloud Infrastructure for Websites
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Stepper Progress Indicator */}
        <div className="px-6 pt-4 pb-2 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {TUTORIAL_STEPS.map((step, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentStep(idx)}
                className={`h-1.5 rounded-full transition-all ${
                  idx === currentStep
                    ? 'w-6 bg-indigo-600'
                    : idx < currentStep
                    ? 'w-3 bg-emerald-500'
                    : 'w-3 bg-slate-200'
                }`}
                title={`Go to step ${idx + 1}`}
              />
            ))}
          </div>

          <span className="text-[11px] font-semibold text-slate-500">
            Step {currentStep + 1} of {TUTORIAL_STEPS.length}
          </span>
        </div>

        {/* Step Body */}
        <div className="p-6 flex-1 overflow-y-auto space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center flex-shrink-0 shadow-xs">
              <StepIcon className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 uppercase tracking-wider">
                {stepData.badge}
              </span>
              <h4 className="text-base font-bold text-slate-900 mt-1">
                {stepData.title}
              </h4>
              <div className="text-xs text-slate-500">
                {stepData.subtitle}
              </div>
            </div>
          </div>

          <div className="pt-2">
            {stepData.content}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-40 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Previous</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleBuild}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Build this standard architecture on your canvas now"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Build on Canvas</span>
            </button>

            {currentStep < TUTORIAL_STEPS.length - 1 ? (
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep + 1)}
                className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <span>Next Step</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
              >
                Done
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
