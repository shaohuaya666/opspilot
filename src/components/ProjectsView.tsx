import React, { useState } from 'react';
import { 
  FolderGit2, 
  Plus, 
  Rocket, 
  Terminal, 
  Settings, 
  Activity, 
  RotateCcw, 
  CheckCircle2, 
  AlertTriangle, 
  Search, 
  Server, 
  GitBranch, 
  Box, 
  ShieldCheck,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { Project, Environment, NavTab } from '../types';

interface ProjectsViewProps {
  projects: Project[];
  onOpenNewProject: () => void;
  onOpenDeployModal: () => void;
  onOpenTerminal: (nodeName: string) => void;
  onTriggerRollback: (projectName: string) => void;
  onNavigate: (tab: NavTab) => void;
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({
  projects,
  onOpenNewProject,
  onOpenDeployModal,
  onOpenTerminal,
  onTriggerRollback,
  onNavigate
}) => {
  const [selectedEnv, setSelectedEnv] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [spotlightProjectName, setSpotlightProjectName] = useState('Blog-System');

  const filteredProjects = projects.filter(p => {
    if (selectedEnv !== 'ALL' && p.environment !== selectedEnv) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.techStack.toLowerCase().includes(q) ||
        p.hostNode.toLowerCase().includes(q) ||
        p.containerName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const spotlightProject = projects.find(p => p.name === spotlightProjectName) || projects[0];

  return (
    <div id="projects-view" className="space-y-6">
      {/* Title & Actions Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
            <span>微服务接入与生命周期</span>
            <span>/</span>
            <span className="text-cyan-400 font-bold">服务治理</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
            项目管理 · Project Hub
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            纳管企业微服务应用工程，配置构建镜像规约、持续交付发布策略及宿主绑定
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-2.5">
          <button
            id="add-project-hub-btn"
            onClick={onOpenNewProject}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-all shadow-md shadow-cyan-500/20 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>新增项目</span>
          </button>

          <button
            onClick={onOpenDeployModal}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#0f172a] hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-medium transition-all cursor-pointer"
          >
            <Rocket className="w-3.5 h-3.5 text-cyan-400" />
            <span>批量构建</span>
          </button>

          <button
            onClick={() => alert('已成功与所有节点同步最新容器配置规约')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#0f172a] hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-medium transition-all cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
            <span>配置同步</span>
          </button>
        </div>
      </div>

      {/* Summary Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#0e1626] border border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="text-xs text-slate-400 font-medium">纳入工程总数</div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-white">{projects.length} / 12</span>
            <span className="text-xs text-emerald-400 font-mono">10 个活跃容器</span>
          </div>
        </div>

        <div className="bg-[#0e1626] border border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="text-xs text-slate-400 font-medium">技术栈分布</div>
          <div className="mt-1 text-xs text-cyan-300 font-mono font-medium truncate">
            .NET 8 · Java 21 · Node.js · Python
          </div>
        </div>

        <div className="bg-[#0e1626] border border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="text-xs text-slate-400 font-medium">构建成功率</div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-white">94.2%</span>
            <span className="text-xs text-slate-400 font-mono">近30天统计</span>
          </div>
        </div>

        <div className="bg-[#0e1626] border border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="text-xs text-slate-400 font-medium">健康检查探活</div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-emerald-400">4 正常</span>
            <span className="text-xs text-red-400 font-medium">/ 1 异常</span>
          </div>
        </div>
      </div>

      {/* Environment Filter & Search Bar */}
      <div className="bg-[#0e1626] border border-slate-800 rounded-xl p-3 flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 flex-wrap">
          {['ALL', 'Production', 'Dev', 'Test'].map(env => (
            <button
              key={env}
              onClick={() => setSelectedEnv(env)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                selectedEnv === env 
                  ? 'bg-cyan-500 text-slate-950 font-bold' 
                  : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {env === 'ALL' ? '全部环境 (All)' : `${env} (${env === 'Production' ? '生产' : env === 'Dev' ? '开发' : '测试'})`}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-80">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="搜索工程名称、技术栈、容器名或宿主节点..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#080d17] border border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-white placeholder-slate-500 outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      {/* Spotlight Project Card (Focused microservice detailed showcase matching Image 9) */}
      {spotlightProject && (
        <div className="bg-gradient-to-r from-[#0d172a] via-[#0e1626] to-[#0a1120] border-2 border-cyan-500/50 rounded-2xl p-6 shadow-xl relative overflow-hidden space-y-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0 shadow-inner">
                <FolderGit2 className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h2 className="text-xl font-bold text-white tracking-tight">{spotlightProject.name}</h2>
                  <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-cyan-950 border border-cyan-500/40 text-cyan-300">
                    {spotlightProject.techStack}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1 ${
                    spotlightProject.status === 'Running' 
                      ? 'bg-emerald-950/80 border border-emerald-500/50 text-emerald-400' 
                      : 'bg-red-950/80 border border-red-500/50 text-red-400'
                  }`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                    {spotlightProject.statusDetail || spotlightProject.status}
                  </span>
                </div>
                <div className="text-xs text-slate-300 font-sans mt-0.5">{spotlightProject.framework}</div>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={onOpenDeployModal}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-all shadow-md shadow-cyan-500/20 cursor-pointer"
              >
                <Rocket className="w-3.5 h-3.5 stroke-[2.2]" />
                <span>一键发布部署</span>
              </button>
              <button
                onClick={() => onNavigate('deployments')}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors cursor-pointer"
              >
                <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                <span>查看实时日志</span>
              </button>
              <button
                onClick={() => onOpenTerminal(spotlightProject.hostNode)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors cursor-pointer"
              >
                <span>远程终端</span>
              </button>
            </div>
          </div>

          {/* Specs & Configuration Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="bg-[#080d17] border border-slate-800 rounded-xl p-3.5 space-y-1">
              <div className="text-slate-400 text-[11px] font-mono uppercase">运行环境与宿主机</div>
              <div className="font-bold text-white text-sm">{spotlightProject.environment}</div>
              <div className="font-mono text-cyan-400 text-[11px]">{spotlightProject.hostNode} ({spotlightProject.hostIp})</div>
            </div>

            <div className="bg-[#080d17] border border-slate-800 rounded-xl p-3.5 space-y-1">
              <div className="text-slate-400 text-[11px] font-mono uppercase">容器名与端口映射</div>
              <div className="font-mono font-bold text-white text-sm">{spotlightProject.containerName}</div>
              <div className="font-mono text-emerald-400 text-[11px]">{spotlightProject.portMap} / TCP</div>
            </div>

            <div className="bg-[#080d17] border border-slate-800 rounded-xl p-3.5 space-y-1">
              <div className="text-slate-400 text-[11px] font-mono uppercase">当前镜像与策略</div>
              <div className="font-mono font-bold text-cyan-300 text-sm">{spotlightProject.version}</div>
              <div className="text-slate-300 text-[11px]">{spotlightProject.deployStrategy}</div>
            </div>

            <div className="bg-[#080d17] border border-slate-800 rounded-xl p-3.5 space-y-1">
              <div className="text-slate-400 text-[11px] font-mono uppercase">代码仓库与分支</div>
              <div className="font-mono font-bold text-white text-sm flex items-center gap-1">
                <GitBranch className="w-3.5 h-3.5 text-cyan-400" />
                {spotlightProject.gitBranch} @ {spotlightProject.gitCommit}
              </div>
              <div className="font-mono text-slate-400 text-[11px] truncate">{spotlightProject.gitRepoUrl}</div>
            </div>
          </div>

          {/* Injected Env & Health Probe Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-1">
            <div className="bg-[#080d17] border border-slate-800 rounded-xl p-3.5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-medium">服务环境变量 ({spotlightProject.envVars.length} 项)</span>
                <span className="text-emerald-400 font-mono text-[11px]">已校验生效</span>
              </div>
              <div className="space-y-1 font-mono text-[11px]">
                {spotlightProject.envVars.map(ev => (
                  <div key={ev.key} className="flex justify-between text-slate-300">
                    <span className="text-slate-500">{ev.key}:</span>
                    <span className={ev.encrypted ? 'text-cyan-400' : 'text-slate-200'}>
                      {ev.encrypted ? '************ (Encrypted)' : ev.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#080d17] border border-slate-800 rounded-xl p-3.5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-medium">健康检查与指标探针</span>
                <span className="text-cyan-400 font-mono text-[11px]">HTTP GET 200 OK</span>
              </div>
              <div className="space-y-1 font-mono text-[11px] text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-500">探活路径:</span>
                  <span>{spotlightProject.healthCheck.path}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">探测频率 / 超时:</span>
                  <span>{spotlightProject.healthCheck.interval} (超时: {spotlightProject.healthCheck.timeout})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">资源负载:</span>
                  <span className="text-emerald-400">CPU {spotlightProject.cpuUsage}% | 内存 {spotlightProject.memoryUsage}% (192 MB)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Grid of Other Projects */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
          <span>全部纳管项目列表</span>
          <span className="text-xs text-slate-400 font-normal font-mono">({filteredProjects.length})</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredProjects.map((p) => {
            const isError = p.status === 'Stopped';
            const isSpotlight = p.name === spotlightProjectName;

            return (
              <div
                key={p.id}
                onClick={() => setSpotlightProjectName(p.name)}
                className={`bg-[#0e1626] border rounded-xl p-4.5 space-y-3 cursor-pointer transition-all ${
                  isSpotlight 
                    ? 'border-cyan-500 shadow-md shadow-cyan-500/10' 
                    : isError
                    ? 'border-red-900/50 hover:border-red-600/70'
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-base">{p.name}</span>
                      <span className="px-2 py-0.2 rounded text-[10px] font-mono bg-slate-900 border border-slate-800 text-cyan-300">
                        {p.techStack}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 font-mono mt-1">
                      {p.environment} · {p.hostNode} ({p.portMap})
                    </div>
                  </div>

                  <span className={`px-2 py-0.5 rounded-full text-xs font-mono font-medium ${
                    isError 
                      ? 'bg-red-950/70 border border-red-500/40 text-red-400' 
                      : 'bg-emerald-950/70 border border-emerald-500/40 text-emerald-400'
                  }`}>
                    {p.statusDetail || p.status}
                  </span>
                </div>

                <div className="text-xs text-slate-300 font-mono bg-[#080d17] p-2.5 rounded-lg border border-slate-800/80 flex items-center justify-between">
                  <span className="text-slate-400">{p.gitBranch} @ {p.gitCommit}</span>
                  <span className="text-cyan-400 font-semibold">{p.version}</span>
                </div>

                <div className="flex items-center justify-between pt-1 text-xs">
                  <span className="text-slate-400 text-[11px]">更新时间: {p.updatedAt}</span>
                  <div className="flex items-center gap-2">
                    {isError ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onTriggerRollback(p.name);
                        }}
                        className="px-2.5 py-1 rounded bg-red-900/40 hover:bg-red-900/70 text-red-200 border border-red-600/40 text-xs font-medium transition-colors"
                      >
                        故障回滚
                      </button>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenDeployModal();
                        }}
                        className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
                      >
                        一键部署
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
