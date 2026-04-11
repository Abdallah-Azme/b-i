import { StatisticsClient } from '@/features/analytics/ui/statistics-client';

export const metadata = {
  title: 'Platform Statistics | إحصائيات المنصة',
  description: 'Real-time overview of the B&I network activity.',
};

export default function StatisticsPage() {
  return <StatisticsClient />;
}
