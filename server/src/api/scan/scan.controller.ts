import { Request, Response, NextFunction } from 'express';
import { ScanService } from './scan.service';
import { GetScansQueryParams } from './types';

export class ScanController {
  static async getScans(req: Request, res: Response, next: NextFunction) {
    try {
      // 1. Parse & validate query parameters
      const year = parseInt(req.query.year as string);
      if (isNaN(year)) {
        return res
          .status(400)
          .json({ message: 'year query parameter is required' });
      }

      const cloudProviderIds = req.query.cloudProviders
        ? (req.query.cloudProviders as string).split(',')
        : undefined;

      const params: GetScansQueryParams = { year, cloudProviderIds };

      const result = await ScanService.getDailyScanCounts(params);

      return res.json(result);
    } catch (error) {
      next(error);
    }
  }
}
