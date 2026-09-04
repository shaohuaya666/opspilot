import React, { useState } from 'react';
import { Box, Play, Square, RotateCcw, Terminal, Search, Filter, RefreshCw, Layers } from 'lucide-react';
import { ContainerInfo } from '../types';
import { initialContainers } from '../data/mockData';

interface ContainersViewProps {
  onOpenTerminal: (nodeName: string) => void;
}

export const ContainersView: React.FC<ContainersViewProps> = ({ onOpenTerminal }) => {
  const [containers, setContainers] = useState<ContainerInfo[]>(initialContainers);
  const [filterNode, setFilterNode] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = containers.filter(c => {
    if (filterNode !== 'ALL' && c.node !== filterNode) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        c.image.toLowerCase().includes(q) ||
        c.node.toLowerCase().includes(q) ||
        c.ports.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleToggleState = (id: string) => {
    setContainers(prev => prev.map(c => {
      if (c.id === id) {
        const isUp = c.status === 'Up';
        return {
          ...c,
          status: isUp ? 'Exited' : 'Up',
          uptime: isUp ? '刚刚停止' : '刚刚启动 (Up 5s)',
          cpu: isUp ? '0.0%' : '0.8%',
          memory: isUp ? '0 MB' : '120 MB'
        };
      }
      return c;
    }));
  };

  return (
    <div id="containers-view" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
            <span>容器编排与运行时</span>
            <span>/</span>
            <span className="text-cyan-400 font-bold">Docker Pods</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
            容器管理 · Docker Container Mesh
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            跨节点统一监控容器健康探针、端口路由、资源占用及生命周期调度
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => alert('已刷新全部宿主机 Docker 容器状态')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#0f172a] hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-medium transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
            <span>实时刷新</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-[#0e1626] border border-slate-800 rounded-xl p-3 flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-slate-400 font-medium">所属节点:</span>
          {['ALL', 'Production-Server', 'Dev-Server', 'Test-Server'].map(node => (
            <button
              key={node}
              onClick={() => setFilterNode(node)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                filterNode === node
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {node === 'ALL' ? '全部节点' : node}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="搜索容器名、镜像或端口..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#080d17] border border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-white placeholder-slate-500 outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      {/* Containers Table */}
      <div className="bg-[#0e1626] border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0a0f1c] text-slate-400 font-mono text-[11px] border-b border-slate-800">
              <tr>
                <th className="px-4 py-3 font-semibold">容器名称 / ID</th>
                <th className="px-4 py-3 font-semibold">镜像源</th>
                <th className="px-4 py-3 font-semibold">宿主节点</th>
                <th className="px-4 py-3 font-semibold">状态 / 存活</th>
                <th className="px-4 py-3 font-semibold">端口映射</th>
                <th className="px-4 py-3 font-semibold">CPU / 内存</th>
                <th className="px-4 py-3 font-semibold text-right">控制操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70">
              {filtered.map((c) => {
                const isUp = c.status === 'Up';

                return (
                  <tr key={c.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-4 py-3.5">
                      <div className="font-bold text-white font-mono flex items-center gap-2">
                        <Box className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span>{c.name}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">{c.id}</div>
                    </td>

                    <td className="px-4 py-3.5 font-mono text-slate-300 truncate max-w-xs">
                      {c.image}
                    </td>

                    <td className="px-4 py-3.5 text-slate-300 font-mono">
                      {c.node}
                    </td>

                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${isUp ? 'bg-emerald-400' : 'bg-red-500'}`}></span>
                        <span className={`font-medium ${isUp ? 'text-emerald-400' : 'text-red-400'}`}>
                          {c.status}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono mt-0.5">{c.uptime}</div>
                    </td>

                    <td className="px-4 py-3.5 font-mono text-cyan-300">
                      {c.ports}
                    </td>

                    <td className="px-4 py-3.5 font-mono text-slate-300">
                      <div>CPU: {c.cpu}</div>
                      <div className="text-[11px] text-slate-400">RAM: {c.memory}</div>
                    </td>

                    <td className="px-4 py-3.5 text-right space-x-2">
                      <button
                        onClick={() => handleToggleState(c.id)}
                        className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                          isUp 
                            ? 'bg-slate-800 hover:bg-red-950/60 text-slate-300 hover:text-red-400 border border-slate-700' 
                            : 'bg-emerald-950/70 hover:bg-emerald-900 text-emerald-300 border border-emerald-500/40'
                        }`}
                      >
                        {isUp ? '停止' : '启动'}
                      </button>

                      <button
                        onClick={() => onOpenTerminal(c.node)}
                        className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-[11px] font-medium transition-colors cursor-pointer"
                      >
                        终端
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
