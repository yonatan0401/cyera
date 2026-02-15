export interface FindAllParams {
  filterCallback?: (scan: Scan) => boolean;
}

export interface Scan {
  id: string;
  date: Date;
  cloudProviderId: string;
  scanPrivateKey: string;
}

// --- Request DTO ---
export interface GetScansQueryParams {
  year: number;
  cloudProviderIds?: string[];
}

// --- Response DTO ---
export interface DailyScanCount {
  date: string; // "YYYY-MM-DD"
  count: number;
}
