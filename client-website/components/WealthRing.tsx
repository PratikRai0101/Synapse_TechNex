
import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { MOCK_FUNDS } from '../mockData';
import LiquidGlassCard from './LiquidGlassCard';

const WealthRing: React.FC = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  
  const data = [
    { name: 'Equity', value: 75, frost: '0.8', fill: '#FFFFFF' },
    { name: 'Debt', value: 15, frost: '0.4', fill: '#808080' },
    { name: 'Cash', value: 10, frost: '0.1', fill: '#333333' }
  ];

  return (
    <LiquidGlassCard className="p-10 h-[450px]">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h3 className="text-xl font-black tracking-widest uppercase mb-1">Vault Ring</h3>
          <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Structural Allocation</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-12">
        <div className="relative w-64 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={75}
                outerRadius={95}
                paddingAngle={4}
                dataKey="value"
                onMouseEnter={(_, index) => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.fill}
                    fillOpacity={index === hoveredIndex ? 1 : 0.7}
                    className="transition-all duration-500 cursor-pointer outline-none"
                    style={{ filter: index === hoveredIndex ? 'drop-shadow(0 0 10px rgba(255,255,255,0.4))' : 'none' }}
                  />
                ))}
              </Pie>
              <Tooltip content={() => null} />
            </PieChart>
          </ResponsiveContainer>
          
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            {hoveredIndex !== null ? (
              <>
                <div className="text-4xl font-black mono text-white leading-none tracking-tighter">{data[hoveredIndex].value}%</div>
                <div className="text-[9px] text-gray-500 font-bold uppercase tracking-[0.2em] mt-3">{data[hoveredIndex].name}</div>
              </>
            ) : (
              <>
                <div className="text-2xl font-black text-gray-500 uppercase tracking-widest leading-none">EQUITY</div>
                <div className="text-5xl font-black mono text-white mt-2 tracking-tighter">75%</div>
              </>
            )}
          </div>
        </div>

        <div className="flex-1 space-y-3">
          {data.map((item, i) => (
            <div 
              key={i} 
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              className={`flex items-center justify-between p-5 rounded-[24px] transition-all duration-300 ${i === hoveredIndex ? 'bg-white/10 border-white/20' : 'bg-white/5 border-transparent'} border`}
            >
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.fill }} />
                <span className="text-xs font-bold uppercase tracking-widest text-gray-400">{item.name}</span>
              </div>
              <div className="text-sm font-black mono text-white">{item.value}%</div>
            </div>
          ))}
        </div>
      </div>
    </LiquidGlassCard>
  );
};

export default WealthRing;
