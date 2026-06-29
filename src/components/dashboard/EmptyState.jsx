import { PhoneOff } from 'lucide-react';

export function EmptyState({ message = 'No call data yet' }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-3">
      <div className="w-12 h-12 rounded-xl border border-border bg-secondary flex items-center justify-center">
        <PhoneOff size={20} className="text-border" />
      </div>
      <p className="text-[15px] font-semibold text-foreground" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
        {message}
      </p>
      <p className="text-[12px] text-muted-foreground" style={{ fontFamily: 'Inter, sans-serif' }}>
        Call data will appear here once Vapi sends reports
      </p>
    </div>
  );
}
