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
  title = 'SSH Remote Web Console - opspilot@192.168.1.120',
  initialCommands = []
}) => {
  const [history, setHistory] = useState<string[]>([
    'Linux production-srv 5.15.0-89-generic #99-Ubuntu SMP x86_64',
    'Welcome to Ubuntu 22.04.3 LTS (GNU/Linux 5.15.0-89-generic x86_64)',
    'OpsPilot Node Agent v1.0.0-beta connected via SSH (AES-256-GCM).',
    'Type "help" for built-in DevOps tools or run standard bash/docker commands.',
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
        'Available simulated commands:',
        '  docker ps          - List active containers on this node',
        '  docker logs [name] - Show recent container logs',
        '  systemctl status   - Check Docker engine & agent daemon',
        '  netstat -tuln      - Show listening ports (8080, 22, etc.)',
        '  htop / free -m     - Inspect CPU & RAM consumption',
        '  uname -a           - Print kernel system architecture',
        '  clear              - Clear terminal display'
      );
    } else if (cmd === 'docker ps') {
      newHistory.push(
        'CONTAINER ID   IMAGE                               COMMAND                  CREATED         STATUS         PORTS                    NAMES',
        '4eb89a10ef23   registry.local/blog-system:8a72f31  "dotnet BlogSystem.dll"  10 mins ago     Up 10 minutes  0.0.0.0:8080->8080/tcp   blog-api-prod',
        '8b901fc921a1   registry.local/file-service:71ac921 "node server.js"         1 day ago       Up 28 hours    0.0.0.0:9000->9000/tcp   file-service-prod',
        '33d2891bf120   nginx:1.25-alpine                   "/docker-entrypoint…"    5 days ago      Up 5 days      0.0.0.0:80->80/tcp       nginx-proxy',
        '55e09aa11b88   redis:7.2-alpine                    "docker-entrypoint.s…"   5 days ago      Up 5 days      0.0.0.0:6379->6379/tcp   redis-cache',
        '99a1820bcf42   postgres:16-alpine                  "docker-entrypoint.s…"   5 days ago      Up 5 days      0.0.0.0:5432->5432/tcp   postgres-db'
      );
    } else if (cmd.startsWith('docker logs')) {
      newHistory.push(
        '[2026-09-04 10:32:41] [INFO] Microsoft.Hosting.Lifetime: Application started. Press Ctrl+C to shut down.',
        '[2026-09-04 10:32:41] [INFO] Microsoft.Hosting.Lifetime: Hosting environment: Production',
        '[2026-09-04 10:32:41] [INFO] Microsoft.Hosting.Lifetime: Content root path: /app',
        '[2026-09-04 10:32:42] [INFO] Health probe /health responded 200 OK in 4.2ms'
      );
    } else if (cmd === 'free -m') {
      newHistory.push(
        '               total        used        free      shared  buff/cache   available',
        'Mem:            8192        4980        1820         128        1392        3212',
        'Swap:           2048         120        1928'
      );
    } else if (cmd === 'netstat -tuln') {
      newHistory.push(
        'Active Internet connections (only servers)',
        'Proto Recv-Q Send-Q Local Address           Foreign Address         State',
        'tcp        0      0 0.0.0.0:22              0.0.0.0:*               LISTEN',
        'tcp        0      0 0.0.0.0:80              0.0.0.0:*               LISTEN',
        'tcp        0      0 0.0.0.0:443             0.0.0.0:*               LISTEN',
        'tcp        0      0 0.0.0.0:8080            0.0.0.0:*               LISTEN',
        'tcp        0      0 0.0.0.0:9000            0.0.0.0:*               LISTEN',
        'tcp        0      0 0.0.0.0:6379            0.0.0.0:*               LISTEN',
        'tcp        0      0 0.0.0.0:5432            0.0.0.0:*               LISTEN'
      );
    } else if (cmd === 'uname -a') {
      newHistory.push('Linux Production-Server 5.15.0-89-generic #99-Ubuntu SMP x86_64 GNU/Linux');
    } else if (cmd === 'systemctl status') {
      newHistory.push(
        '● opspilot-agent.service - OpsPilot Node Orchestration Daemon',
        '     Loaded: loaded (/etc/systemd/system/opspilot-agent.service; enabled)',
        '     Active: active (running) since Thu 2026-09-01 08:00:00 UTC; 3 days ago',
        '   Main PID: 1042 (opspilot-agent)',
        '      Tasks: 14 (limit: 9830)',
        '     Memory: 42.1M'
      );
    } else {
      newHistory.push(`bash: ${cmd}: command executed successfully (exit code 0).`);
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
        {/* Terminal Title Bar */}
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

        {/* Terminal Screen */}
        <div 
          onClick={() => inputRef.current?.focus()}
          className="flex-1 bg-[#050811] p-4 font-mono text-xs text-slate-200 overflow-y-auto space-y-1 cursor-text"
        >
          {history.map((line, idx) => (
            <div key={idx} className="whitespace-pre-wrap leading-relaxed break-all">
              {line.startsWith('root@opspilot-node:') ? (
                <span className="text-cyan-400 font-bold">{line}</span>
              ) : line.includes('SUCCESS') || line.includes('Up ') || line.includes('active (running)') ? (
                <span className="text-emerald-400">{line}</span>
              ) : line.includes('WARNING') || line.includes('timeout') ? (
                <span className="text-yellow-400">{line}</span>
              ) : line.includes('ERROR') || line.includes('fail') || line.includes('Exited') ? (
                <span className="text-red-400">{line}</span>
              ) : (
                <span className="text-slate-300">{line}</span>
              )}
            </div>
          ))}

          {/* Interactive prompt */}
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

        {/* Terminal Status Footer */}
        <div className="bg-[#090e1a] px-4 py-1.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400 select-none">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>SSH Session Connected (Port 22)</span>
          </div>
          <div>Encoding: UTF-8 · Protocol: SSHv2</div>
        </div>
      </div>
    </div>
  );
};
