import Link from 'next/link';
import { ArrowRight, Calendar } from './Icons';
import { SheetTrigger } from './Sheets';

export function ClosingCta({
  headline,
  lead,
  bookUrl,
  bookLabel,
  bookTitle,
}: {
  headline: string;
  lead: string;
  bookUrl: string;
  bookLabel: string;
  bookTitle?: string;
}) {
  return (
    <section className="closing" aria-labelledby="closing-title">
      <div className="container closing-row">
        <div>
          <h2 className="h2" id="closing-title">{headline}</h2>
          <p>{lead}</p>
        </div>
        <div className="hero-actions" style={{ marginTop: 0 }}>
          <a className="btn btn-primary" href={bookUrl} target="_blank" rel="noopener noreferrer" data-track="book_click" data-label={bookTitle}>
            <Calendar /> {bookLabel} <ArrowRight className="nudge" />
          </a>
          <SheetTrigger name="booking" className="btn btn-ghost">More ways to meet</SheetTrigger>
          <Link className="btn btn-ghost" href="/#contact">Contact <ArrowRight size={16} /></Link>
        </div>
      </div>
    </section>
  );
}
