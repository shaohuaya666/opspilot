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
  const [logLevel, setLogLevel] = useState('全部');
  const terminalEndRef = useRef<HTMLDivElement>(null);

  // 日志自动滚动到底部
  useEffect(() => {
    if (isAutoScroll) {
      terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, isAutoScroll]);

  // 流水线执行中时模拟实时日志输出
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      const now = new Date();
      const timeStr = now.toTimeString().split(' ')[0] + '.' + String(now.getMilliseconds()).padStart(3, '0');
      
      setLogs(prev => {
        if (prev.length >= 24) {
          // 日志累计到 24 行时，将第 9 步及之后的阶段标记为已完成
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
            { id: String(prev.length + 1), timestamp: timeStr, level: 'SUCCESS', tag: '健康检查', message: '已收到 http://localhost:8080/health 的 200 正常响应（耗时：12 毫秒）' },
            { id: String(prev.length + 2), timestamp: timeStr, level: 'INFO', tag: '网关', message: '已将上游流量切换至容器 博客接口-生产:8080' },
            { id: String(prev.length + 3), timestamp: timeStr, level: 'SUCCESS', tag: '流水线', message: '流水线 #10024 执行成功，总耗时 49.8 秒。' }
          ];
        }

        const candidateMsgs = [
          { level: 'INFO' as const, tag: '健康检查', message: '正在探活 http://localhost:8080/health（第 2/3 次，耗时：18 毫秒）...' },
          { level: 'INFO' as const, tag: '资源指标', message: '处理器：14.2%，常驻内存：198 MB，线程数：28' },
          { level: 'SUCCESS' as const, tag: '健康检查', message: '应用已返回 200 正常响应，可以接入流量。' },
          { level: 'INFO' as const, tag: '网关', message: '正在更新反向代理路由表...' }
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
    a.download = '部署日志-10024.log';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleTerminate = () => {
    setIsRunning(false);
    setLogs(prev => [
      ...prev,
      { id: String(Date.now()), timestamp: '10:32:48.000', level: 'WARN', tag: '中断', message: '部署任务 #10024 已被集群管理员手动终止。' }
    ]);
  };

  const filteredLogs = logLevel === '全部' 
    ? logs 
    : logs.filter(l => l.level === logLevel);

  return (
    <div id="deployments-view" className="space-y-6">
      {/* 顶部面包屑与连接状态栏 */}
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
          <span className="text-slate-400">节点延迟：14 毫秒</span>
        </div>
      </div>

      {/* 主标题与操作栏 */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold text-white tracking-tight">
              博客系统 自动化部署流水线
            </h1>
            <span className={`px-2.5 py-1 rounded-full text-xs font-mono font-semibold flex items-center gap-1.5 ${
              isRunning ? 'bg-cyan-950/60 border border-cyan-500/40 text-cyan-300' : 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-300'
            }`}>
              <span className={`w-2 h-2 rounded-full ${isRunning ? 'bg-cyan-400 animate-pulse' : 'bg-emerald-400'}`}></span>
              <span>{isRunning ? '执行中 · 阶段 9/12' : '已完成 · 12/12'}</span>
            </span>
          </div>

          <div className="mt-2 flex items-center gap-4 text-xs text-slate-400 flex-wrap font-sans">
            <span className="flex items-center gap-1">
              <span className="text-slate-500">触发者:</span>
              <span className="text-slate-200">管理员</span>
            </span>
            <span className="text-slate-600">·</span>
            <span className="flex items-center gap-1">
              <span className="text-slate-500">目标主机:</span>
              <span className="text-cyan-400 font-mono">生产服务器 (192.168.1.120)</span>
            </span>
            <span className="text-slate-600">·</span>
            <span className="flex items-center gap-1">
              <span className="text-slate-500">分支：</span>
              <span className="font-mono text-slate-200">主干</span>
            </span>
            <span className="text-slate-600">·</span>
            <span className="flex items-center gap-1">
              <span className="text-slate-500">提交号：</span>
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

        {/* 操作按钮组 */}
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

      {/* 流水线阶段进度拓扑卡片 */}
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

        {/* 阶段流程（可横向滚动） */}
        <div className="overflow-x-auto py-2">
          <div className="flex items-center min-w-max gap-3">
            {steps.map((st, idx) => {
              const isDone = st.status === 'completed';
              const isCurrent = st.status === 'running';

              return (
                <div key={st.stepNumber} className="flex items-center">
                  {/* 阶段节点块 */}
                  <div className="flex flex-col items-center text-center w-28">
                    {/* 圆形状态节点 */}
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

                    {/* 阶段名称与耗时 */}
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

                  {/* 节点连接线 */}
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

      {/* 主体栅格：左侧命令行控制台 + 右侧部署参数规格 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 左栏：实时终端控制台 */}
        <div className="lg:col-span-2 bg-[#070b14] border border-slate-800 rounded-xl overflow-hidden flex flex-col h-[520px] shadow-lg">
          {/* 终端窗口标题栏 */}
          <div className="bg-[#0e1626] px-4 py-2.5 border-b border-slate-800 flex items-center justify-between select-none">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80 inline-block"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block"></span>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
                <TerminalIcon className="w-3.5 h-3.5 text-cyan-400" />
                <span>命令行 - 部署执行器 [进程号：4921]</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-[11px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                <span>日志级别：</span>
                <select 
                  value={logLevel}
                  onChange={(e) => setLogLevel(e.target.value)}
                  className="bg-transparent text-cyan-400 outline-none cursor-pointer"
                >
                  <option value="全部">全部级别</option>
                  <option value="INFO">信息</option>
                  <option value="SUCCESS">成功</option>
                  <option value="BUILD">构建</option>
                  <option value="RUNNING">运行中</option>
                </select>
              </div>
            </div>
          </div>

          {/* 终端日志输出区 */}
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

          {/* 终端底部状态栏 */}
          <div className="bg-[#0a0f1c] px-4 py-2 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-400 select-none">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span className="text-slate-300">SignalR 实时连接正常</span>
            </div>
            <div className="flex items-center gap-3">
              <span>行数：{logs.length} 行</span>
              <span>编码：UTF-8</span>
              <span className="hidden sm:inline text-slate-400">脱敏策略已生效 (敏感凭据已过滤)</span>
            </div>
          </div>
        </div>

        {/* 右栏：快捷调度与部署参数规格 */}
        <div className="space-y-4">
          {/* 快捷调度卡片 */}
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

          {/* 参数规格卡片（配置编号 #10024） */}
          <div className="bg-[#0e1626] border border-slate-800 rounded-xl p-4.5 space-y-3.5 shadow-sm text-xs">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <span className="font-bold text-white">部署参数配置回顾</span>
              </div>
              <span className="text-[11px] font-mono text-slate-400 font-semibold">配置编号 #10024</span>
            </div>

            <div className="space-y-2 text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-400">目标工程:</span>
                <span className="font-bold text-white">博客系统（.NET 8.0）</span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-400">目标集群 / 节点:</span>
                <span className="font-mono text-cyan-400">生产服务器（节点 01）</span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-400">仓库代码分支:</span>
                <span className="font-mono text-slate-200">主干 @ 8a72f31</span>
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
                  停机热替
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-400">容器映射端口:</span>
                <span className="font-mono text-emerald-400 font-semibold">8080 : 8080 / TCP</span>
              </div>
            </div>

            {/* 注入的环境变量 */}
            <div className="pt-2 border-t border-slate-800/80 space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400 font-medium">注入环境变量 (4 项)</span>
                <span className="text-emerald-400 font-mono text-[10px]">已通过加密验签</span>
              </div>

              <div className="bg-[#080d17] border border-slate-800 rounded-lg p-2.5 space-y-1 font-mono text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-400">ASPNETCORE_ENVIRONMENT</span>
                  <span className="text-slate-200">生产</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">REDIS_HOST</span>
                  <span className="text-slate-200">192.168.1.130:6379</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">DB_CONNECTION_STRING</span>
                  <span className="text-cyan-400">************（已加密）</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">LOG_LEVEL</span>
                  <span className="text-slate-200">信息</span>
                </div>
              </div>
            </div>

            {/* 宿主机实时负载 */}
            <div className="pt-2 border-t border-slate-800/80 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">目标宿主机实时负载（生产环境）</span>
                <span className="text-emerald-400 font-medium text-[11px]">健康</span>
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
