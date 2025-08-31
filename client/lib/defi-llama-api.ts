export interface Protocol {
  id: number;
  name: string;
  category: string;
  apy: string;
  tvl: string;
  input: string;
  output: string;
  risk: string;
  status: string;
  change: string;
  logo: string;
}

export interface DefiLlamaProtocol {
  name: string;
  category: string;
  tvl: number;
  tvlPrevDay: number;
  tvlPrevWeek: number;
  tvlPrevMonth: number;
  logo: string;
  chains: string[];
  symbol?: string;
  mcap?: number;
  chainTvls?: any;
  url?: string;
  referralUrl?: string;
}

export interface DefiLlamaResponse {
  protocols: DefiLlamaProtocol[];
  chains: any;
  parentProtocols: any;
  protocolCategories: any;
}

const DEFI_LLAMA_API_URL = 'https://api.llama.fi/lite/protocols2';

export async function fetchDefiLlamaProtocols(): Promise<DefiLlamaResponse> {
  try {
    console.log('Making fetch request to:', DEFI_LLAMA_API_URL);
    
    // Add timeout to prevent hanging
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    const response = await fetch(DEFI_LLAMA_API_URL, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    
    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Response data keys:', Object.keys(data));
    console.log('Protocols count:', data.protocols?.length);
    return data;
  } catch (error) {
    console.error('Error fetching DeFi Llama protocols:', error);
    throw error;
  }
}

function calculateAPY(tvl: number, tvlPrevWeek: number): string {
  if (tvlPrevWeek === 0) return '0.0%';
  const weeklyChange = ((tvl - tvlPrevWeek) / tvlPrevWeek) * 100;
  // Annualize the weekly change (rough estimate)
  const annualizedAPY = weeklyChange * 52;
  return `${Math.abs(annualizedAPY).toFixed(1)}%`;
}

function calculateChange(tvl: number, tvlPrevDay: number): string {
  if (tvlPrevDay === 0) return '+0.0%';
  const change = ((tvl - tvlPrevDay) / tvlPrevDay) * 100;
  const sign = change >= 0 ? '+' : '';
  return `${sign}${change.toFixed(1)}%`;
}

function formatTVL(tvl: number): string {
  if (tvl >= 1e9) {
    return `$${(tvl / 1e9).toFixed(1)}B`;
  } else if (tvl >= 1e6) {
    return `$${(tvl / 1e6).toFixed(0)}M`;
  } else if (tvl >= 1e3) {
    return `$${(tvl / 1e3).toFixed(0)}K`;
  }
  return `$${tvl.toFixed(0)}`;
}

function getRiskLevel(category: string): string {
  const riskMap: { [key: string]: string } = {
    'Lending': 'Low',
    'DEX': 'Medium',
    'Liquid Staking': 'Low',
    'Restaking': 'Medium',
    'Yield': 'High',
    'Derivatives': 'High',
    'Synthetics': 'High',
    'Options': 'High',
    'Leveraged Farming': 'High',
    'Yield Farming': 'High',
    'Cross Chain': 'Medium',
    'Bridge': 'Medium',
    'RWA': 'Low',
    'Staking': 'Low'
  };
  return riskMap[category] || 'Medium';
}

function getInputOutput(category: string, name: string): { input: string; output: string } {
  const categoryMap: { [key: string]: { input: string; output: string } } = {
    'Lending': { input: 'USDC/ETH', output: 'aTokens' },
    'DEX': { input: 'ETH/USDC', output: 'LP Tokens' },
    'Liquid Staking': { input: 'ETH', output: 'stETH' },
    'Restaking': { input: 'ETH', output: 'Restaked ETH' },
    'Yield': { input: 'Various', output: 'Yield Tokens' },
    'Derivatives': { input: 'Collateral', output: 'Derivatives' },
    'Synthetics': { input: 'Collateral', output: 'Synths' },
    'Options': { input: 'Premium', output: 'Options' },
    'Cross Chain': { input: 'Assets', output: 'Wrapped Assets' },
    'Bridge': { input: 'Assets', output: 'Bridged Assets' },
    'RWA': { input: 'Fiat/Assets', output: 'RWA Tokens' },
    'Staking': { input: 'Native Token', output: 'Staked Token' }
  };
  return categoryMap[category] || { input: 'Assets', output: 'Tokens' };
}

export function transformProtocolsData(defiLlamaData: DefiLlamaResponse): Protocol[] {
  return defiLlamaData.protocols
    .filter(protocol => protocol.tvl > 100000000) // Filter protocols with TVL > $100M
    .slice(0, 20) // Take top 20 protocols
    .map((protocol, index) => {
      const { input, output } = getInputOutput(protocol.category, protocol.name);
      
      return {
        id: index + 1,
        name: protocol.name,
        category: protocol.category,
        apy: calculateAPY(protocol.tvl, protocol.tvlPrevWeek),
        tvl: formatTVL(protocol.tvl),
        input,
        output,
        risk: getRiskLevel(protocol.category),
        status: 'Active',
        change: calculateChange(protocol.tvl, protocol.tvlPrevDay),
        logo: protocol.logo || `https://icons.llamao.fi/icons/protocols/${protocol.name.toLowerCase().replace(/\s+/g, '-')}?w=48&h=48`
      };
    });
}

export async function getProtocolsData(): Promise<Protocol[]> {
  try {
    console.log('API: Fetching protocols from server API...');
    
    const response = await fetch('/api/protocols', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log(`API: Received ${data.count} protocols from server`);
    
    if (!data.success) {
      console.log('API: Server returned fallback data due to external API error');
    }

    return data.protocols;

  } catch (error) {
    console.error('Error getting protocols data:', error);
    return getLiskFallbackProtocols();
  }
}

function getLiskFallbackProtocols(): Protocol[] {
  return [
    {
      id: 1,
      name: "Lisk Protocol Example",
      category: "Lending",
      apy: "8.5%",
      tvl: "$63K",
      input: "LSK",
      output: "aLSK",
      risk: "Low",
      status: "Active",
      change: "+1.2%",
      logo: "/placeholder.svg"
    }
  ];
}

function getFallbackProtocols(): Protocol[] {
  return [
    {
      id: 1,
      name: "Velodrome",
      category: "DEX",
      apy: "12.5%",
      tvl: "$1.2B",
      input: "ETH",
      output: "VELO",
      risk: "Medium",
      status: "Active",
      change: "+2.3%",
      logo: "/placeholder.svg"
    },
    {
      id: 2,
      name: "Beefy Finance",
      category: "Vault",
      apy: "8.7%",
      tvl: "$800M",
      input: "USDC",
      output: "BIFI",
      risk: "Low",
      status: "Active",
      change: "+1.8%",
      logo: "/placeholder.svg"
    },
    {
      id: 3,
      name: "Gearbox Protocol",
      category: "Lending",
      apy: "15.2%",
      tvl: "$450M",
      input: "WETH",
      output: "GEAR",
      risk: "High",
      status: "Active",
      change: "+4.1%",
      logo: "/placeholder.svg"
    }
  ];
}