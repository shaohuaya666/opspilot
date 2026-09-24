import React from 'react';
import { 
  Plus, 
  Server, 
  Play, 
  Terminal, 
  ArrowUpRight, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Layers, 
  Activity, 
  Box, 
  ChevronRight,
  Maximize2
} from 'lucide-react';
import { Project, ServerNode, DeploymentRecord, NavTab } from '../types';

interface OverviewViewProps {
  projects: Project[];
  servers: ServerNode[];
  deployments: DeploymentRecord[];
  onNavigate: (tab: NavTab) => void;
  onOpenNewProject: () => void;
  onOpenNewServer: () => void;
  onOpenDeployModal: () => void;
  onOpenTerminal: (nodeName?: string) => void;
  onTriggerRollback: (projectName?: string) => void;
  onViewLogs: (record: DeploymentRecord) => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  projects,
  servers,
  deployments,
  onNavigate,
  onOpenNewProject,
  onOpenNewServer,
  onOpenDeployModal,
  onOpenTerminal,
  onTriggerRollback,
  onViewLogs
}) => {
  return (
    <div id="overview-view" className="space-y-6">
      {/* 页面标题与操作栏 */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
            <span>集群与编排状态</span>
            <span>/</span>
            <span className="text-cyan-400">实时监控</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1 flex items-center gap-2">
            <span>首页概览 · 基础设施编排全景</span>
          </h1>
        </div>

        <div className="flex items-center flex-wrap gap-2.5">
          <button
            id="overview-add-project-btn"
            onClick={onOpenNewProject}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-all shadow-md shadow-cyan-500/20 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>新增项目</span>
          </button>

          <button
            id="overview-connect-server-btn"
            onClick={onOpenNewServer}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#0f172a] hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-medium transition-all cursor-pointer"
          >
            <Server className="w-3.5 h-3.5 text-slate-400" />
            <span>接入服务器</span>
          </button>

          <button
            id="overview-quick-deploy-btn"
            onClick={onOpenDeployModal}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#0f172a] hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-medium transition-all cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400" />
            <span>快速触发部署</span>
          </button>

          <button
            id="overview-quick-terminal-btn"
            onClick={() => onOpenTerminal('生产服务器')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#0f172a] hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-medium transition-all cursor-pointer"
          >
            <Terminal className="w-3.5 h-3.5 text-slate-400" />
            <span>终端快捷连接</span>
          </button>
        </div>
      </div>

      {/* 四个核心指标卡片 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: 项目总数 */}
        <div 
          onClick={() => onNavigate('projects')}
          className="bg-[#0e1626] border border-slate-800/90 hover:border-slate-700 rounded-xl p-4.5 transition-all cursor-pointer group shadow-sm"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>项目总数</span>
            <div className="w-8 h-8 rounded-lg bg-cyan-950/40 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white tracking-tight">12</span>
            <span className="text-xs text-emerald-400 font-medium flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
              +2 环比上月
            </span>
          </div>
          <div className="mt-3 flex items-center gap-1.5 flex-wrap">
            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-900 border border-slate-800 text-slate-400">.NET 8</span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-900 border border-slate-800 text-slate-400">Python</span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-900 border border-slate-800 text-slate-400">Node.js</span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-900 border border-slate-800 text-slate-400">Java</span>
          </div>
        </div>

        {/* Card 2: 纳入服务器节点 */}
        <div 
          onClick={() => onNavigate('servers')}
          className="bg-[#0e1626] border border-slate-800/90 hover:border-slate-700 rounded-xl p-4.5 transition-all cursor-pointer group shadow-sm"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>纳入服务器节点</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Server className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white tracking-tight">3 / 3</span>
            <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              100% 连通
            </span>
          </div>
          <div className="mt-3 text-xs text-slate-400 font-mono">
            开发 · 测试 · 生产
          </div>
        </div>

        {/* Card 3: 运行中服务 */}
        <div 
          onClick={() => onNavigate('containers')}
          className="bg-[#0e1626] border border-slate-800/90 hover:border-slate-700 rounded-xl p-4.5 transition-all cursor-pointer group shadow-sm"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>运行中服务</span>
            <div className="w-8 h-8 rounded-lg bg-blue-950/40 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Box className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white tracking-tight">10</span>
            <span className="text-xs text-emerald-400 font-medium">可用率 98.2%</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs">
            <span className="text-slate-400 font-mono">活跃容器组：14</span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-950/60 border border-emerald-600/40 text-emerald-300">
              服务等级达标
            </span>
          </div>
        </div>

        {/* Card 4: 异常告警服务 */}
        <div 
          onClick={() => onTriggerRollback('订单系统')}
          className="bg-[#0e1626] border border-red-900/40 hover:border-red-600/60 rounded-xl p-4.5 transition-all cursor-pointer group shadow-sm relative overflow-hidden"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>异常告警服务</span>
            <div className="w-8 h-8 rounded-lg bg-red-950/60 border border-red-500/50 flex items-center justify-center text-red-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-red-500 tracking-tight">1</span>
            <span className="text-xs text-red-400 font-medium">需运维介入</span>
          </div>
          <div className="mt-3 text-xs text-slate-300 truncate font-mono">
            <span className="text-red-400 font-semibold">订单系统：</span>容器死锁重启中
          </div>
        </div>
      </div>

      {/* 分区一：服务器状态与资源指标（3 个节点） */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-sm bg-cyan-400 rotate-45"></div>
            <h2 className="text-sm font-bold text-white tracking-tight">
              服务器状态与资源指标（3 个节点）
            </h2>
          </div>
          <div className="text-xs text-slate-400 font-mono">
            指标采样间隔：5 秒 · 网络延迟：2 毫秒
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {servers.map((node) => {
            const memoryBarColor = node.name === '测试服务器' 
              ? 'bg-gradient-to-r from-blue-500 to-indigo-500' 
              : 'bg-gradient-to-r from-cyan-400 to-blue-500';

            return (
              <div 
                key={node.id}
                className="bg-[#0e1626] border border-slate-800 rounded-xl p-4 space-y-4 hover:border-slate-700 transition-colors"
              >
                {/* 节点名称与状态徽标 */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    <span className="font-bold text-sm text-white">{node.name}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950/70 border border-emerald-500/40 text-emerald-400">
                    在线
                  </span>
                </div>

                {/* 网络与系统信息 */}
                <div className="space-y-1 text-xs">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="font-mono text-slate-300">{node.internalIp}</span>
                    <span className="font-mono">端口：{node.port}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>{node.os.split(' ')[0]} {node.os.split(' ')[1]}</span>
                    <span className="text-cyan-400/90 font-mono">Docker 24.0.7</span>
                  </div>
                </div>

                {/* 资源占用进度条 */}
                <div className="space-y-2.5 pt-1 text-xs">
                  {/* 处理器 */}
                  <div>
                    <div className="flex justify-between text-slate-400 mb-1">
                      <span>CPU 负载</span>
                      <span className="font-mono text-slate-200">{node.cpuLoad}%</span>
                    </div>
                    <div className="w-full bg-slate-800/80 rounded-full h-1.5 overflow-hidden">
                      <div 
                        className="bg-cyan-400 h-full rounded-full transition-all duration-500"
                        style={{ width: `${node.cpuLoad}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* 内存 */}
                  <div>
                    <div className="flex justify-between text-slate-400 mb-1">
                      <span>内存占用 ({node.memoryUsed} / {node.memoryTotal} GB)</span>
                      <span className="font-mono text-slate-200">{node.memoryPercent}%</span>
                    </div>
                    <div className="w-full bg-slate-800/80 rounded-full h-1.5 overflow-hidden">
                      <div 
                        className={`${memoryBarColor} h-full rounded-full transition-all duration-500`}
                        style={{ width: `${node.memoryPercent}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* 磁盘 */}
                  <div>
                    <div className="flex justify-between text-slate-400 mb-1">
                      <span>存储空间 ({node.storageUsed} / {node.storageTotal} GB)</span>
                      <span className="font-mono text-slate-200">{node.storagePercent}%</span>
                    </div>
                    <div className="w-full bg-slate-800/80 rounded-full h-1.5 overflow-hidden">
                      <div 
                        className="bg-slate-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${node.storagePercent}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* 卡片底部信息 */}
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <span>运行容器：{node.runningContainersCount}</span>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => onOpenTerminal(node.name)}
                      title="打开远程 SSH 终端"
                      className="p-1 hover:text-cyan-400 text-slate-500 transition-colors cursor-pointer"
                    >
                      <Terminal className="w-3.5 h-3.5" />
                    </button>
                    <button 
                      onClick={() => onNavigate('servers')}
                      title="展开节点详情"
                      className="p-1 hover:text-cyan-400 text-slate-500 transition-colors cursor-pointer"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 分区二：最近部署动态 */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-base">🚀</span>
            <h2 className="text-sm font-bold text-white tracking-tight">
              最近部署动态
            </h2>
          </div>
          <button
            onClick={() => onNavigate('deployments')}
            className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1 font-medium cursor-pointer"
          >
            <span>查看全部历史</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 部署记录表格 */}
        <div className="bg-[#0e1626] border border-slate-800/90 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0a0f1c] text-slate-400 font-mono text-[11px] border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3 font-semibold">项目名称 / 技术栈</th>
                  <th className="px-4 py-3 font-semibold">版本号</th>
                  <th className="px-4 py-3 font-semibold">目标节点</th>
                  <th className="px-4 py-3 font-semibold">GIT 提交</th>
                  <th className="px-4 py-3 font-semibold">耗时</th>
                  <th className="px-4 py-3 font-semibold">流水线状态</th>
                  <th className="px-4 py-3 font-semibold">部署时间</th>
                  <th className="px-4 py-3 font-semibold text-right">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/70">
                {deployments.map((rec) => {
                  const isFailed = rec.status === '失败';

                  return (
                    <tr 
                      key={rec.id}
                      className="hover:bg-slate-800/40 transition-colors group"
                    >
                      {/* 工程名称与技术栈 */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          <span className={`font-bold ${isFailed ? 'text-red-400' : 'text-slate-100'}`}>
                            {rec.projectName}
                          </span>
                          <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-slate-900 border border-slate-800 text-cyan-300">
                            {rec.techStack}
                          </span>
                        </div>
                        {rec.errorDetail && (
                          <div className="text-[11px] text-red-400/90 font-mono mt-0.5">
                            {rec.errorDetail}
                          </div>
                        )}
                      </td>

                      {/* 版本号 */}
                      <td className="px-4 py-3.5 font-mono text-slate-300">
                        {rec.version}
                      </td>

                      {/* 目标节点 */}
                      <td className="px-4 py-3.5 text-slate-300">
                        {rec.targetNode}
                      </td>

                      {/* 代码提交 */}
                      <td className="px-4 py-3.5 font-mono text-slate-300">
                        <span className="text-slate-200">{rec.gitBranch}</span>
                        <span className="text-slate-500 mx-1">/</span>
                        <span className="text-cyan-400">{rec.gitCommit}</span>
                      </td>

                      {/* 耗时 */}
                      <td className="px-4 py-3.5 font-mono text-slate-400">
                        {rec.duration}
                      </td>

                      {/* 流水线状态 */}
                      <td className="px-4 py-3.5">
                        {isFailed ? (
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium bg-red-950/60 border border-red-600/40 text-red-400">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
                            失败
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-950/60 border border-emerald-600/40 text-emerald-400">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                            成功
                          </span>
                        )}
                      </td>

                      {/* 部署时间 */}
                      <td className="px-4 py-3.5 text-slate-400">
                        {rec.deployedAt}
                      </td>

                      {/* 操作按钮 */}
                      <td className="px-4 py-3.5 text-right space-x-2">
                        {isFailed ? (
                          <>
                            <button
                              onClick={() => onViewLogs(rec)}
                              className="px-2.5 py-1 rounded bg-red-900/40 hover:bg-red-900/70 text-red-200 border border-red-600/40 text-[11px] font-medium transition-colors cursor-pointer"
                            >
                              错误日志
                            </button>
                            <button
                              onClick={() => onTriggerRollback(rec.projectName)}
                              className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-[11px] font-medium transition-colors cursor-pointer"
                            >
                              回滚至上版
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => onViewLogs(rec)}
                              className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-[11px] font-medium transition-colors cursor-pointer"
                            >
                              查看日志
                            </button>
                            <button
                              onClick={onOpenDeployModal}
                              className="px-2.5 py-1 rounded bg-cyan-950/40 hover:bg-cyan-900/60 text-cyan-300 border border-cyan-500/30 text-[11px] font-medium transition-colors cursor-pointer"
                            >
                              重新部署
                            </button>
                          </>
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
    </div>
  );
};
