import { TrendingUp, TrendingDown, Phone, CheckCircle, Clock, DollarSign } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useCountUp } from '@/hooks/useCountUp';

function StatCard({ label, value, prefix = '', suffix = '', decimals = 0, trend, trendLabel, subLabel, icon: Icon }) {
  const animated = useCountUp(typeof value === 'number' ? value : 0, 1000, decimals);
  const display = `${prefix}${animated.toFixed(decimals)}${suffix}`;
  const isUp = trend >= 0;

  return (
    <Card className="@container/card bg-linear-to-t from-primary/5 to-card shadow-xs">
      <CardHeader>
        <CardDescription className="flex items-center gap-1.5 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
          <Icon className="size-3.5 text-muted-foreground" />
          {label}
        </CardDescription>
        <CardTitle className="pt-5 text-2xl font-semibold tabular-nums @[250px]/card:text-3xl" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
          {display}
        </CardTitle>
        {trend !== undefined && (
          <CardAction>
            <Badge variant="outline" className="text-[11px] gap-1" style={{ fontFamily: 'Inter, sans-serif' }}>
              {isUp ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
              {isUp ? '+' : ''}{trend}%
            </Badge>
          </CardAction>
        )}
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1 text-sm">
        <div className="flex gap-2 font-medium line-clamp-1" style={{ fontFamily: 'Inter, sans-serif' }}>
          {trendLabel}
          {trend !== undefined && (isUp
            ? <TrendingUp className="size-4 text-(--green)" />
            : <TrendingDown className="size-4 text-destructive" />
          )}
        </div>
        <div className="text-muted-foreground text-xs" style={{ fontFamily: 'Inter, sans-serif' }}>{subLabel}</div>
      </CardFooter>
    </Card>
  );
}

export function SectionCards({ stats, loading }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="skeleton-shimmer rounded-xl h-36" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <StatCard
        label="Total Calls"
        value={stats.totalCalls}
        icon={Phone}
        subLabel="Total calls received via AI"
      />
      <StatCard
        label="Answer Rate"
        value={stats.answeredRate}
        suffix="%"
        icon={CheckCircle}
        subLabel="Percentage of successful calls"
      />
      <StatCard
        label="Avg Duration"
        value={stats.avgDuration}
        suffix=" min"
        decimals={1}
        icon={Clock}
        subLabel="Average call duration in minutes"
      />
      <StatCard
        label="Total Cost"
        value={stats.totalCost}
        prefix="$"
        decimals={2}
        icon={DollarSign}
        subLabel="Total AI call cost this period"
      />
    </div>
  );
}
