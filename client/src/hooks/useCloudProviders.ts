import { useState, useEffect, useCallback } from 'react';
import instance from '../api/http-client';
import { CloudProvider } from '../types';

interface UseCloudProvidersResult {
  data: CloudProvider[] | undefined;
  error: string | null;
  retry: () => void;
}

export function useCloudProviders(): UseCloudProvidersResult {
  const [data, setData] = useState<CloudProvider[]>();
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const retry = useCallback(() => setRetryCount((c) => c + 1), []);

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        setError(null);
        const response = await instance.get<CloudProvider[]>('/api/cloud-providers/');
        setData(response.data);
      } catch {
        setError('Failed to load cloud providers. Please try again.');
      }
    };

    fetchProviders();
  }, [retryCount]);

  return { data, error, retry };
}
