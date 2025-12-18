import React from 'react';
import { motion } from 'framer-motion';

const Hero: React.FC<{ onStartInvesting: () => void }> = ({ onStartInvesting }) => {
  return (
    <div className="relative overflow-hidden rounded-[40px] neumorphic-flat p-10 md:p-14 border border-[var(--border)] transition-all duration-400">
      <div className="relative z-10 grid md:grid-cols-2 gap-10 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--text)]/5 border border-[var(--border)] text-[var(--text)] text-[9px] font-bold uppercase tracking-widest mb-6">
            <div className="w-1.5 h-1.5 rounded-full bg-[var(--text)]" />
            Live Market Analysis
          </div>
          <h1 className="text-4xl md:text-6xl font-black leading-tight mb-5 tracking-tighter uppercase text-[var(--text)]">
            WEALTH <br />
            <span className="text-[var(--text-muted)]">OBSIDIAN</span>
          </h1>
          <p className="text-[var(--text-muted)] text-base mb-10 max-w-sm leading-relaxed">
            Access curated mutual fund portfolios previously reserved for the elite 1%. High-fidelity analytics in liquid glass.
          </p>
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={onStartInvesting}
              className="px-8 py-3.5 bg-[var(--text)] text-[var(--bg)] rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all shadow-[0_0_25px_rgba(128,128,128,0.2)] hover:scale-105"
            >
              Initialize Vault
            </button>
            <button className="px-8 py-3.5 glass text-[var(--text)] border border-[var(--border)] rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all hover:bg-[var(--text)]/5">
              Explore Funds
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative hidden md:block"
        >
          <div className="absolute inset-0 bg-[var(--text)]/5 blur-[80px] rounded-full pointer-events-none" />
          <div className="relative rounded-3xl overflow-hidden border border-[var(--border)] shadow-2xl grayscale transition-all duration-1000 group hover:grayscale-0">
             <img 
               src="https://picsum.photos/seed/wealth/800/600" 
               alt="Financial Terminal" 
               className="w-full h-auto opacity-30 group-hover:opacity-60 transition-opacity duration-1000"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)] via-[var(--bg)]/40 to-transparent" />
             <div className="absolute bottom-6 left-6 right-6 p-6 glass rounded-2xl border border-[var(--border)]">
                <div className="flex justify-between items-end mb-4">
                  <div>
                    <div className="text-[8px] text-[var(--text-dim)] font-bold uppercase tracking-widest">Vault Value</div>
                    <div className="text-xl font-black mono text-[var(--text)]">₹1,24,592.85</div>
                  </div>
                  <div className="text-[var(--text)] font-bold mono text-xs">+24.51%</div>
                </div>
                <div className="w-full h-1 bg-[var(--text)]/10 rounded-full overflow-hidden">
                   <div className="w-3/4 h-full bg-[var(--text)] shadow-[0_0_10px_var(--text)] opacity-60" />
                </div>
             </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;