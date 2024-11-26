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

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

const fetchWithRetry = async (url: string, options: RequestInit = {}, retries = MAX_RETRIES): Promise<Response> => {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Elastos-Dashboard',
        ...options.headers,
      }
    });
    if (!response.ok) throw new Error(response.statusText);
    return response;
  } catch (error) {
    if (retries > 0) {
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      return fetchWithRetry(url, options, retries - 1);
    }
    throw error;
  }
};

const fetchHashrate = async (): Promise<number> => {
  try {
    const response = await fetchWithRetry('https://blockchain.info/q/hashrate');
    const hashrate = await response.json();
    const formatted = String(hashrate).replace(/^(...)/g, '$1.');
    return Number(formatted);
  } catch (error) {
    console.warn('Bitcoin hashrate fetch error:', error);
    return 671.05; // Fallback value
  }
};

const fetchElastosHashrate = async (): Promise<number> => {
  try {
    // First fetch the latest block hash
    const latestBlockResponse = await fetchWithRetry('https://ela.elastos.io/api/v1/block/height/0', {
      headers: {
        'Accept': 'application/json'
      }
    });
    
    if (!latestBlockResponse.ok) {
      throw new Error(`Failed to fetch latest block: ${latestBlockResponse.statusText}`);
    }
    
    const latestBlockData = await latestBlockResponse.json();
    const latestBlockHash = latestBlockData.hash;
    
    // Then fetch the block details using the hash
    const blockResponse = await fetchWithRetry(`https://ela.elastos.io/api/v1/block/${latestBlockHash}`, {
      headers: {
        'Accept': 'application/json'
      }
    });
    
    if (!blockResponse.ok) {
      throw new Error(`Failed to fetch block details: ${blockResponse.statusText}`);
    }
    
    const blockData = await blockResponse.json();
    
    if (!blockData || typeof blockData.difficulty !== 'number') {
      throw new Error('Invalid block data received');
    }
    
    // Convert difficulty to hashrate (EH/s)
    const hashrate = Number(blockData.difficulty) / 1e18;
    return isNaN(hashrate) ? 48.52 : hashrate;
  } catch (error) {
    console.error('Elastos hashrate fetch error:', error);
    return 48.52; // Fallback value
  }
};

const fetchBitcoinPrice = async (): Promise<{ price: number; change24h: number }> => {
  try {
    const response = await fetchWithRetry('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true');
    const data = await response.json();
    
    return {
      price: data.bitcoin?.usd ?? 43000,
      change24h: Number((data.bitcoin?.usd_24h_change ?? 0).toFixed(2))
    };
  } catch (error) {
    console.warn('Bitcoin price fetch error:', error);
    return { price: 43000, change24h: 0 };
  }
};

const fetchELAPrice = async (): Promise<{ price: number; change24h: number }> => {
  try {
    const response = await fetchWithRetry('https://api.coingecko.com/api/v3/simple/price?ids=elastos&vs_currencies=usd&include_24hr_change=true');
    const data = await response.json();
    
    return {
      price: data.elastos?.usd ?? 1.78,
      change24h: Number((data.elastos?.usd_24h_change ?? 0).toFixed(2))
    };
  } catch (error) {
    console.warn('ELA price fetch error:', error);
    return { price: 1.78, change24h: 0 };
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
        console.error('Failed to fetch data:', error);
        // Return fallback values instead of throwing
        return {
          bitcoinHashrate: 671.05,
          elastosHashrate: 48.52,
          bitcoinPrice: 43000,
          elaPrice: 1.78,
          bitcoinPriceChange24h: 0,
          elaPriceChange24h: 0,
          isLoading: false,
          error: error instanceof Error ? error : new Error('Failed to fetch data')
        };
      }
    },
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
    refetchIntervalInBackground: true,
    retry: MAX_RETRIES,
  });
};
