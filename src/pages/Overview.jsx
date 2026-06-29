import { SectionCards } from '@/components/dashboard/SectionCards';
import { CallVolumeChart } from '@/components/dashboard/CallVolumeChart';
import { SuccessRateChart } from '@/components/dashboard/SuccessRateChart';
import { RecentCallsTable } from '@/components/dashboard/RecentCallsTable';
import { EmptyState } from '@/components/dashboard/EmptyState';
import { useStats } from '@/hooks/useStats';

export function Overview({ calls, loading }) {
  const stats = useStats(calls);

  if (!loading && calls.length === 0) return <EmptyState />;

  return (
    <>
      <SectionCards stats={stats} loading={loading} />

      <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-[3fr_2fr]">
        <CallVolumeChart data={stats.callsByDay} loading={loading} />
        <SuccessRateChart calls={calls} answeredRate={stats.answeredRate} loading={loading} />
      </div>

      <div className="px-4 lg:px-6">
        <RecentCallsTable calls={calls} loading={loading} limit={10} />
      </div>
    </>
  );
}
