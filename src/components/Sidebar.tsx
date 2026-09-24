import React from 'react';
import { 
  LayoutGrid, 
  FolderGit2, 
  Rocket, 
  Server, 
  GitBranch, 
  Box, 
  Terminal, 
  Settings, 
  HelpCircle,
  Cpu
} from 'lucide-react';
import { NavTab } from '../types';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onOpenQuickDocs?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, onSelectTab, onOpenQuickDocs }) => {
  const navItems = [
    { id: 'overview' as NavTab, label: '首页概览', icon: LayoutGrid },
    { id: 'projects' as NavTab, label: '项目管理', icon: FolderGit2 },
    { id: 'deployments' as NavTab, label: '部署管理', icon: Rocket },
    { id: 'servers' as NavTab, label: '服务器管理', icon: Server },
    { id: 'versions' as NavTab, label: '版本管理', icon: GitBranch },
    { id: 'containers' as NavTab, label: '容器管理', icon: Box },
    { id: 'logs' as NavTab, label: '日志中心', icon: Terminal },
    { id: 'settings' as NavTab, label: '系统设置', icon: Settings },
  ];

  return (
    <aside id="sidebar-nav" className="w-64 bg-[#080d1a] border-r border-slate-800/80 flex flex-col justify-between shrink-0 select-none h-screen sticky top-0">
      <div>
        {/* 品牌标识区 */}
        <div className="p-5 flex items-center gap-3 border-b border-slate-800/60">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 ring-1 ring-cyan-400/30">
            <Cpu className="w-5 h-5 text-slate-950 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-lg tracking-tight text-white">OpsPilot</span>
            </div>
            <div className="text-[10px] tracking-wider uppercase font-mono font-semibold text-cyan-400/90 -mt-0.5">
              运维编排中台
            </div>
          </div>
        </div>

        {/* 导航菜单 */}
        <nav className="p-3 space-y-1 mt-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-item-${item.id}`}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 text-left cursor-pointer ${
                  isActive
                    ? 'bg-cyan-500 text-slate-950 font-semibold shadow-md shadow-cyan-500/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-slate-950 stroke-[2.2]' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* 底部系统状态 */}
      <div className="p-4 border-t border-slate-800/60 bg-[#060a14]/60">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-slate-300 font-medium text-[13px]">编排引擎运行中</span>
          </div>
          <button 
            onClick={onOpenQuickDocs}
            className="text-slate-400 hover:text-cyan-400 text-xs transition-colors flex items-center gap-1 cursor-pointer"
          >
            <HelpCircle className="w-3 h-3" />
            快速指引
          </button>
        </div>
        <div className="text-[11px] font-mono text-slate-400">
          v1.0.0-beta | .NET 8 + Docker
        </div>
      </div>
    </aside>
  );
};
