export interface CloudProvider {
  id: string;
  name: string;
}

export interface DailyScanCount {
  date: string; // "YYYY-MM-DD"
  count: number;
}
