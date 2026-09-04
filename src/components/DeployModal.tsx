import React, { useState } from 'react';
import { Rocket, X, GitBranch, Server, Play } from 'lucide-react';
import { Project } from '../types';

interface DeployModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  onTriggerDeploy: (projectName: string, branch: string) => void;
}

export const DeployModal: React.FC<DeployModalProps> = ({
  isOpen,
  onClose,
  projects,
  onTriggerDeploy
}) => {
  const [selectedProject, setSelectedProject] = useState(projects[0]?.name || 'Blog-System');
  const [branch, setBranch] = useState('main');
  const [strategy, setStrategy] = useState('停机热替 (Recreate)');

  if (!isOpen) return null;

  const currentProj = projects.find(p => p.name === selectedProject);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onTriggerDeploy(selectedProject, branch);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-lg bg-[#0e1626] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Rocket className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">快速触发部署流水线</h2>
              <div className="text-xs text-slate-400 font-mono">Launch Continuous Delivery Pipeline</div>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="text-slate-300 font-medium mb-1.5 block">选择部署工程 *</label>
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="w-full bg-[#080d17] border border-slate-700 rounded-lg px-3 py-2.5 text-white outline-none focus:border-cyan-500 font-medium"
            >
              {projects.map(p => (
                <option key={p.id} value={p.name}>
                  {p.name} ({p.techStack}) - {p.environment}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-300 font-medium mb-1.5 block">目标部署分支</label>
              <input
                type="text"
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                placeholder="main"
                className="w-full bg-[#080d17] border border-slate-700 rounded-lg px-3 py-2 text-white outline-none focus:border-cyan-500 font-mono"
              />
            </div>

            <div>
              <label className="text-slate-300 font-medium mb-1.5 block">部署发布策略</label>
              <select
                value={strategy}
                onChange={(e) => setStrategy(e.target.value)}
                className="w-full bg-[#080d17] border border-slate-700 rounded-lg px-3 py-2 text-white outline-none focus:border-cyan-500"
              >
                <option value="停机热替 (Recreate)">停机热替 (Recreate)</option>
                <option value="滚动更新 (RollingUpdate)">滚动更新 (RollingUpdate)</option>
                <option value="蓝绿部署 (BlueGreen)">蓝绿部署 (BlueGreen)</option>
                <option value="金丝雀发布 (Canary 10%)">金丝雀发布 (Canary 10%)</option>
              </select>
            </div>
          </div>

          {currentProj && (
            <div className="bg-[#080d17] border border-slate-800 rounded-xl p-3 text-slate-300 space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">目标宿主机:</span>
                <span className="font-mono text-cyan-400">{currentProj.hostNode} ({currentProj.hostIp})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">映射端口:</span>
                <span className="font-mono text-slate-200">{currentProj.portMap}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">最新 Commit:</span>
                <span className="font-mono text-slate-400">{currentProj.gitCommit} ({currentProj.gitMessage.slice(0, 24)}...)</span>
              </div>
            </div>
          )}

          <div className="pt-2 flex justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition-all shadow-lg shadow-cyan-500/20"
            >
              <Play className="w-3.5 h-3.5 fill-slate-950" />
              <span>开始流水线构建</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
