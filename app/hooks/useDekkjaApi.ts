import { useQuery } from 'react-query';
import { DekkFilter, DekkStaerd, Dekk } from '../types';
import { 
  fetchDekk, 
  fetchStaerdir, 
  fetchFramleideendur, 
  fetchVefsidur
} from '../lib/api';

export function useDekkja(filter: DekkFilter = {}) {
  return useQuery(
    ['dekk', filter], 
    () => fetchDekk(filter),
    {
      staleTime: 5 * 60 * 1000,
      keepPreviousData: true,
      retry: 2,
      onError: (error) => {
        console.error('Error fetching tires:', error);
      }
    }
  );
}

export function useStaerdir() {
  return useQuery('staerdir', fetchStaerdir, {
    staleTime: Infinity,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    onError: (error) => {
      console.error('Error fetching sizes:', error);
    }
  });
}

export function useFramleideendur() {
  return useQuery('framleideendur', fetchFramleideendur, {
    staleTime: 60 * 60 * 1000,
    retry: 2,
    onError: (error) => {
      console.error('Error fetching manufacturers:', error);
    }
  });
}

export function useVefsidur() {
  return useQuery('vefsidur', fetchVefsidur, {
    staleTime: 60 * 60 * 1000,
    retry: 2,
    onError: (error) => {
      console.error('Error fetching websites:', error);
    }
  });
}

export function useLastUpdated() {
  return useQuery('lastUpdated', 
    async () => {
      const timestamp = new Date().getTime();
      const response = await fetch(`/api/lastUpdated?_=${timestamp}`);
      if (!response.ok) throw new Error("Network response was not ok");
      return response.json();
    }, 
    {
      refetchOnMount: true,
      refetchOnWindowFocus: true,
      staleTime: 30000, // Consider data stale after 30 seconds
      cacheTime: 60000, // Remove from cache after 1 minute
    }
  );
}
