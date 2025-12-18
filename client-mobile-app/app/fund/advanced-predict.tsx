import Slider from '@react-native-community/slider';
import { Picker } from '@react-native-picker/picker';
import React, { useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function AdvancedPredictScreen() {
  // All possible fields
  const [input, setInput] = useState({
    min_sip: 5000,
    fund_age_yr: 5,
    category: 'Equity',
    sub_category: 'FoFs Domestic',
    min_lumpsum: 10000,
    expense_ratio: 1.5,
    fund_size_cr: 2000,
    sortino: 0.5,
    alpha: 2.0,
    sd: 10.0,
    beta: 1.0,
    sharpe: 0.8,
    risk_level: 3,
    amc_name: 'HDFC Mutual Fund',
    rating: 4.5,
  });

  // Provided lists
  const CATEGORY_OPTIONS = [
    'Equity',
    'Hybrid',
    'Debt',
    'Solution Oriented',
    'Other',
  ] as const;

  type Category = typeof CATEGORY_OPTIONS[number];

  const SUB_CATEGORY_OPTIONS: Record<Category, string[]> = {
    'Equity': [
      'Sectoral / Thematic Mutual Funds', 'Dividend Yield Funds', 'Large & Mid Cap Funds', 'Flexi Cap Funds',
      'Focused Funds', 'Large Cap Mutual Funds', 'Mid Cap Mutual Funds', 'Index Funds', 'Value Funds',
      'Small Cap Mutual Funds', 'ELSS Mutual Funds', 'Multi Cap Funds', 'Contra Funds',
    ],
    'Hybrid': [
      'Arbitrage Mutual Funds', 'Dynamic Asset Allocation or Balanced Advantage', 'Aggressive Hybrid Mutual Funds',
      'Equity Savings Mutual Funds', 'Conservative Hybrid Mutual Funds', 'Multi Asset Allocation Mutual Funds',
    ],
    'Debt': [
      'Banking and PSU Mutual Funds', 'Corporate Bond Mutual Funds', 'Credit Risk Funds', 'Dynamic Bond',
      'FoFs Domestic', 'FoFs Overseas', 'Gilt Mutual Funds', 'Medium to Long Duration Funds', 'Liquid Mutual Funds',
      'Low Duration Funds', 'Medium Duration Funds', 'Money Market Funds', 'Overnight Mutual Funds',
      'Ultra Short Duration Funds', 'Short Duration Funds', 'Fixed Maturity Plans', 'Floater Mutual Funds',
    ],
    'Solution Oriented': [
      'Childrens Funds', 'Retirement Funds',
    ],
    'Other': [
      'Dynamic Bond', 'Value Funds', 'Multi Cap Funds', 'Contra Funds',
    ],
  };

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
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePredict = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const response = await fetch('https://pred-mod-776087882401.europe-west1.run.app/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });
      const text = await response.text();
      if (!response.ok) throw new Error('Network response was not ok: ' + text);
      let data;
      try {
        data = JSON.parse(text);
      } catch (err) {
        throw new Error('Invalid JSON: ' + text);
      }
      setResult(data);
    } catch (e: any) {
      setError(e.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Advanced Benchmark Prediction</Text>
      <View style={styles.inputBox}>
        <Text style={styles.inputTitle}>All Parameters</Text>
        {/* SIP Amount Slider */}
        <View style={styles.inputRow}>
          <Text style={styles.inputKey}>SIP Amount</Text>
          <View style={{flex: 1, alignItems: 'stretch', marginLeft: 8}}>
            <Slider
              value={input.min_sip}
              minimumValue={500}
              maximumValue={50000}
              step={500}
              minimumTrackTintColor="#000"
              maximumTrackTintColor="#000"
              thumbTintColor="#000"
              onValueChange={v => setInput(i => ({ ...i, min_sip: v }))}
            />
            <Text style={{ color: '#000', alignSelf: 'flex-end' }}>{input.min_sip}</Text>
          </View>
        </View>
        {/* Fund Age Slider */}
        <View style={styles.inputRow}>
          <Text style={styles.inputKey}>Fund Age (Years)</Text>
          <View style={{flex: 1, alignItems: 'stretch', marginLeft: 8}}>
            <Slider
              value={input.fund_age_yr}
              minimumValue={1}
              maximumValue={30}
              step={1}
              minimumTrackTintColor="#000"
              maximumTrackTintColor="#000"
              thumbTintColor="#000"
              onValueChange={v => setInput(i => ({ ...i, fund_age_yr: v }))}
            />
            <Text style={{ color: '#000', alignSelf: 'flex-end' }}>{input.fund_age_yr}</Text>
          </View>
        </View>
        {/* Category Dropdown */}
        <View style={styles.inputRow}>
          <Text style={styles.inputKey}>Category</Text>
          <View style={{flex: 1}}>
            <Picker
              selectedValue={input.category}
              style={{ color: '#000', backgroundColor: '#fff' }}
              onValueChange={v => setInput(i => ({ ...i, category: v }))}
            >
              {CATEGORY_OPTIONS.map(opt => (
                <Picker.Item key={opt} label={opt} value={opt} />
              ))}
            </Picker>
          </View>
        </View>
        {/* Sub Category Dropdown */}
        <View style={styles.inputRow}>
          <Text style={styles.inputKey}>Sub Category</Text>
          <View style={{flex: 1}}>
            <Picker
              selectedValue={input.sub_category}
              style={{ color: '#000', backgroundColor: '#fff' }}
              onValueChange={v => setInput(i => ({ ...i, sub_category: v }))}
            >
              {(SUB_CATEGORY_OPTIONS[input.category as Category] || []).map((opt: string) => (
                <Picker.Item key={opt} label={opt} value={opt} />
              ))}
            </Picker>
          </View>
        </View>
        {/* Lumpsum */}
        <View style={styles.inputRow}>
          <Text style={styles.inputKey}>Min Lumpsum</Text>
          <View style={{flex: 1, alignItems: 'stretch', marginLeft: 8}}>
            <Slider
              value={input.min_lumpsum}
              minimumValue={1000}
              maximumValue={100000}
              step={1000}
              minimumTrackTintColor="#000"
              maximumTrackTintColor="#000"
              thumbTintColor="#000"
              onValueChange={v => setInput(i => ({ ...i, min_lumpsum: v }))}
            />
            <Text style={{ color: '#000', alignSelf: 'flex-end' }}>{input.min_lumpsum}</Text>
          </View>
        </View>
        {/* Expense Ratio */}
        <View style={styles.inputRow}>
          <Text style={styles.inputKey}>Expense Ratio</Text>
          <View style={{flex: 1, alignItems: 'stretch', marginLeft: 8}}>
            <Slider
              value={input.expense_ratio}
              minimumValue={0}
              maximumValue={5}
              step={0.01}
              minimumTrackTintColor="#000"
              maximumTrackTintColor="#000"
              thumbTintColor="#000"
              onValueChange={v => setInput(i => ({ ...i, expense_ratio: v }))}
            />
            <Text style={{ color: '#000', alignSelf: 'flex-end' }}>{input.expense_ratio}</Text>
          </View>
        </View>
        {/* Fund Size */}
        <View style={styles.inputRow}>
          <Text style={styles.inputKey}>Fund Size (Cr)</Text>
          <View style={{flex: 1, alignItems: 'stretch', marginLeft: 8}}>
            <Slider
              value={input.fund_size_cr}
              minimumValue={10}
              maximumValue={10000}
              step={10}
              minimumTrackTintColor="#000"
              maximumTrackTintColor="#000"
              thumbTintColor="#000"
              onValueChange={v => setInput(i => ({ ...i, fund_size_cr: v }))}
            />
            <Text style={{ color: '#000', alignSelf: 'flex-end' }}>{input.fund_size_cr}</Text>
          </View>
        </View>
        {/* Fund Metrics */}
        {[
          { key: 'sortino', label: 'Sortino', min: 0, max: 3, step: 0.01 },
          { key: 'alpha', label: 'Alpha', min: -5, max: 10, step: 0.01 },
          { key: 'sd', label: 'SD', min: 0, max: 50, step: 0.1 },
          { key: 'beta', label: 'Beta', min: 0, max: 3, step: 0.01 },
          { key: 'sharpe', label: 'Sharpe', min: 0, max: 3, step: 0.01 },
          { key: 'risk_level', label: 'Risk Level', min: 1, max: 5, step: 1 },
          { key: 'rating', label: 'Rating', min: 1, max: 5, step: 0.1 },
        ].map(slider => (
          <View style={styles.inputRow} key={slider.key}>
            <Text style={styles.inputKey}>{slider.label}</Text>
            <View style={{flex: 1, alignItems: 'stretch', marginLeft: 8}}>
              <Slider
                value={input[slider.key as keyof typeof input] as number}
                minimumValue={slider.min}
                maximumValue={slider.max}
                step={slider.step}
                minimumTrackTintColor="#000"
                maximumTrackTintColor="#000"
                thumbTintColor="#000"
                onValueChange={v => setInput(i => ({ ...i, [slider.key]: v }))}
              />
              <Text style={{ color: '#000', alignSelf: 'flex-end' }}>{input[slider.key as keyof typeof input]}</Text>
            </View>
          </View>
        ))}
        {/* AMC Name Dropdown */}
        <View style={styles.inputRow}>
          <Text style={styles.inputKey}>AMC Name</Text>
          <View style={{flex: 1}}>
            <Picker
              selectedValue={input.amc_name}
              style={{ color: '#000', backgroundColor: '#fff' }}
              onValueChange={v => setInput(i => ({ ...i, amc_name: v }))}
            >
              {AMC_NAME_OPTIONS.map(opt => (
                <Picker.Item key={opt} label={opt} value={opt} />
              ))}
            </Picker>
          </View>
        </View>
      </View>
      <TouchableOpacity
        style={{
          backgroundColor: '#000',
          borderRadius: 24,
          paddingVertical: 16,
          paddingHorizontal: 32,
          marginTop: 24,
          marginBottom: 32,
        }}
        onPress={handlePredict}
        disabled={loading}
      >
        <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16, textAlign: 'center' }}>
          Predict
        </Text>
      </TouchableOpacity>
      {loading && <ActivityIndicator color="#000" size="large" style={{ marginTop: 32 }} />}
      {error && <Text style={styles.error}>{error}</Text>}
      {result && (
        <View style={styles.resultBox}>
          <Text style={styles.resultLabel}>1 Year Return:</Text>
          <Text style={styles.resultValue}>{result.returns_1yr ?? '--'}%</Text>
          <Text style={styles.resultLabel}>3 Year Return:</Text>
          <Text style={styles.resultValue}>{result.returns_3yr ?? '--'}%</Text>
          <Text style={styles.resultLabel}>5 Year Return:</Text>
          <Text style={styles.resultValue}>{result.returns_5yr ?? '--'}%</Text>
          
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 24,
  },
  error: {
    color: '#dc2626',
    fontWeight: 'bold',
    marginTop: 32,
  },
  resultBox: {
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#000',
    padding: 24,
    marginBottom: 32,
    width: '100%',
  },
  resultLabel: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 8,
  },
  resultValue: {
    color: '#000',
    fontSize: 18,
    marginBottom: 8,
  },
  inputBox: {
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#000',
    padding: 16,
    width: '100%',
  },
  inputTitle: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 8,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  inputKey: {
    color: '#000',
    fontWeight: 'bold',
  },
  inputValue: {
    color: '#000',
  },
});
