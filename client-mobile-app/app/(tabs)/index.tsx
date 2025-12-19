import { FeaturedFunds } from '@/components/featured-funds';
import { MUTUAL_FUND_CATEGORIES } from '@/constants/funds';
import { useFetchFunds } from '@/hooks/use-fetch-funds';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LineChart } from 'react-native-wagmi-charts';

// Custom hook to fetch recommended fund
function getAllFunds() {
  return MUTUAL_FUND_CATEGORIES.flatMap(cat => cat.funds);
}

function getRandomFund(funds: { code: string; name: string }[], excludeCode?: string) {
  const filtered = excludeCode ? funds.filter(f => f.code !== excludeCode) : funds;
  return filtered[Math.floor(Math.random() * filtered.length)];
}

function useRecommendedFundRotating() {
  const allFunds = getAllFunds();
  const [currentFund, setCurrentFund] = useState(() => getRandomFund(allFunds));
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFund = (fund: { code: string; name: string }) => {
    setLoading(true);
    setError(null);
    fetch(`https://api.mfapi.in/mf/${fund.code}`)
      .then(res => {
        if (!res.ok) throw new Error('Network error');
        return res.json();
      })
      .then(json => setData(json))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchFund(currentFund);
    // eslint-disable-next-line
  }, [currentFund.code]);

  const refresh = () => {
    const nextFund = getRandomFund(allFunds, currentFund.code);
    setCurrentFund(nextFund);
  };

  return { data, loading, error, refresh, fund: currentFund };
}

export default function HomeScreen() {
  const router = useRouter();
  const [query] = useState('Axis');
  const { data: funds, loading: fundsLoading, error: fundsError } = useFetchFunds(query);
  const { data: recFund, loading: recLoading, error: recError, refresh, fund: recFundMeta } = useRecommendedFundRotating();

  // Extract values for the card
  const fundName = recFund?.meta?.scheme_name || recFundMeta?.name || 'Recommended Mutual Fund';
  const navData = recFund?.data || [];
  const latestNav = navData[0] ? parseFloat(navData[0].nav) : 0;
  const prevNav = navData[1] ? parseFloat(navData[1].nav) : 0;
  const change = latestNav - prevNav;
  const percentChange = prevNav ? (change / prevNav) * 100 : 0;
  const chartData = navData.slice(0, 30).map((d: any) => ({ value: parseFloat(d.nav) })).reverse();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.userInfo}>
            <View style={styles.avatarContainer}>
                <Ionicons name="person" size={24} color="#F59E0B" />
            </View>
            <View>
              <Text style={styles.greeting}>Good Morning</Text>
              <Text style={styles.userName}>Welcome Synapse</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Ionicons name="notifications" size={24} color="black" />
          </TouchableOpacity>
        </View>

        {/* Recommended Mutual Fund Section */}
        <View style={styles.portfolioCard}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
            <Text style={{ fontSize: 12, color: '#6B7280', fontWeight: '500' }}>Recommended Mutual Fund</Text>
            <TouchableOpacity onPress={refresh} style={{ padding: 4 }}>
              <Ionicons name="refresh" size={18} color="#111827" />
            </TouchableOpacity>
          </View>
          <View style={styles.portfolioHeader}>
            <View style={styles.portfolioTitleContainer}>
                <Ionicons name="pie-chart" size={16} color="black" />
                <Text style={styles.portfolioLabel}>{fundName}</Text>
            </View>
            <View style={styles.percentBadge}>
              <Ionicons name="trending-up" size={12} color="black" />
              <Text style={styles.percentText}>{percentChange > 0 ? '+' : ''}{percentChange.toFixed(2)}%</Text>
            </View>
          </View>
          {recLoading ? (
            <ActivityIndicator size="small" color="#111827" style={{ marginVertical: 24 }} />
          ) : recError ? (
            <Text style={{ color: 'red', marginVertical: 24 }}>Error: {recError}</Text>
          ) : (
            <>
              <View style={styles.valueContainer}>
                <Text style={styles.currency}>₹</Text>
                <Text style={styles.value}>{latestNav.toLocaleString()}</Text>
                <Text style={styles.cents}>.00</Text>
              </View>
              <Text style={styles.monthlyChange}>{change > 0 ? '+' : ''}₹{change.toLocaleString()} this month</Text>
              {/* Live Chart */}
              <View style={styles.graphContainer}>
                {chartData.length > 1 ? (
                  <LineChart.Provider data={chartData}>
                    <LineChart width={260} height={60} style={{ backgroundColor: 'transparent' }}>
                      <LineChart.Path color="#111827" width={3} />
                    </LineChart>
                  </LineChart.Provider>
                ) : (
                  <View style={styles.graphLine} />
                )}
                <View style={styles.athBadge}>
                  <Text style={styles.athText}>ATH</Text>
                </View>
              </View>
            </>
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionButton}>
            <View style={styles.actionIcon}>
              <Ionicons name="wallet" size={24} color="black" />
            </View>
            <Text style={styles.actionLabel}>Invest</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <View style={styles.actionIcon}>
              <Ionicons name="sync" size={24} color="black" />
            </View>
            <Text style={styles.actionLabel}>SIP</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <View style={styles.actionIcon}>
              <Ionicons name="arrow-up-circle" size={24} color="black" style={{transform: [{rotate: '45deg'}]}} />
            </View>
            <Text style={styles.actionLabel}>Redeem</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <View style={styles.actionIcon}>
              <Ionicons name="grid" size={24} color="black" />
            </View>
            <Text style={styles.actionLabel}>More</Text>
          </TouchableOpacity>
        </View>

        {/* Top Performing Funds (Featured) */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Top Performing Funds</Text>
        </View>
        <FeaturedFunds />
        
        {/* Spacer for Bottom Tab */}
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
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FEF3C7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 12,
    color: '#6B7280',
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
  },
  notificationButton: {
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
  portfolioCard: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  portfolioHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  portfolioTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  portfolioLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  percentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  percentText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'black',
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  currency: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  value: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#111827',
  },
  cents: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#9CA3AF',
  },
  monthlyChange: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
    marginBottom: 24,
  },
  graphContainer: {
    height: 100,
    justifyContent: 'flex-end',
    position: 'relative',
  },
  graphLine: {
    height: 60,
    borderTopWidth: 3,
    borderTopColor: 'black',
    borderRightWidth: 0,
    borderLeftWidth: 0,
    borderStyle: 'solid',
    borderRadius: 0, // Placeholder for curve
    // In real app use SVG
  },
  athBadge: {
    position: 'absolute',
    top: 20,
    right: 40,
    backgroundColor: 'black',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  athText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  actionButton: {
    alignItems: 'center',
    gap: 8,
  },
  actionIcon: {
    width: 56,
    height: 56,
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
  actionLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  viewAllText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#9CA3AF',
  },
  fundsList: {
    gap: 16,
  },
  fundCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  fundIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  fundInfo: {
    flex: 1,
  },
  fundName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  fundCategory: {
    fontSize: 12,
    color: '#6B7280',
  },
  fundPrice: {
    alignItems: 'flex-end',
  },
  priceText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  changeBadge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  changeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: 'black',
  },
});
