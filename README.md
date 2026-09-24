# OpsPilot — 自动化运维与容器编排平台

面向云原生与微服务架构的自动化运维中台前端，集基础设施管理、CI/CD 部署流水线、容器集群监控、版本回滚与实时诊断于一体。

## 功能特性

- **全局总览**：多环境运行状态一览，关键告警提醒与资源健康监控
- **项目管理**：在研服务全生命周期管理，状态、版本、健康检查实时跟踪
- **部署流水线**：自动化部署流程可视化，支持一键触发部署
- **版本回滚**：历史版本制品追溯，极速回滚并自动生成回滚记录
- **服务器监控**：宿主机节点资源占用（CPU / 内存 / 存储）与 Docker 环境实时查看
- **容器管理**：容器运行状态、端口映射与资源使用情况监控
- **实时日志**：部署过程日志流与错误诊断查看
- **远程终端**：SSH Web 终端模拟，便捷登录各节点
- **命令面板**：`Ctrl/⌘ + K` 快速导航与常用操作

## 技术栈

| 类别 | 选型 |
| ---- | ---- |
| 框架 | React 19 |
| 语言 | TypeScript |
| 构建 | Vite 6 |
| 样式 | Tailwind CSS 4 |
| 动画 | Motion |
| 图标 | Lucide Icons |

## 目录结构

```
opspilot/
├── index.html              # 入口 HTML
├── src/
│   ├── main.tsx            # 应用入口
│   ├── App.tsx             # 主应用（路由视图编排）
│   ├── types.ts            # TypeScript 类型定义
│   ├── index.css           # 全局样式（Tailwind）
│   ├── data/
│   │   └── mockData.ts     # 模拟数据
│   └── components/         # 页面视图与弹窗组件
│       ├── OverviewView.tsx       # 总览视图
│       ├── ProjectsView.tsx       # 项目管理
│       ├── DeploymentsView.tsx    # 部署流水线
│       ├── ServersView.tsx        # 服务器监控
│       ├── ContainersView.tsx     # 容器管理
│       ├── VersionsView.tsx       # 版本回滚
│       ├── LogsView.tsx           # 实时日志
│       └── ...                    # 其余视图与弹窗组件（均已中文化）
└── vite.config.ts         # Vite 配置
```

## 本地运行

**环境要求：** Node.js 18+（推荐 20+）

```bash
# 1. 安装依赖
npm install

# 2. 启动开发服务器（默认 http://localhost:3000）
npm run dev
```

## 构建与预览

```bash
# 生产构建，产物输出到 dist/
npm run build

# 本地预览构建产物
npm run preview
```

## 代码检查

```bash
npm run lint
```
