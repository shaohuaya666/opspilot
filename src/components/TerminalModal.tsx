import React, { useState, useEffect, useRef } from 'react';
import { Terminal as TerminalIcon, X, Maximize2, Minimize2, Trash2, Copy, Check } from 'lucide-react';

interface TerminalModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  initialCommands?: string[];
}

export const TerminalModal: React.FC<TerminalModalProps> = ({
  isOpen,
  onClose,
  title = '远程终端控制台 - 运维平台@192.168.1.120',
  initialCommands = []
}) => {
  const [history, setHistory] = useState<string[]>([
    'Linux 生产服务器 5.15.0-89-generic #99-Ubuntu SMP x86_64',
    '欢迎使用 Ubuntu 22.04.3 LTS（GNU/Linux 5.15.0-89-generic x86_64）',
    'OpsPilot 节点代理 v1.0.0-beta 已建立远程会话（加密套件：AES-256-GCM）。',
    '输入 "help" 查看内置运维工具，也可直接执行标准命令行与容器指令。',
    ''
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      if (initialCommands.length > 0) {
        setHistory(prev => [...prev, ...initialCommands]);
      }
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  if (!isOpen) return null;

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = inputVal.trim();
    if (!cmd) return;

    const newHistory = [...history, `root@opspilot-node:~# ${cmd}`];

    if (cmd === 'clear') {
      setHistory([]);
      setInputVal('');
      return;
    } else if (cmd === 'help') {
      newHistory.push(
        '当前可执行的模拟指令：',
        '  docker ps          - 查看本节点正在运行的容器',
        '  docker logs [名称] - 查看指定容器最近的日志',
        '  systemctl status   - 检查容器引擎与节点代理守护进程',
        '  netstat -tuln      - 查看监听中的端口（8080、22 等）',
        '  htop / free -m     - 查看处理器与内存占用',
        '  uname -a           - 输出内核与系统架构信息',
        '  clear              - 清空终端显示'
      );
    } else if (cmd === 'docker ps') {
      newHistory.push(
        '容器标识       镜像                                启动命令                 创建时间      状态            端口映射                 容器名称',
        '4eb89a10ef23   registry.local/blog-system:8a72f31  "dotnet BlogSystem.dll"  10 分钟前     运行中 10 分钟   0.0.0.0:8080->8080/tcp   博客接口-生产',
        '8b901fc921a1   registry.local/file-service:71ac921 "node server.js"         1 天前        运行中 28 小时   0.0.0.0:9000->9000/tcp   文件服务-生产',
        '33d2891bf120   nginx:1.25-alpine                   "/docker-entrypoint…"    5 天前        运行中 5 天      0.0.0.0:80->80/tcp       网关代理',
        '55e09aa11b88   redis:7.2-alpine                    "docker-entrypoint.s…"   5 天前        运行中 5 天      0.0.0.0:6379->6379/tcp   缓存服务',
        '99a1820bcf42   postgres:16-alpine                  "docker-entrypoint.s…"   5 天前        运行中 5 天      0.0.0.0:5432->5432/tcp   数据库'
      );
    } else if (cmd.startsWith('docker logs')) {
      newHistory.push(
        '[2026-09-04 10:32:41] [信息] 应用宿主生命周期：应用已启动，按 Ctrl+C 可关闭。',
        '[2026-09-04 10:32:41] [信息] 应用宿主生命周期：当前运行环境：生产',
        '[2026-09-04 10:32:41] [信息] 应用宿主生命周期：内容根路径：/app',
        '[2026-09-04 10:32:42] [信息] 健康探针 /health 返回 200 正常响应，耗时 4.2 毫秒'
      );
    } else if (cmd === 'free -m') {
      newHistory.push(
        '              总计       已用       空闲      共享    缓冲/缓存     可用',
        '内存：        8192       4980       1820       128       1392       3212',
        '交换分区：    2048        120       1928'
      );
    } else if (cmd === 'netstat -tuln') {
      newHistory.push(
        '活动网络连接（仅显示服务端）',
        '协议   接收队列  发送队列  本地地址              外部地址              状态',
        'tcp        0      0      0.0.0.0:22            0.0.0.0:*            监听中',
        'tcp        0      0      0.0.0.0:80            0.0.0.0:*            监听中',
        'tcp        0      0      0.0.0.0:443           0.0.0.0:*            监听中',
        'tcp        0      0      0.0.0.0:8080          0.0.0.0:*            监听中',
        'tcp        0      0      0.0.0.0:9000          0.0.0.0:*            监听中',
        'tcp        0      0      0.0.0.0:6379          0.0.0.0:*            监听中',
        'tcp        0      0      0.0.0.0:5432          0.0.0.0:*            监听中'
      );
    } else if (cmd === 'uname -a') {
      newHistory.push('Linux 生产服务器 5.15.0-89-generic #99-Ubuntu SMP x86_64 GNU/Linux');
    } else if (cmd === 'systemctl status') {
      newHistory.push(
        '● 节点代理服务 - OpsPilot 节点编排守护进程',
        '     已加载：已加载（/etc/systemd/system/节点代理服务；已启用）',
        '     状态：运行中（自 2026 年 9 月 1 日 周四 08:00:00 起，已运行 3 天）',
        '   主进程号：1042（节点代理）',
        '     任务数：14（上限：9830）',
        '     内存：42.1M'
      );
    } else {
      newHistory.push(`命令行：${cmd} 执行成功（退出码 0）。`);
    }

    setHistory(newHistory);
    setInputVal('');
  };

  const handleCopyLogs = () => {
    navigator.clipboard.writeText(history.join('\n'));
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div 
        id="terminal-window"
        className="w-full max-w-4xl bg-[#070b14] border border-slate-700/80 rounded-xl shadow-2xl overflow-hidden flex flex-col h-[560px]"
      >
        {/* 终端标题栏 */}
        <div className="bg-[#0f172a] px-4 py-2.5 border-b border-slate-800 flex items-center justify-between select-none">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 mr-2">
              <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block"></span>
              <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block"></span>
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
            </div>
            <TerminalIcon className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-mono font-semibold text-slate-300 truncate max-w-md">
              {title}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLogs}
              title="复制全部终端输出"
              className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors text-xs flex items-center gap-1"
            >
              {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline text-[11px] font-mono">{isCopied ? '已复制' : '复制'}</span>
            </button>
            <button
              onClick={() => setHistory([])}
              title="清空输出"
              className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
            <button 
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 终端显示区 */}
        <div 
          onClick={() => inputRef.current?.focus()}
          className="flex-1 bg-[#050811] p-4 font-mono text-xs text-slate-200 overflow-y-auto space-y-1 cursor-text"
        >
          {history.map((line, idx) => (
            <div key={idx} className="whitespace-pre-wrap leading-relaxed break-all">
              {line.startsWith('root@opspilot-node:') ? (
                <span className="text-cyan-400 font-bold">{line}</span>
              ) : line.includes('成功') || line.includes('运行中') || line.includes('已启用') ? (
                <span className="text-emerald-400">{line}</span>
              ) : line.includes('警告') || line.includes('超时') ? (
                <span className="text-yellow-400">{line}</span>
              ) : line.includes('错误') || line.includes('失败') || line.includes('已退出') || line.includes('已停止') ? (
                <span className="text-red-400">{line}</span>
              ) : (
                <span className="text-slate-300">{line}</span>
              )}
            </div>
          ))}

          {/* 交互式命令输入 */}
          <form onSubmit={handleCommand} className="flex items-center gap-2 pt-1">
            <span className="text-cyan-400 font-bold shrink-0 select-none">root@opspilot-node:~#</span>
            <input 
              ref={inputRef}
              type="text" 
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              className="flex-1 bg-transparent text-white outline-none border-none font-mono text-xs"
              autoFocus
            />
          </form>
          <div ref={bottomRef} />
        </div>

        {/* 终端底部状态栏 */}
        <div className="bg-[#090e1a] px-4 py-1.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400 select-none">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>远程会话已连接（端口 22）</span>
          </div>
          <div>编码：UTF-8 · 协议：SSHv2</div>
        </div>
      </div>
    </div>
  );
};
