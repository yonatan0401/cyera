import { useState, useEffect } from 'react';
import instance from './http-client';
import { CloudProvider, DailyScanCount } from './types';

export function useCloudProviders(): CloudProvider[] | undefined {
  const [cloudProviders, setCloudProviders] = useState<CloudProvider[]>();

  if (cloudProviders === undefined) {
    void loadCloudProviders(setCloudProviders);
  }

  return cloudProviders;
}

async function loadCloudProviders(
  onResponse: (result: CloudProvider[]) => void
): Promise<void> {
  const response = await instance.get<CloudProvider[]>('/api/cloud-providers/');
  onResponse(response.data);
}

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

    const params = new URLSearchParams({ year: String(year) });
    params.set('cloudProviders', cloudProviderIds.join(','));

    instance
      .get<DailyScanCount[]>(`/api/scans?${params.toString()}`)
      .then((response) => setScans(response.data));
  }, [year, cloudProviderIds]);

  return scans;
}
