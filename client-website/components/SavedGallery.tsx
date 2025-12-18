
import React from 'react';
import { motion } from 'framer-motion';
import { Search, LayoutGrid, List, BellRing, ChevronRight } from 'lucide-react';
import { MOCK_FUNDS } from '../mockData';

const FundCard = ({ fund }: { fund: any }) => (
  <motion.div 
    whileHover={{ scale: 1.02, backgroundColor: 'var(--text)/0.03' }}
    className="glass p-6 rounded-[32px] border border-[var(--border)] group cursor-pointer relative overflow-hidden transition-all duration-400"
  >
    <div className="flex justify-between items-start mb-6">
      <div className="w-12 h-12 rounded-2xl glass border border-[var(--border)] p-2 grayscale group-hover:grayscale-0 transition-all">
        <img src={`https://picsum.photos/seed/${fund.amc}/100`} alt={fund.amc} className="w-full h-full object-contain opacity-50 group-hover:opacity-100" />
      </div>
      <button className="p-2 glass rounded-full border border-[var(--border)] hover:bg-[var(--text)]/5 transition-all">
        <BellRing size={16} className="text-[var(--text-dim)] group-hover:text-[var(--text)]" />
      </button>
    </div>
    
    <div className="space-y-1 mb-6">
      <div className="text-sm font-bold truncate pr-4 text-[var(--text)]">{fund.name}</div>
      <div className="text-[10px] text-[var(--text-dim)] uppercase tracking-widest font-bold">{fund.category}</div>
    </div>

    <div className="flex items-end justify-between">
       <div>
         <div className="text-[9px] text-[var(--text-dim)] font-bold uppercase tracking-widest mb-1">Current NAV</div>
         <div className="text-2xl font-black mono tracking-tighter text-[var(--text)]">₹{fund.nav.toFixed(2)}</div>
       </div>
       <div className="flex items-center gap-1.5 mb-1 px-2 py-0.5 rounded-full glass border border-[var(--border)]">
          <div className="w-1.5 h-1.5 rounded-full bg-[var(--text)] animate-pulse" />
          <span className="text-[10px] font-bold mono text-[var(--text)]">+{fund.returns3y}%</span>
       </div>
    </div>

    {/* Mini Sparkline Background */}
    <div className="absolute bottom-0 left-0 w-full h-12 opacity-10 group-hover:opacity-30 transition-opacity pointer-events-none">
       <svg viewBox="0 0 100 20" className="w-full h-full">
         <path 
           d="M0,15 Q25,5 50,15 T100,10" 
           fill="none" 
           stroke="var(--text)" 
           strokeWidth="2"
         />
       </svg>
    </div>
  </motion.div>
);

const SavedGallery: React.FC = () => {
  return (
    <div className="space-y-12 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-end gap-8">
        <div className="space-y-2">
          <h2 className="text-4xl font-black tracking-tight uppercase text-[var(--text)]">Wealth Gallery</h2>
          <p className="text-[var(--text-muted)]">Your curated collection of market opportunities.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-dim)]" size={16} />
            <input 
              type="text" 
              placeholder="Filter gallery..." 
              className="neumorphic-pressed py-3 pl-12 pr-6 rounded-2xl w-64 outline-none text-sm text-[var(--text)] focus:ring-1 focus:ring-[var(--text)]/20"
            />
          </div>
          <div className="glass p-1 rounded-2xl border border-[var(--border)] flex">
            <button className="p-2 rounded-xl bg-[var(--text)] text-[var(--bg)] transition-colors duration-400"><LayoutGrid size={18} /></button>
            <button className="p-2 rounded-xl text-[var(--text-dim)] hover:text-[var(--text)] transition-colors duration-400"><List size={18} /></button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {MOCK_FUNDS.map(fund => <FundCard key={fund.id} fund={fund} />)}
        <motion.button 
          whileHover={{ backgroundColor: 'var(--text)/0.02' }}
          className="glass border border-dashed border-[var(--border)] rounded-[32px] flex flex-col items-center justify-center p-10 group gap-4 transition-all duration-400"
        >
          <div className="w-14 h-14 rounded-full border border-dashed border-[var(--border)] flex items-center justify-center group-hover:border-[var(--text)] group-hover:rotate-90 transition-all duration-500">
             <span className="text-2xl font-light text-[var(--text-muted)] group-hover:text-[var(--text)]">+</span>
          </div>
          <div className="text-xs font-bold text-[var(--text-dim)] uppercase tracking-widest group-hover:text-[var(--text)] transition-colors">Find More Funds</div>
        </motion.button>
      </div>

      {/* Comparison Drawer Trigger */}
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50">
        <motion.button 
          whileHover={{ y: -5 }}
          className="glass px-10 py-5 rounded-full border border-[var(--border)] shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center gap-4 transition-all duration-400"
        >
          <div className="flex -space-x-3">
             {[1,2,3].map(i => (
               <div key={i} className="w-8 h-8 rounded-full border-2 border-[var(--bg)] bg-[var(--text)] overflow-hidden transition-colors duration-400">
                 <img src={`https://picsum.photos/seed/${i}/40`} className="w-full h-full grayscale" alt="Fund Preview" />
               </div>
             ))}
          </div>
          <span className="text-xs font-black uppercase tracking-widest text-[var(--text)]">Compare Selected (3)</span>
          <ChevronRight size={18} className="text-[var(--text)]" />
        </motion.button>
      </div>
    </div>
  );
};

export default SavedGallery;
