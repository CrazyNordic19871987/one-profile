import { useEffect, useState } from 'react';

export default function useData(load, deps = []) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [tick, setTick] = useState(0);
  useEffect(() => {
    let alive = true;
    Promise.resolve(load()).then(d => { if (alive) setData(d); }).catch(e => { if (alive) setError(e); });
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, tick]);
  const reload = () => setTick(t => t + 1);
  return [data, error, reload];
}