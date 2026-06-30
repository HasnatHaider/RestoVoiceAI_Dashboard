import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { TooltipProvider } from '@/components/ui/tooltip';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useCallReports } from '@/hooks/useCallReports';
import { useNewCallNotification } from '@/hooks/useNewCallNotification';
import { Overview } from '@/pages/Overview';
import { Calls } from '@/pages/Calls';

function Dashboard() {
  const [dateRange, setDateRange] = useState('all');
  const { calls, loading, connected, error } = useCallReports(dateRange);
  const { needsInteraction, unlockAudio } = useNewCallNotification(calls, dateRange);

  return (
    <DashboardLayout
      dateRange={dateRange}
      onDateRangeChange={setDateRange}
      loading={loading}
      connected={connected}
      needsInteraction={needsInteraction}
      unlockAudio={unlockAudio}>

      {error && (
        <div className="mx-4 lg:mx-6 mb-2 px-4 py-2.5 bg-destructive/10 border border-destructive/30 rounded-lg text-[13px] text-destructive" style={{ fontFamily: 'Inter, sans-serif' }}>
          <strong>Firestore error:</strong> {error}
        </div>
      )}

      <Routes>
        <Route path="/"          element={<Overview  calls={calls} loading={loading} />} />
        <Route path="/calls"     element={<Calls     calls={calls} loading={loading} />} />
      </Routes>
    </DashboardLayout>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <TooltipProvider>
        <Dashboard />
      </TooltipProvider>
    </BrowserRouter>
  );
}
