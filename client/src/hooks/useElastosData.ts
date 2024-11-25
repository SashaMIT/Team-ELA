import { useQuery } from '@tanstack/react-query';

interface MiningInfo {
  hashrate: number;
  supply: number;
}

const fetchElastosData = async (method: string) => {
  const response = await fetch('https://api.elastos.io/ela', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ method, params: {} }),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch Elastos data');
  }

  const data = await response.json();
  return data.result;
};

export const useElastosData = () => {
  const { data: miningInfo, isLoading: isMiningLoading, error: miningError } = useQuery({
    queryKey: ['elastos', 'mininginfo'],
    queryFn: () => fetchElastosData('getmininginfo'),
    refetchInterval: 300000, // Refresh every 5 minutes
  });

  const { data: supplyData, isLoading: isSupplyLoading, error: supplyError } = useQuery({
    queryKey: ['elastos', 'supply'],
    queryFn: () => fetchElastosData('getsupply'),
    refetchInterval: 300000, // Refresh every 5 minutes
  });

  return {
    miningInfo,
    supplyData,
    isLoading: isMiningLoading || isSupplyLoading,
    error: miningError || supplyError,
  };
};
