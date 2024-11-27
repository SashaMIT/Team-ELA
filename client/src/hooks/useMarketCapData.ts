import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useHashrateData } from './useHashrateData';

interface MarketCapData {
  bitcoinMarketCap: number;
  elastosMarketCap: number;
  bitcoinCirculatingSupply: number;
  elastosCirculatingSupply: number;
  marketCapRatio: number;
}

const COINGECKO_API = 'https://api.coingecko.com/api/v3';
const FALLBACK_ELASTOS_SUPPLY = 22381457;
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;
const TIMEOUT = 10000;

const fetchWithRetry = async (
  url: string, 
  options: RequestInit = {}, 
  retries = MAX_RETRIES, 
  currentDelay = RETRY_DELAY
): Promise<Response> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
        'Origin': window.location.origin,
        ...options.headers,
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorMessage}`);
    }

    return response;
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('request_timeout');
    }

    if (retries > 0) {
      await new Promise(resolve => setTimeout(resolve, currentDelay));
      return fetchWithRetry(url, options, retries - 1, currentDelay * 2);
    }

    throw error;
  }
};

export const useMarketCapData = () => {
  const { t } = useTranslation();
  const { data: hashrateData, isLoading: isHashrateLoading, error: hashrateError } = useHashrateData();

  const fetchMarketCapData = async (): Promise<MarketCapData> => {
    try {
      // Bitcoin circulating supply from blockchain.info API with retry
      let bitcoinCirculatingSupply = 0;
      try {
        const btcSupplyResponse = await fetchWithRetry('https://blockchain.info/q/totalbc');
        const btcSupplyData = await btcSupplyResponse.text();
        bitcoinCirculatingSupply = parseInt(btcSupplyData) / 100000000;
      } catch (error) {
        console.error(t('common.error.fetchFailed'), error);
        bitcoinCirculatingSupply = 19600000; // Fallback supply
      }

      // Calculate Bitcoin market cap
      const bitcoinPrice = hashrateData?.bitcoinPrice ?? 0;
      const bitcoinMarketCap = bitcoinPrice * bitcoinCirculatingSupply;

      // Initialize Elastos market data
      let elastosMarketCap = 0;
      let elastosCirculatingSupply = FALLBACK_ELASTOS_SUPPLY;

      // Try to fetch Elastos data from CoinGecko API
      try {
        const elaMarketDataResponse = await fetchWithRetry(
          `${COINGECKO_API}/simple/price?ids=elastos&vs_currencies=usd&include_market_cap=true&include_circulating_supply=true`
        );
        const elaMarketData = await elaMarketDataResponse.json();
        
        if (!elaMarketData?.elastos?.usd_market_cap) {
          throw new Error('Invalid market cap data');
        }
        
        elastosMarketCap = elaMarketData.elastos.usd_market_cap;
        elastosCirculatingSupply = elaMarketData.elastos.circulating_supply || FALLBACK_ELASTOS_SUPPLY;
      } catch (error) {
        console.error(t('common.error.fetchFailed'), error);
        // Fallback calculation using known supply and current price
        const elaPrice = hashrateData?.elaPrice ?? 0;
        elastosMarketCap = elaPrice * FALLBACK_ELASTOS_SUPPLY;
      }

      // Calculate market cap ratio with safeguard against division by zero
      const marketCapRatio = bitcoinMarketCap > 0 ? (elastosMarketCap / bitcoinMarketCap) * 100 : 0;

      return {
        bitcoinMarketCap: bitcoinMarketCap || 0,
        elastosMarketCap: elastosMarketCap || 0,
        bitcoinCirculatingSupply: bitcoinCirculatingSupply || 0,
        elastosCirculatingSupply: elastosCirculatingSupply || 0,
        marketCapRatio: marketCapRatio || 0
      };
    } catch (error) {
      console.error(t('common.error.fetchFailed'), error);
      throw error;
    }
  };

  return useQuery<MarketCapData>({
    queryKey: ['marketCapData', hashrateData],
    queryFn: fetchMarketCapData,
    enabled: !isHashrateLoading && !hashrateError,
    refetchInterval: 300000, // Refetch every 5 minutes
    staleTime: 60000, // Consider data stale after 1 minute
    retry: MAX_RETRIES,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000)
  });
};
