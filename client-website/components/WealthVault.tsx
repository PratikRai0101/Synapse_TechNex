import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Target, Droplets } from 'lucide-react';
import { PORTFOLIO_STATS } from '../mockData';
import { formatINR } from '../utils/formatCurrency';
import LiquidGlassCard from './LiquidGlassCard';

const GoalCapsule = ({ label, progress }: { label: string, progress: number }) => (
  <div className="space-y-2">
    <div className="flex justify-between items-end">
      <span className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-widest">{label}</span>
      <span className="text-[9px] mono font-bold text-[var(--text)]">{progress}%</span>
    </div>
    <div className="h-3.5 w-full bg-[var(--text)]/10 rounded-full overflow-hidden relative border border-[var(--border)]">
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 2, ease: "easeOut" }}
        className="h-full bg-[var(--text)] relative"
      >
        <div className="absolute top-0 left-0 w-full h-[50%] bg-[var(--text)]/20"></div>
      </motion.div>
    </div>
  </div>
);

const WealthVault: React.FC<{ compact?: boolean }> = ({ compact }) => {
  return (
    <div className="space-y-10">
      {/* Total Wealth Vault Header */}
      <div className="neumorphic-flat p-10 rounded-[40px] border border-[var(--border)] relative overflow-hidden group transition-all duration-500">
        {/* Lunar Glow Effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] lunar-glow-bg pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="text-center md:text-left space-y-5">
            <h2 className="text-[var(--text-muted)] text-[9px] font-bold uppercase tracking-[0.3em]">Vault Liquidity</h2>
            <div className="relative">
              <span className="text-6xl md:text-7xl font-black mono tracking-tighter text-[var(--text)]">
                {formatINR(PORTFOLIO_STATS.totalValue)}
              </span>
            </div>
            <div className="flex items-center justify-center md:justify-start gap-8 mt-5">
              <div className="space-y-1">
                <span className="text-[8px] text-[var(--text-muted)] uppercase font-bold tracking-widest">Growth Index (XIRR)</span>
                <div className="text-xl font-black mono text-[var(--text)]">14.2%</div>
              </div>
              <div className="h-8 w-px bg-[var(--text)]/10" />
              <div className="space-y-1">
                <span className="text-[8px] text-[var(--text-muted)] uppercase font-bold tracking-widest">Day Trajectory</span>
                <div className="text-xl font-black mono text-[var(--text)]">+0.5%</div>
              </div>
            </div>
          </div>

          {!compact && (
            <div className="grid grid-cols-1 gap-5 w-full md:w-72">
              <div className="relative glass p-7 rounded-[32px] border border-[var(--border)] overflow-hidden group/alert">
                <div className="absolute inset-0 animate-shimmer pointer-events-none opacity-20" />
                <ShieldCheck className="text-[var(--text)] mb-3" size={24} />
                <div className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-1">Tax Opportunity</div>
                <div className="text-base font-bold text-[var(--text)]">₹15,625 Harvestable</div>
                <div className="mt-3 text-[9px] text-[var(--text-muted)] font-medium">Rebalance vault for LTCG efficiency.</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {!compact && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <LiquidGlassCard className="p-8 space-y-8">
            <h3 className="text-base font-black tracking-widest uppercase flex items-center gap-3">
              <Target size={20} /> Goal Saturation
            </h3>
            <div className="space-y-6">
              <GoalCapsule label="Retirement Corp" progress={74} />
              <GoalCapsule label="Real Estate Reserve" progress={42} />
              <GoalCapsule label="Luxury Sabbatical" progress={18} />
            </div>
          </LiquidGlassCard>
          
          <LiquidGlassCard className="p-8 space-y-8">
             <h3 className="text-base font-black tracking-widest uppercase flex items-center gap-3">
              <Droplets size={20} /> Asset X-Ray
            </h3>
            <div className="space-y-4">
               {[
                 { name: 'HDFC Bank', exposure: 12.4, opacity: 'opacity-100' },
                 { name: 'Reliance Ind', exposure: 9.8, opacity: 'opacity-80' },
                 { name: 'Infosys Ltd', exposure: 7.2, opacity: 'opacity-60' },
                 { name: 'ICICI Bank', exposure: 6.5, opacity: 'opacity-40' }
               ].map((stock, i) => (
                 <div key={i} className={`flex items-center justify-between p-4 neumorphic-pressed rounded-[24px] ${stock.opacity} transition-all duration-500`}>
                    <div>
                      <div className="text-xs font-bold text-[var(--text)]">{stock.name}</div>
                      <div className="text-[8px] text-[var(--text-muted)] uppercase font-bold mt-1 tracking-widest">Active Exposure</div>
                    </div>
                    <div className="text-right">
                       <div className="text-base font-black mono text-[var(--text)]">{stock.exposure}%</div>
                    </div>
                 </div>
               ))}
            </div>
          </LiquidGlassCard>
        </div>
      )}
    </div>
  );
};

export default WealthVault;