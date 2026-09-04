import React, { useState } from 'react';
import { 
  Search, 
  AlertTriangle, 
  CheckCircle2, 
  Bell, 
  ChevronDown, 
  Terminal, 
  ShieldCheck,
  Layers,
  X
} from 'lucide-react';
import { Environment } from '../types';

interface HeaderProps {
  currentEnv: string;
  onEnvChange: (env: string) => void;
  onOpenCommandPalette: () => void;
  onOpenAlertDetails: () => void;
  unresolvedAlertCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentEnv,
  onEnvChange,
  onOpenCommandPalette,
  onOpenAlertDetails,
  unresolvedAlertCount
}) => {
  const [showEnvMenu, setShowEnvMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const envOptions = [
    '全局生产与开发环境',
    '生产集群 (Production-Cluster)',
    '测试集群 (Test-Cluster)',
    '开发集群 (Dev-Cluster)'
  ];

  return (
    <header id="app-header" className="h-16 bg-[#080d1a]/95 backdrop-blur border-b border-slate-800/80 px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Left section: Breadcrumb & Cluster filter */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-300">
          <span className="text-white font-bold">OpsPilot</span>
          <span className="text-slate-500">/</span>
          <span className="text-slate-400 font-normal">Console</span>
        </div>

        {/* Environment Filter Pill */}
        <div className="relative">
          <button
            id="env-selector-btn"
            onClick={() => setShowEnvMenu(!showEnvMenu)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 text-xs font-medium hover:bg-cyan-900/40 transition-colors cursor-pointer"
          >
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            <span>{currentEnv}</span>
            <ChevronDown className="w-3.5 h-3.5 text-cyan-400 opacity-70" />
          </button>

          {showEnvMenu && (
            <div className="absolute left-0 mt-2 w-64 bg-[#0d1424] border border-slate-700/80 rounded-xl shadow-2xl py-1.5 z-50 animate-in fade-in slide-in-from-top-1">
              <div className="px-3 py-1.5 text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                选择集群与运行环境
              </div>
              {envOptions.map((opt) => (
                <button
                  key={opt}
                  onClick={() => {
                    onEnvChange(opt);
                    setShowEnvMenu(false);
                  }}
                  className={`w-full text-left px-3.5 py-2 text-xs transition-colors flex items-center justify-between cursor-pointer ${
                    currentEnv === opt ? 'bg-cyan-500/15 text-cyan-300 font-semibold' : 'text-slate-300 hover:bg-slate-800/60'
                  }`}
                >
                  <span>{opt}</span>
                  {currentEnv === opt && <span className="text-cyan-400 font-mono text-xs">✓</span>}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Middle & Right Section */}
      <div className="flex items-center gap-3">
        {/* Global Search Input (Ctrl+K) */}
        <div 
          onClick={onOpenCommandPalette}
          className="relative flex items-center bg-[#0d1424] hover:bg-[#111a30] border border-slate-800/90 hover:border-slate-700 rounded-lg px-3 py-1.5 w-80 text-xs text-slate-400 cursor-pointer transition-all shadow-inner group"
        >
          <Search className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 mr-2 shrink-0 transition-colors" />
          <span className="flex-1 truncate">Search commands, pods, releases...</span>
          <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-slate-800/90 border border-slate-700/80 text-slate-400 rounded">Ctrl+K</kbd>
        </div>

        {/* Alert Pill (Critical Alert Status) */}
        {unresolvedAlertCount > 0 ? (
          <button
            id="header-alert-pill"
            onClick={onOpenAlertDetails}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-red-500/15 border border-red-500/30 text-red-400 hover:bg-red-500/25 transition-all text-xs font-medium cursor-pointer shadow-sm shadow-red-500/10"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-red-400 animate-bounce" />
            <span>{unresolvedAlertCount} 待处理异常</span>
          </button>
        ) : (
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>无未决告警</span>
          </div>
        )}

        {/* Nodes Health Pill */}
        <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          <span>3/3 在线</span>
        </div>

        {/* Notifications Bell */}
        <div className="relative">
          <button 
            id="notifications-btn"
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 rounded-lg transition-colors relative cursor-pointer"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-[#080d1a]"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-[#0d1424] border border-slate-700/80 rounded-xl shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-1">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs font-semibold text-slate-200">
                <span>实时通知与事件中心</span>
                <button onClick={() => setShowNotifications(false)} className="text-slate-500 hover:text-slate-300">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="space-y-2.5 mt-2.5 max-h-72 overflow-y-auto">
                <div className="p-2.5 rounded-lg bg-red-950/30 border border-red-900/40 text-xs">
                  <div className="text-red-400 font-semibold flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    容器死锁与探活超时
                  </div>
                  <div className="text-slate-300 mt-1 text-[11px]">
                    Order-System 在 Dev-Server 上最近一次部署因端口探测超时失败，已触发自动熔断保护。
                  </div>
                  <div className="text-slate-500 text-[10px] mt-1 font-mono">10分钟前 · 需运维介入</div>
                </div>

                <div className="p-2.5 rounded-lg bg-emerald-950/20 border border-emerald-900/30 text-xs">
                  <div className="text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    流水线部署完成
                  </div>
                  <div className="text-slate-300 mt-1 text-[11px]">
                    Blog-System v20260904.001 已成功发布至 Production-Server。
                  </div>
                  <div className="text-slate-500 text-[10px] mt-1 font-mono">12分钟前 · 耗时 45s</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-slate-800">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 p-[1.5px] shadow">
            <img 
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" 
              alt="Avatar" 
              className="w-full h-full object-cover rounded-full"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="hidden sm:block text-left">
            <div className="text-xs font-semibold text-slate-200 leading-none">Administrator</div>
            <div className="text-[10px] text-slate-400 font-mono mt-0.5">Cluster Root</div>
          </div>
        </div>
      </div>
    </header>
  );
};
