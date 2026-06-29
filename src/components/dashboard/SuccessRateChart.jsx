import { PieChart, Pie, Cell } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const chartConfig = {
  Successful: { label: 'Successful', color: '#24811c' },
  Failed:     { label: 'Failed',     color: '#ef4444' },
};

export function SuccessRateChart({ calls, answeredRate, loading }) {
  const successData = [
    { name: 'Successful', value: calls.filter((c) => c.analysis?.success).length },
    { name: 'Failed',     value: calls.filter((c) => !c.analysis?.success).length },
  ];

  return (
    <Card className="pt-0">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Success Rate</CardTitle>
          <CardDescription style={{ fontFamily: 'Inter, sans-serif' }}>
            Successful vs failed calls
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="px-2 pt-2 sm:px-6 sm:pt-4">
        {loading ? (
          <div className="skeleton-shimmer rounded h-[250px]" />
        ) : (
          <div className="flex flex-col items-center justify-center h-[250px]">
            <ChartContainer config={chartConfig} className="w-[210px] h-[210px]">
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent nameKey="name" hideLabel />} />
                <Pie
                  data={successData}
                  cx="50%" cy="50%"
                  innerRadius={70} outerRadius={95}
                  dataKey="value"
                  strokeWidth={0}
                  animationDuration={800}
                >
                  <Cell fill="var(--color-Successful)" />
                  <Cell fill="var(--color-Failed)" />
                </Pie>
              </PieChart>
            </ChartContainer>

            <div className="mt-[-210px] h-[210px] flex flex-col items-center justify-center pointer-events-none">
              <p className="text-[2rem] font-bold text-foreground leading-none" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                {answeredRate}%
              </p>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                success
              </p>
            </div>

            <div className="flex gap-5 mt-6">
              {successData.map((d, i) => (
                <span key={d.name} className="flex items-center gap-1.5 text-[12px] text-muted-foreground" style={{ fontFamily: 'Inter, sans-serif' }}>
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ background: i === 0 ? '#24811c' : '#ef4444' }} />
                  {d.name} ({d.value})
                </span>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
