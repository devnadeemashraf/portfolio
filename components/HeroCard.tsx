import { ArrowRight, Calendar, socialIcon } from './Icons';
import { SheetTrigger } from './Sheets';
import { ResumeMenu } from './ResumeMenu';
import { AvailabilityPill } from './AvailabilityPill';

type Props = {
  available: boolean;
  availableLabel: string;
  bookUrl: string;
  bookTitle?: string;
  bookCta: string;
  moreWays: string;
  resumeLabel: string;
  resumeSde: string;
  resumeFde: string;
  recruiterTrigger: string;
  openTo: readonly { label: string; info: string }[];
  socials: readonly { label: string; handle: string; url: string }[];
};

/** Right-hand hero card: slides in on load and settles beside the headline. */
export function HeroCard(p: Props) {
  return (
    <aside className="card hero-card" aria-label="Book a call, résumé and availability">
      {p.available && <AvailabilityPill label={p.availableLabel} />}

      <div className="hero-card-actions">
        <a className="btn btn-primary" href={p.bookUrl} target="_blank" rel="noopener noreferrer" data-track="book_click" data-label={p.bookTitle}>
          <Calendar /> {p.bookCta} <ArrowRight className="nudge" />
        </a>
        <div className="hero-card-row">
          <ResumeMenu label={p.resumeLabel} sde={p.resumeSde} fde={p.resumeFde} align="left" />
          <SheetTrigger name="booking" className="btn btn-ghost">{p.moreWays}</SheetTrigger>
        </div>
      </div>

      {p.available && (
        <div className="opento">
          <p className="label">Open to</p>
          <ul className="open-chips">
            {p.openTo.map((o, i) => (
              <li key={o.label} className="tip-wrap">
                <button type="button" className="chip tip" aria-describedby={`opento-${i}`}>{o.label}</button>
                <span role="tooltip" id={`opento-${i}`} className="tooltip">{o.info}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <SheetTrigger name="recruiter" className="aside-link">
        <span>{p.recruiterTrigger}</span>
        <ArrowRight size={16} className="nudge" />
      </SheetTrigger>

      <ul className="social-row" aria-label="Elsewhere">
        {p.socials.map((s) => {
          const Icon = socialIcon(s.label);
          return (
            <li key={s.label}>
              <a className="btn-icon" href={s.url} target="_blank" rel="noopener noreferrer" aria-label={`${s.label} (${s.handle})`}>
                <Icon />
              </a>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
