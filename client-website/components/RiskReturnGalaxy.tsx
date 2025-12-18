
import React from 'react';
import { 
  ScatterChart, 
  Scatter, 
  XAxis, 
  YAxis, 
  ZAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { MOCK_FUNDS } from '../mockData';

const CustomStar = (props: any) => {
  const { cx, cy, fill } = props;
  return (
    <g>
      <circle cx={cx} cy={cy} r={6} fill={fill} className="animate-pulse" />
      <circle cx={cx} cy={cy} r={12} fill={fill} fillOpacity={0.15} className="hover:scale-150 transition-transform duration-500" />
      <circle cx={cx} cy={cy} r={20} fill={fill} fillOpacity={0.05} />
    </g>
  );
};

const RiskReturnGalaxy: React.FC = () => {
  const isDark = typeof document !== 'undefined' && document.documentElement.getAttribute('data-theme') === 'dark';
  const textColor = isDark ? '#FFFFFF' : '#000000';
  const mutedTextColor = isDark ? '#666666' : '#999999';
  const gridColor = isDark ? '#ffffff08' : '#00000010';

  const data = MOCK_FUNDS.map(f => ({
    name: f.name,
    risk: f.stdDev,
    return: f.returns3y,
    alpha: f.alpha,
    category: f.category
  }));

  return (
    <div className="neumorphic-flat p-8 rounded-[40px] border border-[var(--border)] h-[450px] transition-all duration-400">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-xl font-bold mb-1 text-[var(--text)]">Risk-Return Galaxy</h3>
          <p className="text-xs text-[var(--text-muted)] uppercase tracking-widest font-bold">Visualizing Alpha potential</p>
        </div>
        <div className="px-3 py-1 rounded-full glass border border-[var(--border)] text-[var(--text)] text-[10px] font-bold uppercase tracking-widest">
          Live Market
        </div>
      </div>

      <div className="w-full h-64 relative">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis 
              type="number" 
              dataKey="risk" 
              name="Risk" 
              unit="%" 
              stroke={mutedTextColor} 
              fontSize={10} 
              axisLine={false} 
              tickLine={false}
              label={{ value: 'Volatility (Std Dev) →', position: 'insideBottom', offset: -10, fill: mutedTextColor, fontSize: 10 }}
            />
            <YAxis 
              type="number" 
              dataKey="return" 
              name="Returns" 
              unit="%" 
              stroke={mutedTextColor} 
              fontSize={10} 
              axisLine={false} 
              tickLine={false}
              label={{ value: 'Returns (3Y) →', angle: -90, position: 'insideLeft', offset: 20, fill: mutedTextColor, fontSize: 10 }}
            />
            <ZAxis type="number" dataKey="alpha" range={[100, 400]} />
            <Tooltip 
              cursor={{ strokeDasharray: '3 3' }} 
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="glass p-4 rounded-xl border border-[var(--border)] shadow-2xl">
                      <div className="text-[10px] text-[var(--text-dim)] font-bold uppercase tracking-widest mb-1">{data.category}</div>
                      <div className="text-sm font-bold text-[var(--text)] mb-2">{data.name}</div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-[10px] text-[var(--text-muted)] uppercase">Alpha</div>
                          <div className="text-[var(--text)] font-bold mono">+{data.alpha}%</div>
                        </div>
                        <div>
                          <div className="text-[10px] text-[var(--text-muted)] uppercase">Return</div>
                          <div className="text-[var(--text)] font-bold mono">{data.return}%</div>
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Scatter name="Funds" data={data} shape={<CustomStar />}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={textColor} />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
        
        {/* Quadrant Labels */}
        <div className="absolute top-0 left-10 text-[8px] font-bold text-[var(--text-dim)] uppercase tracking-widest opacity-50">High Alpha / Low Volatility</div>
        <div className="absolute bottom-10 right-0 text-[8px] font-bold text-[var(--text-dim)] uppercase tracking-widest opacity-50">Low Alpha / High Volatility</div>
      </div>
    </div>
  );
};

export default RiskReturnGalaxy;
