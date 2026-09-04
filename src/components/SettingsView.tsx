import React, { useState } from 'react';
import { Settings, Shield, Bell, Key, Database, Save, Check } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const [registryUrl, setRegistryUrl] = useState('registry.local');
  const [registryUser, setRegistryUser] = useState('opspilot_admin');
  const [gitProvider, setGitProvider] = useState('GitLab Internal');
  const [webhookUrl, setWebhookUrl] = useState('https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=xxxx-xxxx');
  const [autoRollback, setAutoRollback] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div id="settings-view" className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <div className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
          <span>集群基础设施</span>
          <span>/</span>
          <span className="text-cyan-400 font-bold">系统设置</span>
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
          系统设置 · Global Configuration
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          配置 Docker 镜像仓库鉴权、Git 持续集成触发器、告警推送渠道及自动化回滚策略
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Card 1: Docker 镜像仓库配置 */}
        <div className="bg-[#0e1626] border border-slate-800 rounded-xl p-5 space-y-4 shadow-sm text-xs">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <Database className="w-4 h-4 text-cyan-400" />
            <h2 className="text-sm font-bold text-white">Docker 镜像仓库与私有 Harbor</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-slate-300 font-medium mb-1.5 block">镜像仓库域名 / 地址</label>
              <input
                type="text"
                value={registryUrl}
                onChange={(e) => setRegistryUrl(e.target.value)}
                className="w-full bg-[#080d17] border border-slate-700 rounded-lg px-3 py-2 text-white font-mono outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="text-slate-300 font-medium mb-1.5 block">鉴权账户名称</label>
              <input
                type="text"
                value={registryUser}
                onChange={(e) => setRegistryUser(e.target.value)}
                className="w-full bg-[#080d17] border border-slate-700 rounded-lg px-3 py-2 text-white font-mono outline-none focus:border-cyan-500"
              />
            </div>
          </div>
        </div>

        {/* Card 2: 告警推送与机器人集成 */}
        <div className="bg-[#0e1626] border border-slate-800 rounded-xl p-5 space-y-4 shadow-sm text-xs">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <Bell className="w-4 h-4 text-cyan-400" />
            <h2 className="text-sm font-bold text-white">运维事件告警通道 (Webhook)</h2>
          </div>

          <div>
            <label className="text-slate-300 font-medium mb-1.5 block">企业微信 / 钉钉 / 飞书 机器人 Webhook URL</label>
            <input
              type="text"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              className="w-full bg-[#080d17] border border-slate-700 rounded-lg px-3 py-2 text-white font-mono outline-none focus:border-cyan-500 text-[11px]"
            />
          </div>

          <div className="flex items-center gap-3 pt-1">
            <input
              type="checkbox"
              id="autoRollbackCheckbox"
              checked={autoRollback}
              onChange={(e) => setAutoRollback(e.target.checked)}
              className="rounded bg-slate-900 border-slate-700 text-cyan-500 focus:ring-0 cursor-pointer"
            />
            <label htmlFor="autoRollbackCheckbox" className="text-slate-300 cursor-pointer">
              当健康探测连续 3 次超时失败时，允许系统执行自动安全熔断与极速回滚至上一稳定镜像
            </label>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-between pt-2">
          {saved && (
            <span className="text-emerald-400 text-xs flex items-center gap-1 font-medium animate-in fade-in">
              <Check className="w-4 h-4" /> 配置规约已保存并热加载生效
            </span>
          )}
          <div className="ml-auto">
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-all shadow-md shadow-cyan-500/20 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>保存系统配置</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
