'use client';

import { useEffect, useRef } from 'react';
import { Download } from './Icons';

export function ResumeMenu({ label, sde, fde }: { label: string; sde: string; fde: string }) {
  const ref = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    const close = (e: Event) => {
      const d = ref.current;
      if (d?.open && !(e.target instanceof Node && d.contains(e.target))) d.open = false;
    };
    const esc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && ref.current?.open) {
        ref.current.open = false;
        ref.current.querySelector('summary')?.focus();
      }
    };
    document.addEventListener('click', close);
    document.addEventListener('keydown', esc);
    return () => {
      document.removeEventListener('click', close);
      document.removeEventListener('keydown', esc);
    };
  }, []);

  return (
    <details className="popmenu" ref={ref}>
      <summary className="btn btn-ghost">
        <Download /> {label}
      </summary>
      <div className="popmenu-panel">
        <a href={fde} download data-track="resume_download" data-label="fde" onClick={() => ref.current && (ref.current.open = false)}>
          <strong>Forward deployed</strong>
          <span className="mono">PDF · FDE / solutions</span>
        </a>
        <a href={sde} download data-track="resume_download" data-label="sde" onClick={() => ref.current && (ref.current.open = false)}>
          <strong>Software engineer</strong>
          <span className="mono">PDF · full-stack</span>
        </a>
      </div>
    </details>
  );
}
