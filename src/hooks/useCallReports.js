import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { subDays, startOfDay } from 'date-fns';

export function useCallReports(dateRange = 'all') {
  const [calls, setCalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    setLoading(true);

    let q;
    if (dateRange === 'all') {
      q = query(collection(db, 'WEB_HOOK'), orderBy('createdAt', 'desc'));
    } else {
      const days = dateRange === 'today' ? 0 : dateRange === '7d' ? 7 : 30;
      const since = startOfDay(subDays(new Date(), days)).toISOString();
      q = query(
        collection(db, 'WEB_HOOK'),
        where('createdAt', '>=', since),
        orderBy('createdAt', 'desc')
      );
    }

    const unsub = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setCalls(data);
        setLoading(false);
        setConnected(true);
        setError(null);
      },
      (err) => {
        console.error('Firestore error:', err);
        setError(err.message);
        setLoading(false);
        setConnected(false);
      }
    );

    return () => unsub();
  }, [dateRange]);

  return { calls, loading, error, connected };
}
