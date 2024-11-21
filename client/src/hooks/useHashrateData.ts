import { useQuery } from "@tanstack/react-query";

interface HashrateData {
  bitcoinHashrate: number;
  elastosHashrate: number;
}

const fetchHashrate = async (): Promise<number> => {
  const response = await fetch('https://blockchain.info/q/hashrate');
  const hashrate = await response.json();
  // Convert number to string, insert decimal after 3rd digit
  const formatted = String(hashrate).replace(/^(...)/g, '$1.');
  return Number(formatted);
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
