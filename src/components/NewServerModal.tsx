import React, { useState } from 'react';
import { Server, X, Shield, Plus } from 'lucide-react';
import { ServerNode } from '../types';

interface NewServerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddServer: (server: Partial<ServerNode>) => void;
}

export const NewServerModal: React.FC<NewServerModalProps> = ({
  isOpen,
  onClose,
  onAddServer
}) => {
  const [name, setName] = useState('');
  const [ip, setIp] = useState('');
  const [port, setPort] = useState('22');
  const [role, setRole] = useState<'核心生产节点' | '开发测试' | '预发布环境'>('开发测试');
  const [os, setOs] = useState('Ubuntu 22.04 LTS (x86_64)');
  const [sshKey, setSshKey] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !ip.trim()) return;

    onAddServer({
      name,
      role,
      status: '在线',
      internalIp: ip,
      port: parseInt(port) || 22,
      os,
      dockerVersion: 'Docker 24.0.7 运行中 (接口 1.43)',
      cpuCores: '4 核 / AMD 霄龙 2.8GHz',
      cpuLoad: 12,
      memoryUsed: 2.1,
      memoryTotal: 8.0,
      memoryPercent: 26,
      storageUsed: 22.0,
      storageTotal: 100.0,
      storagePercent: 22,
      runningContainersCount: 0,
      containers: [],
      sshKeyMode: 'ed25519 [已加密保护: ****************]',
      hostUuid: `srv-node-${Math.random().toString(16).substring(2, 8)}`
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-lg bg-[#0e1626] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">接入新服务器节点</h2>
              <div className="text-xs text-slate-400 font-mono">通过远程连接与容器引擎纳管主机</div>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-300 font-medium mb-1.5 block">节点标识名称 *</label>
              <input 
                type="text" 
                required
                placeholder="例如：边缘节点-01"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#080d17] border border-slate-700 rounded-lg px-3 py-2 text-white outline-none focus:border-cyan-500 font-mono"
              />
            </div>
            <div>
              <label className="text-slate-300 font-medium mb-1.5 block">集群角色定位</label>
              <select 
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
                className="w-full bg-[#080d17] border border-slate-700 rounded-lg px-3 py-2 text-white outline-none focus:border-cyan-500"
              >
                <option value="核心生产节点">核心生产节点（生产）</option>
                <option value="开发测试">开发测试（开发）</option>
                <option value="预发布环境">预发布环境（测试与预发布）</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="text-slate-300 font-medium mb-1.5 block">内网 / 公网 IP 地址 *</label>
              <input 
                type="text" 
                required
                placeholder="192.168.1.125"
                value={ip}
                onChange={(e) => setIp(e.target.value)}
                className="w-full bg-[#080d17] border border-slate-700 rounded-lg px-3 py-2 text-white outline-none focus:border-cyan-500 font-mono"
              />
            </div>
            <div>
              <label className="text-slate-300 font-medium mb-1.5 block">SSH 端口</label>
              <input 
                type="text" 
                value={port}
                onChange={(e) => setPort(e.target.value)}
                placeholder="22"
                className="w-full bg-[#080d17] border border-slate-700 rounded-lg px-3 py-2 text-white outline-none focus:border-cyan-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="text-slate-300 font-medium mb-1.5 block">操作系统与发行版</label>
            <select 
              value={os}
              onChange={(e) => setOs(e.target.value)}
              className="w-full bg-[#080d17] border border-slate-700 rounded-lg px-3 py-2 text-white outline-none focus:border-cyan-500"
            >
              <option value="Ubuntu 22.04 LTS (x86_64)">Ubuntu 22.04.3 LTS (x86_64)</option>
              <option value="Debian 12 Bookworm (x86_64)">Debian 12 Bookworm (x86_64)</option>
              <option value="CentOS Stream 9 (x86_64)">CentOS Stream 9 (x86_64)</option>
              <option value="Alpine Linux 3.19">Alpine Linux 3.19</option>
            </select>
          </div>

          <div>
            <label className="text-slate-300 font-medium mb-1.5 flex items-center justify-between">
              <span>远程登录认证私钥</span>
              <span className="text-emerald-400 font-mono text-[11px] flex items-center gap-1">
                <Shield className="w-3 h-3" /> AES-256 加密
              </span>
            </label>
            <textarea 
              rows={3}
              value={sshKey}
              onChange={(e) => setSshKey(e.target.value)}
              placeholder="-----BEGIN OPENSSH PRIVATE KEY-----&#10;...&#10;-----END OPENSSH PRIVATE KEY-----"
              className="w-full bg-[#080d17] border border-slate-700 rounded-lg p-2.5 text-white font-mono text-[11px] outline-none focus:border-cyan-500"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition-all"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>验证并纳管</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
