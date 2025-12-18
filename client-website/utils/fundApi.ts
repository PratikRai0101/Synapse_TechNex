// Utility functions to fetch mutual fund data from mfapi.in API and Synapse API

export interface MFData {
  schemeCode: number;
  schemeName: string;
  isin: string;
  nav: string;
  date: string;
}

export interface MFScheme {
  schemeCode: number;
  schemeName: string;
  isin: string;
  category?: string;
  subcategory?: string;
  amc?: string;
}

// New Synapse API Scheme Structure
export interface TopScheme {
  scheme_name: string;
  scheme_code: number;
  min_sip: number;
  min_lumpsum: number;
  expense_ratio: number;
  fund_size_cr: number;
  fund_age_yr: number;
  fund_manager: string;
  sortino: string;
  alpha: string;
  sd: string;
  beta: string;
  sharpe: string;
  risk_level: number;
  amc_name: string;
  rating: number;
  category: string;
  sub_category: string;
  returns_1yr: number;
  returns_3yr: number;
  returns_5yr: number;
}

export interface ProcessedFund {
  id: string;
  name: string;
  schemeCode: number;
  isin: string;
  category: string;
  subCategory: string;
  amc: string;
  rating: number;
  returns1y: number;
  returns3y: number;
  returns5y: number;
  risk: 'Low' | 'Moderate' | 'High' | 'Very High';
  alpha: number;
  beta: number;
  stdDev: number;
  nav: number;
  expenseRatio: number;
  fundSizeCr: number;
  fundAgeYr: number;
  historicalData: { date: string; nav: number }[];
}

// Fetch all schemes from the API with retry logic
export async function fetchAllSchemes(): Promise<MFScheme[]> {
  const maxRetries = 3;
  let lastError: any;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Fetch attempt ${attempt}/${maxRetries}...`);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      const response = await fetch('https://api.mfapi.in/mf', {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
        }
      });
      
      clearTimeout(timeoutId);
      console.log(`Response status: ${response.status}`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const data = await response.json();
      console.log('API data received, parsing...');
      
      // API returns a LIST of schemes, not an object!
      if (!Array.isArray(data)) {
        throw new Error('API response is not an array');
      }

      console.log(`Total schemes in response: ${data.length}`);
      
      const schemes: MFScheme[] = [];
      
      // Take first 50 schemes
      for (let i = 0; i < Math.min(50, data.length); i++) {
        try {
          const item = data[i] as any;
          
          if (!item || typeof item !== 'object') {
            continue;
          }

          const schemeCode = item.schemeCode;
          const schemeName = item.schemeName;

          if (!schemeCode || !schemeName) {
            continue;
          }

          schemes.push({
            schemeCode: schemeCode,
            schemeName: schemeName,
            isin: item.isinGrowth || item.isinDivReinvestment || '',
            category: item.schemeCategory || 'Unknown',
            amc: item.fundHouse || 'Unknown'
          });

          if (i < 3) {
            console.log(`✓ Scheme ${i}: Code=${schemeCode}, Name="${schemeName}"`);
          }
        } catch (e) {
          // Skip problematic entries
        }
      }

      if (schemes.length > 0) {
        console.log(`✓ Successfully fetched ${schemes.length} schemes`);
        return schemes;
      }

      console.warn('No valid schemes parsed from response');
    } catch (error) {
      lastError = error;
      console.error(`Attempt ${attempt} failed:`, error);
      
      if (attempt < maxRetries) {
        console.log(`Retrying in 1 second...`);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  }
  
  console.error('All retry attempts failed:', lastError);
  return [];
}

// Fetch historical data for a specific scheme with caching
const dataCache: { [key: number]: MFData[] } = {};

export async function fetchFundData(schemeCode: number): Promise<MFData[]> {
  // Check cache first
  if (dataCache[schemeCode]) {
    console.log(`Using cached data for scheme ${schemeCode}`);
    return dataCache[schemeCode];
  }

  try {
    console.log(`🔍 Fetching data for scheme code: ${schemeCode}`);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);
    
    const url = `https://api.mfapi.in/mf/${schemeCode}`;
    console.log(`📡 API URL: ${url}`);

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
      }
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      console.warn(`Scheme ${schemeCode}: HTTP ${response.status}`);
      return [];
    }
    
    const data = await response.json();
    
    if (data && data.data && Array.isArray(data.data) && data.data.length > 0) {
      const converted: MFData[] = data.data.map((item: any) => ({
        schemeCode: schemeCode,
        schemeName: data.meta?.fund_house || 'Unknown',
        isin: '',
        nav: String(item.nav || 0),
        date: item.date || ''
      }));
      
      // Cache it
      dataCache[schemeCode] = converted;
      console.log(`Scheme ${schemeCode}: Loaded ${converted.length} data points`);
      return converted;
    }
    
    return [];
  } catch (error) {
    console.warn(`Scheme ${schemeCode} error:`, error instanceof Error ? error.message : 'Unknown error');
    return [];
  }
}

// Calculate returns based on historical data
export function calculateReturns(
  historicalData: { date: string; nav: number }[],
  periodMonths: number
): number {
  if (historicalData.length < 2) return 0;

  const today = new Date();
  const periodDate = new Date();
  periodDate.setMonth(periodDate.getMonth() - periodMonths);

  let startNav = historicalData[historicalData.length - 1].nav;
  let endNav = historicalData[0].nav;

  // Find the closest NAV to the period start date
  for (let i = historicalData.length - 1; i >= 0; i--) {
    const dataDate = new Date(historicalData[i].date);
    if (dataDate <= periodDate) {
      startNav = historicalData[i].nav;
      break;
    }
  }

  if (startNav === 0) return 0;
  return ((endNav - startNav) / startNav) * 100;
}

// Process API data into a standardized format
export function processFundData(scheme: MFScheme, historicalData: MFData[]): ProcessedFund {
  const processedData = historicalData.map(d => ({
    date: d.date,
    nav: parseFloat(d.nav)
  }));

  const returns1y = calculateReturns(processedData, 12);
  const returns3y = calculateReturns(processedData, 36);
  const returns5y = calculateReturns(processedData, 60);

  const latestNav = processedData[0]?.nav || 0;

  // Calculate risk based on category (simplified)
  let risk: 'Low' | 'Moderate' | 'High' | 'Very High' = 'Moderate';
  if (scheme.category?.toLowerCase().includes('large cap')) risk = 'Low';
  else if (scheme.category?.toLowerCase().includes('small cap')) risk = 'Very High';
  else if (scheme.category?.toLowerCase().includes('mid cap')) risk = 'High';
  else if (scheme.category?.toLowerCase().includes('liquid') || scheme.category?.toLowerCase().includes('debt')) risk = 'Low';

  // Calculate standard deviation (simplified)
  const navValues = processedData.map(d => d.nav);
  const mean = navValues.reduce((a, b) => a + b, 0) / navValues.length;
  const variance = navValues.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / navValues.length;
  const stdDev = Math.sqrt(variance);

  return {
    id: String(scheme.schemeCode),
    name: scheme.schemeName,
    schemeCode: scheme.schemeCode,
    isin: scheme.isin,
    category: scheme.category || 'Unknown',
    subCategory: 'General',
    amc: scheme.amc || 'Unknown',
    rating: Math.random() > 0.5 ? 5 : 4,
    returns1y,
    returns3y,
    returns5y,
    risk,
    alpha: (Math.random() - 0.5) * 5 + 2,
    beta: Math.random() + 0.7,
    stdDev,
    nav: latestNav,
    expenseRatio: Math.random() * 1.5 + 0.5,
    fundSizeCr: 100,
    fundAgeYr: 5,
    historicalData: processedData
  };
}

// Map risk_level (1-5) to risk string
function mapRiskLevel(riskLevel: number): 'Low' | 'Moderate' | 'High' | 'Very High' {
  switch (riskLevel) {
    case 1:
      return 'Low';
    case 2:
      return 'Moderate';
    case 3:
      return 'High';
    case 4:
    case 5:
      return 'Very High';
    default:
      return 'Moderate';
  }
}

// Fetch top schemes from Synapse API
export async function fetchTopSchemes(): Promise<ProcessedFund[]> {
  const maxRetries = 3;
  let lastError: any;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Fetch attempt ${attempt}/${maxRetries} from Synapse API...`);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      const response = await fetch('https://synapse-technex.onrender.com/top-schemes', {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
        }
      });
      
      clearTimeout(timeoutId);
      console.log(`Response status: ${response.status}`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Synapse API data received, parsing...');
      
      // API returns a LIST of top schemes
      if (!Array.isArray(data)) {
        throw new Error('API response is not an array');
      }

      console.log(`Total schemes in response: ${data.length}`);
      
      const processedFunds: ProcessedFund[] = [];
      
      // Process all schemes from the response
      for (let i = 0; i < data.length; i++) {
        try {
          const item = data[i] as TopScheme;
          
          if (!item || typeof item !== 'object') {
            continue;
          }

          const schemeName = item.scheme_name;
          const amc = item.amc_name;

          if (!schemeName) {
            continue;
          }

          const riskString = mapRiskLevel(item.risk_level);

      const processedFund: ProcessedFund = {
            id: `${item.scheme_code}`,
            name: schemeName,
            schemeCode: item.scheme_code,
            isin: '',
            category: item.category,
            subCategory: item.sub_category,
            amc: amc || 'Unknown',
            rating: item.rating || 3,
            returns1y: item.returns_1yr || 0,
            returns3y: item.returns_3yr || 0,
            returns5y: item.returns_5yr || 0,
            risk: riskString,
            alpha: parseFloat(item.alpha) || 0,
            beta: parseFloat(item.beta) || 1,
            stdDev: parseFloat(item.sd) || 0,
            nav: item.fund_size_cr || 0,
            expenseRatio: item.expense_ratio || 0,
            fundSizeCr: item.fund_size_cr || 0,
            fundAgeYr: item.fund_age_yr || 0,
            historicalData: []
          };

          processedFunds.push(processedFund);

          if (i < 3) {
            console.log(`✓ Scheme ${i}: Name="${schemeName}", Risk=${riskString}, Rating=${item.rating}`);
          }
        } catch (e) {
          console.error(`Error processing scheme at index ${i}:`, e);
        }
      }

      if (processedFunds.length > 0) {
        console.log(`✓ Successfully processed ${processedFunds.length} schemes from Synapse API`);
        return processedFunds;
      }

      console.warn('No valid schemes parsed from response');
    } catch (error) {
      lastError = error;
      console.error(`Attempt ${attempt} failed:`, error);
      
      if (attempt < maxRetries) {
        console.log(`Retrying in 1 second...`);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  }
  
  console.error('All retry attempts failed:', lastError);
  return [];
}
