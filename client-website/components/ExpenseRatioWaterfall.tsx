
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';
import { COLORS } from '../constants';

const ExpenseRatioWaterfall: React.FC = () => {
  const data = [
    { name: 'Gross Return', value: 124500, type: 'start' },
    { name: 'Mgmt Fee', value: -933, type: 'loss' },
    { name: '12b-1 Fee', value: -250, type: 'loss' },
    { name: 'Other Exp', value: -120, type: 'loss' },
    { name: 'Net Return', value: 123197, type: 'end' },
  ];

  return (
    <div className="neumorphic-flat p-8 rounded-[40px] border border-white/5 h-[500px]">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-xl font-bold mb-1">Waterfall Impact Analysis</h3>
          <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">How fees impact your wealth</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
             <div className="w-2 h-2 rounded-full bg-[#3D5AFE]" />
             <span className="text-[10px] text-gray-500 uppercase font-bold">Gross</span>
          </div>
          <div className="flex items-center gap-1 ml-4">
             <div className="w-2 h-2 rounded-full bg-red-500" />
             <span className="text-[10px] text-gray-500 uppercase font-bold">Expense Ratio</span>
          </div>
        </div>
      </div>

      <div className="flex-1 w-full h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <defs>
              <linearGradient id="barSheen" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#ffffff22" />
                <stop offset="50%" stopColor="#ffffff00" />
                <stop offset="100%" stopColor="#ffffff22" />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff08" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#666', fontSize: 10 }} dy={10} />
            <YAxis hide={true} domain={[0, 140000]} />
            <Tooltip 
              cursor={{ fill: 'rgba(255,255,255,0.03)' }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="glass p-3 rounded-xl border border-white/10 shadow-2xl">
                      <div className="text-xs font-bold text-white mb-1">{payload[0].payload.name}</div>
                      <div className={`text-lg font-bold mono ${payload[0].value < 0 ? 'text-red-500' : 'text-white'}`}>
                        ₹{Math.abs(payload[0].value as number).toLocaleString()}
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="value" radius={[8, 8, 0, 0]} animationDuration={2000}>
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.type === 'loss' ? '#ef4444' : COLORS.ELECTRIC_BLUE}
                  fillOpacity={entry.type === 'loss' ? 0.6 : 1}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-8 p-6 rounded-3xl bg-white/5 border border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div>
            <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Avg. Expense Ratio</div>
            <div className="text-xl font-bold mono">0.75%</div>
          </div>
          <div className="h-10 w-px bg-white/10" />
          <div>
            <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Total Fees Paid (YTD)</div>
            <div className="text-xl font-bold mono text-red-500">₹933</div>
          </div>
        </div>
        <button className="px-6 py-2 rounded-xl text-xs font-bold bg-[#3D5AFE]/10 text-[#3D5AFE] hover:bg-[#3D5AFE] hover:text-white transition-all">
          Optimize Portfolio Fees
        </button>
      </div>
    </div>
  );
};

export default ExpenseRatioWaterfall;
