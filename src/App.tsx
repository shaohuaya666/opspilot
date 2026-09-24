import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { AlertBanner } from './components/AlertBanner';
import { OverviewView } from './components/OverviewView';
import { ProjectsView } from './components/ProjectsView';
import { DeploymentsView } from './components/DeploymentsView';
import { ServersView } from './components/ServersView';
import { VersionsView } from './components/VersionsView';
import { ContainersView } from './components/ContainersView';
import { LogsView } from './components/LogsView';
import { SettingsView } from './components/SettingsView';

import { RollbackModal } from './components/RollbackModal';
import { TerminalModal } from './components/TerminalModal';
import { CommandPalette } from './components/CommandPalette';
import { NewProjectModal } from './components/NewProjectModal';
import { NewServerModal } from './components/NewServerModal';
import { DeployModal } from './components/DeployModal';
import { QuickDocsModal } from './components/QuickDocsModal';

import { 
  initialProjects, 
  initialServers, 
  initialDeployments, 
  initialVersions 
} from './data/mockData';
import { NavTab, Project, ServerNode, DeploymentRecord, VersionArtifact } from './types';
import { CheckCircle2 } from 'lucide-react';

export function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>('overview');
  const [currentEnv, setCurrentEnv] = useState<string>('全局生产与开发环境');
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [servers, setServers] = useState<ServerNode[]>(initialServers);
  const [deployments, setDeployments] = useState<DeploymentRecord[]>(initialDeployments);
  const [versions, setVersions] = useState<VersionArtifact[]>(initialVersions);

  // 告警横幅与未处理告警数量
  const [alertBannerVisible, setAlertBannerVisible] = useState<boolean>(true);
  const [unresolvedAlertCount, setUnresolvedAlertCount] = useState<number>(1);

  // 各类弹窗开关
  const [isRollbackOpen, setIsRollbackOpen] = useState(false);
  const [rollbackProject, setRollbackProject] = useState<Project | null>(null);
  const [rollbackVersion, setRollbackVersion] = useState<VersionArtifact | null>(null);

  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [terminalTitle, setTerminalTitle] = useState('远程终端控制台 - 运维平台@192.168.1.120');

  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isNewProjectOpen, setIsNewProjectOpen] = useState(false);
  const [isNewServerOpen, setIsNewServerOpen] = useState(false);
  const [isDeployModalOpen, setIsDeployModalOpen] = useState(false);
  const [isQuickDocsOpen, setIsQuickDocsOpen] = useState(false);

  // 全局操作提示
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // 触发版本回滚流程
  const handleOpenRollback = (targetProjNameOrVer?: string | VersionArtifact) => {
    if (typeof targetProjNameOrVer === 'object' && targetProjNameOrVer !== null) {
      const ver = targetProjNameOrVer as VersionArtifact;
      const proj = projects.find(p => p.name === ver.projectName) || projects[0];
      setRollbackProject(proj);
      setRollbackVersion(ver);
    } else {
      const projName = typeof targetProjNameOrVer === 'string' ? targetProjNameOrVer : '订单系统';
      const proj = projects.find(p => p.name === projName) || projects[0];
      const targetVer = versions.find(v => v.projectName === proj.name && !v.isCurrentRunning) || versions[1];
      setRollbackProject(proj);
      setRollbackVersion(targetVer);
    }
    setIsRollbackOpen(true);
  };

  const handleExecuteRollback = (reason: string) => {
    if (rollbackProject && rollbackVersion) {
      // 1. 将目标工程切换至回滚版本，并置为运行中状态
      setProjects(prev => prev.map(p => {
        if (p.id === rollbackProject.id) {
          return {
            ...p,
            status: '运行中',
            statusDetail: '运行中 (已回滚)',
            version: rollbackVersion.version,
            gitCommit: rollbackVersion.commit,
            gitMessage: rollbackVersion.commitMessage,
            updatedAt: '刚刚 (已回滚)',
            updatedBy: '管理员'
          };
        }
        return p;
      }));

      // 2. 新增一条回滚部署记录
      const newDep: DeploymentRecord = {
        id: `dep-${Math.floor(10000 + Math.random() * 90000)}`,
        projectName: rollbackProject.name,
        techStack: rollbackProject.techStack.split('/')[0].trim(),
        version: rollbackVersion.version,
        targetNode: rollbackProject.hostNode,
        gitBranch: rollbackProject.gitBranch,
        gitCommit: rollbackVersion.commit,
        duration: '4s',
        status: '成功',
        deployedAt: '刚刚 (回滚)'
      };
      setDeployments(prev => [newDep, ...prev]);

      // 3. 清除严重告警
      setUnresolvedAlertCount(0);
      setAlertBannerVisible(false);

      showToast(`已成功将 ${rollbackProject.name} 极速回滚至 ${rollbackVersion.version}，服务健康探测 200 OK！`);
    }
  };

  const handleOpenTerminal = (nodeName: string = '生产服务器') => {
    const node = servers.find(s => s.name === nodeName) || servers[0];
    setTerminalTitle(`远程终端控制台 - root@${node.internalIp}:${node.port} (${node.name})`);
    setIsTerminalOpen(true);
  };

  const handleAddProject = (newProjData: Partial<Project>) => {
    const newProj: Project = {
      id: `proj-${Date.now()}`,
      name: newProjData.name || '新建服务',
      techStack: newProjData.techStack || '.NET 8 (C#)',
      framework: newProjData.framework || '.NET 8 / C#',
      environment: newProjData.environment || '生产环境',
      hostNode: newProjData.hostNode || '生产服务器',
      hostIp: newProjData.hostIp || '192.168.1.120',
      containerName: newProjData.containerName || '新应用容器',
      portMap: newProjData.portMap || '8080:8080',
      status: '运行中',
      statusDetail: '运行中',
      version: 'v20260905.001',
      gitBranch: newProjData.gitBranch || '主干',
      gitCommit: newProjData.gitCommit || '8a72f31',
      gitMessage: '新功能：初始化微服务并接入 OpsPilot',
      gitRepoUrl: newProjData.gitRepoUrl || 'https://github.com/myteam/new-service.git',
      dockerfilePath: './Dockerfile',
      imageTag: `registry.local/${newProjData.name?.toLowerCase()}:v20260905.001`,
      deployStrategy: '停机热替',
      cpuUsage: 4,
      memoryUsage: 14,
      updatedAt: '刚刚',
      updatedBy: '管理员',
      envVars: newProjData.envVars || [{ key: 'ENVIRONMENT', value: '生产' }],
      healthCheck: { path: '/health', interval: '10s', timeout: '3s', retries: 3 }
    };
    setProjects(prev => [newProj, ...prev]);
    showToast(`工程 [${newProj.name}] 已成功纳入 OpsPilot 持续部署集群！`);
  };

  const handleAddServer = (newServerData: Partial<ServerNode>) => {
    const newServer: ServerNode = {
      id: `srv-${Date.now()}`,
      name: newServerData.name || '新节点',
      role: newServerData.role || '开发测试',
      status: '在线',
      internalIp: newServerData.internalIp || '192.168.1.150',
      port: newServerData.port || 22,
      os: newServerData.os || 'Ubuntu 22.04 LTS (x86_64)',
      dockerVersion: 'Docker 24.0.7 运行中 (接口 1.43)',
      cpuCores: '4 核 / AMD 霄龙 2.8GHz',
      cpuLoad: 12,
      memoryUsed: 1.8,
      memoryTotal: 8.0,
      memoryPercent: 22,
      storageUsed: 18.0,
      storageTotal: 100.0,
      storagePercent: 18,
      runningContainersCount: 0,
      containers: [],
      sshKeyMode: 'ed25519 [已加密保护: ****************]',
      hostUuid: `srv-node-${Math.random().toString(16).substring(2, 8)}`
    };
    setServers(prev => [...prev, newServer]);
    showToast(`宿主机节点 [${newServer.name} (${newServer.internalIp})] SSH 验证通过，已接入网格！`);
  };

  const handleTriggerDeploy = (projectName: string, branch: string) => {
    const proj = projects.find(p => p.name === projectName);
    if (!proj) return;

    setCurrentTab('deployments');
    showToast(`流水线任务已下发！正在对 [${projectName}] (${branch} 分支) 执行 12 步自动化部署...`);
  };

  return (
    <div className="flex bg-[#0b101b] text-slate-100 min-h-screen font-sans antialiased selection:bg-cyan-500 selection:text-black">
      {/* 左侧导航栏 */}
      <Sidebar 
        currentTab={currentTab} 
        onSelectTab={setCurrentTab} 
        onOpenQuickDocs={() => setIsQuickDocsOpen(true)}
      />

      {/* 右侧主内容区 */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* 顶部固定头栏 */}
        <Header 
          currentEnv={currentEnv}
          onEnvChange={setCurrentEnv}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
          onOpenAlertDetails={() => handleOpenRollback('订单系统')}
          unresolvedAlertCount={unresolvedAlertCount}
        />

        {/* 可滚动视图内容 */}
        <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
          {/* 严重告警横幅（存在未处理告警时展示） */}
          {alertBannerVisible && unresolvedAlertCount > 0 && (
            <AlertBanner 
              onOpenDiagnosticLogs={() => {
                setCurrentTab('logs');
              }}
              onTriggerRollback={() => handleOpenRollback('订单系统')}
              onDismiss={() => setAlertBannerVisible(false)}
            />
          )}

          {/* 视图切换动画 */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTab}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.16 }}
            >
              {currentTab === 'overview' && (
                <OverviewView 
                  projects={projects}
                  servers={servers}
                  deployments={deployments}
                  onNavigate={setCurrentTab}
                  onOpenNewProject={() => setIsNewProjectOpen(true)}
                  onOpenNewServer={() => setIsNewServerOpen(true)}
                  onOpenDeployModal={() => setIsDeployModalOpen(true)}
                  onOpenTerminal={handleOpenTerminal}
                  onTriggerRollback={(name) => handleOpenRollback(name)}
                  onViewLogs={(rec) => {
                    setCurrentTab('deployments');
                  }}
                />
              )}

              {currentTab === 'projects' && (
                <ProjectsView 
                  projects={projects}
                  onOpenNewProject={() => setIsNewProjectOpen(true)}
                  onOpenDeployModal={() => setIsDeployModalOpen(true)}
                  onOpenTerminal={handleOpenTerminal}
                  onTriggerRollback={(name) => handleOpenRollback(name)}
                  onNavigate={setCurrentTab}
                />
              )}

              {currentTab === 'deployments' && (
                <DeploymentsView 
                  onOpenNewDeployModal={() => setIsDeployModalOpen(true)}
                />
              )}

              {currentTab === 'servers' && (
                <ServersView 
                  servers={servers}
                  onOpenNewServer={() => setIsNewServerOpen(true)}
                  onOpenTerminal={handleOpenTerminal}
                  onNavigate={setCurrentTab}
                />
              )}

              {currentTab === 'versions' && (
                <VersionsView 
                  versions={versions}
                  projects={projects}
                  onTriggerRollback={(ver) => handleOpenRollback(ver)}
                  onOpenNewDeployModal={() => setIsDeployModalOpen(true)}
                />
              )}

              {currentTab === 'containers' && (
                <ContainersView 
                  onOpenTerminal={handleOpenTerminal}
                />
              )}

              {currentTab === 'logs' && (
                <LogsView />
              )}

              {currentTab === 'settings' && (
                <SettingsView />
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* 全局弹窗与浮层 */}
      <RollbackModal 
        isOpen={isRollbackOpen}
        onClose={() => setIsRollbackOpen(false)}
        onConfirmRollback={handleExecuteRollback}
        targetProject={rollbackProject}
        targetVersion={rollbackVersion}
      />

      <TerminalModal 
        isOpen={isTerminalOpen}
        onClose={() => setIsTerminalOpen(false)}
        title={terminalTitle}
      />

      <CommandPalette 
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onNavigate={setCurrentTab}
        onSelectProject={(proj) => {
          setCurrentTab('projects');
        }}
        onTriggerRollback={() => handleOpenRollback('订单系统')}
        onOpenTerminal={() => handleOpenTerminal('生产服务器')}
      />

      <NewProjectModal 
        isOpen={isNewProjectOpen}
        onClose={() => setIsNewProjectOpen(false)}
        onAddProject={handleAddProject}
      />

      <NewServerModal 
        isOpen={isNewServerOpen}
        onClose={() => setIsNewServerOpen(false)}
        onAddServer={handleAddServer}
      />

      <DeployModal 
        isOpen={isDeployModalOpen}
        onClose={() => setIsDeployModalOpen(false)}
        projects={projects}
        onTriggerDeploy={handleTriggerDeploy}
      />

      <QuickDocsModal 
        isOpen={isQuickDocsOpen}
        onClose={() => setIsQuickDocsOpen(false)}
      />

      {/* 操作结果轻提示 */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 bg-[#0d1627] border border-cyan-500/60 rounded-xl shadow-2xl text-xs text-white font-medium animate-in slide-in-from-bottom-3">
          <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
export default App;
