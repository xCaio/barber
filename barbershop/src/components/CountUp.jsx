import { useEffect, useRef, useState } from 'react';

export default function CountUp({ value, duration = 1400, className = '' }) {
  const ref = useRef(null);
  const [display, setDisplay] = useState(String(value));

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const match = String(value).match(/^(\d+)(.*)$/);
    if (!match) {
      setDisplay(String(value));
      return;
    }

    const target = Number(match[1]);
    const suffix = match[2];
    let started = false;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started) return;
        started = true;
        observer.disconnect();

        const startTime = performance.now();
        const tick = (now) => {
          const progress = Math.min((now - startTime) / duration, 1);
          const eased = 1 - (1 - progress) ** 3;
          setDisplay(`${Math.floor(target * eased)}${suffix}`);
          if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [value, duration]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}
