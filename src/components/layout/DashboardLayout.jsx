import { useLocation } from 'react-router-dom';
import { AppSidebar } from './Sidebar';
import { SiteHeader } from './Header';

import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

export function DashboardLayout({ children, dateRange, onDateRangeChange, loading, connected }) {
  const location = useLocation();

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <SiteHeader
          pathname={location.pathname}
          dateRange={dateRange}
          onDateRangeChange={onDateRangeChange}
          loading={loading}
          connected={connected}
        />
        <div className="flex flex-1 flex-col gap-4 py-4 md:gap-6 md:py-6 @container/main">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
