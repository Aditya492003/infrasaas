import React, { useState, useMemo } from 'react';
import { X, Copy, Check, Download, FileCode, Server, Terminal } from 'lucide-react';
import { generateTerraformCode, generateCloudFormationCode } from '../../simulation/iacExporter';

export const IacExportModal = ({ isOpen, onClose, nodes, edges, architectureName }) => {
  const [activeTab, setActiveTab] = useState('terraform'); // 'terraform' | 'cloudformation'
  const [tfFileTab, setTfFileTab] = useState('main.tf');   // 'main.tf' | 'variables.tf' | 'outputs.tf'
  const [copied, setCopied] = useState(false);

  const { tfCode, cfYaml } = useMemo(() => {
    const tf = generateTerraformCode(nodes, edges, { projectName: architectureName });
    const cf = generateCloudFormationCode(nodes, edges, { projectName: architectureName });
    return { tfCode: tf, cfYaml: cf };
  }, [nodes, edges, architectureName]);

  if (!isOpen) return null;

  const currentCode = activeTab === 'terraform' 
    ? (tfFileTab === 'main.tf' ? tfCode.mainTf : tfFileTab === 'variables.tf' ? tfCode.variablesTf : tfCode.outputsTf)
    : cfYaml;

  const currentFilename = activeTab === 'terraform' ? tfFileTab : 'template.yaml';

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
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-400">
              <FileCode className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base tracking-tight">Deployable Infrastructure as Code (IaC)</h3>
              <p className="text-xs text-slate-400">Convert visual graph into production Terraform HCL or AWS CloudFormation</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Format Selector Tabs */}
        <div className="px-6 pt-3 bg-slate-100 border-b border-slate-200 flex items-center justify-between">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('terraform')}
              className={`px-4 py-2 text-xs font-bold rounded-t-lg transition-all flex items-center gap-2 ${
                activeTab === 'terraform'
                  ? 'bg-slate-900 text-indigo-400 border-t-2 border-indigo-500'
                  : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Server className="w-3.5 h-3.5" />
              <span>HashiCorp Terraform (HCL)</span>
            </button>
            <button
              onClick={() => setActiveTab('cloudformation')}
              className={`px-4 py-2 text-xs font-bold rounded-t-lg transition-all flex items-center gap-2 ${
                activeTab === 'cloudformation'
                  ? 'bg-slate-900 text-amber-400 border-t-2 border-amber-500'
                  : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>AWS CloudFormation (YAML)</span>
            </button>
          </div>

          {/* Sub-file tabs for Terraform */}
          {activeTab === 'terraform' && (
            <div className="flex gap-1 bg-slate-200 p-1 rounded-md mb-1">
              {['main.tf', 'variables.tf', 'outputs.tf'].map(f => (
                <button
                  key={f}
                  onClick={() => setTfFileTab(f)}
                  className={`px-2.5 py-1 text-[11px] font-mono font-medium rounded transition-all ${
                    tfFileTab === f ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Code Content */}
        <div className="p-4 bg-slate-950 flex-1 overflow-auto font-mono text-xs text-slate-200">
          <pre className="leading-relaxed whitespace-pre-wrap">{currentCode}</pre>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-3 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div>
            <span>Format: <strong className="text-white">{currentFilename}</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded font-medium transition-colors border border-slate-700"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
              <span>{copied ? 'Copied!' : 'Copy Code'}</span>
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded font-semibold transition-all shadow-sm shadow-indigo-900"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download {currentFilename}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
