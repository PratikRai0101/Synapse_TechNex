import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, Info, Zap, Calendar } from 'lucide-react';
import { formatINR } from '../utils/formatCurrency';

const SwitchInterface: React.FC = () => {
  const [amount, setAmount] = useState('10,000');
  const [isConfigured, setIsConfigured] = useState(false);

  const formatRaw = (val: string) => val.replace(/\D/g, '');

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = formatRaw(e.target.value);
    const formatted = new Intl.NumberFormat('en-IN').format(parseInt(raw || '0'));
    setAmount(formatted);
    setIsConfigured(parseInt(raw || '0') > 0);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-12 pb-20">
      <div className="text-center space-y-2">
        <h2 className="text-4xl font-black tracking-tighter uppercase text-[var(--text)]">Mercury Transition</h2>
        <p className="text-[var(--text-muted)] uppercase text-[9px] tracking-[0.3em] font-bold">Fluid Rebalancing Engine</p>
      </div>

      <div className="relative space-y-8">
        {/* Source Well */}
        <div className="neumorphic-pressed p-8 rounded-[40px] relative z-10 border border-[var(--border)]">
          <label className="text-[8px] font-black text-[var(--text-dim)] uppercase tracking-[0.4em] mb-4 block">Debit Vault</label>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-[20px] glass border border-[var(--border)] flex items-center justify-center text-lg font-black text-[var(--text)]">AX</div>
              <div>
                <div className="font-black text-lg text-[var(--text)] uppercase tracking-tight">Axis Bluechip</div>
                <div className="text-[9px] text-[var(--text-muted)] font-bold mt-1 uppercase tracking-widest">Liquid Balance: {formatINR(142500)}</div>
              </div>
            </div>
            <button className="text-[9px] font-black text-[var(--text-muted)] hover:text-[var(--text)] transition-all uppercase tracking-widest p-2 glass rounded-xl border border-[var(--border)]">Modify</button>
          </div>
        </div>

        {/* Liquid Metal Connector */}
        <div className="absolute left-1/2 -translate-x-1/2 h-40 w-1.5 z-0 top-32">
           <svg className="h-full w-full">
            <line 
              x1="50%" y1="0" x2="50%" y2="100%" 
              stroke="var(--text)" 
              strokeWidth="3" 
              className={isConfigured ? "animate-mercury" : "opacity-20"}
              style={{ transition: 'stroke 0.4s ease' }}
            />
          </svg>
        </div>

        {/* Transition Well */}
        <div className="flex justify-center relative z-20 py-8">
          <div className="glass px-10 py-6 rounded-[40px] border border-[var(--border)] shadow-[0_0_80px_rgba(128,128,128,0.05)] text-center">
            <div className="text-[8px] font-black text-[var(--text-dim)] uppercase tracking-[0.4em] mb-3">Saturation Amount</div>
            <div className="flex items-baseline justify-center gap-3">
              <span className="text-2xl font-light text-[var(--text-muted)]">₹</span>
              <input 
                type="text" 
                value={amount}
                onChange={handleAmountChange}
                className="bg-transparent text-5xl font-black mono text-[var(--text)] outline-none w-56 text-center tracking-tighter"
              />
            </div>
          </div>
        </div>

        {/* Destination Well */}
        <div className="neumorphic-pressed p-8 rounded-[40px] relative z-10 border border-[var(--border)]">
          <label className="text-[8px] font-black text-[var(--text-dim)] uppercase tracking-[0.4em] mb-4 block">Credit Vault</label>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-[20px] glass bg-[var(--text)]/10 border border-[var(--border)] flex items-center justify-center text-lg font-black text-[var(--text)] shadow-[0_0_20px_rgba(128,128,128,0.1)]">SB</div>
              <div>
                <div className="font-black text-lg text-[var(--text)] uppercase tracking-tight">SBI Small Cap</div>
                <div className="text-[9px] text-[var(--text-muted)] font-bold mt-1 uppercase tracking-widest">Target Multiplier: 2.4x Alpha</div>
              </div>
            </div>
            <button className="text-[9px] font-black text-[var(--text-muted)] hover:text-[var(--text)] transition-all uppercase tracking-widest p-2 glass rounded-xl border border-[var(--border)]">Modify</button>
          </div>
        </div>
      </div>

      {/* Action Capsule */}
      <div className="glass p-8 rounded-[40px] border border-[var(--border)] space-y-8">
        <div className="flex flex-wrap justify-center gap-5">
          <div className="glass px-5 py-2.5 rounded-full border border-[var(--border)] flex items-center gap-3">
             <Info size={16} className="text-[var(--text-dim)]" />
             <span className="text-[9px] text-[var(--text-dim)] font-bold uppercase tracking-widest">Exit Friction: <span className="text-[var(--text)] font-black">NIL</span></span>
          </div>
          <div className="glass px-5 py-2.5 rounded-full border border-[var(--border)] flex items-center gap-3">
             <Calendar size={16} className="text-[var(--text-dim)]" />
             <span className="text-[9px] text-[var(--text-dim)] font-bold uppercase tracking-widest">Time Buffer: <span className="text-[var(--text)] font-black">T+3</span></span>
          </div>
          <div className="glass px-5 py-2.5 rounded-full border border-[var(--border)] flex items-center gap-3">
             <Zap size={16} className="text-[var(--text-dim)]" />
             <span className="text-[9px] text-[var(--text-dim)] font-bold uppercase tracking-widest">Tax Projection: <span className="text-[var(--text)] font-black">~₹42</span></span>
          </div>
        </div>

        <button className="w-full h-20 bg-[var(--text)] text-[var(--bg)] rounded-[28px] relative overflow-hidden group shadow-[0_0_40px_rgba(128,128,128,0.2)]">
          {/* High-gloss specular highlight */}
          <div className="absolute top-4 left-10 w-2 h-2 bg-[var(--bg)] rounded-full blur-[1px] opacity-30" />
          
          <div className="relative z-10 flex items-center justify-center gap-6">
            <span className="text-xl font-black uppercase tracking-[0.4em]">Commit Transition</span>
            <div className="w-9 h-9 rounded-full bg-[var(--bg)] text-[var(--text)] flex items-center justify-center shadow-2xl transition-colors duration-400">
              <ArrowDown size={20} />
            </div>
          </div>
          <motion.div 
            className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"
          />
        </button>
      </div>
    </div>
  );
};

export default SwitchInterface;