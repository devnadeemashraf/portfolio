import Link from 'next/link';
import { ArrowUpRight } from './Icons';
import { formatDate, type Log } from '@/lib/content';

/** Compact card used on Home. Whole card is one link. */
export function LogCard({ l, index = 0 }: { l: Log; index?: number }) {
  return (
    <article className="card log-card morph sticky-card" style={{ '--i': index } as React.CSSProperties}>
      <Link href={`/logs/${l.slug}`} className="card-link">
        <p className="label meta">{formatDate(l.date)} · {l.minutes} min read</p>
        <h3 className="h3 log-title">{l.title}</h3>
        <ul className="chips">
          {l.tags.map((t) => <li className="chip" key={t}>{t}</li>)}
        </ul>
        <ArrowUpRight className="corner" />
      </Link>
    </article>
  );
}
