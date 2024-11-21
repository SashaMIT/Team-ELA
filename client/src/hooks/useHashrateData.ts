import { useQuery } from "@tanstack/react-query";

interface HashrateData {
  bitcoinHashrate: number;
  elastosHashrate: number;
  bitcoinPrice: number;
  isLoading: boolean;
  error: Error | null;
}

const fetchHashrate = async (): Promise<number> => {
  const response = await fetch('https://blockchain.info/q/hashrate');
  if (!response.ok) {
    throw new Error('Failed to fetch hashrate');
  }
  const hashrate = await response.json();
  // Convert number to string, insert decimal after 3rd digit
  const formatted = String(hashrate).replace(/^(...)/g, '$1.');
  return Number(formatted);
};

const fetchBitcoinPrice = async (): Promise<number> => {
  const response = await fetch('https://blockchain.info/q/24hrprice');
  if (!response.ok) {
    throw new Error('Failed to fetch Bitcoin price');
  }
  const price = await response.json();
  return Number(price);
};

export const useHashrateData = () => {
  return useQuery<HashrateData>({
    queryKey: ['hashrate-and-price'],
    queryFn: async () => {
      try {
        const [bitcoinHashrate, bitcoinPrice] = await Promise.all([
          fetchHashrate(),
          fetchBitcoinPrice()
        ]);
        const elastosHashrate = bitcoinHashrate * 0.48; // Elastos hashrate is 48% of Bitcoin's
        
        return {
          bitcoinHashrate,
          elastosHashrate,
          bitcoinPrice,
          isLoading: false,
          error: null
        };
      } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'Failed to fetch data');
      }
    },
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
    refetchIntervalInBackground: true,
  });
};
