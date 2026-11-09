'use client';

import { useRef, useState } from 'react';
import { Check, Copy } from '../Icons';
import { track } from '../analytics/track';

export function CopyCode({ code }: { code: string }) {
  const [done, setDone] = useState(false);
  const t = useRef<ReturnType<typeof setTimeout>>(undefined);
  return (
    <button
      type="button"
      className="btn btn-ghost btn-sm copy-code"
      aria-label="Copy code"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(code);
        } catch {}
        track('code_copy');
        setDone(true);
        clearTimeout(t.current);
        t.current = setTimeout(() => setDone(false), 1600);
      }}
    >
      <span className="swap" data-done={done}>{done ? <Check size={15} /> : <Copy size={15} />}</span>
      <span aria-live="polite">{done ? 'Copied' : 'Copy'}</span>
    </button>
  );
}
