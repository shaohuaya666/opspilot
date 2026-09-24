import React from 'react';
import { AlertOctagon, RotateCcw, FileText, ChevronRight, X } from 'lucide-react';

interface AlertBannerProps {
  onOpenDiagnosticLogs: () => void;
  onTriggerRollback: () => void;
  onDismiss?: () => void;
}

export const AlertBanner: React.FC<AlertBannerProps> = ({
  onOpenDiagnosticLogs,
  onTriggerRollback,
  onDismiss
}) => {
  return (
    <div 
      id="critical-alert-banner" 
      className="relative overflow-hidden rounded-xl bg-gradient-to-r from-red-950/80 via-[#26090c]/90 to-red-950/60 border border-red-500/40 p-4 shadow-lg shadow-red-950/40 mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
    >
      {/* 左侧告警图标与说明 */}
      <div className="flex items-start gap-3.5">
        <div className="w-10 h-10 rounded-lg bg-red-600/30 border border-red-500/50 flex items-center justify-center shrink-0 shadow-inner">
          <AlertOctagon className="w-5 h-5 text-red-400 animate-pulse" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold tracking-wider text-red-300 uppercase">
              告警级别：严重
            </span>
            <span className="px-2 py-0.5 rounded bg-red-900/60 text-red-200 text-[11px] font-mono border border-red-700/50">
              开发服务器:8080
            </span>
          </div>
          <div className="text-sm font-medium text-slate-100 mt-1 leading-snug">
            订单系统 在 开发服务器 上最近一次部署因端口健康探测超时失败，已触发自动熔断保护。
          </div>
        </div>
      </div>

      {/* 右侧操作按钮 */}
      <div className="flex items-center gap-2.5 shrink-0 self-end md:self-center">
        <button
          id="alert-diagnostic-btn"
          onClick={onOpenDiagnosticLogs}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-900/50 hover:bg-red-900/80 border border-red-500/40 text-red-200 text-xs font-medium transition-all cursor-pointer shadow-sm"
        >
          <FileText className="w-3.5 h-3.5 text-red-300" />
          <span>诊断日志</span>
        </button>

        <button
          id="alert-rollback-btn"
          onClick={onTriggerRollback}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-slate-200 hover:text-white text-xs font-medium transition-all cursor-pointer shadow-sm"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-300" />
          <span>回滚至上版</span>
        </button>

        {onDismiss && (
          <button 
            onClick={onDismiss}
            className="text-slate-400 hover:text-slate-200 p-1 transition-colors"
            title="关闭此告警通知"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
