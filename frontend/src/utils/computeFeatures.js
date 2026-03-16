// Takes raw keystroke events and computes the 15-feature vector
// that the ML model expects

function mean(arr) {
  if (!arr.length) return 0;
  return arr.reduce((sum, v) => sum + v, 0) / arr.length;
}

function stdDev(arr) {
  if (arr.length < 2) return 0;
  const m = mean(arr);
  return Math.sqrt(arr.reduce((sum, v) => sum + (v - m) ** 2, 0) / arr.length);
}

export function computeFeatures(events) {
  const holds    = events.map((e) => e.hold);
  const latencies = events.map((e) => e.latency).filter((v) => v > 0);
  const flights   = events.map((e) => e.flight).filter((v) => v > 0);

  const leftEvents  = events.filter((e) => e.hand === 'L');
  const rightEvents = events.filter((e) => e.hand === 'R');

  const l_hold    = mean(leftEvents.map((e) => e.hold));
  const r_hold    = mean(rightEvents.map((e) => e.hold));
  const l_latency = mean(leftEvents.map((e) => e.latency).filter((v) => v > 0));
  const r_latency = mean(rightEvents.map((e) => e.latency).filter((v) => v > 0));
  const l_flight  = mean(leftEvents.map((e) => e.flight).filter((v) => v > 0));
  const r_flight  = mean(rightEvents.map((e) => e.flight).filter((v) => v > 0));

  return {
    mean_hold:    +mean(holds).toFixed(2),
    std_hold:     +stdDev(holds).toFixed(2),
    mean_latency: +mean(latencies).toFixed(2),
    std_latency:  +stdDev(latencies).toFixed(2),
    mean_flight:  +mean(flights).toFixed(2),
    std_flight:   +stdDev(flights).toFixed(2),
    l_hold:       +l_hold.toFixed(2),
    r_hold:       +r_hold.toFixed(2),
    l_latency:    +l_latency.toFixed(2),
    r_latency:    +r_latency.toFixed(2),
    l_flight:     +l_flight.toFixed(2),
    r_flight:     +r_flight.toFixed(2),
    hold_asym:    +Math.abs(l_hold - r_hold).toFixed(2),
    lat_asym:     +Math.abs(l_latency - r_latency).toFixed(2),
    flight_asym:  +Math.abs(l_flight - r_flight).toFixed(2),
  };
}