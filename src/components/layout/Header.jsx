import { SidebarTrigger } from '@/components/ui/sidebar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

const PAGE_TITLES = {
  '/':      'Overview',
  '/calls': 'Call Log',
};

export function SiteHeader({ pathname, dateRange, onDateRangeChange, loading, connected }) {
  const title = PAGE_TITLES[pathname] ?? 'Dashboard';

  return (
    <header className="flex h-[52px] shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-[52px]">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1 cursor-pointer" />
        <div className="mx-2 w-px h-4 bg-border shrink-0" />
        <h1 className="text-base font-semibold text-foreground" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
          {title}
        </h1>

        <div className="ml-auto flex items-center gap-3">
          {/* Live indicator */}
          <div className="flex items-center gap-1.5">
            <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', connected ? 'bg-(--green) animate-pulse' : 'bg-muted-foreground')} />
            <span className="text-[11px] text-muted-foreground hidden sm:block" style={{ fontFamily: 'Inter, sans-serif' }}>
              {connected ? 'Live' : 'Connecting…'}
            </span>
          </div>

          {/* Date range */}
          <Select value={dateRange} onValueChange={onDateRangeChange}>
            <SelectTrigger className="h-8 w-32 text-[12px] cursor-pointer" style={{ fontFamily: 'Inter, sans-serif' }}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent style={{ fontFamily: 'Inter, sans-serif' }}>
              <SelectItem value="all"   className="text-[12px] cursor-pointer">All time</SelectItem>
              <SelectItem value="today" className="text-[12px] cursor-pointer">Today</SelectItem>
              <SelectItem value="7d"    className="text-[12px] cursor-pointer">Last 7 days</SelectItem>
              <SelectItem value="30d"   className="text-[12px] cursor-pointer">Last 30 days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </header>
  );
}
