import { motion } from 'framer-motion';
import { useCountUp } from '@/hooks/useCountUp';

export function StatsCard({ title, value, suffix = '', prefix = '', decimals = 0, icon: Icon, delay = 0 }) {
  const animated = useCountUp(typeof value === 'number' ? value : 0, 1200, decimals);
  const display = `${prefix}${animated.toFixed(decimals)}${suffix}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.22, 1, 0.36, 1] }}
      className="bg-card border border-border rounded-lg p-5 flex flex-col gap-3 cursor-default hover:shadow-sm transition-shadow">

      <div className="flex items-center justify-between">
        <p className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground" style={{ fontFamily: 'Inter, sans-serif' }}>
          {title}
        </p>
        <div className="w-7 h-7 rounded flex items-center justify-center bg-secondary">
          <Icon size={13} className="text-foreground" strokeWidth={1.5} />
        </div>
      </div>

      <p className="text-[2rem] font-bold leading-none tracking-tight text-foreground" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
        {display}
      </p>
    </motion.div>
  );
}
