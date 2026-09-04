import React from 'react';
import { HelpCircle, X, Terminal, GitBranch, Rocket, Server, ShieldCheck } from 'lucide-react';

interface QuickDocsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuickDocsModal: React.FC<QuickDocsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-2xl bg-[#0e1626] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">OpsPilot 平台快速指引 (Quick Docs)</h2>
              <div className="text-xs text-slate-400 font-mono">DevOps Architecture & Operational Playbook</div>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 text-xs text-slate-300 max-h-[70vh] overflow-y-auto">
          <div className="space-y-1.5">
            <h3 className="text-sm font-bold text-cyan-300 flex items-center gap-2">
              <Rocket className="w-4 h-4" /> 1. 自动化流水线执行流程
            </h3>
            <p className="leading-relaxed text-slate-400">
              平台通过内置 SignalR 长连接实现 12 步 DAG 拓扑流水线：包括 Git 检出、Docker 镜像分层构建、多阶段打包、容器平滑热替和健康探针检测。
            </p>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-slate-800">
            <h3 className="text-sm font-bold text-red-300 flex items-center gap-2">
              <GitBranch className="w-4 h-4" /> 2. 紧急故障秒级回滚机制 (Rollback)
            </h3>
            <p className="leading-relaxed text-slate-400">
              当线上突发故障或服务健康检查超时，可直接在【告警横幅】或【版本管理】页面点击「极速回滚至此版」。平台会使用本地缓存的历史镜像直接热替换故障容器，耗时仅 3~5 秒。
            </p>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-slate-800">
            <h3 className="text-sm font-bold text-emerald-300 flex items-center gap-2">
              <Server className="w-4 h-4" /> 3. 跨节点 SSH 纳管与免密鉴权
            </h3>
            <p className="leading-relaxed text-slate-400">
              支持一键纳入 Ubuntu / Debian / CentOS / Alpine 节点。通过 AES-256 加密的 SSH 密钥连接，内置 Web 控制台终端，随时执行 <code className="text-cyan-400 font-mono">docker ps</code>、<code className="text-cyan-400 font-mono">netstat</code> 等诊断指令。
            </p>
          </div>
        </div>

        <div className="p-4 border-t border-slate-800 bg-[#090d17]/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-all"
          >
            知道了
          </button>
        </div>
      </div>
    </div>
  );
};
