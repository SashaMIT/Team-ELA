import { useQuery } from "@tanstack/react-query";

interface HashrateData {
  bitcoinHashrate: number;
  elastosHashrate: number;
}

const fetchHashrate = async (): Promise<number> => {
  const response = await fetch('https://blockchain.info/q/hashrate');
  const hashrate = await response.json();
  // Convert GH/s to EH/s by dividing by 1,000,000
  const ehashrate = hashrate / 1_000_000;
  return Number(ehashrate.toFixed(5)); // Keep 5 decimal places for precision
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
