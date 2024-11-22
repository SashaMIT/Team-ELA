import { useQuery } from "@tanstack/react-query";

interface HashrateData {
  bitcoinHashrate: number;
  elastosHashrate: number;
  bitcoinPrice: number;
  elaPrice: number;
  bitcoinPriceChange24h: number;
  elaPriceChange24h: number;
  isLoading: boolean;
  error: Error | null;
}

const fetchHashrate = async (): Promise<number> => {
  const response = await fetch('https://blockchain.info/q/hashrate');
  if (!response.ok) {
    throw new Error('Failed to fetch hashrate');
  }
  const hashrate = await response.json();
  // Convert number to string, insert decimal after 3rd digit
  const formatted = String(hashrate).replace(/^(...)/g, '$1.');
  return Number(formatted);
};

const fetchElastosHashrate = async (): Promise<number> => {
  const response = await fetch('https://api.elastos.io/ela', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      method: 'getmininginfo',
      params: []
    })
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch Elastos hashrate');
  }
  
  const data = await response.json();
  return Number(data.result.networkhashps) / 1e18; // Convert to EH/s
};

const fetchBitcoinPrice = async (): Promise<{ price: number; change24h: number }> => {
  try {
    const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true');
    if (!response.ok) {
      throw new Error(`Failed to fetch Bitcoin price: ${response.statusText}`);
    }
    const data = await response.json();
    if (!data.bitcoin?.usd || !data.bitcoin?.usd_24h_change) {
      throw new Error('Invalid Bitcoin price data format from API');
    }
    return {
      price: data.bitcoin.usd,
      change24h: Number(data.bitcoin.usd_24h_change.toFixed(2))
    };
  } catch (error) {
    console.error('Bitcoin price fetch error:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch Bitcoin price data');
  }
};

const fetchELAPrice = async (): Promise<{ price: number; change24h: number }> => {
  try {
    const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=elastos&vs_currencies=usd&include_24hr_change=true');
    if (!response.ok) {
      throw new Error(`Failed to fetch ELA price: ${response.statusText}`);
    }
    const data = await response.json();
    if (!data.elastos?.usd || !data.elastos?.usd_24h_change) {
      throw new Error('Invalid ELA price data format from API');
    }
    return {
      price: data.elastos.usd,
      change24h: Number(data.elastos.usd_24h_change.toFixed(2))
    };
  } catch (error) {
    console.error('ELA price fetch error:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch ELA price data');
  }
};

export const useHashrateData = () => {
  return useQuery<HashrateData>({
    queryKey: ['hashrate-and-price'],
    queryFn: async () => {
      try {
        const [bitcoinHashrate, bitcoinPriceData, elaPriceData, elastosHashrate] = await Promise.all([
          fetchHashrate(),
          fetchBitcoinPrice(),
          fetchELAPrice(),
          fetchElastosHashrate()
        ]);
        
        return {
          bitcoinHashrate,
          elastosHashrate,
          bitcoinPrice: bitcoinPriceData.price,
          elaPrice: elaPriceData.price,
          bitcoinPriceChange24h: bitcoinPriceData.change24h,
          elaPriceChange24h: elaPriceData.change24h,
          isLoading: false,
          error: null
        };
      } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'Failed to fetch data');
      }
    },
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
    refetchIntervalInBackground: true,
  });
};
