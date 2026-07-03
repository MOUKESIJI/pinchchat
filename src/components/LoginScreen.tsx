import { useState } from 'react';
import { ChangePassword } from './ChangePassword';
import { Sparkles, Loader2 } from 'lucide-react';

interface Props {
  onConnect: (url: string, secret: string, authMode?: string, clientId?: string) => void;
  error?: string | null;
  isConnecting?: boolean;
}

export function LoginScreen({ onConnect, error, isConnecting }: Props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [checking, setChecking] = useState(false);
  const [showChangePwd, setShowChangePwd] = useState(false);

  const trimmedUser = username.trim();
  const trimmedPass = password.trim();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trimmedUser || !trimmedPass) return;
    setChecking(true);
    setLoginError(null);

    try {
      const auth = btoa(trimmedUser + ':' + trimmedPass);
      const res = await fetch('/check-auth', {
        headers: { 'Authorization': 'Basic ' + auth },
      });
      const authData = await res.json();
      if (authData.force_change) {
        setShowChangePwd(true);
        return;
      }
      if (res.status === 200) {
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const host = window.location.host;
        const wsUrl = protocol + '//' + host + '/live/' + trimmedUser.toLowerCase();
        // Fetch real token from server
        const tokenRes = await fetch("/get-token?user=" + trimmedUser.toLowerCase());
        const tokenData = await tokenRes.json();
        onConnect(wsUrl, tokenData.token || "institutional_placeholder", "token");
      } else {
        setLoginError('账号或密码错误，请重试');
      }
    } catch {
      setLoginError('无法连接到服务器，请检查网络');
    }
    setChecking(false);
  };

  if (showChangePwd) {
    return <ChangePassword user={trimmedUser} onDone={() => { setShowChangePwd(false); }} />;
  }
  return (
    <div className="h-dvh flex items-center justify-center bg-[var(--pc-bg-base)] text-pc-text bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.02),transparent_50%),radial-gradient(ellipse_at_bottom_right,rgba(99,102,241,0.04),transparent_50%)]">
      <div className="w-full max-w-md mx-4">
        <div className="flex flex-col items-center gap-3 mb-8">
          <img src="/logo.png" alt="显君" className="h-20 w-20 drop-shadow-lg" />
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-pc-text tracking-wide">显君 AI 工作台</h1>
            <Sparkles className="h-5 w-5 text-pc-accent-light/60" />
          </div>
          <p className="text-sm text-pc-text-muted">显君咨询 × AI</p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-2xl border border-pc-border bg-[var(--pc-bg-surface)]/80 backdrop-blur-xl p-6 space-y-5 shadow-2xl shadow-black/30">
          <div className="space-y-2">
            <label htmlFor="username" className="block text-xs font-medium text-pc-text-secondary uppercase tracking-wider">账号</label>
            <input id="username" type="text" value={username} onChange={e => setUsername(e.target.value)}
              placeholder="请输入账号"
              className="w-full rounded-xl border border-pc-border bg-pc-elevated/50 px-4 py-3 text-sm text-pc-text placeholder:text-pc-text-faint outline-none focus:border-[var(--pc-accent-dim)] focus:ring-1 focus:ring-[var(--pc-accent-glow)] transition-all"
              autoComplete="username" disabled={checking} autoFocus />
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="block text-xs font-medium text-pc-text-secondary uppercase tracking-wider">密码</label>
            <input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)}
              placeholder="请输入密码"
              className="w-full rounded-xl border border-pc-border bg-pc-elevated/50 px-4 py-3 text-sm text-pc-text placeholder:text-pc-text-faint outline-none focus:border-[var(--pc-accent-dim)] focus:ring-1 focus:ring-[var(--pc-accent-glow)] transition-all"
              autoComplete="current-password" disabled={checking} />
          </div>
          {(loginError || error) && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-300">
              {loginError || error}
            </div>
          )}
          <button type="submit" disabled={!trimmedUser || !trimmedPass || checking}
            className="w-full rounded-xl bg-gradient-to-r from-cyan-500 to-violet-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30 hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2">
            {checking ? (<><Loader2 size={16} className="animate-spin" />验证中...</>) : '登入'}
          </button>
        </form>
        <p className="text-center text-xs text-pc-text-faint mt-6">显君咨询内部系统</p>
      </div>
    </div>
  );
}
