import { useEffect, useRef, useState } from 'react';

export default function RevealOnScroll({
  children,
  className = '',
  delay = 0,
  direction = 'up',
  as: Tag = 'div',
}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -32px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const directionClass = {
    up: 'reveal-up',
    down: 'reveal-down',
    left: 'reveal-left',
    right: 'reveal-right',
    fade: 'reveal-fade',
    scale: 'reveal-scale',
  }[direction];

  return (
    <Tag
      ref={ref}
      className={`reveal ${directionClass} ${visible ? 'reveal-visible' : ''} ${className}`}
      style={{ '--reveal-delay': `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}
