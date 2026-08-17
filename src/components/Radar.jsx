import React from 'react';

// Радар 7 равноправных составных (SVG, без библиотек)
export default function Radar({ data }) {
  if (!data || data.length === 0) return null;
  const n = data.length;
  const size = 260, cx = 130, cy = 130, R = 92;
  const angle = i => (Math.PI * 2 * i) / n - Math.PI / 2;
  const pt = (i, r) => {
    const a = angle(i);
    return [cx + Math.cos(a) * r, cy + Math.sin(a) * r];
  };
  const poly = data.map((d, i) => {
    const [x, y] = pt(i, (R * d.pct) / 100);
    return `${x},${y}`;
  }).join(' ');

  // сетка (3 концентрических уровня)
  const rings = [0.33, 0.66, 1];
  const spokes = data.map((_, i) => {
    const [x, y] = pt(i, R);
    return <line key={i} x1={cx} y1={cy} x2={x} y2={y} className="radar-spoke" />;
  });

  return (
    <div className="radar-wrap">
      <svg viewBox="0 0 260 260" className="radar">
        {rings.map((r, i) => (
          <polygon key={i} points={data.map((_, j) => pt(j, R * r).join(',')).join(' ')} className="radar-ring" />
        ))}
        {spokes}
        <polygon points={poly} className="radar-fill" />
        <polygon points={poly} className="radar-stroke" />
        {data.map((d, i) => {
          const [x, y] = pt(i, (R * d.pct) / 100);
          return <circle key={i} cx={x} cy={y} r="4" className="radar-dot" />;
        })}
      </svg>
      <div className="radar-labels">
        {data.map((d, i) => {
          const [x, y] = pt(i, R + 26);
          return (
            <div key={d.id} className="radar-label" style={{ left: x, top: y }}>
              {d.icon}
              <b>{d.pct}%</b>
            </div>
          );
        })}
      </div>
    </div>
  );
}