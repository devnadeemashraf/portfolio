import Link from 'next/link';
import { Rss } from './Icons';

export function Footer({ name, tagline }: { name: string; tagline: string }) {
  return (
    <footer className="site-footer">
      <div className="container footer-row">
        <p className="mono footer-copy">© {new Date().getFullYear()} {name} · {tagline}</p>
        <nav aria-label="Footer" className="footer-links">
          <Link className="link" href="/logs">Build logs</Link>
          <Link className="link" href="/logs/rss.xml"><Rss size={14} /> RSS</Link>
          <a className="link" href="https://github.com/devnadeemashraf/portfolio" target="_blank" rel="noopener noreferrer">View source</a>
          <a className="link" href="#top">Back to top</a>
        </nav>
      </div>
    </footer>
  );
}
