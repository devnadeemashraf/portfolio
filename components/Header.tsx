import Link from 'next/link';
import { Menu } from './Icons';
import { SheetTrigger } from './Sheets';
import { ThemeToggle } from './ThemeToggle';
import { ResumeMenu } from './ResumeMenu';
import { AvailabilityPill } from './AvailabilityPill';

type Props = {
  name: string;
  monogram: string;
  available: boolean;
  availableLabel: string;
  resumeSde: string;
  resumeFde: string;
  ui: { navWork: string; navLogs: string; navAbout: string; navContact: string; resumeLabel: string };
};

export function Header({ name, monogram, available, availableLabel, resumeSde, resumeFde, ui }: Props) {
  return (
    <header className="site-header">
      <div className="container header-row">
        <Link href="/" className="brand">
          <span className="brand-mark" aria-hidden="true">{monogram}</span>
          <span className="brand-name">{name}</span>
        </Link>

        <nav aria-label="Primary" className="nav">
          <Link className="link" href="/#work">{ui.navWork}</Link>
          <Link className="link" href="/logs">{ui.navLogs}</Link>
          <Link className="link" href="/#path">{ui.navAbout}</Link>
          <Link className="link" href="/#contact">{ui.navContact}</Link>
        </nav>

        <div className="header-actions">
          {available && <span className="hide-sm"><AvailabilityPill label={availableLabel} /></span>}
          <ThemeToggle />
          <span className="hide-sm"><ResumeMenu label={ui.resumeLabel} sde={resumeSde} fde={resumeFde} /></span>
          <SheetTrigger name="menu" className="btn-icon show-sm" aria-label="Open menu">
            <Menu />
          </SheetTrigger>
        </div>
      </div>
    </header>
  );
}
