import { useQuery } from "@tanstack/react-query";

interface HashrateData {
  bitcoinHashrate: number;
  elastosHashrate: number;
}

const fetchHashrate = async (): Promise<number> => {
  const response = await fetch('https://blockchain.info/q/hashrate');
  const hashrate = await response.json();
  return Number((hashrate / 1_000_000).toFixed(2)); // Convert GH/s to EH/s with 2 decimal places
};

export const useHashrateData = () => {
  return useQuery<HashrateData>({
    queryKey: ['hashrate'],
    queryFn: async () => {
      const bitcoinHashrate = await fetchHashrate();
      const elastosHashrate = bitcoinHashrate * 0.48; // Elastos hashrate is 48% of Bitcoin's
      return {
        bitcoinHashrate,
        elastosHashrate,
      };
    },
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
    refetchIntervalInBackground: true,
  });
};
