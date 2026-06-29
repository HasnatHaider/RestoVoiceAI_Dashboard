import { useMemo } from 'react';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const chartConfig = {
  total: {
    label: 'Total Calls',
    color: '#24811c',
  },
  successful: {
    label: 'Successful',
    color: '#24811c',
  },
};

function buildMonthScaffold(data) {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const today = now.getDate();

  const lookup = {};
  data.forEach((d) => { lookup[d.date] = d; });

  const days = [];
  for (let d = 1; d <= today; d++) {
    const label = new Date(year, month, d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    days.push(lookup[label] ?? { date: label, total: 0, successful: 0 });
  }
  return days;
}

export function CallVolumeChart({ data, loading }) {
  const chartData = useMemo(() => buildMonthScaffold(data), [data]);

  const monthLabel = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <Card className="pt-0">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Call Volume</CardTitle>
          <CardDescription style={{ fontFamily: 'Inter, sans-serif' }}>
            Total vs successful calls — {monthLabel}
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="px-2 pt-2 sm:px-6 sm:pt-4">
        {loading ? (
          <div className="skeleton-shimmer rounded h-[250px]" />
        ) : (
          <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
            <AreaChart data={chartData} margin={{ top: 4, right: 0, left: -20, bottom: 10 }}>
              <defs>
                <linearGradient id="fillTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="var(--color-total)"      stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--color-total)"      stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="fillSuccessful" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="var(--color-successful)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--color-successful)" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={40}
                tick={{ fontSize: 11, fill: 'var(--muted-foreground)', fontFamily: 'Inter, sans-serif' }}
                tickFormatter={(v) => v.split(' ')[1] ?? v}
              />
              <YAxis
                allowDecimals={false}
                tickLine={false}
                axisLine={false}
                tickMargin={4}
                tick={{ fontSize: 11, fill: 'var(--muted-foreground)', fontFamily: 'Inter, sans-serif' }}
                width={28}
              />
              <ChartTooltip
                cursor={{ stroke: 'var(--border)', strokeWidth: 1 }}
                content={<ChartTooltipContent indicator="dot" />}
              />
              <Area
                dataKey="total"
                type="monotone"
                fill="url(#fillTotal)"
                stroke="var(--color-total)"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, strokeWidth: 0 }}
              />
              <Area
                dataKey="successful"
                type="monotone"
                fill="url(#fillSuccessful)"
                stroke="var(--color-successful)"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, strokeWidth: 0 }}
              />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
