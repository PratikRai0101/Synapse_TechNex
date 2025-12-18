import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { MOCK_FUNDS } from '../mockData';

const FundExplorer: React.FC = () => {
  const [filter, setFilter] = useState('All');

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-2">
          <h2 className="text-4xl font-black tracking-tighter uppercase text-[var(--text)]">Market Explorer</h2>
          <p className="text-[var(--text-muted)] max-w-xl text-[9px] font-bold uppercase tracking-[0.2em] leading-relaxed">
            Discover elite capital pools within the obsidian framework.
          </p>
        </div>
        <div className="flex gap-2.5 neumorphic-pressed p-1.5 rounded-full border border-[var(--border)] overflow-x-auto no-scrollbar">
          {['All', 'CRED SELECT', 'High Growth', 'Index Funds'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-7 py-2.5 rounded-full text-[9px] font-black tracking-widest transition-all whitespace-nowrap uppercase
                ${filter === f ? 'bg-[var(--text)] text-[var(--bg)]' : 'text-[var(--text-dim)] hover:text-[var(--text)]'}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3.5">
        {MOCK_FUNDS.map((fund) => (
          <div 
            key={fund.id} 
            className="glass group hover:bg-[var(--text)]/[0.05] transition-all duration-500 rounded-[28px] p-6 border border-[var(--border)] hover:border-[var(--text)]/20 flex flex-col lg:flex-row items-center justify-between gap-8 cursor-pointer"
          >
            <div className="flex items-center gap-6 w-full lg:w-1/3">
              <div className="w-14 h-14 rounded-[20px] glass border border-[var(--border)] flex items-center justify-center transition-all duration-700 opacity-40 grayscale group-hover:opacity-100 group-hover:grayscale-0 group-hover:shadow-[0_0_20px_rgba(128,128,128,0.2)]">
                <img src={`https://picsum.photos/seed/${fund.amc}/100`} alt={fund.amc} className="w-9 h-9 object-contain" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <span className="font-black text-lg uppercase tracking-tight text-[var(--text)]">{fund.name}</span>
                  {fund.isCredSelect && (
                    <span className="text-[7px] font-black bg-[var(--text)] text-[var(--bg)] px-1.5 py-0.5 rounded uppercase tracking-tighter">ELITE</span>
                  )}
                </div>
                <div className="text-[8px] text-[var(--text-dim)] font-bold uppercase tracking-widest">{fund.category}</div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-10 w-full lg:w-2/3">
              <div className="text-center min-w-[80px]">
                 <div className="text-[8px] text-[var(--text-dim)] font-black uppercase tracking-widest mb-1.5">3Y Growth</div>
                 <div className="text-xl font-black mono text-[var(--text)]">+{fund.returns3y}%</div>
              </div>
              
              <div className="text-center min-w-[80px]">
                 <div className="text-[8px] text-[var(--text-dim)] font-black uppercase tracking-widest mb-1.5">Alpha Level</div>
                 <div className="text-xl font-black mono text-[var(--text-muted)]">+{fund.alpha}%</div>
              </div>

              <div className="text-center min-w-[80px]">
                 <div className="text-[8px] text-[var(--text-dim)] font-black uppercase tracking-widest mb-1.5">Risk Rating</div>
                 <span className="text-[9px] font-black px-3 py-1 rounded-full glass border border-[var(--border)] text-[var(--text)] uppercase tracking-widest">
                    {fund.risk}
                 </span>
              </div>

              <div className="flex-1 flex justify-end">
                <button className="px-8 py-3 bg-[var(--text)] text-[var(--bg)] text-[9px] font-black uppercase tracking-widest rounded-[16px] hover:scale-105 transition-all opacity-0 group-hover:opacity-100 shadow-[0_10px_30px_rgba(128,128,128,0.2)]">
                  Enter Position
                </button>
                <div className="lg:hidden group-hover:hidden">
                   <ChevronRight className="text-[var(--text-dim)]" size={20} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FundExplorer;