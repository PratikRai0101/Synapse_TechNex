import React from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';
import { Fund } from '../mockData';
import LiquidGlassCard from './LiquidGlassCard';

interface PerformanceChartProps {
  fund: Fund;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass p-5 rounded-2xl border border-[var(--border)] shadow-2xl">
        <div className="text-[9px] text-[var(--text-dim)] font-bold uppercase tracking-[0.2em] mb-2">NAV Cycle @ {payload[0].payload.time}</div>
        <div className="text-2xl font-black mono text-[var(--text)]">₹{payload[0].value.toFixed(2)}</div>
      </div>
    );
  }
  return null;
};

const PerformanceChart: React.FC<PerformanceChartProps> = ({ fund }) => {
  const isDark = typeof document !== 'undefined' && document.documentElement.getAttribute('data-theme') === 'dark';
  const accentColor = isDark ? '#FFFFFF' : '#000000';

  return (
    <LiquidGlassCard className="p-10 h-[500px] flex flex-col">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h3 className="text-xl font-black tracking-widest uppercase mb-1 text-[var(--text)]">Growth Trajectory</h3>
          <p className="text-[10px] text-[var(--text-muted)] uppercase font-bold tracking-[0.15em] flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--text)] shadow-[0_0_8px_var(--text)]" />
            {fund.name} NAV Trend
          </p>
        </div>
        
        <div className="flex gap-2 p-1 neumorphic-pressed rounded-full border border-[var(--border)]">
          {['1D', '1W', '1M', '6M', '1Y', 'All'].map(range => (
            <button 
              key={range} 
              className={`w-12 h-9 flex items-center justify-center rounded-full text-[10px] font-black transition-all
                ${range === '1W' ? 'bg-[var(--text)] text-[var(--bg)]' : 'text-[var(--text-dim)] hover:text-[var(--text)]'}`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={fund.historicalPoints} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="areaGlow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={accentColor} stopOpacity={0.15}/>
                <stop offset="95%" stopColor={accentColor} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
            <XAxis 
              dataKey="time" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: 'var(--text-dim)', fontSize: 10, fontWeight: 700 }}
              dy={15}
            />
            <YAxis hide={true} domain={['auto', 'auto']} />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'var(--text)', strokeWidth: 1, strokeDasharray: '3 3' }} />
            
            <Area 
              type="monotone" 
              dataKey="nav" 
              stroke="var(--text)" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#areaGlow)" 
              animationDuration={2500}
              activeDot={{ 
                r: 6, 
                fill: 'var(--bg)', 
                stroke: 'var(--text)', 
                strokeWidth: 3
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </LiquidGlassCard>
  );
};

export default PerformanceChart;