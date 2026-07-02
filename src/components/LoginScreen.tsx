import { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';

interface Props {
  onConnect: (url: string, secret: string, authMode: string, clientId?: string) => void;
  error?: string | null;
  isConnecting?: boolean;
}

export function LoginScreen({ onConnect, error, isConnecting }: Props) {
  const [staffId, setStaffId] = useState('');

  const staffIdTrimmed = staffId.trim();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!staffIdTrimmed) return;

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.host;
    const institutionalWsUrl = `${protocol}//${host}/live/${staffIdTrimmed.toLowerCase()}`;
    const dummyToken = 'institutional_placeholder';

    onConnect(institutionalWsUrl, dummyToken, 'token');
  };

  return (
    <div className="h-dvh flex items-center justify-center bg-[var(--pc-bg-base)] text-pc-text bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.02),transparent_50%),radial-gradient(ellipse_at_bottom_right,rgba(99,102,241,0.04),transparent_50%)]">
      <div className="w-full max-w-md mx-4">
        {/* Logo */}
        <div className="flex flex-col items-center gap-3 mb-8">
          <img src="/logo.png" alt="PinchChat" className="h-20 w-20 drop-shadow-lg" />
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-pc-text tracking-wide">内部 AI 矩阵终端登入</h1>
            <Sparkles className="h-5 w-5 text-pc-accent-light/60" />
          </div>
          <p className="text-sm text-pc-text-muted">PinchChat 企业内网通道</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="rounded-2xl border border-pc-border bg-[var(--pc-bg-surface)]/80 backdrop-blur-xl p-6 space-y-5 shadow-2xl shadow-black/30">
          <div className="space-y-2">
            <label htmlFor="staff-id" className="block text-xs font-medium text-pc-text-secondary uppercase tracking-wider">
              员工拼音账号 (Staff ID)
            </label>
            <input
              id="staff-id"
              type="text"
              value={staffId}
              onChange={e => setStaffId(e.target.value)}
              placeholder="请输入账号（例：wangwei）"
              className="w-full rounded-xl border border-pc-border bg-pc-elevated/50 px-4 py-3 text-sm text-pc-text placeholder:text-pc-text-faint outline-none focus:border-[var(--pc-accent-dim)] focus:ring-1 focus:ring-[var(--pc-accent-glow)] transition-all"
              autoComplete="username"
              disabled={isConnecting}
            />
          </div>

          {error && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={!staffIdTrimmed || isConnecting}
            className="w-full rounded-xl bg-gradient-to-r from-cyan-500 to-violet-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30 hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            aria-label={isConnecting ? '登入中…' : '登入'}
          >
            {isConnecting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                登入中…
              </>
            ) : (
              '登入'
            )}
          </button>
        </form>

        <p className="text-center text-xs text-pc-text-faint mt-6">
          通过动态内网路由自动连接，无需手动配置网关
        </p>
      </div>
    </div>
  );
}
