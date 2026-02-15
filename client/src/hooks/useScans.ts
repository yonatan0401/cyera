import { useState, useEffect, useCallback } from 'react';
import instance from '../api/http-client';
import { DailyScanCount } from '../types';

interface UseScansResult {
  data: DailyScanCount[] | undefined;
  error: string | null;
  retry: () => void;
}

export function useScans(
  year: number,
  cloudProviderIds: string[]
): UseScansResult {
  const [data, setData] = useState<DailyScanCount[]>();
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const retry = useCallback(() => setRetryCount((c) => c + 1), []);

  useEffect(() => {
    if (cloudProviderIds.length === 0) {
      setData([]);
      setError(null);
      return;
    }

    setData(undefined);
    setError(null);

    const fetchScans = async () => {
      try {
        const params = new URLSearchParams({ year: String(year) });
        params.set('cloudProviders', cloudProviderIds.join(','));

        const response = await instance.get<DailyScanCount[]>(
          `/api/scans?${params.toString()}`
        );
        setData(response.data);
      } catch {
        setError('Failed to load scans. Please try again.');
      }
    };

    fetchScans();
  }, [year, cloudProviderIds, retryCount]);

  return { data, error, retry };
}
