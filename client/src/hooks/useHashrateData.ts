import { useQuery } from "@tanstack/react-query";

interface HashrateData {
  bitcoinHashrate: number;
  elastosHashrate: number;
  bitcoinPrice: number;
  elaPrice: number;
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
const fetchELAPrice = async (): Promise<number> => {
  const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=elastos&vs_currencies=usd');
  if (!response.ok) {
    throw new Error('Failed to fetch ELA price');
  }
  const data = await response.json();
  return data.elastos.usd;
};

};

export const useHashrateData = () => {
  return useQuery<HashrateData>({
    queryKey: ['hashrate-and-price'],
    queryFn: async () => {
      try {
        const [bitcoinHashrate, bitcoinPrice, elaPrice] = await Promise.all([
          fetchHashrate(),
          fetchBitcoinPrice(),
          fetchELAPrice()
        ]);
        const elastosHashrate = bitcoinHashrate * 0.48;
        
        return {
          bitcoinHashrate,
          elastosHashrate,
          bitcoinPrice,
          elaPrice,
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
