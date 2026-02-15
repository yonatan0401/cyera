import { useState, useEffect } from 'react';
import instance from '../api/http-client';
import { DailyScanCount } from '../types';

export function useScans(
  year: number,
  cloudProviderIds: string[]
): DailyScanCount[] | undefined {
  const [scans, setScans] = useState<DailyScanCount[]>();

  useEffect(() => {
    if (cloudProviderIds.length === 0) {
      setScans([]);
      return;
    }

    setScans(undefined);

    const fetchScans = async () => {
      const params = new URLSearchParams({ year: String(year) });
      params.set('cloudProviders', cloudProviderIds.join(','));

      const response = await instance.get<DailyScanCount[]>(
        `/api/scans?${params.toString()}`
      );
      setScans(response.data);
    };

    fetchScans();
  }, [year, cloudProviderIds]);

  return scans;
}
