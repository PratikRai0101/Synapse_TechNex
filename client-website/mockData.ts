
export interface FundPoint {
  time: string;
  nav: number;
  benchmark: number;
}

export interface Fund {
  id: string;
  name: string;
  category: string;
  amc: string;
  rating: number;
  returns3y: number;
  risk: 'Low' | 'Moderate' | 'High' | 'Very High';
  alpha: number;
  beta: number;
  stdDev: number;
  nav: number;
  expenseRatio: number;
  isCredSelect: boolean;
  allocation: { name: string; value: number; color: string }[];
  historicalPoints: FundPoint[];
}

export const MOCK_FUNDS: Fund[] = [
  {
    id: '1',
    name: 'Axis Bluechip Fund',
    category: 'Large Cap • Equity',
    amc: 'Axis Mutual Fund',
    rating: 5,
    returns3y: 18.42,
    risk: 'Very High',
    alpha: 2.1,
    beta: 0.85,
    stdDev: 14.2,
    nav: 142.50,
    expenseRatio: 0.65,
    isCredSelect: true,
    allocation: [
      { name: 'Equity', value: 95, color: '#3D5AFE' },
      { name: 'Cash', value: 5, color: '#666666' }
    ],
    historicalPoints: generateHistory(100, 140)
  },
  {
    id: '2',
    name: 'SBI Small Cap Fund',
    category: 'Small Cap • Equity',
    amc: 'SBI Mutual Fund',
    rating: 4,
    returns3y: 24.12,
    risk: 'High',
    alpha: 4.5,
    beta: 1.1,
    stdDev: 18.5,
    nav: 92.40,
    expenseRatio: 0.82,
    isCredSelect: false,
    allocation: [
      { name: 'Equity', value: 98, color: '#3D5AFE' },
      { name: 'Cash', value: 2, color: '#666666' }
    ],
    historicalPoints: generateHistory(70, 92)
  },
  {
    id: '3',
    name: 'Mirae Asset Emerging Bluechip',
    category: 'Large & Mid Cap • Equity',
    amc: 'Mirae Asset Mutual Fund',
    rating: 5,
    returns3y: 21.05,
    risk: 'High',
    alpha: 3.2,
    beta: 0.95,
    stdDev: 16.1,
    nav: 108.20,
    expenseRatio: 0.70,
    isCredSelect: false,
    allocation: [
      { name: 'Equity', value: 96, color: '#3D5AFE' },
      { name: 'Debt', value: 2, color: '#00FF41' },
      { name: 'Cash', value: 2, color: '#666666' }
    ],
    historicalPoints: generateHistory(85, 108)
  },
  {
    id: '4',
    name: 'Parag Parikh Flexi Cap',
    category: 'Flexi Cap • Equity',
    amc: 'PPFAS Mutual Fund',
    rating: 5,
    returns3y: 19.80,
    risk: 'Moderate',
    alpha: 2.8,
    beta: 0.72,
    stdDev: 12.8,
    nav: 64.15,
    expenseRatio: 0.76,
    isCredSelect: true,
    allocation: [
      { name: 'Equity', value: 88, color: '#3D5AFE' },
      { name: 'Foreign Equity', value: 10, color: '#FF4D00' },
      { name: 'Cash', value: 2, color: '#666666' }
    ],
    historicalPoints: generateHistory(45, 64)
  }
];

function generateHistory(start: number, end: number): FundPoint[] {
  const points: FundPoint[] = [];
  const count = 20;
  for (let i = 0; i < count; i++) {
    const ratio = i / (count - 1);
    const nav = start + (end - start) * ratio + (Math.random() - 0.5) * 5;
    const benchmark = start * 0.95 + (end - start) * 0.8 * ratio + (Math.random() - 0.5) * 3;
    points.push({
      time: `${10 + Math.floor(i / 5)}:00 AM`,
      nav,
      benchmark
    });
  }
  return points;
}

export const PORTFOLIO_STATS = {
  totalValue: 124500,
  dayChange: 340,
  dayChangePercent: 0.5,
  xirr: 14.2,
  invested: 89200
};

export const RECENT_TRANSACTIONS = [
  { name: 'SIP Instalment - Mirae Asset', type: 'Equity', date: 'Oct 24, 2023', amount: 5000, status: 'Completed' },
  { name: 'SIP Instalment - Axis Bluechip', type: 'Equity', date: 'Oct 22, 2023', amount: 2500, status: 'Completed' },
  { name: 'Gold ETF Purchase', type: 'Commodity', date: 'Oct 18, 2023', amount: 12400, status: 'Completed' },
];
