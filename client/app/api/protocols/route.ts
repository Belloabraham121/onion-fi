import { NextResponse } from 'next/server';

interface DefiLlamaProtocol {
  id: string;
  name: string;
  address: string;
  symbol: string;
  url: string;
  description: string;
  chain: string;
  logo: string;
  audits: string;
  audit_note: string;
  gecko_id: string;
  cmcId: string;
  category: string;
  chains: string[];
  module: string;
  twitter: string;
  audit_links: string[];
  listedAt: number;
  chainTvls: Record<string, {
    tvl: number;
    tvlPrevDay?: number;
    tvlPrevWeek?: number;
    tvlPrevMonth?: number;
  }>;
  change_1h: number;
  change_1d: number;
  change_7d: number;
  tokenBreakdowns: Record<string, any>;
  mcap: number;
  tvl: number;
  tvlPrevDay?: number;
  tvlPrevWeek?: number;
  tvlPrevMonth?: number;
}

export async function GET() {
  try {
    console.log('API: Fetching DeFi Llama protocols...');
    
    const response = await fetch('https://api.llama.fi/lite/protocols2', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'OnionFi/1.0'
      },
      next: { revalidate: 300 } // Cache for 5 minutes
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: { protocols: DefiLlamaProtocol[] } = await response.json();
    console.log(`API: Received ${data.protocols.length} total protocols`);

    // Filter for Lisk protocols
    const liskProtocols = data.protocols.filter(protocol => 
      protocol.chains && protocol.chains.some(chain => 
        chain.toLowerCase().includes('lisk')
      )
    );

    console.log(`API: Found ${liskProtocols.length} Lisk protocols`);

    // Transform the data
    const transformedProtocols = liskProtocols.map((protocol, index) => {
      // Get Lisk-specific TVL data
      const liskChainData = protocol.chainTvls?.['Lisk'] || protocol.chainTvls?.['lisk'];
      const currentTvl = liskChainData?.tvl || protocol.tvl || 0;
      const prevDayTvl = liskChainData?.tvlPrevDay || protocol.tvlPrevDay;
      
      const formatTVL = (tvl: any): string => {
        const numTvl = Number(tvl);
        if (isNaN(numTvl) || numTvl === null || numTvl === undefined) {
          return '$0';
        }
        if (numTvl >= 1000000) {
          return `$${(numTvl / 1000000).toFixed(1)}M`;
        } else if (numTvl >= 1000) {
          return `$${(numTvl / 1000).toFixed(1)}K`;
        } else {
          return `$${numTvl.toFixed(0)}`;
        }
      };
      
      const calculateChange = (current: number, previous?: number): string => {
        if (!previous || previous === 0) {
          return '0.0%';
        }
        const changePercent = ((current - previous) / previous) * 100;
        const formatted = changePercent.toFixed(1);
        return changePercent >= 0 ? `+${formatted}%` : `${formatted}%`;
      };
      
      return {
        id: index + 1,
        name: protocol.name,
        logo: protocol.logo || '/placeholder-logo.svg',
        category: protocol.category || 'DeFi',
        apy: '8.5%', // This would need to be calculated from additional data
        tvl: formatTVL(currentTvl),
        input: 'LSK',
        output: 'aLSK', // This would be protocol-specific
        risk: 'Low', // This would need risk assessment logic
        status: 'Active',
        change: calculateChange(currentTvl, prevDayTvl)
      };
    });

    return NextResponse.json({
      success: true,
      protocols: transformedProtocols,
      count: transformedProtocols.length
    });

  } catch (error) {
    console.error('API: Error fetching protocols:', error);
    
    // Return fallback data on error
    const fallbackProtocols = [
      {
        id: 1,
        name: 'Uniswap V3',
        logo: '/placeholder-logo.svg',
        category: 'DEX',
        apy: '12.3%',
        tvl: '$2.5M',
        input: 'LSK',
        output: 'LP',
        risk: 'Medium',
        status: 'Active',
        change: '+2.1%'
      },
      {
        id: 2,
        name: 'Mellow LRT',
        logo: '/placeholder-logo.svg',
        category: 'Liquid Staking',
        apy: '8.7%',
        tvl: '$1.8M',
        input: 'LSK',
        output: 'stLSK',
        risk: 'Low',
        status: 'Active',
        change: '+1.5%'
      },
      {
        id: 3,
        name: 'Beefy',
        logo: '/placeholder-logo.svg',
        category: 'Yield Farming',
        apy: '15.2%',
        tvl: '$950.0K',
        input: 'LSK',
        output: 'bLSK',
        risk: 'Medium',
        status: 'Active',
        change: '-0.8%'
       }
     ];

    return NextResponse.json({
      success: false,
      protocols: fallbackProtocols,
      count: fallbackProtocols.length,
      error: 'Using fallback data due to API error'
    });
  }
}