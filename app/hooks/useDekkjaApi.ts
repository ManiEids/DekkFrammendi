import { useQuery, useMutation, useQueryClient } from 'react-query';
import { DekkFilter, DekkStaerd, Dekk } from '../types';
import { 
  fetchDekk, 
  fetchStaerdir, 
  fetchFramleideendur, 
  fetchVefsidur, 
  skrapaDekk,
  checkHealth 
} from '../lib/api';

export function useDekkja(filter: DekkFilter = {}) {
  return useQuery(
    ['dekk', filter], 
    () => fetchDekk(filter),
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
      keepPreviousData: true
    }
  );
}

export function useStaerdir() {
  return useQuery('staerdir', fetchStaerdir, {
    staleTime: Infinity, // These rarely change
  });
}

export function useFramleideendur() {
  return useQuery('framleideendur', fetchFramleideendur, {
    staleTime: 60 * 60 * 1000, // 1 hour
  });
}

export function useVefsidur() {
  return useQuery('vefsidur', fetchVefsidur, {
    staleTime: 60 * 60 * 1000, // 1 hour
  });
}

export function useSkrapa() {
  const queryClient = useQueryClient();
  
  return useMutation(
    (staerd: {breidd: number; haed: number; felga: number}) => 
      skrapaDekk(staerd.breidd, staerd.haed, staerd.felga),
    {
      onSuccess: () => {
        // Invalidate relevant queries after scraping completes
        setTimeout(() => {
          queryClient.invalidateQueries('dekk');
          queryClient.invalidateQueries('staerdir');
        }, 10000); // Wait 10 seconds before refreshing data
      }
    }
  );
}

export function useApiHealth() {
  return useQuery('apiHealth', checkHealth, {
    refetchInterval: 60000, // Check API health every minute
    retry: 3,
  });
}
