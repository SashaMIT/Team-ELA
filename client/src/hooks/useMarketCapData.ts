import { useQuery } from '@tanstack/react-query';
import { useHashrateData } from './useHashrateData';

interface MarketCapData {
  bitcoinMarketCap: number;
  elastosMarketCap: number;
  bitcoinCirculatingSupply: number;
  elastosCirculatingSupply: number;
  marketCapRatio: number;
}

type MarketCapError = Error & {
  response?: Response;
  status?: number;
};

const COINGECKO_API = 'https://api.coingecko.com/api/v3';
const FALLBACK_ELASTOS_SUPPLY = 22381457; // Fallback circulating supply from elastos.io

const fetchWithCORS = async (url: string) => {
  try {
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'User-Agent': 'Elastos-Dashboard/1.0'
      }
    });
    return response;
  } catch (error) {
    console.error('CORS fetch error:', error);
    throw error;
  }
};

const backoff = (retryCount: number) => Math.min(1000 * Math.pow(2, retryCount), 10000);

const fetchWithRetry = async (url: string, retries = 3): Promise<Response> => {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetchWithCORS(url);
      if (response.ok) return response;
      await new Promise(resolve => setTimeout(resolve, backoff(i)));
    } catch (error) {
      console.warn(`Attempt ${i + 1} failed:`, error);
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, backoff(i)));
    }
  }
  throw new Error('Max retries reached');
};

export const useMarketCapData = () => {
  const { data: hashrateData, isLoading: isHashrateLoading, error: hashrateError } = useHashrateData();

  const DEFAULT_BTC_SUPPLY = 19600000;
  const MAX_RETRIES = 3;
  
  const fetchMarketCapData = async (): Promise<MarketCapData> => {
    try {
      // Bitcoin circulating supply from blockchain.info API with retry and fallback
      let bitcoinCirculatingSupply = DEFAULT_BTC_SUPPLY;
      try {
        const btcSupplyResponse = await fetchWithRetry('https://blockchain.info/q/totalbc', MAX_RETRIES);
        const btcSupplyData = await btcSupplyResponse.text();
        const parsedSupply = parseInt(btcSupplyData) / 100000000; // Convert satoshis to BTC
        if (!isNaN(parsedSupply) && parsedSupply > 0) {
          bitcoinCirculatingSupply = parsedSupply;
        }
      } catch (error) {
        console.warn('Using default Bitcoin supply due to API error:', error);
      }

      // Calculate Bitcoin market cap with fallback price
      const bitcoinPrice = hashrateData?.bitcoinPrice ?? 0;
      const bitcoinMarketCap = bitcoinPrice * bitcoinCirculatingSupply;

      // Initialize Elastos market data with fallbacks
      let elastosMarketCap = 0;
      let elastosCirculatingSupply = FALLBACK_ELASTOS_SUPPLY;
      const elaPrice = hashrateData?.elaPrice ?? 0;

      // Try to fetch Elastos data from CoinGecko API with enhanced error handling
      try {
        const elaMarketDataResponse = await fetchWithRetry(
          `${COINGECKO_API}/simple/price?ids=elastos&vs_currencies=usd&include_market_cap=true&include_circulating_supply=true`,
          MAX_RETRIES
        );
        const elaMarketData = await elaMarketDataResponse.json();
        
        if (elaMarketData?.elastos?.usd_market_cap) {
          elastosMarketCap = elaMarketData.elastos.usd_market_cap;
        }
        
        if (elaMarketData?.elastos?.circulating_supply) {
          elastosCirculatingSupply = elaMarketData.elastos.circulating_supply;
        }
      } catch (error) {
        console.warn('Using fallback Elastos market data calculation:', error);
        // Fallback calculation using known supply and current price
        elastosMarketCap = elaPrice * FALLBACK_ELASTOS_SUPPLY;
      }

      // Ensure all values are valid numbers with fallbacks
      const safeMarketCapData = {
        bitcoinMarketCap: Number.isFinite(bitcoinMarketCap) ? bitcoinMarketCap : 0,
        elastosMarketCap: Number.isFinite(elastosMarketCap) ? elastosMarketCap : 0,
        bitcoinCirculatingSupply: Number.isFinite(bitcoinCirculatingSupply) ? bitcoinCirculatingSupply : DEFAULT_BTC_SUPPLY,
        elastosCirculatingSupply: Number.isFinite(elastosCirculatingSupply) ? elastosCirculatingSupply : FALLBACK_ELASTOS_SUPPLY,
        marketCapRatio: 0
      };

      // Calculate market cap ratio only if both values are valid
      if (safeMarketCapData.bitcoinMarketCap > 0) {
        safeMarketCapData.marketCapRatio = (safeMarketCapData.elastosMarketCap / safeMarketCapData.bitcoinMarketCap) * 100;
      }

      return safeMarketCapData;
    } catch (error) {
      console.error('Critical error in fetchMarketCapData:', error);
      // Return safe default values for any unhandled errors
      return {
        bitcoinMarketCap: 0,
        elastosMarketCap: 0,
        bitcoinCirculatingSupply: DEFAULT_BTC_SUPPLY,
        elastosCirculatingSupply: FALLBACK_ELASTOS_SUPPLY,
        marketCapRatio: 0
      };
    }
  };

  return useQuery<MarketCapData>({
    queryKey: ['marketCapData', hashrateData],
    queryFn: fetchMarketCapData,
    enabled: !isHashrateLoading && !hashrateError,
    refetchInterval: 300000, // Refetch every 5 minutes
    staleTime: 60000, // Consider data stale after 1 minute
    retry: 3, // Allow 3 retries for the entire query
    retryDelay: (attemptIndex) => Math.min(1000 * Math.pow(2, attemptIndex), 30000), // Exponential backoff with max 30s
    onError: (error: MarketCapError) => {
      console.error('Market cap data fetch error:', error);
    },
    select: (data: MarketCapData): MarketCapData => ({
      ...data,
      // Ensure all values are valid numbers
      bitcoinMarketCap: Number.isFinite(data.bitcoinMarketCap) ? data.bitcoinMarketCap : 0,
      elastosMarketCap: Number.isFinite(data.elastosMarketCap) ? data.elastosMarketCap : 0,
      bitcoinCirculatingSupply: Number.isFinite(data.bitcoinCirculatingSupply) ? data.bitcoinCirculatingSupply : DEFAULT_BTC_SUPPLY,
      elastosCirculatingSupply: Number.isFinite(data.elastosCirculatingSupply) ? data.elastosCirculatingSupply : FALLBACK_ELASTOS_SUPPLY,
      marketCapRatio: Number.isFinite(data.marketCapRatio) ? data.marketCapRatio : 0
    })
  });
};
