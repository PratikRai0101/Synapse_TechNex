import React, { useState, useEffect } from 'react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { ProcessedFund } from '../utils/fundApi';

interface CandleChartProps {
  fund: ProcessedFund;
  period: '1y' | '3y' | '5y' | 'all';
  onPeriodChange?: (period: '1y' | '3y' | '5y' | 'all') => void;
}

interface CandleData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  x: number;
  y: number;
  timestamp: number;
}

// Generate synthetic candlestick data from historical data
const generateCandleData = (
  historicalData: { date: string; nav: number }[],
  period: '1y' | '3y' | '5y' | 'all'
): CandleData[] => {
  if (!historicalData || historicalData.length === 0) {
    return generateMockCandleData(period);
  }

  const today = new Date();
  const periodDate = new Date();

  switch (period) {
    case '1y':
      periodDate.setFullYear(periodDate.getFullYear() - 1);
      break;
    case '3y':
      periodDate.setFullYear(periodDate.getFullYear() - 3);
      break;
    case '5y':
      periodDate.setFullYear(periodDate.getFullYear() - 5);
      break;
    case 'all':
      break;
  }

  const filteredData = historicalData.filter((point) => {
    const pointDate = new Date(point.date);
    return pointDate >= periodDate;
  });

  // Group data into weekly/monthly candles depending on period
  const candleData: CandleData[] = [];
  const groupSize = period === '1y' ? 1 : period === '3y' ? 2 : period === '5y' ? 4 : 1;

  for (let i = 0; i < filteredData.length; i += groupSize) {
    const group = filteredData.slice(i, Math.min(i + groupSize, filteredData.length));
    if (group.length === 0) continue;

    const navs = group.map((d) => d.nav);
    const open = navs[0];
    const close = navs[navs.length - 1];
    const high = Math.max(...navs);
    const low = Math.min(...navs);
    const date = group[group.length - 1].date;

    const candleIndex = candleData.length;

    candleData.push({
      date: new Date(date).toLocaleDateString('en-IN', {
        month: 'short',
        day: 'numeric',
      }),
      open,
      high,
      low,
      close,
      x: candleIndex,
      y: close,
      timestamp: new Date(date).getTime(),
    });
  }

  return candleData.length > 0 ? candleData : generateMockCandleData(period);
};

// Generate mock candle data if no historical data available
const generateMockCandleData = (period: '1y' | '3y' | '5y' | 'all'): CandleData[] => {
  let dataPoints: number;
  let startDate: Date;
  
  const today = new Date();
  
  switch (period) {
    case '1y':
      dataPoints = 52;
      startDate = new Date(today);
      startDate.setFullYear(startDate.getFullYear() - 1);
      break;
    case '3y':
      dataPoints = 156;
      startDate = new Date(today);
      startDate.setFullYear(startDate.getFullYear() - 3);
      break;
    case '5y':
      dataPoints = 260;
      startDate = new Date(today);
      startDate.setFullYear(startDate.getFullYear() - 5);
      break;
    default: // 'all'
      dataPoints = 260;
      startDate = new Date(today);
      startDate.setFullYear(startDate.getFullYear() - 5);
  }

  const data: CandleData[] = [];
  let baseNav = 100;

  for (let i = 0; i < dataPoints; i++) {
    // Create more realistic candlestick patterns
    const trend = Math.sin(i / 20) * 0.5 + 0.3; // Slight uptrend
    const volatility = Math.random() * 2 - 1; // Random volatility
    const change = trend + volatility;
    
    const open = baseNav;
    const close = baseNav * (1 + change / 100);
    const high = Math.max(open, close) * (1 + Math.random() * 0.015);
    const low = Math.min(open, close) * (1 - Math.random() * 0.015);

    const date = new Date(startDate);
    date.setDate(date.getDate() + i);

    data.push({
      date: date.toLocaleDateString('en-IN', {
        month: 'short',
        day: 'numeric',
      }),
      open,
      high,
      low,
      close,
      x: i,
      y: close,
      timestamp: date.getTime(),
    });

    baseNav = close;
  }

  return data;
};

const CustomCandleTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const change = ((data.close - data.open) / data.open) * 100;
    return (
      <div className="glass border border-white/20 p-4 rounded-lg backdrop-blur-xl">
        <p className="text-white text-xs font-bold mb-2">{data.date}</p>
        <p className="text-gray-300 text-xs">
          <span className="text-green-400">Open: ₹{data.open.toFixed(2)}</span>
        </p>
        <p className="text-gray-300 text-xs">
          <span className="text-blue-400">High: ₹{data.high.toFixed(2)}</span>
        </p>
        <p className="text-gray-300 text-xs">
          <span className="text-orange-400">Low: ₹{data.low.toFixed(2)}</span>
        </p>
        <p className="text-gray-300 text-xs">
          <span className={data.close >= data.open ? 'text-green-400' : 'text-red-400'}>
            Close: ₹{data.close.toFixed(2)}
          </span>
        </p>
        <p className={`text-xs mt-1 font-bold ${change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
          Change: {change >= 0 ? '+' : ''}{change.toFixed(2)}%
        </p>
      </div>
    );
  }
  return null;
};

const CustomCandleShape = (props: any) => {
  const { cx, cy, payload, xAxis, yAxis } = props;

  if (!payload || !xAxis || !yAxis) return null;

  const open = payload.open;
  const close = payload.close;
  const high = payload.high;
  const low = payload.low;

  // Get scale functions
  const xScale = xAxis.scale;
  const yScale = yAxis.scale;

  // Calculate pixel positions
  const x = xScale(payload.x);
  const wickTop = yScale(high);
  const wickBottom = yScale(low);
  const bodyTop = yScale(Math.max(open, close));
  const bodyBottom = yScale(Math.min(open, close));

  const color = close >= open ? '#10b981' : '#ef4444';
  const bodyWidth = 4;

  return (
    <g>
      {/* Wick */}
      <line
        x1={x}
        y1={wickTop}
        x2={x}
        y2={wickBottom}
        stroke={color}
        strokeWidth={1}
        opacity={0.7}
      />
      {/* Body */}
      <rect
        x={x - bodyWidth / 2}
        y={bodyTop}
        width={bodyWidth}
        height={Math.max(bodyBottom - bodyTop, 1)}
        fill={color}
        opacity={0.9}
      />
    </g>
  );
};

const CandleChart: React.FC<CandleChartProps> = ({ fund, period, onPeriodChange }) => {
  const [selectedPeriod, setSelectedPeriod] = useState<'1y' | '3y' | '5y' | 'all'>(period);
  const [candleData, setCandleData] = useState<CandleData[]>([]);

  useEffect(() => {
    const data = generateCandleData(fund.historicalData, selectedPeriod);
    setCandleData(data);
    console.log(`🕯️ Candlestick Chart Loaded - Scheme Code: ${fund.schemeCode}, Fund: ${fund.name}, Period: ${selectedPeriod}, Candles: ${data.length}`);
  }, [selectedPeriod, fund]);

  const handlePeriodChange = (newPeriod: '1y' | '3y' | '5y' | 'all') => {
    setSelectedPeriod(newPeriod);
    onPeriodChange?.(newPeriod);
  };

  const getReturnForPeriod = (): number => {
    if (candleData.length < 2) return 0;
    const start = candleData[0].open;
    const end = candleData[candleData.length - 1].close;
    if (start === 0) return 0;
    return ((end - start) / start) * 100;
  };

  const returns = getReturnForPeriod();
  const returnColor = returns >= 0 ? '#10b981' : '#ef4444';

  return (
    <div className="w-full space-y-4">
      {/* Return Info */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">
            Candlestick Analysis - {fund.name}
          </h3>
          <p className="text-[9px] text-gray-500 uppercase font-bold tracking-[0.15em]">
            {selectedPeriod.toUpperCase()} Return:{' '}
            <span style={{ color: returnColor }}>
              {returns >= 0 ? '+' : ''}{returns.toFixed(2)}%
            </span>
          </p>
        </div>
      </div>

      {/* Candlestick Chart */}
      <div className="w-full h-64 glass border border-white/20 rounded-[16px] p-4 bg-gradient-to-br from-gray-900 to-black overflow-hidden">
        {candleData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart
              data={candleData}
              margin={{ top: 20, right: 30, bottom: 20, left: 60 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.1)"
                vertical={false}
              />
              <XAxis
                type="number"
                dataKey="x"
                name="Period"
                tick={{ fill: '#9CA3AF', fontSize: 10 }}
                stroke="rgba(255,255,255,0.1)"
                domain={['dataMin - 1', 'dataMax + 1']}
                tickFormatter={(value) => {
                  if (candleData[value]) {
                    return candleData[value].date;
                  }
                  return '';
                }}
              />
              <YAxis
                type="number"
                dataKey="y"
                name="Price"
                tick={{ fill: '#9CA3AF', fontSize: 10 }}
                stroke="rgba(255,255,255,0.1)"
              />
              <Tooltip content={<CustomCandleTooltip />} cursor={{ fill: 'rgba(255,255,255,0.1)' }} />

              <Scatter
                name="Candles"
                data={candleData}
                shape={<CustomCandleShape />}
              >
                {candleData.map((entry, index) => (
                  <Cell key={`cell-${index}`} />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <p className="text-gray-400 text-sm">Loading chart data...</p>
          </div>
        )}
      </div>

      {/* Period Selector */}
      <div className="flex gap-2 p-1 bg-gray-800/50 rounded-full border border-white/10 w-full">
        {['1y', '3y', '5y', 'all'].map((p) => (
          <button
            key={p}
            onClick={() => handlePeriodChange(p as '1y' | '3y' | '5y' | 'all')}
            className={`px-4 py-2 rounded-full text-[8px] font-black tracking-widest transition-all uppercase flex-1
              ${
                selectedPeriod === p
                  ? 'bg-white text-black'
                  : 'text-gray-400 hover:text-white'
              }`}
          >
            {p === 'all' ? 'ALL' : p}
          </button>
        ))}
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-2 text-[8px]">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-emerald-500 rounded-sm" />
          <span className="text-gray-400">Bullish (Close ≥ Open)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded-sm" />
          <span className="text-gray-400">Bearish (Close &lt; Open)</span>
        </div>
      </div>
    </div>
  );
};

export default CandleChart;
