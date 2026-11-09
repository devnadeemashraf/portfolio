import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Calendar, Download, socialIcon } from '@/components/Icons';
import { SheetTrigger, EmailCopy } from '@/components/Sheets';
import { AvailabilityPill } from '@/components/AvailabilityPill';
import { Story } from '@/components/Story';
import { ProjectCard } from '@/components/ProjectCard';
import { LogCard } from '@/components/LogCard';
import {
  getAbout, getExperience, getHome, getLogs, getProfile, getProjects, getSocials, getUi,
} from '@/lib/content';
import { personJsonLd } from '@/lib/jsonld';

export default async function Home() {
  const [p, home, ui, projects, logs, about, experience, socials] = await Promise.all([
    getProfile(), getHome(), getUi(), getProjects(), getLogs(), getAbout(), getExperience(), getSocials(),
  ]);
  const featured = projects.filter((x) => x.featured);
  const bookUrl = p.booking?.url ?? '#';

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd(p, socials)) }} />

      <section className="hero" aria-labelledby="hero-title">
        <div className="container hero-grid">
          <div className="hero-copy">
            <p className="label hero-eyebrow">{p.name} · {p.role} · {p.city}</p>
            <h1 className="display" id="hero-title">
              {p.heroHeadline} <span className="dim">{p.heroHeadlineDim}</span>
            </h1>
            <p className="lead hero-lead">{p.lead}</p>
            <div className="hero-actions">
              <a className="btn btn-primary" href={bookUrl} target="_blank" rel="noopener noreferrer" data-track="book_click" data-label={p.booking?.title ?? undefined}>
                <Calendar /> {ui.bookCta} <ArrowRight className="nudge" />
              </a>
              <a className="btn btn-ghost" href={p.resumeFde} download data-track="resume_download" data-label="fde">
                <Download /> {ui.resumeLabel}
              </a>
              <SheetTrigger name="booking" className="link hero-more">{ui.moreWaysToMeet}</SheetTrigger>
            </div>
          </div>

          <aside className="hero-aside" aria-label="Quick facts">
            {p.available && (
              <>
                <div className="card aside-card">
                  <AvailabilityPill label={p.availableLabel} />
                  <SheetTrigger name="recruiter" className="aside-link">
                    <span>{ui.recruiterTrigger}</span>
                    <ArrowRight size={16} className="nudge" />
                  </SheetTrigger>
                  {p.relocation.length > 0 && (
                    <p className="reloc">
                      <span className="label">Open to relocate</span>
                      <span>{p.relocation.join(' · ')}</span>
                    </p>
                  )}
                </div>
              </>
            )}
            <ul className="social-row" aria-label="Elsewhere">
              {socials.map((s) => {
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
            <p className="label scroll-hint">{ui.scrollHint} ↓</p>
          </aside>
        </div>
      </section>

      <Story id="work" label={home.work.label} statement={home.work.statement} cta={home.work.cta} ctaHref="/#work">
        {featured.map((proj, i) => (
          <ProjectCard key={proj.slug} p={proj} index={i} readLabel={ui.readCaseStudy} liveLabel={ui.liveLabel} codeLabel={ui.codeLabel} />
        ))}
      </Story>

      <Story id="logs" label={home.logs.label} statement={home.logs.statement} cta={home.logs.cta} ctaHref="/logs">
        {logs.slice(0, 3).map((l) => <LogCard key={l.slug} l={l} />)}
      </Story>

      <Story id="path" label={home.path.label} statement={home.path.statement} cta={home.path.cta} ctaHref={p.resumeFde} ctaDownload>
        <ol className="principles">
          {about.principles.map((pr, i) => (
            <li className="card morph" key={pr.title}>
              <p className="label">{String(i + 1).padStart(2, '0')}</p>
              <h3 className="h3 sm">{pr.title}</h3>
              <p className="muted">{pr.text}</p>
            </li>
          ))}
        </ol>
        <p className="label flow-label">Experience</p>
        <ol className="exp">
          {experience.map((e) => (
            <li className="card morph" key={e.slug}>
              <p className="label">{e.start} — {e.end}</p>
              <h3 className="h3 sm">{e.role} <span className="muted at">at {e.company}</span></h3>
              <p className="muted">{e.impact}</p>
            </li>
          ))}
        </ol>
        {about.openSource.length > 0 && (
          <>
            <p className="label flow-label">Open source</p>
            <ul className="oss">
              {about.openSource.map((o) => (
                <li key={o.name} className="card morph">
                  <a href={o.url} className="card-link" target="_blank" rel="noopener noreferrer">
                    <h3 className="h3 sm mono">{o.name}</h3>
                    <p className="muted">{o.description}</p>
                    <ArrowUpRight className="corner" />
                  </a>
                </li>
              ))}
            </ul>
          </>
        )}
      </Story>

      <Story id="stack" label={home.stack.label} statement={home.stack.statement} cta={home.stack.cta} ctaHref={p.resumeSde} ctaDownload>
        {about.stackGroups.map((g) => (
          <div className="card morph stack-group" key={g.name}>
            <h3 className="h3 sm">{g.name}</h3>
            <ul className="chips">
              {g.tools.map((t) => <li className="chip" key={t}>{t}</li>)}
            </ul>
          </div>
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
