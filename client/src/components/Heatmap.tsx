import { useMemo } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import { useScans } from '../hooks';
import { DailyScanCount } from '../types';

const MONTH_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

const COLOR_MAP: Record<string, string> = {
  color1: '#3d3d3d',
  color2: '#4a0e66',
  color3: '#680099',
  color4: '#9000d4',
  color5: '#bd30ff',
};

interface DayCell {
  date: Date;
  dateString: string;
}

interface MonthRow {
  month: number;
  label: string;
  days: DayCell[];
}

function buildDateGrid(year: number): MonthRow[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const months: MonthRow[] = [];

  for (let month = 0; month < 12; month++) {
    const daysInMonth = new Date(year, month + 1, 0).getDate(); // last day of month
    const days: DayCell[] = [];

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      if (date >= today) break;

      const mm = String(month + 1).padStart(2, '0');
      const dd = String(day).padStart(2, '0');
      const dateString = `${year}-${mm}-${dd}`;
      days.push({ date, dateString });
    }

    months.push({
      month,
      label: MONTH_NAMES[month],
      days,
    });
  }

  return months;
}

function getColorClass(count: number, maxCount: number): string {
  if (count === 0 || maxCount === 0) return 'color1';
  if (count <= maxCount * 0.25) return 'color2';
  if (count <= maxCount * 0.5) return 'color3';
  if (count <= maxCount * 0.75) return 'color4';
  return 'color5';
}

function buildScanMap(data: DailyScanCount[]): Map<string, number> {
  return new Map(data.map((d) => [d.date, d.count]));
}

interface HeatmapProps {
  year: number;
  selectedProviderIds: string[];
}

export const Heatmap = ({ year, selectedProviderIds }: HeatmapProps) => {
  const data = useScans(year, selectedProviderIds);
  const grid = useMemo(() => buildDateGrid(year), [year]);
  const scanMap = useMemo(
    () => (data ? buildScanMap(data) : new Map<string, number>()),
    [data]
  );
  const maxCount = useMemo(
    () => (data ? Math.max(0, ...data.map((d) => d.count)) : 0),
    [data]
  );

  if (!data) {
    return (
      <Typography variant="body2" color="grey.500">
        Loading...
      </Typography>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.375 }}>
      {grid.map((month) => (
        <Box
          key={month.month}
          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
        >
          <Typography
            variant="caption"
            sx={{ width: '2.5rem', textAlign: 'right', color: 'grey.500' }}
          >
            {month.label}
          </Typography>
          <Box sx={{ display: 'flex', gap: 0.375, flexWrap: 'nowrap' }}>
            {month.days.map((day) => {
              const count = scanMap.get(day.dateString) || 0;
              const colorClass = getColorClass(count, maxCount);
              const tooltip = `${day.date.toDateString()} - ${count} scans`;

              return (
                <Tooltip key={day.dateString} title={tooltip} arrow>
                  <Box
                    sx={{
                      width: '0.875rem',
                      height: '0.875rem',
                      borderRadius: '0.125rem',
                      backgroundColor: COLOR_MAP[colorClass],
                      cursor: 'pointer',
                      '&:hover': {
                        opacity: 0.8,
                      },
                    }}
                  />
                </Tooltip>
              );
            })}
          </Box>
        </Box>
      ))}
    </Box>
  );
};
