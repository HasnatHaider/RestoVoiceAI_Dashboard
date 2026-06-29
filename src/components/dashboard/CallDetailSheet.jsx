import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { Clock, DollarSign, ShoppingBag, CalendarDays } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';

const INTENT_STYLES = {
  order:       'bg-orange-50 text-orange-700',
  reservation: 'bg-green-50 text-green-700',
  inquiry:     'bg-yellow-50 text-yellow-700',
  unknown:     'bg-gray-100 text-gray-600',
};

function SectionLabel({ icon: Icon, children }) {
  return (
    <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-3" style={{ fontFamily: 'Inter, sans-serif' }}>
      {Icon && <Icon size={11} />}
      {children}
    </p>
  );
}

function Row({ label, value }) {
  if (!value) return null;
  return (
    <div className="flex justify-between gap-4 py-2 border-b border-border/50 last:border-0">
      <span className="text-[13px] text-muted-foreground shrink-0" style={{ fontFamily: 'Inter, sans-serif' }}>{label}</span>
      <span className="text-[13px] font-medium text-foreground text-right" style={{ fontFamily: 'Inter, sans-serif' }}>{value}</span>
    </div>
  );
}

export function CallDetailSheet({ call, open, onClose }) {
  if (!call) return null;

  const intent = call.analysis?.intent || 'unknown';
  const intentClass = INTENT_STYLES[intent] ?? INTENT_STYLES.unknown;
  const success = call.analysis?.success === true;

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:w-[40vw] max-w-none p-0 overflow-y-auto bg-background border-l border-border">

        {/* Header */}
        <div className="px-8 pt-8 pb-6 border-b border-border">
          <h2 className="text-[18px] font-semibold text-foreground mb-5" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
            Call Details
          </h2>

          {/* Meta chips */}
          <div className="flex flex-wrap gap-2 mb-4">
            {[
              { icon: Clock,       label: call.call?.durationMinutes ? `${call.call.durationMinutes.toFixed(1)} min` : 'N/A' },
              { icon: DollarSign,  label: `$${(call.cost ?? 0).toFixed(4)}` },
            ].map(({ icon: Icon, label }) => (
              <span key={label} className="flex items-center gap-1.5 px-3 py-1.5 bg-secondary border border-border rounded-full text-[12px] text-muted-foreground" style={{ fontFamily: 'Inter, sans-serif' }}>
                <Icon size={11} />
                {label}
              </span>
            ))}
          </div>

          {/* Intent + outcome badges */}
          <div className="flex gap-2 mb-4">
            <span className={cn('text-[12px] font-medium px-3 py-1 rounded-full capitalize', intentClass)} style={{ fontFamily: 'Inter, sans-serif' }}>
              {intent}
            </span>
            <span className={cn('text-[12px] font-medium px-3 py-1 rounded-full', success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700')} style={{ fontFamily: 'Inter, sans-serif' }}>
              {success ? 'Successful' : 'Unsuccessful'}
            </span>
          </div>

          {call.createdAt && (
            <p className="text-[13px] text-muted-foreground" style={{ fontFamily: 'Inter, sans-serif' }}>
              {format(parseISO(call.createdAt), 'MMMM d, yyyy · h:mm a')}
            </p>
          )}
        </div>

        {/* Body */}
        <div className="px-8 py-6 flex flex-col gap-7">

          {/* Analysis */}
          <div>
            <SectionLabel>Analysis</SectionLabel>
            <Row label="Ended reason" value={call.analysis?.endedReason} />
            {call.analysis?.summary && (
              <div className="mt-3 px-4 py-3 bg-secondary border border-border rounded-lg text-[13px] text-foreground leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
                {call.analysis.summary}
              </div>
            )}
          </div>

          {/* Order */}
          {call.order?.type && (
            <>
              <Separator />
              <div>
                <SectionLabel icon={ShoppingBag}>Order</SectionLabel>
                <Row label="Type"    value={call.order.type} />
                <Row label="Total"   value={call.order.totalPrice} />
                <Row label="Branch"  value={call.order.branchLocation} />
                <Row label="Address" value={call.order.deliveryAddress} />
                {call.order.items?.length > 0 && (
                  <div className="mt-3">
                    <p className="text-[12px] text-muted-foreground mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>Items</p>
                    <div className="px-4 py-3 bg-secondary border border-border rounded-lg space-y-1">
                      {call.order.items.map((item, i) => {
                        const label = typeof item === 'string'
                          ? item
                          : [item.name, item.size, item.quantity ? `×${item.quantity}` : null, item.options].filter(Boolean).join(' · ');
                        return (
                          <p key={i} className="text-[13px] text-foreground" style={{ fontFamily: 'Inter, sans-serif' }}>· {label}</p>
                        );
                      })}
                    </div>
                  </div>
                )}
                {call.order.notes && <Row label="Notes" value={call.order.notes} />}
              </div>
            </>
          )}

          {/* Reservation */}
          {call.reservation?.date && (
            <>
              <Separator />
              <div>
                <SectionLabel icon={CalendarDays}>Reservation</SectionLabel>
                <Row label="Date"   value={call.reservation.date} />
                <Row label="Time"   value={call.reservation.time} />
                <Row label="Guests" value={call.reservation.guestCount ? `${call.reservation.guestCount} guests` : null} />
                <Row label="Branch" value={call.reservation.branchLocation} />
                {call.reservation.notes && <Row label="Notes" value={call.reservation.notes} />}
              </div>
            </>
          )}

          {/* Recording */}
          {call.media?.recordingUrl && (
            <>
              <Separator />
              <div>
                <SectionLabel>Recording</SectionLabel>
                <audio controls src={call.media.recordingUrl} className="w-full h-9 rounded-md outline-none" />
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
