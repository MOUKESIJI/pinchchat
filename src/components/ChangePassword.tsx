import { useState } from 'react';
import { Sparkles, Lock, Check, Loader2 } from 'lucide-react';

interface Props {
  user: string;
  onDone: () => void;
}

export function ChangePassword({ user, onDone }: Props) {
  const [oldPw, setOldPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!oldPw || !newPw || !confirmPw) {
      setError('请填写所有字段');
      return;
    }
    if (newPw.length < 6) {
      setError('新密码至少 6 位');
      return;
    }
    if (newPw !== confirmPw) {
      setError('两次输入的新密码不一致');
      return;
    }
    if (newPw === oldPw) {
      setError('新密码不能与当前密码相同');
      return;
    }

    setBusy(true);
    try {
      const res = await fetch(
        '/change-password?user=' + encodeURIComponent(user) +
        '&old=' + encodeURIComponent(oldPw) +
        '&new=' + encodeURIComponent(newPw) +
        '&change-password=true'
      );
      const data = await res.json();
      if (data.ok) {
        setSuccess(true);
        setTimeout(onDone, 1500);
      } else {
        setError(data.error || '修改失败');
      }
    } catch {
      setError('网络错误');
    }
    setBusy(false);
  };

  if (success) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
        <div className="w-full max-w-sm mx-4 rounded-3xl border border-pc-border bg-[var(--pc-bg-surface)]/95 backdrop-blur-xl p-8 text-center space-y-4">
          <div className="h-16 w-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto">
            <Check size={32} className="text-emerald-400" />
          </div>
          <h2 className="text-lg font-bold text-pc-text">密码已修改</h2>
          <p className="text-sm text-pc-text-muted">请使用新密码重新登录</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-sm mx-4 rounded-3xl border border-pc-border bg-[var(--pc-bg-surface)]/95 backdrop-blur-xl shadow-2xl overflow-hidden">
        <div className="px-6 py-5 border-b border-pc-border flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-cyan-500 to-violet-500 flex items-center justify-center">
            <Lock size={20} className="text-white" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-pc-text">首次登录请修改密码</h2>
            <p className="text-xs text-pc-text-muted">{user}，请设置你的新密码</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-xs font-medium text-pc-text-secondary mb-1">当前密码</label>
            <input type="password" value={oldPw} onChange={e => setOldPw(e.target.value)}
              className="w-full rounded-xl border border-pc-border bg-pc-elevated/50 px-4 py-3 text-sm text-pc-text outline-none focus:border-[var(--pc-accent-dim)] transition-all"
              disabled={busy} autoFocus />
          </div>
          <div>
            <label className="block text-xs font-medium text-pc-text-secondary mb-1">新密码</label>
            <input type="password" value={newPw} onChange={e => setNewPw(e.target.value)}
              className="w-full rounded-xl border border-pc-border bg-pc-elevated/50 px-4 py-3 text-sm text-pc-text outline-none focus:border-[var(--pc-accent-dim)] transition-all"
              disabled={busy} />
          </div>
          <div>
            <label className="block text-xs font-medium text-pc-text-secondary mb-1">确认新密码</label>
            <input type="password" value={confirmPw} onChange={e => setConfirmPw(e.target.value)}
              className="w-full rounded-xl border border-pc-border bg-pc-elevated/50 px-4 py-3 text-sm text-pc-text outline-none focus:border-[var(--pc-accent-dim)] transition-all"
              disabled={busy} />
          </div>

          {error && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-300">{error}</div>
          )}

          <button type="submit" disabled={busy}
            className="w-full rounded-xl bg-gradient-to-r from-cyan-500 to-violet-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 hover:brightness-110 disabled:opacity-40 transition-all flex items-center justify-center gap-2">
            {busy ? <><Loader2 size={16} className="animate-spin" />处理中...</> : '确认修改'}
          </button>
        </form>
      </div>
    </div>
  );
}
