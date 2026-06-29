import { useState } from 'react';
import { formatDistanceToNow, parseISO, format } from 'date-fns';
import { Clock, MapPin, Phone, CheckCircle2, XCircle, ChevronRight } from 'lucide-react';
import { EmptyState } from '@/components/dashboard/EmptyState';
import { CallDetailSheet } from '@/components/dashboard/CallDetailSheet';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

const INTENT_CONFIG = {
  order:       { label: 'Order',       class: 'bg-orange-50 text-orange-600 border-orange-200', dot: 'bg-orange-400' },
  reservation: { label: 'Reservation', class: 'bg-emerald-50 text-emerald-600 border-emerald-200', dot: 'bg-emerald-400' },
  inquiry:     { label: 'Inquiry',     class: 'bg-blue-50 text-blue-600 border-blue-200', dot: 'bg-blue-400' },
  unknown:     { label: 'Unknown',     class: 'bg-gray-100 text-gray-500 border-gray-200', dot: 'bg-gray-300' },
};

function formatCallId(id) {
  if (!id) return 'Unknown';
  return id.slice(0, 8).toUpperCase();
}

function CallCard({ call, onClick }) {
  const intent = call.analysis?.intent || 'unknown';
  const cfg = INTENT_CONFIG[intent] ?? INTENT_CONFIG.unknown;
  const items = call.order?.items ?? [];
  const address = call.order?.deliveryAddress || call.reservation?.branchLocation || '';
  const when = call.call?.startedAt ?? call.call?.createdAt;
  const duration = call.call?.durationMinutes;
  const cost = call.call?.cost ?? call.cost ?? 0;
  const success = call.analysis?.success === true;

  return (
    <div
      onClick={() => onClick(call)}
      className="group relative bg-card border border-border rounded-xl p-5 flex flex-col gap-4 cursor-pointer hover:border-border/60 hover:shadow-md transition-all duration-200">

      {/* Top row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className={cn('w-2 h-2 rounded-full shrink-0 mt-0.5', cfg.dot)} />
          <div className="min-w-0">
            <p className="text-[13px] font-semibold text-foreground" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              #{formatCallId(call.call?.callId)}
            </p>
            {when && (
              <p className="text-[11px] text-muted-foreground mt-0.5" style={{ fontFamily: 'Inter, sans-serif' }}>
                {format(parseISO(when), 'MMM d, yyyy · h:mm a')}
              </p>
            )}
          </div>
        </div>
        <Badge variant="outline" className={cn('text-[11px] shrink-0 font-medium', cfg.class)} style={{ fontFamily: 'Inter, sans-serif' }}>
          {cfg.label}
        </Badge>
      </div>

      {/* Summary */}
      {call.analysis?.summary && (
        <p className="text-[13px] text-muted-foreground leading-[1.65] line-clamp-2" style={{ fontFamily: 'Inter, sans-serif' }}>
          {call.analysis.summary}
        </p>
      )}

      {/* Order items */}
      {intent === 'order' && items.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {items.slice(0, 3).map((item, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1 bg-muted text-foreground text-[11px] font-medium px-2.5 py-1 rounded-full"
              style={{ fontFamily: 'Inter, sans-serif' }}>
              {item.quantity}× {item.name}
              {item.size && item.size !== 'N/A' ? ` · ${item.size}` : ''}
            </span>
          ))}
          {items.length > 3 && (
            <span className="inline-flex items-center bg-muted text-muted-foreground text-[11px] px-2.5 py-1 rounded-full" style={{ fontFamily: 'Inter, sans-serif' }}>
              +{items.length - 3} more
            </span>
          )}
        </div>
      )}

      {/* Reservation details */}
      {intent === 'reservation' && call.reservation?.date && (
        <div className="flex items-center gap-4">
          <span className="text-[12px] text-muted-foreground" style={{ fontFamily: 'Inter, sans-serif' }}>
            📅 {call.reservation.date}{call.reservation.time ? ` · ${call.reservation.time}` : ''}
          </span>
          {call.reservation.guestCount > 0 && (
            <span className="text-[12px] text-muted-foreground" style={{ fontFamily: 'Inter, sans-serif' }}>
              {call.reservation.guestCount} guests
            </span>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between gap-2 pt-1 border-t border-border/60">
        <div className="flex items-center gap-3">
          {duration && (
            <span className="flex items-center gap-1 text-[11px] text-muted-foreground" style={{ fontFamily: 'Inter, sans-serif' }}>
              <Clock size={11} className="text-muted-foreground/70" />
              {duration.toFixed(1)}m
            </span>
          )}
          {cost > 0 && (
            <span className="text-[11px] text-muted-foreground font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>
              ${cost.toFixed(3)}
            </span>
          )}
          {address && (
            <span className="flex items-center gap-1 text-[11px] text-muted-foreground truncate max-w-[140px]" style={{ fontFamily: 'Inter, sans-serif' }}>
              <MapPin size={11} className="text-muted-foreground/70 shrink-0" />
              {address}
            </span>
          )}
        </div>
        <ChevronRight size={14} className="text-muted-foreground/40 group-hover:text-muted-foreground transition-colors shrink-0" />
      </div>
    </div>
  );
}

function CallGrid({ calls, onSelect, loading }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="skeleton-shimmer rounded-xl h-44" />
        ))}
      </div>
    );
  }

  if (calls.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-52 rounded-xl border border-dashed border-border gap-2">
        <Phone size={20} className="text-muted-foreground/30" />
        <p className="text-[13px] text-muted-foreground" style={{ fontFamily: 'Inter, sans-serif' }}>
          No calls in this category
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
      {calls.map((call) => (
        <CallCard key={call.id ?? call.call?.callId} call={call} onClick={onSelect} />
      ))}
    </div>
  );
}

export function Calls({ calls, loading }) {
  const [selected, setSelected] = useState(null);

  if (!loading && calls.length === 0) return <EmptyState message="No calls recorded yet" />;

  const successful = calls.filter((c) => c.analysis?.success === true);
  const failed     = calls.filter((c) => c.analysis?.success !== true);

  return (
    <div className="px-4 lg:px-6 flex flex-col gap-5">
      <Tabs defaultValue="success">
        {/* Tab bar */}
        <TabsList className="w-full h-14 p-1.5 rounded-xl mb-6">
          <TabsTrigger value="success" className="flex-1 cursor-pointer h-full rounded-lg gap-2 text-[14px] font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>
            <CheckCircle2 size={15} className="text-[#24811c]" />
            Successful
            <span className="ml-0.5 text-[11px] bg-[#24811c]/10 text-[#24811c] font-semibold px-1.5 py-0.5 rounded-full">
              {successful.length}
            </span>
          </TabsTrigger>
          <TabsTrigger value="failed" className="flex-1 cursor-pointer h-full rounded-lg gap-2 text-[14px] font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>
            <XCircle size={15} className="text-red-500" />
            Failed
            <span className="ml-0.5 text-[11px] bg-red-50 text-red-500 font-semibold px-1.5 py-0.5 rounded-full">
              {failed.length}
            </span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="success" className="mt-0">
          <CallGrid calls={successful} onSelect={setSelected} loading={loading} />
        </TabsContent>

        <TabsContent value="failed" className="mt-0">
          <CallGrid calls={failed} onSelect={setSelected} loading={loading} />
        </TabsContent>
      </Tabs>

      <CallDetailSheet call={selected} open={!!selected} onClose={() => setSelected(null)} />
    </div>
  );
}
