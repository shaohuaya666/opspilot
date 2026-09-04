import React, { useState } from 'react';
import { FolderGit2, X, Plus, Check } from 'lucide-react';
import { Project, Environment } from '../types';

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProject: (project: Partial<Project>) => void;
}

export const NewProjectModal: React.FC<NewProjectModalProps> = ({
  isOpen,
  onClose,
  onAddProject
}) => {
  const [name, setName] = useState('');
  const [techStack, setTechStack] = useState('.NET 8 (C#)');
  const [environment, setEnvironment] = useState<Environment>('Production');
  const [repoUrl, setRepoUrl] = useState('');
  const [branch, setBranch] = useState('main');
  const [port, setPort] = useState('8080');
  const [hostNode, setHostNode] = useState('Production-Server');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAddProject({
      name,
      techStack,
      framework: techStack,
      environment,
      gitRepoUrl: repoUrl || `https://github.com/myteam/${name.toLowerCase()}.git`,
      gitBranch: branch,
      gitCommit: Math.random().toString(16).substring(2, 9),
      gitMessage: 'feat: 初始化微服务并集成 OpsPilot 持续部署规范',
      portMap: `${port}:${port}`,
      hostNode,
      hostIp: hostNode === 'Production-Server' ? '192.168.1.120' : hostNode === 'Dev-Server' ? '192.168.1.121' : '192.168.1.122',
      containerName: `${name.toLowerCase()}-app`,
      status: 'Running',
      version: `v20260905.001`,
      dockerfilePath: './Dockerfile',
      imageTag: `registry.local/${name.toLowerCase()}:v20260905.001`,
      deployStrategy: '停机热替 (Recreate)',
      cpuUsage: 5,
      memoryUsage: 15,
      updatedAt: '刚刚',
      updatedBy: 'admin',
      envVars: [{ key: 'ENVIRONMENT', value: environment }],
      healthCheck: { path: '/health', interval: '10s', timeout: '3s', retries: 3 }
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-lg bg-[#0e1626] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <FolderGit2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">新增服务项目</h2>
              <div className="text-xs text-slate-400 font-mono">Onboard New Containerized Microservice</div>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="text-slate-300 font-medium mb-1.5 block">工程名称 *</label>
            <input 
              type="text" 
              required
              placeholder="例如: Auth-Service, Payment-Worker"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#080d17] border border-slate-700 rounded-lg px-3.5 py-2.5 text-white outline-none focus:border-cyan-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-300 font-medium mb-1.5 block">技术栈 / 框架</label>
              <select 
                value={techStack}
                onChange={(e) => setTechStack(e.target.value)}
                className="w-full bg-[#080d17] border border-slate-700 rounded-lg px-3 py-2 text-white outline-none focus:border-cyan-500"
              >
                <option value=".NET 8 (C#)">.NET 8 (C#)</option>
                <option value="Java 21 / SpringBoot 3">Java 21 / SpringBoot 3</option>
                <option value="Node.js 20 / Fastify">Node.js 20 / Fastify</option>
                <option value="Python 3.11 / FastAPI">Python 3.11 / FastAPI</option>
                <option value="Golang 1.22 / Gin">Golang 1.22 / Gin</option>
              </select>
            </div>

            <div>
              <label className="text-slate-300 font-medium mb-1.5 block">目标环境</label>
              <select 
                value={environment}
                onChange={(e) => setEnvironment(e.target.value as Environment)}
                className="w-full bg-[#080d17] border border-slate-700 rounded-lg px-3 py-2 text-white outline-none focus:border-cyan-500"
              >
                <option value="Production">Production (生产集群)</option>
                <option value="Dev">Dev (开发测试)</option>
                <option value="Test">Test (预发布测试)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-300 font-medium mb-1.5 block">目标宿主机节点</label>
              <select 
                value={hostNode}
                onChange={(e) => setHostNode(e.target.value)}
                className="w-full bg-[#080d17] border border-slate-700 rounded-lg px-3 py-2 text-white outline-none focus:border-cyan-500"
              >
                <option value="Production-Server">Production-Server (192.168.1.120)</option>
                <option value="Dev-Server">Dev-Server (192.168.1.121)</option>
                <option value="Test-Server">Test-Server (192.168.1.122)</option>
              </select>
            </div>

            <div>
              <label className="text-slate-300 font-medium mb-1.5 block">对外映射端口</label>
              <input 
                type="text" 
                value={port}
                onChange={(e) => setPort(e.target.value)}
                placeholder="8080"
                className="w-full bg-[#080d17] border border-slate-700 rounded-lg px-3 py-2 text-white outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div>
            <label className="text-slate-300 font-medium mb-1.5 block">Git 仓库地址</label>
            <input 
              type="text" 
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              placeholder="https://github.com/myteam/project.git"
              className="w-full bg-[#080d17] border border-slate-700 rounded-lg px-3.5 py-2 text-white outline-none focus:border-cyan-500 font-mono"
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
              <span>立即接入</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
