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

interface FetchError extends Error {
  status?: number;
  endpoint?: string;
}

const fetchWithRetry = async (url: string, options: RequestInit = {}, retries = MAX_RETRIES): Promise<Response> => {
  let lastError: FetchError;
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Elastos-Dashboard',
          ...options.headers,
        }
      });
      
      if (!response.ok) {
        const error = new Error(response.statusText) as FetchError;
        error.status = response.status;
        error.endpoint = url;
        throw error;
      }
      
      return response;
    } catch (error) {
      lastError = error as FetchError;
      lastError.endpoint = url;
      
      if (i < retries - 1) {
        console.warn(`Retry ${i + 1}/${retries} for ${url} failed:`, error);
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * Math.pow(2, i))); // Exponential backoff
        continue;
      }
    }
  }
  throw lastError!;
};

const fetchHashrate = async (): Promise<number> => {
  try {
    const response = await fetchWithRetry('https://blockchain.info/q/hashrate');
    const hashrate = await response.json();
    if (typeof hashrate !== 'number' || isNaN(hashrate)) {
      throw new Error('Invalid hashrate data received');
    }
    const formatted = String(hashrate).replace(/^(...)/g, '$1.');
    return Number(formatted);
  } catch (error) {
    console.error('Bitcoin hashrate fetch error:', error);
    // Log detailed error for monitoring
    if ((error as FetchError).status) {
      console.error(`Status: ${(error as FetchError).status}, Endpoint: ${(error as FetchError).endpoint}`);
    }
    return 671.05; // Fallback value
  }
};

const fetchElastosHashrate = async (): Promise<number> => {
  try {
    const response = await fetchWithRetry('https://ela.elastos.io/api/v1/statistics/difficulty', {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });
    
    const data = await response.json();
    // Convert difficulty to hashrate using Bitcoin's formula
    // hashrate = difficulty * 2^32 / block_time_seconds
    const difficulty = Number(data.difficulty);
    const blockTime = 120; // 2 minutes block time for Elastos
    const hashrate = (difficulty * Math.pow(2, 32)) / blockTime;
    return hashrate / 1e18; // Convert to EH/s
  } catch (error) {
    console.warn('Elastos hashrate fetch error:', error);
    // Log detailed error for monitoring
    if ((error as FetchError).status) {
      console.error(`Status: ${(error as FetchError).status}, Endpoint: ${(error as FetchError).endpoint}`);
    }
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
        // Sequential fetching with individual error handling
        const results = {
          bitcoinHashrate: 671.05,
          elastosHashrate: 48.52,
          bitcoinPrice: 43000,
          elaPrice: 1.78,
          bitcoinPriceChange24h: 0,
          elaPriceChange24h: 0
        };

        try {
          results.bitcoinHashrate = await fetchHashrate();
        } catch (error) {
          console.error('Bitcoin hashrate fetch failed:', error);
        }

        try {
          const bitcoinPriceData = await fetchBitcoinPrice();
          results.bitcoinPrice = bitcoinPriceData.price;
          results.bitcoinPriceChange24h = bitcoinPriceData.change24h;
        } catch (error) {
          console.error('Bitcoin price fetch failed:', error);
        }

        try {
          const elaPriceData = await fetchELAPrice();
          results.elaPrice = elaPriceData.price;
          results.elaPriceChange24h = elaPriceData.change24h;
        } catch (error) {
          console.error('ELA price fetch failed:', error);
        }

        try {
          results.elastosHashrate = await fetchElastosHashrate();
        } catch (error) {
          console.error('Elastos hashrate fetch failed:', error);
        }
        
        return {
          ...results,
          isLoading: false,
          error: null
        };
      } catch (error) {
        console.error('Critical failure in data fetching:', error);
        // Return fallback values for complete failure scenario
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
    retryDelay: (attemptIndex) => Math.min(1000 * Math.pow(2, attemptIndex), 30000), // Exponential backoff capped at 30 seconds
  });
};
