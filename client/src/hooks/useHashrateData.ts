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
    if ((error as FetchError).status) {
      console.error(`Status: ${(error as FetchError).status}, Endpoint: ${(error as FetchError).endpoint}`);
    }
    return 671.05; // Fallback value
  }
};

const fetchElastosHashrate = async (): Promise<number> => {
  try {
    const response = await fetchWithRetry('https://ela.elastos.io/api/v1/data-statistics/', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Cache-Control': 'no-cache'
      }
    });
    
    const data = await response.json();
    
    // Extract network hashrate from the new API response format
    if (!data || !data.networkHashps) {
      throw new Error('Network hashrate not found in response');
    }
    
    // Convert network hashrate from H/s to EH/s
    const hashrateInEH = Number(data.networkHashps) / 1e18;
    
    if (isNaN(hashrateInEH)) {
      throw new Error('Invalid hashrate value received');
    }
    
    // Validate the hashrate is within a reasonable range
    if (hashrateInEH <= 0 || hashrateInEH > 1000) {
      throw new Error('Hashrate value out of expected range');
    }
    
    return hashrateInEH;
  } catch (error) {
    console.warn('Elastos hashrate fetch error:', error);
    // Enhanced error logging
    if ((error as FetchError).status) {
      console.error(`API Error - Status: ${(error as FetchError).status}, Endpoint: ${(error as FetchError).endpoint}`);
    } else {
      console.error('Network or parsing error:', error.message);
    }
    // Use recent fallback value with a warning
    console.warn('Using fallback hashrate value');
    return 48.52;
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
        const results = {
          bitcoinHashrate: 671.05,
          elastosHashrate: 48.52,
          bitcoinPrice: 43000,
          elaPrice: 1.78,
          bitcoinPriceChange24h: 0,
          elaPriceChange24h: 0
        };

        const fetchPromises = [
          fetchHashrate().then(hr => results.bitcoinHashrate = hr),
          fetchElastosHashrate().then(hr => results.elastosHashrate = hr),
          fetchBitcoinPrice().then(({ price, change24h }) => {
            results.bitcoinPrice = price;
            results.bitcoinPriceChange24h = change24h;
          }),
          fetchELAPrice().then(({ price, change24h }) => {
            results.elaPrice = price;
            results.elaPriceChange24h = change24h;
          })
        ];

        await Promise.allSettled(fetchPromises);
        
        return {
          ...results,
          isLoading: false,
          error: null
        };
      } catch (error) {
        console.error('Critical failure in data fetching:', error);
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
