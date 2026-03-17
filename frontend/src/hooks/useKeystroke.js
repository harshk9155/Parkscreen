import { useState, useRef } from 'react';

// Keys typed by the LEFT hand on a standard QWERTY keyboard
const LEFT_KEYS = new Set([
  'q','w','e','r','t',
  'a','s','d','f','g',
  'z','x','c','v','b',
  '1','2','3','4','5',
  '`','~','!','@','#','$','%',
]);

// Keys to completely ignore (modifiers)
const IGNORE_KEYS = new Set([
  'Shift','Control','Alt','Meta',
  'CapsLock','Tab','Escape',
  'ArrowUp','ArrowDown','ArrowLeft','ArrowRight',
  'Home','End','PageUp','PageDown',
]);

export function useKeystroke() {
  const [events, setEvents] = useState([]);
  const keyDownTimes = useRef({});   // stores keydown timestamp per key
  const lastEvent = useRef(null);    // stores previous event for latency calc

  const handleKeyDown = (e) => {
    if (IGNORE_KEYS.has(e.key)) return;
    // Store the keydown time — using performance.now() for sub-millisecond precision
    keyDownTimes.current[e.key] = performance.now();
  };

  const handleKeyUp = (e) => {
    if (IGNORE_KEYS.has(e.key)) return;

    const upTime = performance.now();
    const downTime = keyDownTimes.current[e.key];

    // If we don't have a matching keydown, skip
    if (!downTime) return;

    // ── Compute the 3 core timing features ──
    const hold = upTime - downTime;

    // Latency: gap between releasing the previous key and pressing this one
    const latency = lastEvent.current
      ? downTime - lastEvent.current.upTime
      : 0;

    // Flight: time from pressing the previous key to pressing this one
    const flight = lastEvent.current
      ? downTime - lastEvent.current.downTime
      : 0;

    // Which hand typed this key?
    const hand = LEFT_KEYS.has(e.key.toLowerCase()) ? 'L' : 'R';

    const newEvent = {
      hold: +hold.toFixed(2),
      latency: +latency.toFixed(2),
      flight: +flight.toFixed(2),
      hand,
    };

    if (lastEvent.current !== null) {
      setEvents((prev) => [...prev, newEvent]);
    }


    // Update lastEvent for the next keystroke's calculations
    lastEvent.current = { downTime, upTime };

    // Clean up used keydown time
    delete keyDownTimes.current[e.key];
  };

  const reset = () => {
    setEvents([]);
    keyDownTimes.current = {};
    lastEvent.current = null;
  };

  return {
    events,           // array of { hold, latency, flight, hand }
    handleKeyDown,
    handleKeyUp,
    reset,
    count: events.length,
    isReady: events.length >= 100,
  };
}