import { useLocation } from 'react-router-dom';
import { AppSidebar } from './Sidebar';
import { SiteHeader } from './Header';

import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

export function DashboardLayout({ children, dateRange, onDateRangeChange, loading, connected, needsInteraction, unlockAudio }) {
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
        {needsInteraction && (
          <button
            onClick={unlockAudio}
            className="w-full px-4 py-2 text-[13px] bg-amber-50 border-b border-amber-200 text-amber-700 text-center hover:bg-amber-100 transition-colors cursor-pointer"
            style={{ fontFamily: 'Inter, sans-serif' }}>
            🔔 Click here to enable call notifications
          </button>
        )}
        <div className="flex flex-1 flex-col gap-4 py-4 md:gap-6 md:py-6 @container/main">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
