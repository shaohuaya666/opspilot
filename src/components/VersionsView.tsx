import React, { useState } from 'react';
import { 
  GitBranch, 
  RotateCcw, 
  Download, 
  FileText, 
  Trash2, 
  CheckCircle2, 
  AlertTriangle, 
  Layers, 
  Search, 
  Filter, 
  HardDrive, 
  Plus
} from 'lucide-react';
import { VersionArtifact, Project } from '../types';

interface VersionsViewProps {
  versions: VersionArtifact[];
  projects: Project[];
  onTriggerRollback: (version: VersionArtifact) => void;
  onOpenNewDeployModal: () => void;
}

export const VersionsView: React.FC<VersionsViewProps> = ({
  versions,
  projects,
  onTriggerRollback,
  onOpenNewDeployModal
}) => {
  const [selectedProject, setSelectedProject] = useState('全部');
  const [selectedEnv, setSelectedEnv] = useState('全部');
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = versions.filter(v => {
    if (selectedProject !== '全部' && v.projectName !== selectedProject) return false;
    if (selectedEnv !== '全部' && v.environment !== selectedEnv) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        v.version.toLowerCase().includes(q) ||
        v.commit.toLowerCase().includes(q) ||
        v.commitMessage.toLowerCase().includes(q) ||
        v.projectName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div id="versions-view" className="space-y-6">
      {/* 标题与操作栏 */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
            <span>工程生命周期</span>
            <span>/</span>
            <span className="text-cyan-400 font-bold">镜像制品库</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
            版本管理 · 发布制品库
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            跨环境多版本镜像溯源、极速版本回滚与 Docker 仓库镜像归档管理
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenNewDeployModal}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-all shadow-md shadow-cyan-500/20 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>构建新版本</span>
          </button>
        </div>
      </div>

      {/* 统计卡片区 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#0e1626] border border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="text-xs text-slate-400 font-medium">镜像制品总数</div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-white">18</span>
            <span className="text-xs text-cyan-400 font-mono">已归档保存</span>
          </div>
        </div>

        <div className="bg-[#0e1626] border border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="text-xs text-slate-400 font-medium">活跃运行版本</div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-emerald-400">5</span>
            <span className="text-xs text-emerald-400/80 font-mono">5 个集群微服务</span>
          </div>
        </div>

        <div className="bg-[#0e1626] border border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="text-xs text-slate-400 font-medium">平均制品存储体积</div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-white">224 MB</span>
            <span className="text-xs text-slate-400 font-mono">分层缓存复用率 84%</span>
          </div>
        </div>
      </div>

      {/* 筛选栏 */}
      <div className="bg-[#0e1626] border border-slate-800 rounded-xl p-3 flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3 w-full md:w-auto flex-wrap">
          {/* 所属项目筛选 */}
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-medium">所属项目:</span>
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="bg-[#080d17] border border-slate-700 rounded-lg px-2.5 py-1.5 text-white outline-none focus:border-cyan-500 font-medium"
            >
              <option value="全部">全部项目</option>
              {projects.map(p => (
                <option key={p.id} value={p.name}>{p.name} ({p.techStack})</option>
              ))}
            </select>
          </div>

          {/* 运行环境筛选 */}
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-medium">运行环境:</span>
            <select
              value={selectedEnv}
              onChange={(e) => setSelectedEnv(e.target.value)}
              className="bg-[#080d17] border border-slate-700 rounded-lg px-2.5 py-1.5 text-white outline-none focus:border-cyan-500 font-medium"
            >
              <option value="全部">全部环境</option>
              <option value="生产环境">生产环境</option>
              <option value="开发环境">开发环境</option>
              <option value="测试环境">测试环境</option>
            </select>
          </div>
        </div>

        {/* 搜索输入框 */}
        <div className="relative w-full md:w-64">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="搜索版本号、提交号或变更说明..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#080d17] border border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-white placeholder-slate-500 outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      {/* 版本制品表格 */}
      <div className="bg-[#0e1626] border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0a0f1c] text-slate-400 font-mono text-[11px] border-b border-slate-800">
              <tr>
                <th className="px-4 py-3 font-semibold">版本号 / 制品标签</th>
                <th className="px-4 py-3 font-semibold">关联 GIT 提交</th>
                <th className="px-4 py-3 font-semibold">构建时间 / 发布人</th>
                <th className="px-4 py-3 font-semibold">镜像体积</th>
                <th className="px-4 py-3 font-semibold">部署环境 / 宿主机</th>
                <th className="px-4 py-3 font-semibold">运行状态</th>
                <th className="px-4 py-3 font-semibold text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70">
              {filtered.map((ver) => {
                const isRunning = ver.isCurrentRunning;
                const isError = ver.projectName === '订单系统' && ver.isCurrentRunning;

                return (
                  <tr key={ver.id} className="hover:bg-slate-800/40 transition-colors">
                    {/* 版本号与制品标签 */}
                    <td className="px-4 py-3.5">
                      <div className="font-bold text-white font-mono flex items-center gap-2">
                        <span>{ver.version}</span>
                        <span className="text-[11px] font-sans font-medium px-1.5 py-0.2 rounded bg-slate-900 border border-slate-800 text-cyan-300">
                          {ver.projectName}
                        </span>
                      </div>
                      <div className="font-mono text-[11px] text-slate-400 mt-0.5 truncate max-w-xs">
                        {ver.imageTag}
                      </div>
                    </td>

                    {/* 关联代码提交 */}
                    <td className="px-4 py-3.5">
                      <div className="font-mono text-cyan-400 font-semibold flex items-center gap-1.5">
                        <GitBranch className="w-3.5 h-3.5" />
                        <span>{ver.commit}</span>
                      </div>
                      <div className="text-[11px] text-slate-300 mt-0.5 truncate max-w-xs italic">
                        "{ver.commitMessage}"
                      </div>
                    </td>

                    {/* 构建时间与发布人 */}
                    <td className="px-4 py-3.5 font-mono text-slate-300">
                      <div>{ver.buildTime}</div>
                      <div className="text-[11px] text-slate-400 font-sans">发布人：{ver.author}</div>
                    </td>

                    {/* 镜像体积 */}
                    <td className="px-4 py-3.5 font-mono text-slate-300">
                      {ver.imageSize}
                    </td>

                    {/* 部署环境与宿主机 */}
                    <td className="px-4 py-3.5">
                      <div className="text-slate-200 font-medium">{ver.targetHost}</div>
                      <div className="text-[11px] font-mono text-slate-400">{ver.environment}</div>
                    </td>

                    {/* 运行状态徽标 */}
                    <td className="px-4 py-3.5">
                      {isRunning ? (
                        isError ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-red-950/60 border border-red-600/40 text-red-400">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse"></span>
                            异常挂起
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-950/60 border border-emerald-600/40 text-emerald-400">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                            当前运行中
                          </span>
                        )
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-800 text-slate-400 border border-slate-700">
                          历史版本
                        </span>
                      )}
                    </td>

                    {/* 操作按钮 */}
                    <td className="px-4 py-3.5 text-right space-x-2">
                      {!isRunning ? (
                        <button
                          id={`rollback-to-${ver.version}`}
                          onClick={() => onTriggerRollback(ver)}
                          className="px-2.5 py-1 rounded bg-red-900/40 hover:bg-red-900/80 text-red-200 border border-red-600/40 text-[11px] font-semibold transition-all cursor-pointer shadow-sm"
                        >
                          极速回滚至此版
                        </button>
                      ) : (
                        <button
                          onClick={onOpenNewDeployModal}
                          className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-[11px] font-medium transition-colors cursor-pointer"
                        >
                          重新分发
                        </button>
                      )}
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
