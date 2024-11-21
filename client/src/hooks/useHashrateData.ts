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

const fetchBitcoinPrice = async (): Promise<{ price: number; change24h: number }> => {
  const [currentResponse, yesterdayResponse] = await Promise.all([
    fetch('https://blockchain.info/q/24hrprice'),
    fetch('https://blockchain.info/q/24hrago')
  ]);
  
  if (!currentResponse.ok || !yesterdayResponse.ok) {
    throw new Error('Failed to fetch Bitcoin price data');
  }
  
  const currentPrice = await currentResponse.json();
  const yesterdayPrice = await yesterdayResponse.json();
  const priceChange = ((Number(currentPrice) - Number(yesterdayPrice)) / Number(yesterdayPrice)) * 100;
  
  return {
    price: Number(currentPrice),
    change24h: Number(priceChange.toFixed(2))
  };
};

const fetchELAPrice = async (): Promise<{ price: number; change24h: number }> => {
  const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=elastos&vs_currencies=usd&include_24hr_change=true');
  if (!response.ok) {
    throw new Error('Failed to fetch ELA price');
  }
  const data = await response.json();
  return {
    price: data.elastos.usd,
    change24h: Number(data.elastos.usd_24h_change.toFixed(2))
  };
};

export const useHashrateData = () => {
  return useQuery<HashrateData>({
    queryKey: ['hashrate-and-price'],
    queryFn: async () => {
      try {
        const [bitcoinHashrate, bitcoinPriceData, elaPriceData] = await Promise.all([
          fetchHashrate(),
          fetchBitcoinPrice(),
          fetchELAPrice()
        ]);
        const elastosHashrate = bitcoinHashrate * 0.48;
        
        return {
          bitcoinHashrate,
          elastosHashrate: bitcoinHashrate * 0.48,
          bitcoinPrice: bitcoinPriceData.price,
          elaPrice: elaPriceData.price,
          bitcoinPriceChange24h: bitcoinPriceData.change24h,
          elaPriceChange24h: elaPriceData.change24h,
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
