import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { useStats } from '@/hooks/useStats';
import { EmptyState } from '@/components/dashboard/EmptyState';
import { SuccessRateChart } from '@/components/dashboard/SuccessRateChart';

const barConfig = {
  total:      { label: 'Total',      color: '#24811c' },
  successful: { label: 'Successful', color: '#3da832' },
};


const intentConfig = {
  value: { label: 'Calls', color: '#24811c' },
};

function Panel({ title, subtitle, delay, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      className="bg-card border border-border rounded-lg p-6">
      <p className="text-[14px] font-semibold text-foreground" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{title}</p>
      <p className="text-[12px] text-muted-foreground mt-0.5 mb-5" style={{ fontFamily: 'Inter, sans-serif' }}>{subtitle}</p>
      {children}
    </motion.div>
  );
}

const INTENT_FILLS = ['#24811c', '#3da832', '#1a5e14', '#56c44e'];

export function Analytics({ calls, loading }) {
  const stats = useStats(calls);
  if (!loading && calls.length === 0) return <EmptyState message="No analytics data yet" />;

  const intentData = stats.intentBreakdown.map((d, i) => ({ ...d, fill: INTENT_FILLS[i % INTENT_FILLS.length] }));

  return (
    <div className="flex flex-col gap-4">

      {/* Daily bar chart */}
      <Panel title="Daily Call Volume" subtitle="Total calls received per day" delay={0.04}>
        {loading ? (
          <div className="skeleton-shimmer rounded h-[240px]" />
        ) : (
          <ChartContainer config={barConfig} className="h-[240px] w-full">
            <BarChart data={stats.callsByDay} margin={{ top: 4, right: 0, left: -22, bottom: 0 }}>
              <CartesianGrid strokeDasharray="2 4" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'var(--muted-foreground)', fontFamily: 'Inter, sans-serif' }} axisLine={false} tickLine={false} />
              <YAxis allowDecimals={false} tick={{ fontSize: 10, fill: 'var(--muted-foreground)', fontFamily: 'Inter, sans-serif' }} axisLine={false} tickLine={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="total" name="Total" fill="var(--color-total)" radius={[3, 3, 0, 0]} animationDuration={800} />
              <Bar dataKey="successful" name="Successful" fill="var(--color-successful)" radius={[3, 3, 0, 0]} animationDuration={900} />
            </BarChart>
          </ChartContainer>
        )}
      </Panel>

      <div className="grid grid-cols-2 gap-4">

        {/* Success donut */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}>
          <SuccessRateChart calls={calls} answeredRate={stats.answeredRate} loading={loading} />
        </motion.div>

        {/* Intent horizontal bar */}
        <Panel title="Intent Breakdown" subtitle="Calls grouped by purpose" delay={0.18}>
          {loading ? (
            <div className="skeleton-shimmer rounded h-[190px]" />
          ) : (
            <ChartContainer config={intentConfig} className="h-[190px] w-full">
              <BarChart data={intentData} layout="vertical" margin={{ top: 0, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="2 4" stroke="var(--border)" horizontal={false} />
                <XAxis type="number" allowDecimals={false} tick={{ fontSize: 10, fill: 'var(--muted-foreground)', fontFamily: 'Inter, sans-serif' }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: 'var(--muted-foreground)', fontFamily: 'Inter, sans-serif' }} axisLine={false} tickLine={false} width={72} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="value" name="Calls" radius={[0, 3, 3, 0]} animationDuration={800}>
                  {intentData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                </Bar>
              </BarChart>
            </ChartContainer>
          )}
        </Panel>
      </div>
    </div>
  );
}
