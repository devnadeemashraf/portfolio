import { ArrowRight, Calendar, Download, socialIcon } from '@/components/Icons';
import { SheetTrigger, EmailCopy } from '@/components/Sheets';
import { Story } from '@/components/Story';
import { PreviewRow } from '@/components/PreviewRow';
import { HeroHeading } from '@/components/HeroHeading';
import { HeroCard } from '@/components/HeroCard';
import {
  formatDate, getAbout, getExperience, getHome, getLogs, getProfile, getProjects, getSocials, getTools, getUi,
} from '@/lib/content';
import { personJsonLd } from '@/lib/jsonld';

export default async function Home() {
  const [p, home, ui, projects, logs, about, experience, socials, tools] = await Promise.all([
    getProfile(), getHome(), getUi(), getProjects(), getLogs(), getAbout(), getExperience(), getSocials(), getTools(),
  ]);
  const featured = projects.filter((x) => x.featured);
  const sideTools = tools.filter((t) => t.origin === 'side');
  const bookUrl = p.booking?.url ?? '#';

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd(p, socials)) }} />

      <section className="hero" aria-labelledby="hero-title">
        <div className="container hero-grid">
          <div className="hero-copy">
            <HeroHeading
              name={p.name}
              city={p.city}
              roles={p.roles.map((r) => ({ word: r.word, title: r.title, headline: r.headline, dim: r.dim }))}
            />
            <p className="lead hero-lead">{p.lead}</p>
            <p className="label scroll-hint">{ui.scrollHint} ↓</p>
          </div>

          <HeroCard
            available={p.available}
            availableLabel={p.availableLabel}
            bookUrl={bookUrl}
            bookTitle={p.booking?.title ?? undefined}
            bookCta={ui.bookCta}
            moreWays={ui.moreWaysToMeet}
            resumeLabel={ui.resumeLabel}
            resumeSde={p.resumeSde}
            resumeFde={p.resumeFde}
            recruiterTrigger={ui.recruiterTrigger}
            openTo={p.openTo.map((o) => ({ label: o.label, info: o.info }))}
            socials={socials}
          />
        </div>
      </section>

      <Story id="work" label={home.work.label} statement={home.work.statement} cta={home.work.cta} ctaHref="/work">
        {experience.map((e) => (
          <PreviewRow key={e.slug} href="/work" label={`${e.start} — ${e.end}`} title={e.role} text={e.company} />
        ))}
      </Story>

      <Story id="projects" label={home.projects.label} statement={home.projects.statement} cta={home.projects.cta} ctaHref="/projects">
        {featured.slice(0, 1).map((proj) => (
          <PreviewRow key={proj.slug} href={`/projects/${proj.slug}`} label={proj.status || 'Project'} title={proj.title} text={proj.oneLiner} />
        ))}
        {sideTools.slice(0, 2).map((t) => (
          <PreviewRow key={t.slug} href={`/open-source/${t.slug}`} label={t.kind} title={t.title} text={t.tagline} />
        ))}
      </Story>

      <Story id="logs" label={home.logs.label} statement={home.logs.statement} cta={home.logs.cta} ctaHref="/logs">
        {logs.slice(0, 2).map((l) => (
          <PreviewRow key={l.slug} href={`/logs/${l.slug}`} label={`${formatDate(l.date)} · ${l.minutes} min read`} title={l.title} text={l.summary} />
        ))}
      </Story>

      <Story id="about" label={home.about.label} statement={home.about.statement} cta={home.about.cta} ctaHref="/about">
        {about.principles.map((pr) => (
          <PreviewRow key={pr.title} href="/about" label="Principle" title={pr.title} text={pr.text} />
        ))}
      </Story>

      <section className="contact" id="contact" aria-labelledby="contact-title">
        <div className="container contact-grid">
          <div>
            <p className="label">{home.contactLabel}</p>
            <h2 className="display contact-title" id="contact-title">{home.contactHeadline}</h2>
            <p className="lead">{home.contactLead}</p>
            <div className="hero-actions">
              <a className="btn btn-primary" href={bookUrl} target="_blank" rel="noopener noreferrer" data-track="book_click" data-label={p.booking?.title ?? undefined}>
                <Calendar /> {ui.bookCta} <ArrowRight className="nudge" />
              </a>
              <a className="btn btn-ghost" href={p.resumeFde} download data-track="resume_download" data-label="fde">
                <Download /> {ui.resumeLabel}
              </a>
              <SheetTrigger name="booking" className="link hero-more">{ui.moreWaysToMeet}</SheetTrigger>
            </div>
            <div className="contact-email">
              <EmailCopy email={p.email} copy={ui.copyLabel} copied={ui.copiedLabel} />
            </div>
          </div>
          <div>
            <p className="label">Elsewhere</p>
            <ul className="elsewhere">
              {socials.map((s) => {
                const Icon = socialIcon(s.label);
                return (
                  <li key={s.label}>
                    <a className="card elsewhere-item" href={s.url} target="_blank" rel="noopener noreferrer">
                      <span className="elsewhere-name"><Icon size={18} /> {s.label}</span>
                      <span className="mono muted">{s.handle}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
