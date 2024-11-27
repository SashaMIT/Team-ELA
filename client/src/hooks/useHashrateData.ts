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
        'Origin': window.location.origin,
        'Cache-Control': 'no-cache',
        ...options.headers,
      },
      mode: 'cors',
      cache: 'no-cache',
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }
    return response;
  } catch (error) {
    if (retries > 0) {
      console.warn(`Retry attempt ${MAX_RETRIES - retries + 1}/${MAX_RETRIES} for ${url}`);
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * (MAX_RETRIES - retries + 1)));
      return fetchWithRetry(url, options, retries - 1);
    }
    console.error(`Failed to fetch ${url} after ${MAX_RETRIES} retries:`, error);
    throw error;
  }
};

const fetchHashrate = async (): Promise<number> => {
  try {
    const response = await fetchWithRetry('/api/blockchain/q/hashrate', {
      headers: {
        'Accept': 'application/json',
      }
    });
    const hashrate = await response.text();
    // Format hashrate from GH/s to EH/s
    return Number(hashrate) / 1000000;
  } catch (error) {
    console.warn('Bitcoin hashrate fetch error:', error);
    return 671.05; // Fallback value
  }
};

const fetchElastosHashrate = async (): Promise<number> => {
  try {
    // Using new REST API endpoint for mining info
    const response = await fetchWithRetry('/api/elastos/api/v1/mining/info', {
      headers: {
        'Accept': 'application/json'
      }
    });
    const data = await response.json();
    
    if (!data || !data.hashrate) {
      throw new Error('Invalid response format');
    }
    
    // Convert hashrate from H/s to EH/s (data comes in H/s)
    return Number(data.hashrate) / 1e18;
  } catch (error) {
    console.warn('Elastos hashrate fetch error:', error);
    return 48.52; // Fallback value if API fails
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
