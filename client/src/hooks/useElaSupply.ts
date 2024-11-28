import { useQuery } from '@tanstack/react-query';

interface ElaSupplyResponse {
  total_supply: number;
}

export const useElaSupply = () => {
  return useQuery<number>({
    queryKey: ['elaSupply'],
    queryFn: async () => {
      try {
        const response = await fetch('https://api.elastos.io/widgets?q=total_supply');
        if (!response.ok) {
          throw new Error('Failed to fetch supply data');
        }
        const data: ElaSupplyResponse = await response.json();
        return data.total_supply;
      } catch (error) {
        console.error('Error fetching ELA supply:', error);
        return 25748861; // Fallback to current supply if API fails
      }
    },
    refetchInterval: 300000, // Refetch every 5 minutes
    staleTime: 60000, // Consider data stale after 1 minute
  });
};
