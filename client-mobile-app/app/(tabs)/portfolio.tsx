// Tab categories for the UI
  const tabs = [
    'Equity',
    'Hybrid',
    'Debt',
    'Solution Oriented',
    'Other',
  ];
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MUTUAL_FUND_CATEGORIES } from '../../constants/funds';

// List of all AMC names (from advanced-predict.tsx)
const AMC_NAME_OPTIONS = [
  'Aditya Birla Sun Life Mutual Fund', 'Axis Mutual Fund', 'Bandhan Mutual Fund', 'Bank of India Mutual Fund',
  'Baroda BNP Paribas Mutual Fund', 'Edelweiss Mutual Fund', 'Canara Robeco Mutual Fund', 'DSP Mutual Fund',
  'Franklin Templeton Mutual Fund', 'HDFC Mutual Fund', 'HSBC Mutual Fund', 'ICICI Prudential Mutual Fund',
  'IDBI Mutual Fund', 'IIFL Mutual Fund', 'Indiabulls Mutual Fund', 'Invesco Mutual Fund', 'ITI Mutual Fund',
  'JM Financial Mutual Fund', 'Kotak Mahindra Mutual Fund', 'L&T Mutual Fund', 'LIC Mutual Fund',
  'Mahindra Manulife Mutual Fund', 'Mirae Asset Mutual Fund', 'Motilal Oswal Mutual Fund', 'Navi Mutual Fund',
  'Nippon India Mutual Fund', 'PPFAS Mutual Fund', 'PGIM India Mutual Fund', 'Quant Mutual Fund',
  'Quantum Mutual Fund', 'SBI Mutual Fund', 'Shriram Mutual Fund', 'Sundaram Mutual Fund', 'Tata Mutual Fund',
  'Taurus Mutual Fund', 'Trust Mutual Fund', 'Union Mutual Fund', 'UTI Mutual Fund', 'WhiteOak Capital Mutual Fund'
];

// --- Top Funds Recommendation Logic ---
// Flatten all funds from all categories
const allFunds = MUTUAL_FUND_CATEGORIES.flatMap(cat => cat.funds.map(fund => ({
  ...fund,
  category: cat.title,
})));

// Simulate predicted returns for each fund (replace with API if needed)
const fundsWithReturns = allFunds.map(fund => ({
  ...fund,
  predictedReturn: (Math.random() * 20 + 5).toFixed(2), // 5% to 25%
}));

// Sort by predicted return descending
const topFunds = fundsWithReturns.sort((a, b) => Number(b.predictedReturn) - Number(a.predictedReturn)).slice(0, 5);

const holdings = [
  {
    id: 1,
    name: 'BLUE CHIP GROWTH',
    type: 'Large Cap',
    value: '₹4.2L',
    change: '+12%',
    icon: 'chart-pie',
  },
  {
    id: 2,
    name: 'NIFTY 50 INDEX',
    type: 'Index Fund',
    value: '₹2.8L',
    change: '+8.4%',
    icon: 'chart-line',
  },
  {
    id: 3,
    name: 'CORP BOND FUND',
    type: 'AAA Rated',
    value: '₹1.5L',
    change: '+4.2%',
    icon: 'piggy-bank',
  },
  {
    id: 4,
    name: 'SOVEREIGN GOLD',
    type: 'SGB 2024',
    value: '₹1.1L',
    change: '+2.1%',
    icon: 'coins',
  },
];



// Map category to a valid sub_category (first option from advanced-predict.tsx)
const SUB_CATEGORY_MAP: Record<string, string> = {
  'Equity': 'Large Cap Mutual Funds',
  'Hybrid': 'Aggressive Hybrid Mutual Funds',
  'Debt': 'Corporate Bond Mutual Funds',
  'Solution Oriented': 'Retirement Funds',
  'Other': 'Multi Cap Funds',
};

export default function PortfolioScreen() {
  const [activeTab, setActiveTab] = useState('Equity');
  const [topFundsByAMC, setTopFundsByAMC] = React.useState<Record<string, any[]>>({});
  const [topFundsErrorsByAMC, setTopFundsErrorsByAMC] = React.useState<Record<string, string>>({});
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    setLoading(true);
    const fetchAll = async () => {
      const results: Record<string, any[]> = {};
      const errors: Record<string, string> = {};
      await Promise.all(AMC_NAME_OPTIONS.map(async (amc) => {
        try {
          const body = {
            min_sip: 5000,
            fund_age_yr: 5,
            category: activeTab,
            sub_category: SUB_CATEGORY_MAP[activeTab] || '',
            min_lumpsum: 10000,
            expense_ratio: 1.5,
            fund_size_cr: 2000,
            sortino: 0.5,
            alpha: 2.0,
            sd: 10.0,
            beta: 1.0,
            sharpe: 0.8,
            risk_level: 3,
            amc_name: amc,
            rating: 4.5,
          };
          const res = await fetch('https://pred-mod-776087882401.europe-west1.run.app/predict', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
          });
          const data = await res.json();
          if (data.detail) {
            errors[amc] = typeof data.detail === 'string' ? data.detail : JSON.stringify(data.detail);
            results[amc] = [];
          } else if (Array.isArray(data)) {
            results[amc] = data.sort((a: any, b: any) => (b.returns_3yr ?? 0) - (a.returns_3yr ?? 0)).slice(0, 3);
          } else if (data && data.funds) {
            results[amc] = data.funds.sort((a: any, b: any) => (b.returns_3yr ?? 0) - (a.returns_3yr ?? 0)).slice(0, 3);
          } else if (data && typeof data === 'object' && data.returns_3yr !== undefined) {
            results[amc] = [data];
          } else {
            results[amc] = [];
          }
        } catch (err) {
          errors[amc] = 'Network or parsing error';
          results[amc] = [];
        }
      }));
      setTopFundsByAMC(results);
      setTopFundsErrorsByAMC(errors);
      setLoading(false);
    };
    fetchAll();
  }, [activeTab]);

  // Compute the top 5 AMCs by predicted 3Y return (descending)
  const top5AMCEntries = React.useMemo(() => {
    // Flatten to [amc, fund] pairs for AMCs with at least one fund
    const entries: [string, any][] = Object.entries(topFundsByAMC)
      .filter(([_, funds]) => Array.isArray(funds) && funds.length > 0)
      .map(([amc, funds]) => [amc, funds[0]]); // Only use the top fund per AMC
    // Sort by predicted 3Y return descending
    entries.sort((a, b) => (b[1]?.returns_3yr ?? 0) - (a[1]?.returns_3yr ?? 0));
    return entries.slice(0, 5);
  }, [topFundsByAMC]);

  // Example static distribution (should sum to 100)
  const categoryDistribution: Record<string, number> = {
    'Equity': 60,
    'Hybrid': 15,
    'Debt': 12,
    'Solution Oriented': 8,
    'Other': 5,
  };
  const selectedPercent = categoryDistribution[activeTab] || 0;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Top Mutual Fund Predictions</Text>
          <TouchableOpacity style={styles.profileButton}>
            <Ionicons name="person-add" size={20} color="black" />
          </TouchableOpacity>
        </View>

        {/* Net Worth & Chart */}
        <View style={styles.chartSection}>
          <Text style={styles.netWorthLabel}>NET WORTH</Text>
          <Text style={styles.netWorthValue}>₹12,50,000</Text>

          <View style={styles.chartContainer}>
            {/* Donut Chart with dynamic segment */}
            <View style={styles.donutChart}>
              <View style={styles.donutInner}>
                <Text style={styles.chartLabel}>{activeTab.toUpperCase()}</Text>
                <Text style={styles.chartValue}>{selectedPercent}<Text style={styles.percentSymbol}>%</Text></Text>
                <View style={styles.chartBadge}>
                  <Ionicons name="arrow-up" size={12} color="black" />
                  <Text style={styles.chartBadgeText}>+12.4%</Text>
                </View>
              </View>
            </View>
            {/* Simulated segments for each category */}
            {/* Draw colored arcs for each category's percent */}
            {Object.entries(categoryDistribution).map(([cat, percent], idx) => {
              // Calculate rotation and color for each segment
              const startAngle = Object.entries(categoryDistribution)
                .slice(0, idx)
                .reduce((sum, [, p]) => sum + p, 0) * 3.6 - 90; // -90 to start at top
              const segmentColor = cat === activeTab ? '#111827' : '#E5E7EB';
              return (
                <View
                  key={cat}
                  style={[
                    styles.segment,
                    {
                      borderTopColor: segmentColor,
                      borderRightColor: segmentColor,
                      transform: [
                        { rotate: `${startAngle}deg` },
                        { scaleX: percent / 100 },
                      ],
                    },
                  ]}
                />
              );
            })}
          </View>
        </View>

        {/* Tabs */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsContainer}>

          {tabs.map((tab: string) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.activeTab]}
              onPress={() => setActiveTab(tab)}
            >
              {activeTab === tab && <View style={styles.activeDot} />}
              <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Top Funds by AMC Section */}
        <View style={styles.holdingsContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>TOP FUNDS TO INVEST (by AMC)</Text>
          </View>
          {loading ? (
            <Text style={{ color: '#000', textAlign: 'center', marginVertical: 24 }}>Loading predictions for all AMCs...</Text>
          ) : (
            top5AMCEntries.map(([amc, fund], idx) => (
              <View key={amc} style={{ marginBottom: 24 }}>
                <Text style={{ fontWeight: 'bold', color: '#111827', marginBottom: 8 }}>{amc}</Text>
                <View style={styles.holdingsList}>
                  <View style={styles.holdingCard}>
                    <View style={styles.holdingIcon}>
                      <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 18 }}>{idx + 1}</Text>
                    </View>
                    <View style={styles.holdingInfo}>
                      <Text style={styles.holdingName}>{fund.name || fund.fund_name}</Text>
                      <Text style={styles.holdingType}>{activeTab}</Text>
                    </View>
                    <View style={styles.holdingValueContainer}>
                      <Text style={styles.holdingValue}>{fund.returns_3yr != null ? `${fund.returns_3yr}%` : '--'}</Text>
                      <Text style={styles.holdingChange}>Predicted 3Y Return</Text>
                    </View>
                  </View>
                </View>
              </View>
            ))
          )}
        </View>

        {/* Spacer */}
        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollContent: {
    paddingTop: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1,
    color: '#6B7280',
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  chartSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  netWorthLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1,
    color: '#9CA3AF',
    marginBottom: 8,
  },
  netWorthValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 32,
  },
  chartContainer: {
    width: 280,
    height: 280,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  donutChart: {
    width: 280,
    height: 280,
    borderRadius: 140,
    borderWidth: 10,
    borderColor: '#E5E7EB', // Light gray base
    justifyContent: 'center',
    alignItems: 'center',
  },
  donutInner: {
    alignItems: 'center',
  },
  chartLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 2,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  chartValue: {
    fontSize: 64,
    fontWeight: 'bold',
    color: 'black',
    lineHeight: 70,
  },
  percentSymbol: {
    fontSize: 32,
    color: '#9CA3AF',
  },
  chartBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 8,
    gap: 4,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  chartBadgeText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'black',
  },
  segment: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 140,
    borderWidth: 10,
    borderColor: 'transparent',
    borderTopColor: '#4B5563', // Dark gray segment
    borderRightColor: '#4B5563',
    transform: [{ rotate: '-45deg' }],
  },
  tabsContainer: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    backgroundColor: 'white',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    gap: 8,
  },
  activeTab: {
    backgroundColor: 'black',
    borderColor: 'black',
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'white',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  activeTabText: {
    color: 'white',
  },
  holdingsContainer: {
    paddingHorizontal: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1,
    color: '#9CA3AF',
  },
  holdingsList: {
    gap: 16,
  },
  holdingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  holdingIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  holdingInfo: {
    flex: 1,
  },
  holdingName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  holdingType: {
    fontSize: 12,
    color: '#6B7280',
  },
  holdingValueContainer: {
    alignItems: 'flex-end',
  },
  holdingValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  holdingChange: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#6B7280',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
});
