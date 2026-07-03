import { useState, useEffect } from 'react';
import { Sparkles, Bot, Check } from 'lucide-react';

const ONBOARDING_KEY = 'xianjun_onboarding';

export interface OnboardingData {
  personality: string;
  customPersonality?: string;
}

export function getOnboarding(): OnboardingData | null {
  try {
    const raw = localStorage.getItem(ONBOARDING_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

export function saveOnboarding(data: OnboardingData) {
  localStorage.setItem(ONBOARDING_KEY, JSON.stringify(data));
}

const PRESETS = [
  { id: 'consultant', label: '咨询顾问', desc: '专业严谨，逻辑清晰，擅长分析问题并提供可落地的建议' },
  { id: 'analyst', label: '分析师', desc: '数据驱动，善于拆解复杂信息，以结构化方式呈现洞察' },
  { id: 'assistant', label: '助理', desc: '高效务实，执行力强，注重细节和效率' },
  { id: 'custom', label: '自定义', desc: '按你的想法定义 AI 的性格和表达方式' },
];

interface Props {
  onComplete: (data: OnboardingData) => void;
}

export function OnboardingWizard({ onComplete }: Props) {
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<string>('consultant');
  const [customText, setCustomText] = useState('');

  const handleFinish = () => {
    const data: OnboardingData = {
      personality: selected,
      ...(selected === 'custom' ? { customPersonality: customText } : {}),
    };
    saveOnboarding(data);
    onComplete(data);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg mx-4 rounded-3xl border border-pc-border bg-[var(--pc-bg-surface)]/95 backdrop-blur-xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-pc-border flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-cyan-500 to-violet-500 flex items-center justify-center">
            <Sparkles size={20} className="text-white" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-pc-text">欢迎来到显君 AI 工作台</h2>
            <p className="text-xs text-pc-text-muted">先设定你的 AI 助手人格</p>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-3">
          <p className="text-xs text-pc-text-secondary mb-1">选择你希望 AI 助手以什么风格与你协作：</p>
          
          {PRESETS.map(p => (
            <button
              key={p.id}
              onClick={() => { setSelected(p.id); setStep(1); }}
              className={`w-full text-left rounded-xl border p-4 transition-all ${
                selected === p.id && step >= 1
                  ? 'border-cyan-500/50 bg-cyan-500/5 shadow-[0_0_20px_rgba(6,182,212,0.08)]'
                  : 'border-pc-border hover:border-pc-border/80 hover:bg-[var(--pc-hover)]'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bot size={18} className="text-pc-accent-light/70" />
                  <span className="text-sm font-medium text-pc-text">{p.label}</span>
                </div>
                {selected === p.id && step >= 1 && (
                  <Check size={16} className="text-cyan-400" />
                )}
              </div>
              <p className="text-xs text-pc-text-muted mt-1 ml-9">{p.desc}</p>
            </button>
          ))}

          {selected === 'custom' && step >= 1 && (
            <textarea
              value={customText}
              onChange={e => setCustomText(e.target.value)}
              placeholder="例如：专业但不死板，能用通俗语言解释复杂问题…"
              className="w-full rounded-xl border border-pc-border bg-pc-elevated/50 px-4 py-3 text-sm text-pc-text placeholder:text-pc-text-faint outline-none focus:border-[var(--pc-accent-dim)] focus:ring-1 focus:ring-[var(--pc-accent-glow)] transition-all mt-2"
              rows={3}
            />
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-pc-border flex items-center justify-between">
          <p className="text-[10px] text-pc-text-faint">以后也可以在设置中修改</p>
          <button
            onClick={handleFinish}
            disabled={selected === 'custom' && !customText.trim()}
            className="rounded-xl bg-gradient-to-r from-cyan-500 to-violet-500 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 hover:brightness-110 disabled:opacity-40 transition-all"
          >
            开始使用
          </button>
        </div>
      </div>
    </div>
  );
}
