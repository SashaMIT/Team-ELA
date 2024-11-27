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
const MOBILE_RETRY_DELAY = 2000; // Longer delay for mobile devices
const MOBILE_MAX_RETRIES = 5; // More retries for mobile

const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

const fetchWithRetry = async (url: string, options: RequestInit = {}, retries = isMobile ? MOBILE_MAX_RETRIES : MAX_RETRIES): Promise<Response> => {
  const retryDelay = isMobile ? MOBILE_RETRY_DELAY : RETRY_DELAY;
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Accept': 'application/json',
        'User-Agent': `Elastos-Dashboard/${isMobile ? 'Mobile' : 'Desktop'}`,
        ...options.headers,
      }
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response;
  } catch (error) {
    if (retries > 0) {
      console.warn(`Retry ${MAX_RETRIES - retries + 1}/${MAX_RETRIES} for ${url} failed:`, error);
      await new Promise(resolve => setTimeout(resolve, retryDelay));
      return fetchWithRetry(url, options, retries - 1);
    }
    throw error;
  }
};

const fetchHashrate = async (): Promise<number> => {
  const response = await fetchWithRetry('https://blockchain.info/q/hashrate');
  const hashrate = await response.json();
  const formatted = String(hashrate).replace(/^(...)/g, '$1.');
  return Number(formatted);
};

const fetchElastosHashrate = async (): Promise<number> => {
  try {
    const response = await fetchWithRetry('https://ela.elastos.io/api/v1/data-statistics', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': `Elastos-Dashboard/${isMobile ? 'Mobile' : 'Desktop'}`
      }
    });
    
    const data = await response.json();
    if (!data.networkHashps) {
      throw new Error('Invalid API response: networkHashps not found');
    }
    
    const hashrate = Number(data.networkHashps) / 1e18;
    if (hashrate <= 0) {
      throw new Error('Invalid hashrate value: must be greater than 0');
    }
    
    // Cache successful response with device type
    localStorage.setItem('lastElastosHashrate', hashrate.toString());
    localStorage.setItem('lastElastosHashrateTimestamp', Date.now().toString());
    localStorage.setItem('lastElastosHashrateDevice', isMobile ? 'mobile' : 'desktop');
    
    return hashrate;
  } catch (error) {
    console.error(`Elastos hashrate fetch error (${isMobile ? 'Mobile' : 'Desktop'}):`, error);
    
    // Try to use cached data if available and not too old (within last hour)
    const cachedHashrate = localStorage.getItem('lastElastosHashrate');
    const cachedTimestamp = localStorage.getItem('lastElastosHashrateTimestamp');
    const cachedDevice = localStorage.getItem('lastElastosHashrateDevice');
    
    if (cachedHashrate && cachedTimestamp && cachedDevice) {
      const cacheAge = Date.now() - Number(cachedTimestamp);
      // Use cache if it's less than 1 hour old and from the same device type
      if (cacheAge < 3600000 && cachedDevice === (isMobile ? 'mobile' : 'desktop')) {
        console.warn('Using cached hashrate data');
        return Number(cachedHashrate);
      }
    }
    
    throw error;
  }
};

const fetchBitcoinPrice = async (): Promise<{ price: number; change24h: number }> => {
  const response = await fetchWithRetry(
    'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true'
  );
  const data = await response.json();
  
  if (!data.bitcoin?.usd) {
    throw new Error('Invalid Bitcoin price data');
  }
  
  return {
    price: data.bitcoin.usd,
    change24h: Number((data.bitcoin.usd_24h_change ?? 0).toFixed(2))
  };
};

const fetchELAPrice = async (): Promise<{ price: number; change24h: number }> => {
  const response = await fetchWithRetry(
    'https://api.coingecko.com/api/v3/simple/price?ids=elastos&vs_currencies=usd&include_24hr_change=true'
  );
  const data = await response.json();
  
  if (!data.elastos?.usd) {
    throw new Error('Invalid ELA price data');
  }
  
  return {
    price: data.elastos.usd,
    change24h: Number((data.elastos.usd_24h_change ?? 0).toFixed(2))
  };
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
        
        // Validate elastosHashrate
        if (!elastosHashrate || elastosHashrate <= 0) {
          throw new Error('Invalid Elastos hashrate value');
        }
        
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
        throw error; // Let React Query handle retries
      }
    },
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
    refetchIntervalInBackground: true,
    retry: isMobile ? MOBILE_MAX_RETRIES : MAX_RETRIES,
  });
};
