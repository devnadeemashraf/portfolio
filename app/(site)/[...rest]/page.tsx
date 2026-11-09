import { notFound } from 'next/navigation';

// Unmatched URLs inside the site render the branded 404.
export default function CatchAll() {
  notFound();
}
