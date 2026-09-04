import React, { useState } from 'react';
import { 
  AlertTriangle, 
  ArrowDown, 
  RotateCcw, 
  X, 
  Info, 
  CheckCircle2, 
  Server, 
  Layers 
} from 'lucide-react';
import { Project, VersionArtifact } from '../types';

interface RollbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmRollback: (reason: string) => void;
  targetProject?: Project | null;
  targetVersion?: VersionArtifact | null;
}

export const RollbackModal: React.FC<RollbackModalProps> = ({
  isOpen,
  onClose,
  onConfirmRollback,
  targetProject,
  targetVersion
}) => {
  const [reason, setReason] = useState('生产紧急故障恢复');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const currentVersionStr = targetProject?.version || 'v20260904.001';
  const currentCommitStr = targetProject?.gitCommit || '8a72f31';
  const targetVersionStr = targetVersion?.version || 'v20260903.002';
  const targetCommitStr = targetVersion?.commit || '71ac921';
  const targetCommitMsg = targetVersion?.commitMessage || 'fix: 修复用户授权中间件偶发超时问题';
  const hostStr = targetProject?.hostNode || 'Production-Server';
  const ipStr = targetProject?.hostIp ? `${targetProject.hostIp}:5000` : '192.168.1.120:5000';
  const artifactStr = targetVersion?.imageTag ? targetVersion.imageTag.replace('registry.local/', '') : 'blog-system:71ac921';

  const handleConfirm = () => {
    if (!reason.trim()) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onConfirmRollback(reason);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        id="rollback-confirmation-modal"
        className="w-full max-w-xl bg-[#0e1626] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-800/80 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400 shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                <span>确认回滚服务版本</span>
                <span className="text-xs font-normal text-slate-400 font-mono">(Rollback Confirmation)</span>
              </h2>
              <div className="text-[11px] font-mono tracking-wider font-semibold text-red-400/90 uppercase mt-0.5">
                High Risk Production Operation
              </div>
            </div>
          </div>
          <button 
            id="close-rollback-modal-btn"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          {/* Version Diff View */}
          <div className="bg-[#090d17] border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">源版本 (当前运行):</span>
              <span className="font-mono text-slate-200 font-semibold flex items-center gap-2">
                <span>{currentVersionStr}</span>
                <span className="text-slate-500 font-normal">({currentCommitStr})</span>
              </span>
            </div>

            <div className="flex justify-center my-1">
              <div className="w-7 h-7 rounded-full bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400">
                <ArrowDown className="w-4 h-4 animate-bounce" />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">目标回滚版本:</span>
              <span className="font-mono text-cyan-400 font-bold flex items-center gap-2">
                <span>{targetVersionStr}</span>
                <span className="text-cyan-600 font-normal">({targetCommitStr})</span>
              </span>
            </div>

            <div className="text-xs text-slate-300 bg-slate-900/60 rounded-lg p-2.5 border border-slate-800/80 italic text-center">
              "{targetCommitMsg}"
            </div>
          </div>

          {/* Target Host & Pull Artifact Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-[#090d17] border border-slate-800/80 rounded-xl p-3">
              <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-1">
                TARGET HOST
              </div>
              <div className="font-semibold text-slate-200">{hostStr}</div>
              <div className="text-[11px] font-mono text-slate-400 mt-0.5">{ipStr}</div>
            </div>

            <div className="bg-[#090d17] border border-slate-800/80 rounded-xl p-3">
              <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-1">
                PULL ARTIFACT
              </div>
              <div className="font-mono font-semibold text-cyan-300 truncate">{artifactStr}</div>
              <div className="text-[11px] text-emerald-400 mt-0.5">Cached Locally (0s pull)</div>
            </div>
          </div>

          {/* Informational Callout */}
          <div className="flex items-start gap-2.5 bg-cyan-950/30 border border-cyan-500/30 rounded-xl p-3.5 text-xs text-slate-300">
            <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              平台将使用已构建的历史镜像极速替换当前容器，零构建耗时，预计造成约 <strong className="text-cyan-300">3~5 秒</strong> 服务停机，并生成类型为 <strong className="text-white font-mono">Rollback</strong> 的新部署审计记录。
            </p>
          </div>

          {/* Form Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300 flex items-center justify-between">
              <span>操作人确认与理由输入 <span className="text-red-400">*</span></span>
              <span className="text-[11px] text-slate-400 font-mono">必填项</span>
            </label>
            <input 
              id="rollback-reason-input"
              type="text" 
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="请输入本次版本回滚的运维理由..."
              className="w-full bg-[#090d17] border border-slate-700 focus:border-red-500/80 focus:ring-1 focus:ring-red-500 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-slate-500 outline-none transition-all font-sans"
            />
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-slate-800/80 bg-[#090d17]/50 flex items-center justify-end gap-3">
          <button
            id="cancel-rollback-btn"
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors cursor-pointer"
          >
            取消
          </button>
          <button
            id="confirm-execute-rollback-btn"
            type="button"
            disabled={!reason.trim() || isSubmitting}
            onClick={handleConfirm}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-semibold shadow-lg shadow-red-600/30 transition-all cursor-pointer disabled:opacity-50"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${isSubmitting ? 'animate-spin' : ''}`} />
            <span>{isSubmitting ? '正在极速回滚中...' : '确认执行回滚'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
