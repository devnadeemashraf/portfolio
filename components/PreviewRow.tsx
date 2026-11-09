import Link from 'next/link';
import { ArrowUpRight } from './Icons';

/** One quiet link row for the home page: where to go next, in one line each. */
export function PreviewRow({ href, label, title, text }: { href: string; label: string; title: string; text: string }) {
  return (
    <Link href={href} className="card preview-row">
      <span className="label">{label}</span>
      <span className="h3 sm">{title}</span>
      <span className="muted">{text}</span>
      <ArrowUpRight className="corner" />
    </Link>
  );
}
