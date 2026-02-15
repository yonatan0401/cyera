import { useState, useEffect } from 'react';
import './styles.css';
import { Heatmap } from './components/Heatmap';
import { YearPicker } from './components/YearPicker';
import { CloudPrivderSelect } from './components/CloudPrivderSelect';
import { useCloudProviders } from './hooks';

export default function App() {
  const cloudProviders = useCloudProviders();
  const [year, setYear] = useState(new Date().getFullYear());
  const [selectedProviderIds, setSelectedProviderIds] = useState<string[]>([]);

  // Default to all providers selected once loaded
  useEffect(() => {
    if (cloudProviders) {
      setSelectedProviderIds(cloudProviders.map((cp) => cp.id));
    }
  }, [cloudProviders]);

  return (
    <div className="app">
      <div className="filters">
        <YearPicker
          disableFuture
          value={year}
          onChange={setYear}
        />
        <CloudPrivderSelect
          options={cloudProviders?.map((cp) => ({
            displayName: cp.name,
            value: cp.id,
          }))}
          onChange={setSelectedProviderIds}
          selectedOptions={selectedProviderIds}
        />
      </div>
      <Heatmap year={year} selectedProviderIds={selectedProviderIds} />
    </div>
  );
}
