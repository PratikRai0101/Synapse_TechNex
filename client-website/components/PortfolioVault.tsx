
import React, { useState, useEffect } from 'react';
import { TrendingUp, Banknote, Percent } from 'lucide-react';
import { PORTFOLIO_STATS } from '../mockData';

const PortfolioVault: React.FC = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = PORTFOLIO_STATS.totalValue;
    const duration = 1500;
    const increment = end / (duration / 16);
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="neumorphic-flat p-8 rounded-[40px] border border-[var(--border)] relative overflow-hidden group transition-all duration-400">
      <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--text)]/5 blur-3xl group-hover:bg-[var(--text)]/10 transition-all rounded-full -translate-y-1/2 translate-x-1/2" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-8">
          <div className="p-3 rounded-2xl glass border border-[var(--border)] text-[var(--text)]">
            <TrendingUp size={24} />
          </div>
          <div className="px-3 py-1 rounded-full glass border border-[var(--border)] text-[var(--text)] text-[10px] font-bold uppercase tracking-widest">
            Portfolio Alpha +2.4%
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-[var(--text-muted)] text-xs font-bold uppercase tracking-widest mb-2">Total Wealth</h2>
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-[var(--text)]/10 blur-2xl rounded-full scale-150 animate-pulse opacity-50" />
            <span className="text-4xl md:text-5xl font-bold mono relative text-[var(--text)] transition-colors duration-400">₹{count.toLocaleString()}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-1">
            <div className="text-[10px] text-[var(--text-dim)] font-bold uppercase tracking-widest flex items-center gap-1">
              <Banknote size={10} /> Day Change
            </div>
            <div className="text-lg font-bold mono text-[var(--text)] transition-colors duration-400">
              +₹{PORTFOLIO_STATS.dayChange.toLocaleString()}
              <span className="text-xs ml-1 opacity-70">(+{PORTFOLIO_STATS.dayChangePercent}%)</span>
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-[10px] text-[var(--text-dim)] font-bold uppercase tracking-widest flex items-center gap-1">
              <Percent size={10} /> XIRR Return
            </div>
            <div className="text-lg font-bold mono text-[var(--text)] transition-colors duration-400">
              {PORTFOLIO_STATS.xirr}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioVault;
