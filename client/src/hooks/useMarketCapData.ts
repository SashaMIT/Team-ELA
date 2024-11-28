import { useQuery } from '@tanstack/react-query';
import { useHashrateData } from './useHashrateData';

interface MarketCapData {
  bitcoinMarketCap: number;
  elastosMarketCap: number;
  bitcoinCirculatingSupply: number;
  elastosCirculatingSupply: number;
  marketCapRatio: number;
}

const COINGECKO_API = 'https://api.coingecko.com/api/v3';
const FALLBACK_ELASTOS_SUPPLY = 25748861; // Current circulating supply from elastos.io

const fetchWithRetry = async (url: string, retries = 3): Promise<Response> => {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url);
      if (response.ok) return response;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    } catch (error) {
      if (i === retries - 1) throw error;
    }
  }
  throw new Error('Max retries reached');
};

export const useMarketCapData = () => {
  const { data: hashrateData, isLoading: isHashrateLoading, error: hashrateError } = useHashrateData();

  const fetchMarketCapData = async (): Promise<MarketCapData> => {
    try {
      // Bitcoin circulating supply from blockchain.info API with retry
      let bitcoinCirculatingSupply = 0;
      try {
        const btcSupplyResponse = await fetchWithRetry('https://blockchain.info/q/totalbc');
        const btcSupplyData = await btcSupplyResponse.text();
        bitcoinCirculatingSupply = parseInt(btcSupplyData) / 100000000; // Convert satoshis to BTC
      } catch (error) {
        console.error('Failed to fetch Bitcoin supply, using default:', error);
        bitcoinCirculatingSupply = 19600000; // Fallback to approximate circulating supply
      }

      // Calculate Bitcoin market cap
      const bitcoinPrice = hashrateData?.bitcoinPrice ?? 0;
      const bitcoinMarketCap = bitcoinPrice * bitcoinCirculatingSupply;

      // Initialize Elastos market data variables
      let elastosMarketCap = 0;
      let elastosCirculatingSupply = FALLBACK_ELASTOS_SUPPLY;

      // Try to fetch Elastos data from CoinGecko API
      try {
        const elaMarketDataResponse = await fetchWithRetry(
          `${COINGECKO_API}/simple/price?ids=elastos&vs_currencies=usd&include_market_cap=true&include_circulating_supply=true`
        );
        const elaMarketData = await elaMarketDataResponse.json();
        elastosMarketCap = elaMarketData.elastos.usd_market_cap;
        elastosCirculatingSupply = elaMarketData.elastos.circulating_supply || FALLBACK_ELASTOS_SUPPLY;
      } catch (error) {
        console.error('Failed to fetch Elastos data from CoinGecko, using fallback calculation:', error);
        // Fallback calculation using known supply and current price
        const elaPrice = hashrateData?.elaPrice ?? 0;
        elastosMarketCap = elaPrice * FALLBACK_ELASTOS_SUPPLY;
      }

      // Calculate market cap ratio with safeguard against division by zero
      const marketCapRatio = bitcoinMarketCap > 0 ? (elastosMarketCap / bitcoinMarketCap) * 100 : 0;

      // Return data with fallback to 0 for any NaN values
      return {
        bitcoinMarketCap: bitcoinMarketCap || 0,
        elastosMarketCap: elastosMarketCap || 0,
        bitcoinCirculatingSupply: bitcoinCirculatingSupply || 0,
        elastosCirculatingSupply: elastosCirculatingSupply || 0,
        marketCapRatio: marketCapRatio || 0
      };
    } catch (error) {
      console.error('Error in fetchMarketCapData:', error);
      // Return safe default values instead of throwing
      return {
        bitcoinMarketCap: 0,
        elastosMarketCap: 0,
        bitcoinCirculatingSupply: 0,
        elastosCirculatingSupply: 0,
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
    retry: 3 // Allow 3 retries for the entire query
  });
};
