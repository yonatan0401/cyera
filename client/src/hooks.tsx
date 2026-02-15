import { useState } from 'react';
import instance from './http-client';
import { CloudProvider } from './types';

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
