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

export const useMarketCapData = () => {
  const { data: hashrateData, isLoading: isHashrateLoading, error: hashrateError } = useHashrateData();

  const fetchMarketCapData = async (): Promise<MarketCapData> => {
    try {
      // Bitcoin circulating supply from blockchain.info API
      const btcSupplyResponse = await fetch('https://blockchain.info/q/totalbc');
      if (!btcSupplyResponse.ok) {
        throw new Error('Failed to fetch Bitcoin supply data');
      }
      const btcSupplyData = await btcSupplyResponse.text();
      const bitcoinCirculatingSupply = parseInt(btcSupplyData) / 100000000; // Convert satoshis to BTC

      // Calculate Bitcoin market cap using blockchain.info data
      const bitcoinPrice = hashrateData?.bitcoinPrice ?? 0;
      const bitcoinMarketCap = bitcoinPrice * bitcoinCirculatingSupply;

      // Fetch Elastos market data from CoinGecko API
      const elaMarketDataResponse = await fetch(`${COINGECKO_API}/simple/price?ids=elastos&vs_currencies=usd&include_market_cap=true&include_circulating_supply=true`);
      if (!elaMarketDataResponse.ok) {
        throw new Error('Failed to fetch Elastos market data from CoinGecko');
      }
      const elaMarketData = await elaMarketDataResponse.json();
      const elastosMarketCap = elaMarketData.elastos.usd_market_cap;
      const elastosCirculatingSupply = elaMarketData.elastos.circulating_supply;

      // Calculate market cap ratio
      const marketCapRatio = (elastosMarketCap / bitcoinMarketCap) * 100;

      return {
        bitcoinMarketCap,
        elastosMarketCap,
        bitcoinCirculatingSupply,
        elastosCirculatingSupply,
        marketCapRatio
      };
    } catch (error) {
      console.error('Error fetching market cap data:', error);
      throw error;
    }
  };

  return useQuery<MarketCapData>({
    queryKey: ['marketCapData', hashrateData],
    queryFn: fetchMarketCapData,
    enabled: !isHashrateLoading && !hashrateError,
    refetchInterval: 300000, // Refetch every 5 minutes
    staleTime: 60000 // Consider data stale after 1 minute
  });
};
