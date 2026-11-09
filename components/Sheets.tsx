'use client';

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { ArrowRight, ArrowUpRight, Calendar, Clock, Close, Copy, Check, Download } from './Icons';
import { track } from './analytics/track';

export type SheetName = 'recruiter' | 'booking' | 'menu';

export type SheetData = {
  name: string;
  available: boolean;
  availableLabel: string;
  email: string;
  resumeSde: string;
  resumeFde: string;
  relocation: string[];
  booking: { title: string; minutes: number; summary: string; idealFor: string; url: string; primary: boolean }[];
  recruiter: {
    title: string;
    lookingFor: string[];
    experience: string;
    coreStack: string[];
    noticePeriod: string;
    workPreference: string;
    relocationNote: string;
    visaNote: string;
    highlights: string[];
  };
  ui: {
    bookCta: string;
    moreWaysToMeet: string;
    resumeLabel: string;
    recruiterEyebrow: string;
    navWork: string;
    navLogs: string;
    navAbout: string;
    navContact: string;
    copyLabel: string;
    copiedLabel: string;
  };
  socials: { label: string; handle: string; url: string }[];
};

const Ctx = createContext<{ open: SheetName | null; show: (n: SheetName) => void; hide: () => void } | null>(null);

export function useSheets() {
  const c = useContext(Ctx);
  if (!c) throw new Error('useSheets outside SheetsProvider');
  return c;
}

/** Real <button> that opens a sheet. Pass aria-label for icon-only use. */
export function SheetTrigger({
  name,
  className,
  children,
  ...rest
}: { name: SheetName; className?: string; children: ReactNode } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { open, show } = useSheets();
  return (
    <button
      type="button"
      className={className}
      aria-haspopup="dialog"
      aria-expanded={open === name}
      onClick={() => {
        track(`${name}_open`);
        show(name);
      }}
      {...rest}
    >
      {children}
    </button>
  );
}

function Sheet({
  name,
  label,
  kind,
  children,
}: {
  name: SheetName;
  label: string;
  kind: 'sheet' | 'menu';
  children: ReactNode;
}) {
  const { open, hide } = useSheets();
  const ref = useRef<HTMLDialogElement>(null);
  const isOpen = open === name;

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (isOpen && !d.open) d.showModal();
    if (!isOpen && d.open) d.close();
  }, [isOpen]);

  return (
    <dialog
      ref={ref}
      className={`dialog dialog-${kind}`}
      aria-label={label}
      onClose={() => isOpen && hide()}
      onClick={(e) => {
        if (e.target === ref.current) hide();
      }}
    >
      <div className="dialog-body">{children}</div>
    </dialog>
  );
}

function CloseButton() {
  const { hide } = useSheets();
  return (
    <button type="button" className="btn-icon" aria-label="Close" onClick={hide}>
      <Close />
    </button>
  );
}

export function EmailCopy({ email, copy, copied }: { email: string; copy: string; copied: string }) {
  const [done, setDone] = useState(false);
  const t = useRef<ReturnType<typeof setTimeout>>(undefined);
  return (
    <span className="copyrow">
      <a className="link" href={`mailto:${email}`}>{email}</a>
      <button
        type="button"
        className="btn btn-ghost btn-sm"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(email);
          } catch {}
          track('email_copy');
          setDone(true);
          clearTimeout(t.current);
          t.current = setTimeout(() => setDone(false), 1600);
        }}
      >
        <span className="swap" data-done={done}>{done ? <Check /> : <Copy />}</span>
        <span aria-live="polite">{done ? copied : copy}</span>
      </button>
    </span>
  );
}

export function SheetsProvider({ data, children }: { data: SheetData; children: ReactNode }) {
  const [open, setOpen] = useState<SheetName | null>(null);
  const show = useCallback((n: SheetName) => setOpen(n), []);
  const hide = useCallback(() => setOpen(null), []);
  const { recruiter: r, ui } = data;
  const primary = data.booking.find((b) => b.primary) ?? data.booking[0];

  return (
    <Ctx.Provider value={{ open, show, hide }}>
      {children}

      {/* Recruiter 30-second sheet */}
      <Sheet name="recruiter" label={r.title} kind="sheet">
        <header className="sheet-head">
          <div>
            <p className="label">{ui.recruiterEyebrow}</p>
            <h2 className="h3">{r.title}</h2>
          </div>
          <CloseButton />
        </header>
        <dl className="facts">
          <div><dt className="label">Looking for</dt><dd>{r.lookingFor.join(' · ')}</dd></div>
          <div><dt className="label">Experience</dt><dd>{r.experience}</dd></div>
          <div><dt className="label">Core stack</dt><dd className="chips">{r.coreStack.map((s) => <span className="chip" key={s}>{s}</span>)}</dd></div>
          <div><dt className="label">Notice period</dt><dd>{r.noticePeriod}</dd></div>
          <div><dt className="label">Work</dt><dd>{r.workPreference}</dd></div>
          <div><dt className="label">Relocation</dt><dd>{r.relocationNote}</dd></div>
          <div><dt className="label">Visa</dt><dd>{r.visaNote}</dd></div>
        </dl>
        {r.highlights.length > 0 && (
          <ul className="bullets">
            {r.highlights.map((h) => <li key={h}>{h}</li>)}
          </ul>
        )}
        <div className="sheet-actions">
          {primary && (
            <a className="btn btn-primary" href={primary.url} target="_blank" rel="noopener noreferrer" data-track="book_click" data-label={primary.title}>
              <Calendar /> {ui.bookCta} <ArrowRight className="nudge" />
            </a>
          )}
          <a className="btn btn-ghost" href={data.resumeFde} download data-track="resume_download" data-label="fde">
            <Download /> {ui.resumeLabel}
          </a>
        </div>
        <EmailCopy email={data.email} copy={ui.copyLabel} copied={ui.copiedLabel} />
      </Sheet>

      {/* Booking chooser: every Cal.com event type */}
      <Sheet name="booking" label={ui.moreWaysToMeet} kind="sheet">
        <header className="sheet-head">
          <div>
            <p className="label">Cal.com</p>
            <h2 className="h3">{ui.moreWaysToMeet}</h2>
          </div>
          <CloseButton />
        </header>
        <ul className="booklist">
          {data.booking.map((b) => (
            <li key={b.url}>
              <a href={b.url} target="_blank" rel="noopener noreferrer" className="bookitem" data-track="book_click" data-label={b.title}>
                <span className="bookitem-top">
                  <strong>{b.title}</strong>
                  <span className="mono dur"><Clock size={14} /> {b.minutes} min</span>
                </span>
                <span className="bookitem-sum">{b.summary}</span>
                <span className="bookitem-ideal">{b.idealFor}</span>
                <ArrowUpRight className="corner" />
              </a>
            </li>
          ))}
        </ul>
      </Sheet>

      {/* Full-screen mobile menu */}
      <Sheet name="menu" label="Menu" kind="menu">
        <header className="sheet-head">
          <span className="label">Menu</span>
          <CloseButton />
        </header>
        <nav aria-label="Mobile" className="menu-links">
          {[
            ['/#work', ui.navWork],
            ['/logs', ui.navLogs],
            ['/#path', ui.navAbout],
            ['/#contact', ui.navContact],
          ].map(([href, text], i) => (
            <a key={href} href={href} style={{ '--i': i } as React.CSSProperties} onClick={hide}>
              {text}
            </a>
          ))}
        </nav>
        <div className="sheet-actions">
          {primary && (
            <a className="btn btn-primary" href={primary.url} target="_blank" rel="noopener noreferrer" data-track="book_click" data-label={primary.title}>
              <Calendar /> {ui.bookCta}
            </a>
          )}
          <a className="btn btn-ghost" href={data.resumeFde} download data-track="resume_download" data-label="fde">
            <Download /> {ui.resumeLabel}
          </a>
        </div>
      </Sheet>
    </Ctx.Provider>
  );
}
