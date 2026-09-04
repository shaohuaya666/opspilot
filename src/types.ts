export type NavTab = 
  | 'overview' 
  | 'projects' 
  | 'deployments' 
  | 'servers' 
  | 'versions' 
  | 'containers' 
  | 'logs' 
  | 'settings';

export type Environment = 'Production' | 'Dev' | 'Test';

export type ServiceStatus = 'Running' | 'Stopped' | 'Warning' | 'Building' | 'Deploying';

export interface Project {
  id: string;
  name: string;
  techStack: string;
  framework: string;
  environment: Environment;
  hostNode: string;
  hostIp: string;
  containerName: string;
  portMap: string;
  status: ServiceStatus;
  statusDetail?: string;
  version: string;
  gitBranch: string;
  gitCommit: string;
  gitMessage: string;
  gitRepoUrl: string;
  dockerfilePath: string;
  imageTag: string;
  deployStrategy: string;
  cpuUsage: number;
  memoryUsage: number;
  updatedAt: string;
  updatedBy: string;
  isCurrentSpotlight?: boolean;
  envVars: { key: string; value: string; encrypted?: boolean }[];
  healthCheck: {
    path: string;
    interval: string;
    timeout: string;
    retries: number;
  };
}

export interface ServerNode {
  id: string;
  name: string;
  role: '核心生产节点' | '开发测试' | '预发布环境';
  isDefault?: boolean;
  status: 'ONLINE' | 'OFFLINE' | 'WARNING';
  internalIp: string;
  publicIp?: string;
  port: number;
  os: string;
  dockerVersion: string;
  cpuCores: string;
  cpuLoad: number;
  memoryUsed: number;
  memoryTotal: number;
  memoryPercent: number;
  storageUsed: number;
  storageTotal: number;
  storagePercent: number;
  runningContainersCount: number;
  containers: string[];
  sshKeyMode: string;
  hostUuid: string;
}

export interface DeploymentRecord {
  id: string;
  projectName: string;
  techStack: string;
  version: string;
  targetNode: string;
  gitBranch: string;
  gitCommit: string;
  duration: string;
  status: '成功' | '失败' | '执行中';
  deployedAt: string;
  errorDetail?: string;
}

export interface PipelineStep {
  stepNumber: number;
  name: string;
  duration: string;
  status: 'completed' | 'running' | 'pending' | 'failed';
}

export interface LogLine {
  id: string;
  timestamp: string;
  level: 'INFO' | 'SUCCESS' | 'BUILD' | 'RUNNING' | 'WARN' | 'ERROR';
  tag: string;
  message: string;
}

export interface VersionArtifact {
  id: string;
  version: string;
  commit: string;
  commitMessage: string;
  buildTime: string;
  author: string;
  imageTag: string;
  imageSize: string;
  isCurrentRunning?: boolean;
  environment: Environment;
  projectName: string;
  targetHost: string;
}

export interface ContainerInfo {
  id: string;
  name: string;
  image: string;
  node: string;
  status: 'Up' | 'Exited' | 'Restarting';
  ports: string;
  cpu: string;
  memory: string;
  uptime: string;
}
