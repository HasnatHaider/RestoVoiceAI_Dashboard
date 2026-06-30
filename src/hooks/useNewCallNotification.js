import { useEffect, useRef, useState } from 'react';

function playBell(audioCtx) {
  const notes = [784, 988, 1175]; // G5 → B5 → D6 — ascending triple ping
  notes.forEach((freq, i) => {
    const osc  = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.type = 'sine';
    osc.frequency.value = freq;
    const start = audioCtx.currentTime + i * 0.18;
    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(0.35, start + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, start + 0.9);
    osc.start(start);
    osc.stop(start + 0.9);
  });
}

export function useNewCallNotification(calls, dateRange) {
  const knownIds     = useRef(new Set());
  const initialized  = useRef(false);
  const lastPlayedAt = useRef(0);
  const audioCtx     = useRef(null);
  const [needsInteraction, setNeedsInteraction] = useState(false);

  // Reset when dateRange changes so the re-filtered snapshot doesn't trigger bells
  useEffect(() => {
    knownIds.current    = new Set();
    initialized.current = false;
  }, [dateRange]);

  // Detect new docs on every snapshot update
  useEffect(() => {
    if (!calls.length) return;

    // First snapshot after init/reset — just seed knownIds, no bell
    if (!initialized.current) {
      calls.forEach((c) => knownIds.current.add(c.id));
      initialized.current = true;
      return;
    }

    const newCalls = calls.filter((c) => !knownIds.current.has(c.id));
    if (!newCalls.length) return;

    // Track all new IDs regardless of throttle so we don't re-ring them
    newCalls.forEach((c) => knownIds.current.add(c.id));

    // Throttle: at most once every 3 seconds
    const now = Date.now();
    if (now - lastPlayedAt.current < 3000) return;
    lastPlayedAt.current = now;

    // Lazy-init AudioContext (must be created after user gesture on some browsers)
    if (!audioCtx.current) {
      audioCtx.current = new (window.AudioContext || /** @type {any} */ (window).webkitAudioContext)();
    }

    const ctx = audioCtx.current;

    const tryPlay = async () => {
      try {
        if (ctx.state === 'suspended') await ctx.resume();
        playBell(ctx);
        setNeedsInteraction(false);
      } catch {
        setNeedsInteraction(true);
      }
    };

    tryPlay();
  }, [calls]);

  // One-time interaction handler to unblock audio
  const unlockAudio = () => {
    if (!audioCtx.current) {
      audioCtx.current = new (window.AudioContext || /** @type {any} */ (window).webkitAudioContext)();
    }
    audioCtx.current.resume().then(() => setNeedsInteraction(false));
  };

  return { needsInteraction, unlockAudio };
}
