import { useQuery } from "@tanstack/react-query";

interface HashrateData {
  bitcoinHashrate: number;
  elastosHashrate: number;
  bitcoinPrice: number;
  elaPrice: number;
  bitcoinPriceChange24h: number;
  elaPriceChange24h: number;
  elastosCirculatingSupply: number;
  bitcoinCirculatingSupply: number;
  isLoading: boolean;
  error: Error | null;
}

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

const isMobile = /iPhone|iPad|iPod|Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

const fetchWithRetry = async (url: string, options: RequestInit = {}): Promise<Response> => {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Accept': 'application/json',
        ...options.headers,
      }
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
};

const fetchHashrate = async (): Promise<number> => {
  const response = await fetchWithRetry('https://api.minerstat.com/v2/coins?list=BTC&query=%7B%22method%22:%22GET%22,%22isArray%22:true%7D');
  const data = await response.json();
  
  if (!data?.[0]?.network_hashrate) {
    throw new Error('Invalid API response: network_hashrate not found');
  }
  
  // Convert to EH/s
  const hashrate = Number(data[0].network_hashrate) / 1e18;
  return hashrate;
};

const fetchElastosHashrate = async (): Promise<number> => {
  try {
    const response = await fetch('https://ela.elastos.io/api/v1/data-statistics', {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      },
      cache: 'no-cache'
    });
    
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    
    const data = await response.json();
    if (!data.networkHashps) {
      throw new Error('Invalid API response: networkHashps not found');
    }
    
    const hashrate = Number(data.networkHashps) / 1e18;
    return hashrate;
  } catch (error) {
    console.error('Elastos hashrate fetch error:', error);
    throw error; // Let React Query handle retries
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
        // Fetch Bitcoin and Elastos data
        const [bitcoinHashrate, bitcoinPriceData, elaPriceData, elastosHashrate, btcSupplyResponse] = await Promise.all([
          fetchHashrate(),
          fetchBitcoinPrice(),
          fetchELAPrice(),
          fetchElastosHashrate(),
          fetch('https://blockchain.info/q/totalbc')
        ]);

        // Get Bitcoin circulating supply
        const btcSupplyData = await btcSupplyResponse.text();
        const bitcoinCirculatingSupply = parseInt(btcSupplyData) / 100000000; // Convert satoshis to BTC

        // Get Elastos circulating supply from CoinGecko
        const elaSupplyResponse = await fetch(
          'https://api.coingecko.com/api/v3/simple/price?ids=elastos&vs_currencies=usd&include_market_cap=true&include_circulating_supply=true'
        );
        const elaSupplyData = await elaSupplyResponse.json();
        const elastosCirculatingSupply = elaSupplyData.elastos.circulating_supply || 22381457; // Fallback supply
        
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
          bitcoinCirculatingSupply,
          elastosCirculatingSupply,
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
    retry: MAX_RETRIES,
  });
};