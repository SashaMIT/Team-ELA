import { useQuery } from '@tanstack/react-query';
import { useHashrateData } from './useHashrateData';

interface MarketCapData {
  bitcoinMarketCap: number;
  elastosMarketCap: number;
  bitcoinCirculatingSupply: number;
  elastosCirculatingSupply: number;
  marketCapRatio: number;
}

interface ElastosSupplyResponse {
  data: number;
  status: number;
}

export const useMarketCapData = () => {
  const { data: hashrateData, isLoading: isHashrateLoading, error: hashrateError } = useHashrateData();

  const fetchMarketCapData = async (): Promise<MarketCapData> => {
    try {
      // Using existing price data from useHashrateData
      const bitcoinPrice = hashrateData?.bitcoinPrice ?? 0;
      const elaPrice = hashrateData?.elaPrice ?? 0;

      // Bitcoin circulating supply from blockchain.info API
      const btcSupplyResponse = await fetch('https://blockchain.info/q/totalbc');
      if (!btcSupplyResponse.ok) {
        throw new Error('Failed to fetch Bitcoin supply data');
      }
      const btcSupplyData = await btcSupplyResponse.text();
      const bitcoinCirculatingSupply = parseInt(btcSupplyData) / 100000000; // Convert satoshis to BTC

      // Fetch Elastos circulating supply from elastos.io API
      const elaSupplyResponse = await fetch('https://api.elastos.io/widgets?q=circ_supply');
      if (!elaSupplyResponse.ok) {
        throw new Error('Failed to fetch Elastos supply data');
      }
      const elaSupplyData: ElastosSupplyResponse = await elaSupplyResponse.json();
      const elastosCirculatingSupply = elaSupplyData.data;

      // Calculate market caps with exact values
      const bitcoinMarketCap = bitcoinPrice * bitcoinCirculatingSupply;
      const elastosMarketCap = elaPrice * elastosCirculatingSupply;
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
