import React, { useState, useEffect, useRef } from 'react';
import { 
  Check, 
  RotateCcw, 
  XSquare, 
  Copy, 
  Download, 
  Play, 
  Terminal as TerminalIcon, 
  CheckCircle2, 
  Clock, 
  GitBranch, 
  Server, 
  ShieldCheck, 
  AlertCircle,
  Maximize2,
  ChevronDown,
  Layers,
  RefreshCw,
  Rocket
} from 'lucide-react';
import { PipelineStep, LogLine } from '../types';
import { pipelineSteps as defaultSteps, initialLogs } from '../data/mockData';

interface DeploymentsViewProps {
  onOpenNewDeployModal: () => void;
}

export const DeploymentsView: React.FC<DeploymentsViewProps> = ({
  onOpenNewDeployModal
}) => {
  const [steps, setSteps] = useState<PipelineStep[]>(defaultSteps);
  const [logs, setLogs] = useState<LogLine[]>(initialLogs);
  const [isAutoScroll, setIsAutoScroll] = useState(true);
  const [isCopied, setIsCopied] = useState(false);
  const [isRunning, setIsRunning] = useState(true);
  const [logLevel, setLogLevel] = useState('ALL');
  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll effect
  useEffect(() => {
    if (isAutoScroll) {
      terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, isAutoScroll]);

  // Simulated live log generator when pipeline is running
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      const now = new Date();
      const timeStr = now.toTimeString().split(' ')[0] + '.' + String(now.getMilliseconds()).padStart(3, '0');
      
      setLogs(prev => {
        if (prev.length >= 24) {
          // If reached 24 lines, mark step 9 as completed and step 10 as completed!
          setSteps(currSteps => currSteps.map(s => {
            if (s.stepNumber === 9) return { ...s, status: 'completed', duration: '5.2s' };
            if (s.stepNumber === 10) return { ...s, status: 'completed', duration: '0.8s' };
            if (s.stepNumber === 11) return { ...s, status: 'completed', duration: '1.2s' };
            if (s.stepNumber === 12) return { ...s, status: 'completed', duration: '0.4s' };
            return s;
          }));
          setIsRunning(false);
          return [
            ...prev,
            { id: String(prev.length + 1), timestamp: timeStr, level: 'SUCCESS', tag: 'HealthCheck', message: 'HTTP 200 OK received from http://localhost:8080/health (Latency: 12ms)' },
            { id: String(prev.length + 2), timestamp: timeStr, level: 'INFO', tag: 'Gateway', message: 'Nginx upstream rerouted to container blog-api-prod:8080' },
            { id: String(prev.length + 3), timestamp: timeStr, level: 'SUCCESS', tag: 'Pipeline', message: 'Pipeline #10024 finished successfully in 49.8s.' }
          ];
        }

        const candidateMsgs = [
          { level: 'INFO' as const, tag: 'HealthCheck', message: 'Pinging http://localhost:8080/health (Attempt 2/3, latency: 18ms)...' },
          { level: 'INFO' as const, tag: 'Metrics', message: 'CPU: 14.2%, RSS Memory: 198 MB, Threads: 28' },
          { level: 'SUCCESS' as const, tag: 'HealthCheck', message: 'Application responded 200 OK! Ready for traffic routing.' },
          { level: 'INFO' as const, tag: 'Gateway', message: 'Updating reverse proxy routing table...' }
        ];

        const nextMsg = candidateMsgs[(prev.length - 18) % candidateMsgs.length];
        return [
          ...prev,
          { id: String(prev.length + 1), timestamp: timeStr, level: nextMsg.level, tag: nextMsg.tag, message: nextMsg.message }
        ];
      });
    }, 3500);

    return () => clearInterval(interval);
  }, [isRunning]);

  const handleCopyLogs = () => {
    const text = logs.map(l => `[${l.timestamp}] [${l.level}] [${l.tag}] ${l.message}`).join('\n');
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleDownloadLogs = () => {
    const text = logs.map(l => `[${l.timestamp}] [${l.level}] [${l.tag}] ${l.message}`).join('\n');
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'opspilot-deployment-10024.log';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleTerminate = () => {
    setIsRunning(false);
    setLogs(prev => [
      ...prev,
      { id: String(Date.now()), timestamp: '10:32:48.000', level: 'WARN', tag: 'Abort', message: 'Deployment #10024 aborted by cluster root administrator.' }
    ]);
  };

  const filteredLogs = logLevel === 'ALL' 
    ? logs 
    : logs.filter(l => l.level === logLevel);

  return (
    <div id="deployments-view" className="space-y-6">
      {/* Top Breadcrumb & Status Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <span>部署中心</span>
          <span>/</span>
          <span className="text-cyan-400 font-bold">任务 #10024</span>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-1.5 text-emerald-400">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>SignalR WebSocket 已联通</span>
          </div>
          <span className="text-slate-500">|</span>
          <span className="text-slate-400">节点延迟: 14ms</span>
        </div>
      </div>

      {/* Main Title & Action Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Blog-System 自动化部署流水线
            </h1>
            <span className={`px-2.5 py-1 rounded-full text-xs font-mono font-semibold flex items-center gap-1.5 ${
              isRunning ? 'bg-cyan-950/60 border border-cyan-500/40 text-cyan-300' : 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-300'
            }`}>
              <span className={`w-2 h-2 rounded-full ${isRunning ? 'bg-cyan-400 animate-pulse' : 'bg-emerald-400'}`}></span>
              <span>{isRunning ? '执行中 · IN PROGRESS | 阶段 9/12' : '已完成 · COMPLETED | 12/12'}</span>
            </span>
          </div>

          <div className="mt-2 flex items-center gap-4 text-xs text-slate-400 flex-wrap font-sans">
            <span className="flex items-center gap-1">
              <span className="text-slate-500">触发者:</span>
              <span className="text-slate-200">管理员 (admin)</span>
            </span>
            <span className="text-slate-600">·</span>
            <span className="flex items-center gap-1">
              <span className="text-slate-500">目标主机:</span>
              <span className="text-cyan-400 font-mono">Production-Server (192.168.1.120)</span>
            </span>
            <span className="text-slate-600">·</span>
            <span className="flex items-center gap-1">
              <span className="text-slate-500">分支:</span>
              <span className="font-mono text-slate-200">main</span>
            </span>
            <span className="text-slate-600">·</span>
            <span className="flex items-center gap-1">
              <span className="text-slate-500">Commit:</span>
              <span className="font-mono text-cyan-400 underline decoration-dotted">8a72f31</span>
            </span>
            <span className="text-slate-600">·</span>
            <span className="flex items-center gap-1">
              <span className="text-slate-500">开始于:</span>
              <span className="font-mono text-slate-200">10:32:01</span>
            </span>
            <span className="text-slate-600">·</span>
            <span className="flex items-center gap-1">
              <span className="text-slate-500">已耗时:</span>
              <span className="font-mono text-emerald-400 font-bold">46s</span>
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {isRunning && (
            <button
              id="terminate-deploy-btn"
              onClick={handleTerminate}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 border border-red-500/40 text-red-300 text-xs font-medium transition-colors cursor-pointer"
            >
              <XSquare className="w-3.5 h-3.5" />
              <span>终止当前部署</span>
            </button>
          )}

          <button
            onClick={handleCopyLogs}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0f172a] hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-medium transition-colors cursor-pointer"
          >
            {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{isCopied ? '已复制' : '复制日志'}</span>
          </button>

          <button
            onClick={handleDownloadLogs}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0f172a] hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-medium transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>下载文件</span>
          </button>

          <button
            onClick={() => setIsAutoScroll(!isAutoScroll)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
              isAutoScroll 
                ? 'bg-cyan-950/40 border-cyan-500/40 text-cyan-300' 
                : 'bg-[#0f172a] border-slate-700 text-slate-400'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${isAutoScroll ? 'bg-cyan-400' : 'bg-slate-500'}`}></span>
            <span>自动滚动: {isAutoScroll ? '开' : '关'}</span>
          </button>
        </div>
      </div>

      {/* DAG Pipeline Progress Topology Card */}
      <div className="bg-[#0e1626] border border-slate-800 rounded-xl p-5 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <h2 className="text-sm font-bold text-white tracking-tight">部署阶段 DAG 进度拓扑</h2>
            <span className="text-xs text-slate-400 font-mono">总计 12 步 / 当前执行第 9 步</span>
          </div>

          <div className="flex items-center gap-4 text-xs font-medium">
            <span className="flex items-center gap-1 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              已完成 (8)
            </span>
            <span className="flex items-center gap-1 text-cyan-400">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
              进行中 (1)
            </span>
            <span className="flex items-center gap-1 text-slate-400">
              <span className="w-2 h-2 rounded-full bg-slate-500"></span>
              待执行 (3)
            </span>
          </div>
        </div>

        {/* Steps Flow (Horizontal scrollable DAG) */}
        <div className="overflow-x-auto py-2">
          <div className="flex items-center min-w-max gap-3">
            {steps.map((st, idx) => {
              const isDone = st.status === 'completed';
              const isCurrent = st.status === 'running';

              return (
                <div key={st.stepNumber} className="flex items-center">
                  {/* Step Box */}
                  <div className="flex flex-col items-center text-center w-28">
                    {/* Circle Node */}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                      isDone 
                        ? 'bg-emerald-950/80 border border-emerald-500/60 text-emerald-400' 
                        : isCurrent
                        ? 'bg-cyan-950/90 border-2 border-cyan-400 text-cyan-300 shadow-lg shadow-cyan-500/30 animate-pulse'
                        : 'bg-slate-900 border border-slate-700 text-slate-500'
                    }`}>
                      {isDone ? (
                        <Check className="w-4 h-4 stroke-[2.5]" />
                      ) : isCurrent ? (
                        <RefreshCw className="w-4 h-4 animate-spin text-cyan-400" />
                      ) : (
                        <span className="text-xs font-mono">{st.stepNumber}</span>
                      )}
                    </div>

                    {/* Step Title & Duration */}
                    <div className="mt-2">
                      <div className={`text-xs font-medium leading-snug ${
                        isDone ? 'text-slate-200' : isCurrent ? 'text-cyan-300 font-bold' : 'text-slate-400'
                      }`}>
                        {st.stepNumber}. {st.name}
                      </div>
                      <div className={`text-[11px] font-mono mt-0.5 ${
                        isDone ? 'text-emerald-400/80' : isCurrent ? 'text-cyan-400' : 'text-slate-400'
                      }`}>
                        {st.duration}
                      </div>
                    </div>
                  </div>

                  {/* Connector Line */}
                  {idx < steps.length - 1 && (
                    <div className={`w-8 h-[2px] mb-6 ${
                      steps[idx + 1].status === 'completed' || isDone
                        ? 'bg-emerald-500/60' 
                        : isCurrent
                        ? 'bg-gradient-to-r from-cyan-400 to-slate-700'
                        : 'bg-slate-800'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Grid: Left Bash Console (2/3) + Right Config Spec (1/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Live Terminal Console */}
        <div className="lg:col-span-2 bg-[#070b14] border border-slate-800 rounded-xl overflow-hidden flex flex-col h-[520px] shadow-lg">
          {/* Terminal Window Bar */}
          <div className="bg-[#0e1626] px-4 py-2.5 border-b border-slate-800 flex items-center justify-between select-none">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80 inline-block"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block"></span>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
                <TerminalIcon className="w-3.5 h-3.5 text-cyan-400" />
                <span>bash - opspilot-runner [PID: 4921]</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-[11px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                <span>日志级别:</span>
                <select 
                  value={logLevel}
                  onChange={(e) => setLogLevel(e.target.value)}
                  className="bg-transparent text-cyan-400 outline-none cursor-pointer"
                >
                  <option value="ALL">ALL</option>
                  <option value="INFO">INFO</option>
                  <option value="SUCCESS">SUCCESS</option>
                  <option value="BUILD">BUILD</option>
                  <option value="RUNNING">RUNNING</option>
                </select>
              </div>
            </div>
          </div>

          {/* Terminal Logs Output */}
          <div className="flex-1 p-4 font-mono text-xs overflow-y-auto space-y-1 bg-[#050811] text-slate-200">
            {filteredLogs.map((log) => {
              let levelColor = 'text-cyan-400';
              if (log.level === 'SUCCESS') levelColor = 'text-emerald-400 font-bold';
              if (log.level === 'BUILD') levelColor = 'text-purple-400';
              if (log.level === 'RUNNING') levelColor = 'text-cyan-300 font-bold animate-pulse';
              if (log.level === 'WARN') levelColor = 'text-yellow-400';
              if (log.level === 'ERROR') levelColor = 'text-red-400 font-bold';

              return (
                <div key={log.id} className="leading-relaxed flex items-start gap-2 break-all hover:bg-slate-900/40 px-1 rounded transition-colors">
                  <span className="text-slate-400 select-none shrink-0 font-mono text-[11px]">
                    [{log.timestamp}]
                  </span>
                  <span className={`shrink-0 font-semibold ${levelColor}`}>
                    [{log.level}]
                  </span>
                  <span className="text-slate-400 shrink-0 select-none">
                    [{log.tag}]
                  </span>
                  <span className={log.level === 'BUILD' ? 'text-slate-300' : 'text-slate-100'}>
                    {log.message}
                  </span>
                </div>
              );
            })}
            <div ref={terminalEndRef} />
          </div>

          {/* Terminal Status Bar */}
          <div className="bg-[#0a0f1c] px-4 py-2 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-400 select-none">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span className="text-slate-300">SignalR 实时连接正常</span>
            </div>
            <div className="flex items-center gap-3">
              <span>行数: {logs.length} lines</span>
              <span>编码: UTF-8</span>
              <span className="hidden sm:inline text-slate-400">脱敏策略已生效 (敏感凭据已过滤)</span>
            </div>
          </div>
        </div>

        {/* Right Column: Quick Scheduler & Deployment Parameters Spec */}
        <div className="space-y-4">
          {/* Quick Scheduler Card */}
          <div className="bg-[#0e1626] border border-slate-800 rounded-xl p-4.5 flex items-center justify-between shadow-sm">
            <div>
              <div className="text-xs font-bold text-white">部署快捷调度</div>
              <div className="text-[11px] text-slate-400 mt-0.5">启动同项目新版本或变更目标</div>
            </div>
            <button
              onClick={onOpenNewDeployModal}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-all shadow-md shadow-cyan-500/20 cursor-pointer shrink-0"
            >
              <Rocket className="w-3.5 h-3.5 stroke-[2.2]" />
              <span>新建部署</span>
            </button>
          </div>

          {/* Parameters Spec Card (SPEC ID #10024) */}
          <div className="bg-[#0e1626] border border-slate-800 rounded-xl p-4.5 space-y-3.5 shadow-sm text-xs">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <span className="font-bold text-white">部署参数配置回顾</span>
              </div>
              <span className="text-[11px] font-mono text-slate-400 font-semibold">SPEC ID #10024</span>
            </div>

            <div className="space-y-2 text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-400">目标工程:</span>
                <span className="font-bold text-white">Blog-System (.NET 8.0)</span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-400">目标集群 / 节点:</span>
                <span className="font-mono text-cyan-400">Production-Server (Node-01)</span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-400">仓库代码分支:</span>
                <span className="font-mono text-slate-200">main @ 8a72f31</span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-400">镜像制品名称:</span>
                <span className="font-mono text-slate-300 text-[11px] truncate max-w-[180px]">
                  registry.local/blog-system:8a72f31
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-400">部署发布策略:</span>
                <span className="flex items-center gap-1 text-slate-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                  停机热替 (Recreate)
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-400">容器映射端口:</span>
                <span className="font-mono text-emerald-400 font-semibold">8080 : 8080 / TCP</span>
              </div>
            </div>

            {/* Injected Env Vars */}
            <div className="pt-2 border-t border-slate-800/80 space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400 font-medium">注入环境变量 (4 项)</span>
                <span className="text-emerald-400 font-mono text-[10px]">已通过加密验签</span>
              </div>

              <div className="bg-[#080d17] border border-slate-800 rounded-lg p-2.5 space-y-1 font-mono text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-400">ASPNETCORE_ENVIRONMENT</span>
                  <span className="text-slate-200">Production</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">REDIS_HOST</span>
                  <span className="text-slate-200">192.168.1.130:6379</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">DB_CONNECTION_STRING</span>
                  <span className="text-cyan-400">************ (Encrypted)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">LOG_LEVEL</span>
                  <span className="text-slate-200">Information</span>
                </div>
              </div>
            </div>

            {/* Host Load Status */}
            <div className="pt-2 border-t border-slate-800/80 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">目标宿主机实时负载 (Production)</span>
                <span className="text-emerald-400 font-medium text-[11px]">健康 (Normal)</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div>
                  <div className="flex justify-between text-slate-400 mb-0.5">
                    <span>CPU</span>
                    <span className="font-mono text-slate-200">32.4%</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1">
                    <div className="bg-cyan-400 h-1 rounded-full" style={{ width: '32.4%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-slate-400 mb-0.5">
                    <span>内存</span>
                    <span className="font-mono text-slate-200">58.1%</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1">
                    <div className="bg-blue-400 h-1 rounded-full" style={{ width: '58.1%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
