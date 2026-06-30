import { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, PhoneOff } from 'lucide-react';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { CallDetailSheet } from './CallDetailSheet';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const INTENT_STYLES = {
  order: 'bg-green-50 text-green-700 border-green-200',
  reservation: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  inquiry: 'bg-gray-100 text-gray-600 border-gray-200',
  unknown: 'bg-gray-100 text-gray-500 border-gray-200',
};

export function RecentCallsTable({ calls, loading, limit }) {
  const [selected, setSelected] = useState(null);
  const rows = calls.slice(0, limit);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.32, ease: [0.22, 1, 0.36, 1] }}>

      <div className="py-4">
        <h2
          class="font-heading text-base leading-snug font-medium group-data-[size=sm]/card:text-sm"
          style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
          Recent Calls
        </h2>
      </div>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-0">
                {['#', 'Caller', 'Intent', 'Duration', 'Outcome', 'Cost', 'When', ''].map((h) => (
                  <TableHead
                    key={h}
                    className="h-10 px-6 text-[12px] uppercase tracking-wider font-medium text-muted-foreground"
                    style={{ fontFamily: 'Inter, sans-serif' }}>
                    {h}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading ? (
                Array.from({ length: limit ?? 10 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 8 }).map((_, j) => (
                      <TableCell key={j} className="px-6 py-3.5">
                        <div className="skeleton-shimmer rounded h-3" style={{ width: j === 0 ? 20 : j === 1 ? 200 : 60 }} />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="py-16 text-center">
                    <PhoneOff size={22} className="mx-auto mb-2 text-muted-foreground/40" />
                    <p className="text-sm text-muted-foreground" style={{ fontFamily: 'Inter, sans-serif' }}>
                      No calls found
                    </p>
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((call, index) => {
                  const intent = call.analysis?.intent || 'unknown';
                  const intentClass = INTENT_STYLES[intent] ?? INTENT_STYLES.unknown;
                  const success = call.analysis?.success;

                  return (
                    <TableRow
                      key={call.id}
                      className="cursor-pointer hover:bg-muted/40 transition-colors"
                      onClick={() => setSelected(call)}>

                      <TableCell className="px-6 py-3.5 text-[13px] text-muted-foreground tabular-nums w-10" style={{ fontFamily: 'Inter, sans-serif' }}>
                        {index + 1}
                      </TableCell>

                      <TableCell className="px-6 py-3.5 text-[13px] font-medium text-foreground" style={{ fontFamily: 'Inter, sans-serif' }}>
                        {call.call?.callId ?? '—'}
                      </TableCell>

                      <TableCell className="px-6 py-3.5">
                        <span
                          className={cn(
                            'inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-medium capitalize',
                            intentClass
                          )}
                          style={{ fontFamily: 'Inter, sans-serif' }}>
                          {intent}
                        </span>
                      </TableCell>

                      <TableCell className="px-6 py-3.5 text-[13px] text-muted-foreground tabular-nums" style={{ fontFamily: 'Inter, sans-serif' }}>
                        {call.call?.durationMinutes ? `${call.call.durationMinutes.toFixed(1)}m` : '—'}
                      </TableCell>

                      <TableCell className="px-6 py-3.5">
                        <span
                          className={cn(
                            'inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-medium',
                            success
                              ? 'bg-green-50 text-green-700 border-green-200'
                              : 'bg-red-50 text-red-600 border-red-200'
                          )}
                          style={{ fontFamily: 'Inter, sans-serif' }}>
                          {success ? 'Success' : 'Failed'}
                        </span>
                      </TableCell>

                      <TableCell className="px-6 py-3.5 text-[13px] text-muted-foreground tabular-nums" style={{ fontFamily: 'Inter, sans-serif' }}>
                        ${(call.cost ?? 0).toFixed(3)}
                      </TableCell>

                      <TableCell className="px-6 py-3.5 text-[13px] text-muted-foreground" style={{ fontFamily: 'Inter, sans-serif' }}>
                        {call.createdAt ? formatDistanceToNow(parseISO(call.createdAt), { addSuffix: true }) : '—'}
                      </TableCell>

                      <TableCell className="px-6 py-3.5">
                        <button
                          onClick={(e) => { e.stopPropagation(); setSelected(call); }}
                          className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer">
                          <Eye size={14} />
                        </button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <CallDetailSheet call={selected} open={!!selected} onClose={() => setSelected(null)} />
    </motion.div>
  );
}
