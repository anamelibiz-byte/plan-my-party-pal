import { useMemo } from 'react';

const SPRINKLE_COLORS = ['#FF6B9D','#C084FC','#FCD34D','#60A5FA','#34D399','#F87171','#FB923C'];

export default function Sprinkles() {
  const dots = useMemo(() =>
    Array.from({ length: 55 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      color: SPRINKLE_COLORS[i % SPRINKLE_COLORS.length],
      rotation: Math.random() * 360,
      w: 5 + Math.random() * 4,
      h: 14 + Math.random() * 10,
      dur: `${3 + Math.random() * 4}s`,
      delay: `${Math.random() * 5}s`,
    }))
  , []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {dots.map(s => (
        <div
          key={s.id}
          className="sprinkle"
          style={{
            left: s.left,
            top: s.top,
            backgroundColor: s.color,
            width: `${s.w}px`,
            height: `${s.h}px`,
            '--rotation': `${s.rotation}deg`,
            animation: `sprinkle-float ${s.dur} ease-in-out infinite`,
            animationDelay: s.delay,
          }}
        />
      ))}
    </div>
  );
}
