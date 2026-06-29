import { motion } from 'framer-motion';
import { PieChart, Pie, Cell } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

const INTENT_COLORS = {
  order:       '#24811c',
  reservation: '#3da832',
  inquiry:     '#56c44e',
  unknown:     '#d1d5db',
  other:       '#1a5e14',
};

export function IntentDonutChart({ data, total, loading }) {
  const colored = data.map((d) => ({ ...d, fill: INTENT_COLORS[d.name] ?? '#d1d5db' }));

  const chartConfig = Object.fromEntries(
    colored.map((d) => [d.name, { label: d.name, color: d.fill }])
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.26, ease: [0.22, 1, 0.36, 1] }}
      className="bg-card border border-border rounded-lg p-5">

      <p className="text-[14px] font-semibold text-foreground" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
        Call Intent
      </p>
      <p className="text-[12px] text-muted-foreground mt-0.5 mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
        Breakdown by purpose
      </p>

      {loading ? (
        <div className="skeleton-shimmer rounded h-[180px]" />
      ) : data.length === 0 ? (
        <div className="h-[180px] flex items-center justify-center text-[13px] text-muted-foreground">
          No data
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <ChartContainer config={chartConfig} className="w-[180px] h-[180px]">
            <PieChart>
              <ChartTooltip content={<ChartTooltipContent nameKey="name" hideLabel />} />
              <Pie
                data={colored}
                cx="50%"
                cy="50%"
                innerRadius={52}
                outerRadius={78}
                dataKey="value"
                strokeWidth={0}
                animationBegin={100}
                animationDuration={800}>
                {colored.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Pie>
            </PieChart>
          </ChartContainer>

          {/* Center total */}
          <div className="mt-[-180px] mb-0 h-[180px] flex flex-col items-center justify-center pointer-events-none">
            <p className="text-2xl font-bold text-foreground" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{total}</p>
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground" style={{ fontFamily: 'Inter, sans-serif' }}>calls</p>
          </div>

          {/* Legend */}
          <div className="w-full space-y-1.5 mt-3">
            {colored.map((entry) => (
              <div key={entry.name} className="flex items-center justify-between text-[12px]" style={{ fontFamily: 'Inter, sans-serif' }}>
                <span className="flex items-center gap-2 text-muted-foreground capitalize">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ background: entry.fill }} />
                  {entry.name}
                </span>
                <span className="font-medium text-foreground">{entry.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
