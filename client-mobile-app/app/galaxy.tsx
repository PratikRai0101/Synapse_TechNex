// Mapping from fund name to AMC name (expand as needed)
const FUND_TO_AMC: Record<string, string> = {
  'Quant Small Cap Fund': 'Quant Mutual Fund',
  'Quant Flexi Cap Fund': 'Quant Mutual Fund',
  'Nippon India Small Cap': 'Nippon India Mutual Fund',
  'SBI Small Cap Fund': 'SBI Mutual Fund',
  'ICICI Prudential Technology Fund': 'ICICI Prudential Mutual Fund',
  'Tata Aggressive Hybrid Fund': 'Tata Mutual Fund',
  'ICICI Prudential Equity & Debt': 'ICICI Prudential Mutual Fund',
  'SBI Equity Hybrid Fund': 'SBI Mutual Fund',
  'HDFC Hybrid Equity Fund': 'HDFC Mutual Fund',
  'Quant Multi Asset Fund': 'Quant Mutual Fund',
  'Tata Digital India Fund': 'Tata Mutual Fund',
  'ICICI Prudential Technology': 'ICICI Prudential Mutual Fund',
  'SBI Healthcare Opportunities': 'SBI Mutual Fund',
  'Tata Infrastructure Fund': 'Tata Mutual Fund',
  'UTI Nifty 50 Index Fund': 'UTI Mutual Fund',
  'SBI Magnum Medium Duration': 'SBI Mutual Fund',
  'Aditya Birla SL Credit Risk': 'Aditya Birla Sun Life Mutual Fund',
  'ICICI Pru Corporate Bond': 'ICICI Prudential Mutual Fund',
  'SBI Credit Risk Fund': 'SBI Mutual Fund',
  'Aditya Birla SL Corporate Bond': 'Aditya Birla Sun Life Mutual Fund',
  'SBI Retirement Benefit (Aggressive)': 'SBI Mutual Fund',
  'Tata Retirement Savings (Moderate)': 'Tata Mutual Fund',
  'HDFC Retirement Savings (Equity)': 'HDFC Mutual Fund',
  'Aditya Birla SL Retirement (30s)': 'Aditya Birla Sun Life Mutual Fund',
  'ICICI Prudential BHARAT 22 FOF': 'ICICI Prudential Mutual Fund',
};
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Dimensions, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MUTUAL_FUND_CATEGORIES } from '../constants/funds';

const tabs = ['Equity', 'Hybrid', 'Debt', 'Solution Oriented', 'Other'];
const { width } = Dimensions.get('window');
const gridSize = width / 4;

function getCategoryFunds(tab: string) {
  // Map tab to funds.ts category
  if (tab === 'Equity') return MUTUAL_FUND_CATEGORIES.find(c => c.title.toLowerCase().includes('equity'))?.funds || [];
  if (tab === 'Hybrid') return MUTUAL_FUND_CATEGORIES.find(c => c.title.toLowerCase().includes('hybrid'))?.funds || [];
  if (tab === 'Debt') return MUTUAL_FUND_CATEGORIES.find(c => c.title.toLowerCase().includes('debt'))?.funds || [];
  if (tab === 'Solution Oriented') return MUTUAL_FUND_CATEGORIES.find(c => c.title.toLowerCase().includes('solution'))?.funds || [];
  if (tab === 'Other') return MUTUAL_FUND_CATEGORIES.find(c => c.title.toLowerCase().includes('sectoral'))?.funds || [];
  return [];
}

function getRandomFunds(funds: any[], n: number) {
  const shuffled = [...funds].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, n);
}

async function fetchFundStats(code: string) {
  try {
    const res = await fetch(`https://api.mfapi.in/mf/${code}`);
    const json = await res.json();
    // 3Y return
    const navToday = json.data[0] ? parseFloat(json.data[0].nav) : null;
    const threeYearsAgo = new Date();
    threeYearsAgo.setFullYear(threeYearsAgo.getFullYear() - 3);
    const nav3y = json.data.find((d: any) => {
      const [dd, mm, yyyy] = d.date.split('-');
      const dt = new Date(`${yyyy}-${mm}-${dd}`);
      return Math.abs(dt.getTime() - threeYearsAgo.getTime()) < 1000 * 60 * 60 * 24 * 15;
    });
    const nav3yValue = nav3y ? parseFloat(nav3y.nav) : null;
    let return3y: number | null = null;
    if (navToday && nav3yValue) {
      return3y = ((navToday - nav3yValue) / nav3yValue) * 100;
    }
    // Risk (SD) - use a random value for demo, or fetch if available
    const risk = json.meta && json.meta.risk ? parseFloat(json.meta.risk) : (10 + Math.random() * 10);
    return { return3y, risk };
  } catch {
    return { return3y: null, risk: null };
  }
}

export default function GalaxyViewScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Equity'); // Only for category selection
  const [fundCards, setFundCards] = useState<any[]>([]); // 3 random funds, fixed on mount
  const [stats, setStats] = useState<any[]>([]); // [{predictedReturn, predictedRisk, analyzed}]
  const [frontIdx, setFrontIdx] = useState(0);
  const [loading, setLoading] = useState(false);

  // On mount, pick 3 random funds from all categories and predict their values
  React.useEffect(() => {
    // Gather all funds from all categories
    const allFunds = MUTUAL_FUND_CATEGORIES.flatMap(c => c.funds);
    const randomFunds = getRandomFunds(allFunds, 3);
    setFundCards(randomFunds);
    setStats([
      { predictedReturn: 0, predictedRisk: 0, analyzed: false },
      { predictedReturn: 0, predictedRisk: 0, analyzed: false },
      { predictedReturn: 0, predictedRisk: 0, analyzed: false },
    ]);
    setFrontIdx(0);
    // Predict for each fund with default category 'Equity' (or use fund's category if available)
    randomFunds.forEach((fund, idx) => {
      const body = {
        min_sip: 5000,
        fund_age_yr: 5,
        category: activeTab || 'Equity',
        sub_category: fund.sub_category || 'Large Cap Mutual Funds',
        min_lumpsum: 10000,
        expense_ratio: 1.5,
        fund_size_cr: 2000,
        sortino: 0.5,
        alpha: 2.0,
        sd: 10.0,
        beta: 1.0,
        sharpe: 0.8,
        risk_level: 3,
        amc_name: FUND_TO_AMC[fund.name] || 'HDFC Mutual Fund',
        rating: fund.rating || 4.5,
        fund_name: fund.name,
        fund_code: fund.code,
      };
      fetch('https://pred-mod-776087882401.europe-west1.run.app/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
        .then(res => res.json())
        .then(data => {
          console.log('API response for fund', fund.name, data);
          setStats(prev => prev.map((s, i) => i === idx ? {
            ...s,
            predictedReturn: data && (data.returns_3yr !== undefined && data.returns_3yr !== null) ? Number(data.returns_3yr) : 0,
            predictedRisk: Math.random() * 20 + 5, // Use a random risk for X axis (since API does not return risk)
            analyzed: true,
          } : s));
        })
        .catch(() => {});
    });
  }, []);

  // Rotate cards on close: move front card to back, reset stats for new front card
  const handleClose = () => {
    setFrontIdx((prevIdx) => {
      const newIdx = (prevIdx + 1) % 3;
      // Reset stats for the new front card
      setStats((prevStats) => prevStats.map((s, i) =>
        i === newIdx ? { ...s, predictedReturn: 0, predictedRisk: 0, analyzed: false } : s
      ));
      return newIdx;
    });
  };

  // When category changes, allow re-analyze for the front card
  React.useEffect(() => {
    setStats((prevStats) => prevStats.map((s, i) =>
      i === frontIdx ? { ...s, analyzed: false } : s
    ));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  // Analyze button: call predict API, update predictedReturn/predictedRisk for front card
  const handleAnalyze = async () => {
    setLoading(true);
    const fund = fundCards[frontIdx];
    // Use the selected tab as category, and card's name as amc_name
    const body = {
      min_sip: 5000,
      fund_age_yr: 5,
      category: activeTab,
      sub_category: fund.sub_category || 'Large Cap Mutual Funds',
      min_lumpsum: 10000,
      expense_ratio: 1.5,
      fund_size_cr: 2000,
      sortino: 0.5,
      alpha: 2.0,
      sd: 10.0,
      beta: 1.0,
      sharpe: 0.8,
      risk_level: 3,
      amc_name: FUND_TO_AMC[fund.name] || 'HDFC Mutual Fund',
      rating: fund.rating || 4.5,
      fund_name: fund.name,
      fund_code: fund.code,
    };
    try {
      const res = await fetch('https://pred-mod-776087882401.europe-west1.run.app/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      console.log('API response for ANALYZE', fund.name, data);
      setStats(prev => prev.map((s, i) => i === frontIdx ? {
        ...s,
        predictedReturn: data && (data.returns_3yr !== undefined && data.returns_3yr !== null) ? Number(data.returns_3yr) : 0,
        predictedRisk: Math.random() * 20 + 5, // Use a random risk for X axis (since API does not return risk)
        analyzed: true,
      } : s));
    } catch {
      // fallback: do nothing
    }
    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>GALAXY VIEW</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.activeTab]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Grid */}
      <View style={styles.gridContainer}>
        <View style={styles.yAxis}>
            <Text style={styles.axisLabel}>RETURNS (Y)</Text>
            <View style={styles.yAxisLine} />
        </View>
        <View style={styles.grid}>
          {/* Render grid lines */}
          {Array.from({ length: 5 }).map((_, i) => (
            <View key={`row-${i}`} style={styles.gridRow}>
              {Array.from({ length: 4 }).map((_, j) => (
                <View key={`cell-${i}-${j}`} style={styles.gridCell} />
              ))}
            </View>
          ))}
          {/* Plot analyzed fund dots on grid */}
          {(() => {
            const fund = fundCards[frontIdx];
            const stat = stats[frontIdx] || {};
            if (!stat.analyzed) return null;
            // X: risk (0-25), Y: return (0-25), grid is 4x5 (X: 0-25, Y: 0-25)
            // Clamp values to [0,25]
            const risk = Math.max(0, Math.min(25, stat.predictedRisk || 0));
            const ret = Math.max(0, Math.min(25, stat.predictedReturn || 0));
            // Calculate position: left (risk), top (return)
            // gridSize: cell size, 4 cols (risk), 5 rows (return)
            const left = (risk / 25) * (gridSize * 4 - gridSize/2) + 8; // 8px padding for dot center
            // Move the spot above the mutual fund card (e.g., 220px from bottom)
            const gridHeight = gridSize * 5;
            const cardOffset = 180; // px from bottom, adjust as needed
            const top = Math.max(0, (1 - ret / 25) * (gridHeight - gridSize/2) + 8 - cardOffset);
            // Spot style: white ring, black center, shadow
            return (
              <View
                key={`dot-${fund.code}`}
                style={{
                  position: 'absolute',
                  left,
                  top,
                  zIndex: 20,
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 32,
                  height: 32,
                }}
              >
                <View style={{
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  backgroundColor: 'white',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.12,
                  shadowRadius: 6,
                  elevation: 4,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <View style={{
                    width: 16,
                    height: 16,
                    borderRadius: 8,
                    backgroundColor: 'black',
                  }} />
                </View>
              </View>
            );
          })()}
        </View>
      </View>

      {/* X Axis Label for Risk - move above grid */}
      <View style={{ position: 'absolute', left: 60, right: 50, top: 480, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', zIndex: 30 }} pointerEvents="none">
        <Text style={{ color: '#9CA3AF', fontSize: 12, fontWeight: 'bold', letterSpacing: 1 }}>LOW RISK (X)</Text>
      </View>
      {/* Overlay Card(s) - stack 3, frontIdx is on top */}
      {fundCards.map((fund, idx) => {
        // Stack order: frontIdx is top, next is behind, last is bottom
        const order = (idx - frontIdx + 3) % 3;
        const stat = stats[idx] || { predictedReturn: 0, predictedRisk: 0, analyzed: false };
        return (
          <View
            key={fund.code}
            style={[styles.overlayCard, { zIndex: 10 - order, opacity: order === 0 ? 1 : 0.7, transform: [{ scale: 1 - order * 0.05 }, { translateY: order * 10 }] }]}
            pointerEvents={order === 0 ? 'auto' : 'none'}
          >
            <View style={styles.cardHeader}>
              <View style={styles.fundIcon}>
                <Ionicons name="trending-up" size={16} color="white" />
              </View>
              <Text style={styles.fundCategory}>{activeTab.toUpperCase()} • {(fund.sub_category || 'Large Cap').toUpperCase()}</Text>
              <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
                <Ionicons name="close" size={16} color="#6B7280" />
              </TouchableOpacity>
            </View>
            <Text style={styles.fundName}>{fund.name}</Text>
            <View style={styles.statsRow}>
              <View>
                <Text style={styles.statLabel}>3Y RETURN</Text>
                <Text style={styles.statValue}>
                  {stat.analyzed
                    ? `${stat.predictedReturn > 0 ? '+' : ''}${stat.predictedReturn.toFixed(2)}%`
                    : '0.00%'}
                </Text>
              </View>
              <View style={styles.divider} />
              
              <TouchableOpacity style={styles.analyzeButton} onPress={handleAnalyze} disabled={loading || stat.analyzed}>
                <Text style={styles.analyzeButtonText}>Analyze</Text>
                <Ionicons name="arrow-forward" size={16} color="white" />
              </TouchableOpacity>
            </View>
            <View style={styles.sliderContainer}>
              <View style={styles.sliderTrack}>
                {/* Bar fill based on risk/return: fill % = (predictedReturn - 0)/(25-0) * 100, clamp 0-100 */}
                <View style={[styles.sliderFill, { width: `${stat.analyzed ? Math.max(0, Math.min(100, ((stat.predictedReturn || 0) / 25) * 100)) : 0}%` }]} />
              </View>
              <View style={styles.sliderLabels}>
                <Text style={styles.sliderLabel}>Low Risk</Text>
                <Text style={styles.sliderLabel}>High Return</Text>
              </View>
            </View>
          </View>
        );
      })}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
    color: '#111827',
  },
  tabsContainer: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  tab: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    backgroundColor: '#F3F4F6',
    marginRight: 12,
  },
  activeTab: {
    backgroundColor: 'black',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  activeTabText: {
    color: 'white',
  },
  gridContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  yAxis: {
    width: 40,
    alignItems: 'center',
    paddingTop: 20,
  },
  axisLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#9CA3AF',
    transform: [{ rotate: '-90deg' }],
    width: 100,
    textAlign: 'center',
    marginBottom: 20,
  },
  yAxisLine: {
    flex: 1,
    width: 1,
    backgroundColor: '#E5E7EB',
  },
  grid: {
    flex: 1,
  },
  gridRow: {
    flexDirection: 'row',
    height: gridSize,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  gridCell: {
    width: gridSize,
    height: gridSize,
    borderRightWidth: 1,
    borderRightColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#D1D5DB',
  },
  selectedDotContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedDotRing: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: 'white',
    position: 'absolute',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  selectedDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: 'black',
  },
  connectorLine: {
    position: 'absolute',
    left: 20,
    top: 8,
    width: 40,
    height: 1,
    backgroundColor: '#9CA3AF',
  },
  overlayCard: {
    position: 'absolute',
    bottom: 40,
    left: 24,
    right: 24,
    backgroundColor: '#F9FAFB',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  fundIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  fundCategory: {
    flex: 1,
    fontSize: 10,
    fontWeight: 'bold',
    color: '#6B7280',
    letterSpacing: 1,
  },
  closeButton: {
    padding: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 12,
  },
  fundName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 20,
    width: '70%',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  statLabel: {
    fontSize: 10,
    color: '#6B7280',
    marginBottom: 4,
    fontWeight: '600',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  divider: {
    width: 1,
    height: 30,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 16,
  },
  analyzeButton: {
    marginLeft: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'black',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    gap: 8,
  },
  analyzeButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  sliderContainer: {
    gap: 8,
  },
  sliderTrack: {
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
  },
  sliderFill: {
    width: '60%',
    height: 4,
    backgroundColor: 'black',
    borderRadius: 2,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sliderLabel: {
    fontSize: 10,
    color: '#6B7280',
    fontWeight: '600',
  },
});
