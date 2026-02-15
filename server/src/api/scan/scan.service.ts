import { ScanRepository } from './scan.repository';
import { GetScansQueryParams, DailyScanCount } from './types';

export class ScanService {
  /**
   * Get scan counts aggregated by day for the given filters.
   */
  static async getDailyScanCounts(
    params: GetScansQueryParams
  ): Promise<DailyScanCount[]> {
    const { year, cloudProviderIds } = params;

    // Date boundary: scans must be before today (yesterday is the last visible day)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Fetch filtered scans from repository
    const scans = await ScanRepository.findAll({
      filterCallback: (scan) => {
        if (scan.date.getFullYear() !== year) return false;
        if (scan.date >= today) return false;
        if (cloudProviderIds && !cloudProviderIds.includes(scan.cloudProviderId))
          return false;
        return true;
      },
    });

    // Aggregate scan counts by day 
    const countsMap: Record<string, number> = {};
    for (const scan of scans) {
      const y = scan.date.getFullYear();
      const m = String(scan.date.getMonth() + 1).padStart(2, '0');
      const d = String(scan.date.getDate()).padStart(2, '0');
      const key = `${y}-${m}-${d}`;
      countsMap[key] = (countsMap[key] || 0) + 1;
    }

    return Object.entries(countsMap).map(([date, count]) => ({ date, count }));
  }
}
