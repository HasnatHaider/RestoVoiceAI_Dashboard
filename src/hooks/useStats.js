import { useMemo } from 'react';
import { format, parseISO } from 'date-fns';

export function useStats(calls) {
  return useMemo(() => {
    if (!calls.length) {
      return {
        totalCalls: 0,
        answeredRate: 0,
        avgDuration: 0,
        totalCost: 0,
        callsByDay: [],
        intentBreakdown: [],
      };
    }

    const totalCalls = calls.length;
    const answered = calls.filter((c) => c.analysis?.success === true).length;
    const answeredRate = Math.round((answered / totalCalls) * 100);
    const avgDuration =
      calls.reduce((sum, c) => sum + (c.call?.durationMinutes ?? 0), 0) / totalCalls;
    const totalCost = calls.reduce((sum, c) => sum + (c.cost ?? 0), 0);

    // Group by day for area chart
    const dayMap = {};
    calls.forEach((c) => {
      if (!c.createdAt) return;
      const day = format(parseISO(c.createdAt), 'MMM d');
      if (!dayMap[day]) dayMap[day] = { date: day, total: 0, successful: 0 };
      dayMap[day].total += 1;
      if (c.analysis?.success) dayMap[day].successful += 1;
    });
    const callsByDay = Object.values(dayMap).reverse();

    // Intent breakdown for donut
    const intentMap = {};
    calls.forEach((c) => {
      const intent = c.analysis?.intent || 'unknown';
      intentMap[intent] = (intentMap[intent] || 0) + 1;
    });
    const intentColors = {
      order:       '#24811c',
      reservation: '#3da832',
      inquiry:     '#56c44e',
      unknown:     '#d1d5db',
      other:       '#1a5e14',
    };
    const intentBreakdown = Object.entries(intentMap).map(([name, value]) => ({
      name,
      value,
      fill: intentColors[name] ?? '#24811c',
    }));

    return { totalCalls, answeredRate, avgDuration, totalCost, callsByDay, intentBreakdown };
  }, [calls]);
}
