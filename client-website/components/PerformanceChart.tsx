import React, { useState, useEffect } from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';
import { ProcessedFund, fetchFundData, processFundData } from '../utils/fundApi';
import LiquidGlassCard from './LiquidGlassCard';

interface PerformanceChartProps {
  fund: ProcessedFund;
  period?: '1y' | '3y' | '5y' | 'all';
  onPeriodChange?: (period: '1y' | '3y' | '5y' | 'all') => void;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass p-5 rounded-2xl border border-[var(--border)] shadow-2xl">
        <div className="text-[9px] text-[var(--text-dim)] font-bold uppercase tracking-[0.2em] mb-2">NAV Cycle @ {payload[0].payload.date}</div>
        <div className="text-2xl font-black mono text-[var(--text)]">₹{payload[0].value.toFixed(2)}</div>
      </div>
    );
  }
  return null;
};

const PerformanceChart: React.FC<PerformanceChartProps> = ({ fund, period = '1y', onPeriodChange }) => {
  const [selectedPeriod, setSelectedPeriod] = useState<'1y' | '3y' | '5y' | 'all'>(period);
  const [chartData, setChartData] = useState(fund.historicalData);
  const [loading, setLoading] = useState(false);
  const isDark = typeof document !== 'undefined' && document.documentElement.getAttribute('data-theme') === 'dark';
  const accentColor = isDark ? '#FFFFFF' : '#000000';

  // Filter data based on selected period
  const getFilteredData = () => {
    const data = fund.historicalData || [];
    if (data.length === 0) return [];

    if (selectedPeriod === 'all') return data;

    const today = new Date();
    const periodDate = new Date();

    switch (selectedPeriod) {
      case '1y':
        periodDate.setFullYear(periodDate.getFullYear() - 1);
        break;
      case '3y':
        periodDate.setFullYear(periodDate.getFullYear() - 3);
        break;
      case '5y':
        periodDate.setFullYear(periodDate.getFullYear() - 5);
        break;
    }

    return data.filter((point) => {
      const pointDate = new Date(point.date);
      return pointDate >= periodDate;
    });
  };

  useEffect(() => {
    const filteredData = getFilteredData();
    setChartData(filteredData.length > 0 ? filteredData : fund.historicalData);
  }, [selectedPeriod, fund]);

  const handlePeriodChange = (newPeriod: '1y' | '3y' | '5y' | 'all') => {
    setSelectedPeriod(newPeriod);
    onPeriodChange?.(newPeriod);
  };

  const getReturnForPeriod = (): number => {
    if (chartData.length < 2) return 0;
    const start = chartData[chartData.length - 1].nav;
    const end = chartData[0].nav;
    if (start === 0) return 0;
    return ((end - start) / start) * 100;
  };

  return (
    <LiquidGlassCard className="p-10 h-[500px] flex flex-col">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h3 className="text-xl font-black tracking-widest uppercase mb-1 text-[var(--text)]">Growth Trajectory</h3>
          <p className="text-[10px] text-[var(--text-muted)] uppercase font-bold tracking-[0.15em] flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--text)] shadow-[0_0_8px_var(--text)]" />
            {fund.name} NAV Trend
          </p>
          <p className="text-[10px] text-[var(--text-muted)] uppercase font-bold tracking-[0.15em] mt-1">
            {selectedPeriod.toUpperCase()} Return: <span className={getReturnForPeriod() >= 0 ? 'text-green-500' : 'text-red-500'}>
              {getReturnForPeriod() >= 0 ? '+' : ''}{getReturnForPeriod().toFixed(2)}%
            </span>
          </p>
        </div>

        <div className="flex gap-2 p-1 neumorphic-pressed rounded-full border border-[var(--border)]">
          {['1y', '3y', '5y', 'all'].map((range) => (
            <button
              key={range}
              onClick={() => handlePeriodChange(range as '1y' | '3y' | '5y' | 'all')}
              className={`min-w-12 h-9 flex items-center justify-center rounded-full text-[10px] font-black transition-all whitespace-nowrap px-3
                ${selectedPeriod === range ? 'bg-[var(--text)] text-[var(--bg)]' : 'text-[var(--text-dim)] hover:text-[var(--text)]'}`}
            >
              {range === 'all' ? 'All' : range.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="areaGlow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={accentColor} stopOpacity={0.15} />
                <stop offset="95%" stopColor={accentColor} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'var(--text-dim)', fontSize: 10, fontWeight: 700 }}
              dy={15}
              interval={Math.floor(chartData.length / 5)}
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