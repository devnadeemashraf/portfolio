import Link from 'next/link';
import type { ReactNode } from 'react';
import { Statement } from './Statement';
import { ArrowRight } from './Icons';

/**
 * A chapter: statement on the left (sticky on desktop, chapter bar sticky on mobile),
 * cards on the right. All motion is CSS (story.css); this is pure markup.
 */
export function Story({
  id,
  label,
  statement,
  cta,
  ctaHref,
  ctaDownload,
  children,
}: {
  id: string;
  label: string;
  statement: string;
  cta?: string;
  ctaHref?: string;
  ctaDownload?: boolean;
  children: ReactNode;
}) {
  return (
    <section className="story" id={id} aria-labelledby={`${id}-stmt`}>
      <div className="container split">
        <div className="stick">
          <p className="chap label">
            <span>{label}</span>
            <span className="bar" aria-hidden="true"><span /></span>
          </p>
          <Statement text={statement} />
          {cta && ctaHref && (
            <p className="stick-cta">
              {ctaDownload ? (
                <a className="link" href={ctaHref} download>{cta} <ArrowRight size={15} /></a>
              ) : (
                <Link className="link" href={ctaHref}>{cta} <ArrowRight size={15} /></Link>
              )}
            </p>
          )}
        </div>
        <div className="flow">{children}</div>
      </div>
    </section>
  );
}
