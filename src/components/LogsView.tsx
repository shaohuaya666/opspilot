import React, { useState } from 'react';
import { Terminal, Search, Filter, Download, Trash2, Pause, Play, RefreshCw, Copy, Check } from 'lucide-react';
import { initialLogs } from '../data/mockData';

export const LogsView: React.FC = () => {
  const [logs, setLogs] = useState(initialLogs);
  const [selectedService, setSelectedService] = useState('全部');
  const [selectedLevel, setSelectedLevel] = useState('全部');
  const [keyword, setKeyword] = useState('');
  const [isPaused, setIsPaused] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const filteredLogs = logs.filter(l => {
    if (selectedLevel !== '全部' && l.level !== selectedLevel) return false;
    if (keyword) {
      const q = keyword.toLowerCase();
      return (
        l.message.toLowerCase().includes(q) ||
        l.tag.toLowerCase().includes(q) ||
        l.timestamp.includes(q)
      );
    }
    return true;
  });

  const handleCopy = () => {
    const text = filteredLogs.map(l => `[${l.timestamp}] [${l.level}] [${l.tag}] ${l.message}`).join('\n');
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleDownload = () => {
    const text = filteredLogs.map(l => `[${l.timestamp}] [${l.level}] [${l.tag}] ${l.message}`).join('\n');
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `运维日志-${Date.now()}.log`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div id="logs-view" className="space-y-6">
      {/* 页面标题区 */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
            <span>集群可观测性</span>
            <span>/</span>
            <span className="text-cyan-400 font-bold">统一日志中心</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
            日志中心 · 统一审计日志
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            聚合构建日志、容器标准输出、SSH 审计流水与系统运行告警
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => setIsPaused(!isPaused)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
              isPaused 
                ? 'bg-yellow-950/40 border-yellow-500/40 text-yellow-300' 
                : 'bg-[#0f172a] border-slate-700 text-slate-300'
            }`}
          >
            {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
            <span>{isPaused ? '恢复流式滚动' : '暂停日志流'}</span>
          </button>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0f172a] hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-medium transition-colors cursor-pointer"
          >
            {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{isCopied ? '已复制' : '复制日志'}</span>
          </button>

          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0f172a] hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-medium transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>导出日志</span>
          </button>
        </div>
      </div>

      {/* 筛选工具栏 */}
      <div className="bg-[#0e1626] border border-slate-800 rounded-xl p-3 flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3 w-full md:w-auto flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-medium">所属服务:</span>
            <select
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              className="bg-[#080d17] border border-slate-700 rounded-lg px-2.5 py-1.5 text-white outline-none focus:border-cyan-500 font-medium"
            >
              <option value="全部">全部微服务</option>
              <option value="博客系统">博客系统</option>
              <option value="订单系统">订单系统</option>
              <option value="文件服务">文件服务</option>
              <option value="用户服务">用户服务</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-medium">日志级别:</span>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="bg-[#080d17] border border-slate-700 rounded-lg px-2.5 py-1.5 text-white outline-none focus:border-cyan-500 font-medium"
            >
              <option value="全部">全部级别</option>
              <option value="INFO">信息</option>
              <option value="SUCCESS">成功</option>
              <option value="BUILD">构建</option>
              <option value="WARN">警告</option>
              <option value="ERROR">错误</option>
            </select>
          </div>
        </div>

        <div className="relative w-full md:w-80">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="搜索日志关键词、报错堆栈或标签..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="w-full bg-[#080d17] border border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-white placeholder-slate-500 outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      {/* 日志展示终端 */}
      <div className="bg-[#070b14] border border-slate-800 rounded-xl overflow-hidden flex flex-col h-[520px] shadow-lg font-mono text-xs">
        <div className="bg-[#0e1626] px-4 py-2 border-b border-slate-800 flex items-center justify-between text-slate-400 text-[11px]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="text-slate-200">实时聚合管道（标准输出 / 错误输出）</span>
          </div>
          <div>匹配行数：{filteredLogs.length}</div>
        </div>

        <div className="flex-1 p-4 overflow-y-auto space-y-1.5 bg-[#050811] text-slate-200">
          {filteredLogs.map(log => {
            let color = 'text-cyan-400';
            if (log.level === 'SUCCESS') color = 'text-emerald-400 font-bold';
            if (log.level === 'BUILD') color = 'text-purple-400';
            if (log.level === 'RUNNING') color = 'text-cyan-300 font-bold animate-pulse';
            if (log.level === 'WARN') color = 'text-yellow-400';
            if (log.level === 'ERROR') color = 'text-red-400 font-bold';

            return (
              <div key={log.id} className="leading-relaxed flex items-start gap-2 break-all hover:bg-slate-900/50 px-1 py-0.5 rounded">
                <span className="text-slate-400 shrink-0 select-none text-[11px]">[{log.timestamp}]</span>
                <span className={`shrink-0 font-semibold ${color}`}>[{log.level}]</span>
                <span className="text-slate-400 shrink-0 select-none">[{log.tag}]</span>
                <span className="text-slate-200">{log.message}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
