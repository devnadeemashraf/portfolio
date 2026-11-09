import Link from 'next/link';
import { ArrowLeft } from '@/components/Icons';
import { RumiSprite } from '@/components/easter/RumiSprite';

export const metadata = { title: 'Page not found', robots: { index: false } };

export default function NotFound() {
  return (
    <div className="notfound">
      <RumiSprite pose="sit" px={6} />
      <p className="label">Error · 404</p>
      <p className="display" aria-hidden="true">404</p>
      <h1 className="h2">This page wandered off.</h1>
      <p className="lead">Rumi probably knocked it off the shelf. The page you wanted is not here.</p>
      <Link href="/" className="btn btn-primary"><ArrowLeft size={16} /> Back home</Link>
    </div>
  );
}
