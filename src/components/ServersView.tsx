import React, { useState } from 'react';
import { 
  Server, 
  Plus, 
  Activity, 
  Download, 
  Terminal, 
  Box, 
  RefreshCw, 
  Settings, 
  CheckCircle2, 
  ShieldCheck, 
  Cpu, 
  HardDrive, 
  Layers,
  ChevronRight,
  Wifi
} from 'lucide-react';
import { ServerNode, NavTab } from '../types';

interface ServersViewProps {
  servers: ServerNode[];
  onOpenNewServer: () => void;
  onOpenTerminal: (nodeName: string) => void;
  onNavigate: (tab: NavTab) => void;
}

export const ServersView: React.FC<ServersViewProps> = ({
  servers,
  onOpenNewServer,
  onOpenTerminal,
  onNavigate
}) => {
  const [probing, setProbing] = useState<Record<string, boolean>>({});
  const [probeSuccess, setProbeSuccess] = useState<Record<string, boolean>>({});

  const handleProbe = (id: string) => {
    setProbing(prev => ({ ...prev, [id]: true }));
    setTimeout(() => {
      setProbing(prev => ({ ...prev, [id]: false }));
      setProbeSuccess(prev => ({ ...prev, [id]: true }));
      setTimeout(() => {
        setProbeSuccess(prev => ({ ...prev, [id]: false }));
      }, 3000);
    }, 1000);
  };

  const handleBatchProbe = () => {
    servers.forEach(s => handleProbe(s.id));
  };

  const handleExportList = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      "节点名称,集群角色,内网地址,端口,操作系统,处理器,内存,磁盘\n" + 
      servers.map(s => `"${s.name}","${s.role}","${s.internalIp}",${s.port},"${s.os}",${s.cpuLoad}%,${s.memoryPercent}%,${s.storagePercent}%`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "集群节点清单.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div id="servers-view" className="space-y-6">
      {/* 标题与操作栏 */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
            <span>节点编排与远程管理</span>
            <span>/</span>
            <span className="text-cyan-400 font-bold">拓扑监控</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1 flex items-center gap-2">
            <span>服务器管理 · 集群节点编排</span>
          </h1>
        </div>

        <div className="flex items-center flex-wrap gap-2.5">
          <button
            id="add-server-btn"
            onClick={onOpenNewServer}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-all shadow-md shadow-cyan-500/20 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>接入服务器</span>
          </button>

          <button
            id="batch-probe-btn"
            onClick={handleBatchProbe}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#0f172a] hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-medium transition-all cursor-pointer"
          >
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            <span>批量健康探活</span>
          </button>

          <button
            id="export-servers-btn"
            onClick={handleExportList}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#0f172a] hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-medium transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>导出清单</span>
          </button>
        </div>
      </div>

      {/* 集群概览指标 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#0e1626] border border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="text-xs text-slate-400 font-medium">在线节点</div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-white">3 / 3</span>
            <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              100% 可达
            </span>
          </div>
        </div>

        <div className="bg-[#0e1626] border border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="text-xs text-slate-400 font-medium">全集群 CPU 均值</div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-white">31.3%</span>
            <span className="text-xs text-cyan-400 font-medium">健康负荷</span>
          </div>
        </div>

        <div className="bg-[#0e1626] border border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="text-xs text-slate-400 font-medium">总内存消耗</div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-white">13.3 / 24 GB</span>
            <span className="text-xs text-slate-400 font-mono">55.4% 占用</span>
          </div>
        </div>

        <div className="bg-[#0e1626] border border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="text-xs text-slate-400 font-medium">承载容器总数</div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-white">10 个容器</span>
            <span className="text-xs text-emerald-400 font-medium">运行中容器组</span>
          </div>
        </div>
      </div>

      {/* 节点卡片列表 */}
      <div className="space-y-4">
        {servers.map((node) => {
          const isProbeLoading = probing[node.id];
          const isProbeDone = probeSuccess[node.id];

          return (
            <div 
              key={node.id}
              className="bg-[#0e1626] border border-slate-800 rounded-xl p-5 space-y-5 hover:border-slate-700 transition-all shadow-sm"
            >
              {/* 节点头部信息 */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
                <div className="flex items-start sm:items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-cyan-400 shrink-0">
                    <Server className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="text-lg font-bold text-white tracking-tight">{node.name}</span>
                      <span className="px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                        在线
                      </span>
                      <span className="px-2 py-0.5 rounded text-[11px] bg-slate-800 text-slate-300 font-medium border border-slate-700">
                        {node.role} {node.isDefault && '(默认)'}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-xs font-mono text-slate-400 mt-1 flex-wrap">
                      <span>内网: <strong className="text-slate-200">{node.internalIp}:{node.port}</strong></span>
                      {node.publicIp && <span>| 公网: <strong className="text-cyan-400">{node.publicIp}</strong></span>}
                      <span>| 系统架构: <span className="text-slate-300">{node.os}</span></span>
                      <span>| 引擎：<span className="text-emerald-400">{node.dockerVersion}</span></span>
                    </div>
                  </div>
                </div>

                {/* 探活状态与节点标识 */}
                <div className="flex items-center gap-2 self-start lg:self-center">
                  {isProbeDone && (
                    <span className="text-xs text-emerald-400 font-mono flex items-center gap-1 animate-in fade-in">
                      <CheckCircle2 className="w-3.5 h-3.5" /> 探活成功 12ms
                    </span>
                  )}
                  <span className="text-xs font-mono text-slate-400 bg-slate-900 px-2.5 py-1 rounded border border-slate-800">
                    节点标识：{node.hostUuid}
                  </span>
                </div>
              </div>

              {/* 资源占用仪表（三列） */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                {/* 处理器 */}
                <div className="bg-[#090e1a] border border-slate-800/80 rounded-lg p-3 space-y-1.5">
                  <div className="flex justify-between items-center text-slate-400">
                    <span className="flex items-center gap-1.5 font-medium">
                      <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                      CPU 负载
                    </span>
                    <span className="font-mono text-slate-200 font-bold">{node.cpuLoad}%</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-cyan-400 h-full rounded-full transition-all duration-500" style={{ width: `${node.cpuLoad}%` }}></div>
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono pt-0.5 truncate">
                    {node.cpuCores}
                  </div>
                </div>

                {/* 内存 */}
                <div className="bg-[#090e1a] border border-slate-800/80 rounded-lg p-3 space-y-1.5">
                  <div className="flex justify-between items-center text-slate-400">
                    <span className="flex items-center gap-1.5 font-medium">
                      <Layers className="w-3.5 h-3.5 text-blue-400" />
                      内存占用
                    </span>
                    <span className="font-mono text-slate-200 font-bold">{node.memoryPercent}%</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-gradient-to-r from-cyan-400 to-blue-500 h-full rounded-full transition-all duration-500" style={{ width: `${node.memoryPercent}%` }}></div>
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono pt-0.5">
                    {node.memoryUsed} GB / {node.memoryTotal} GB (可用: {(node.memoryTotal - node.memoryUsed).toFixed(1)} GB)
                  </div>
                </div>

                {/* 磁盘 */}
                <div className="bg-[#090e1a] border border-slate-800/80 rounded-lg p-3 space-y-1.5">
                  <div className="flex justify-between items-center text-slate-400">
                    <span className="flex items-center gap-1.5 font-medium">
                      <HardDrive className="w-3.5 h-3.5 text-indigo-400" />
                      磁盘空间
                    </span>
                    <span className="font-mono text-slate-200 font-bold">{node.storagePercent}%</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-slate-400 h-full rounded-full transition-all duration-500" style={{ width: `${node.storagePercent}%` }}></div>
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono pt-0.5">
                    {node.storageUsed} GB / {node.storageTotal} GB (挂载: /var/lib/docker)
                  </div>
                </div>
              </div>

              {/* 承载容器列表 */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs pt-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-slate-400 font-medium">承载容器 ({node.containers.length}):</span>
                  {node.containers.map(c => {
                    const isError = c === '订单系统';
                    return (
                      <span 
                        key={c}
                        onClick={() => onNavigate('containers')}
                        className={`px-2 py-0.5 rounded text-[11px] font-mono cursor-pointer transition-colors ${
                          isError 
                            ? 'bg-red-950/70 border border-red-500/50 text-red-300 hover:bg-red-900/60'
                            : 'bg-slate-900 border border-slate-800 text-slate-300 hover:border-cyan-500/40 hover:text-cyan-300'
                        }`}
                      >
                        {c} {isError && '⚠️'}
                      </span>
                    );
                  })}
                </div>

                {/* 操作按钮组 */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => onOpenTerminal(node.name)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#0f172a] hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-medium transition-colors cursor-pointer"
                  >
                    <Terminal className="w-3 h-3 text-cyan-400" />
                    <span>网页终端</span>
                  </button>

                  <button
                    onClick={() => onNavigate('containers')}
                    className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#0f172a] hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-medium transition-colors cursor-pointer"
                  >
                    <Box className="w-3 h-3 text-blue-400" />
                    <span>Docker 容器管理</span>
                  </button>

                  <button
                    onClick={() => handleProbe(node.id)}
                    disabled={isProbeLoading}
                    className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#0f172a] hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-medium transition-colors cursor-pointer"
                  >
                    <RefreshCw className={`w-3 h-3 text-slate-400 ${isProbeLoading ? 'animate-spin' : ''}`} />
                    <span>节点探活</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
