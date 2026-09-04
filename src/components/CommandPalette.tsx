import React, { useState, useEffect } from 'react';
import { Search, Server, FolderGit2, Rocket, GitBranch, Box, Terminal, X, ArrowRight } from 'lucide-react';
import { NavTab } from '../types';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: NavTab) => void;
  onSelectProject?: (projName: string) => void;
  onTriggerRollback?: () => void;
  onOpenTerminal?: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onSelectProject,
  onTriggerRollback,
  onOpenTerminal
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const items = [
    { id: '1', title: 'Blog-System', type: 'Project', desc: '.NET 8 / ASP.NET Core Web API (Production)', icon: FolderGit2, action: () => { onNavigate('projects'); onSelectProject?.('Blog-System'); onClose(); } },
    { id: '2', title: 'Order-System [异常告警]', type: 'Project', desc: 'Java 21 / SpringBoot 3 - 容器死锁退出', icon: FolderGit2, action: () => { onNavigate('projects'); onSelectProject?.('Order-System'); onClose(); } },
    { id: '3', title: 'Production-Server', type: 'Node', desc: '192.168.1.120 (Ubuntu 22.04 LTS)', icon: Server, action: () => { onNavigate('servers'); onClose(); } },
    { id: '4', title: 'Dev-Server', type: 'Node', desc: '192.168.1.121 (Debian 12 Bookworm)', icon: Server, action: () => { onNavigate('servers'); onClose(); } },
    { id: '5', title: '查看部署任务 #10024', type: 'Deployment', desc: 'Blog-System 流水线实时日志与DAG拓扑', icon: Rocket, action: () => { onNavigate('deployments'); onClose(); } },
    { id: '6', title: '确认回滚服务版本 (Rollback)', type: 'Action', desc: '回滚 Order-System 或 Blog-System 至稳定历史镜像', icon: GitBranch, action: () => { onTriggerRollback?.(); onClose(); } },
    { id: '7', title: '打开 Web SSH 终端', type: 'Console', desc: '直接连入宿主机 Production-Server 执行命令行', icon: Terminal, action: () => { onOpenTerminal?.(); onClose(); } },
    { id: '8', title: '查看容器管理', type: 'Container', desc: '查看全部 10 个跨节点容器运行指标', icon: Box, action: () => { onNavigate('containers'); onClose(); } },
  ];

  const filtered = items.filter(i => 
    i.title.toLowerCase().includes(query.toLowerCase()) || 
    i.desc.toLowerCase().includes(query.toLowerCase()) ||
    i.type.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div 
        id="command-palette-modal"
        className="w-full max-w-xl bg-[#0c1322] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95"
      >
        {/* Search header */}
        <div className="p-3.5 border-b border-slate-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-cyan-400 shrink-0" />
          <input
            id="command-palette-input"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="搜索工程、集群节点、部署任务、容器或回滚命令..."
            className="flex-1 bg-transparent text-sm text-white placeholder-slate-500 outline-none"
            autoFocus
          />
          <kbd className="px-2 py-0.5 text-[10px] font-mono bg-slate-800 border border-slate-700 text-slate-400 rounded">ESC 退出</kbd>
        </div>

        {/* Results List */}
        <div className="p-2 max-h-80 overflow-y-auto space-y-1">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-500 font-mono">
              未找到匹配的资源或命令
            </div>
          ) : (
            filtered.map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={item.action}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-800/80 text-left group transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-300 group-hover:text-cyan-400 group-hover:border-cyan-500/40 transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-slate-200 group-hover:text-cyan-300 flex items-center gap-2">
                        <span>{item.title}</span>
                        <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-slate-800 text-slate-400 border border-slate-700">
                          {item.type}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5 truncate max-w-sm">
                        {item.desc}
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all" />
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
