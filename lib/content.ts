import { cache } from 'react';
import { createReader } from '@keystatic/core/reader';
import keystaticConfig from '../keystatic.config';

const reader = createReader(process.cwd(), keystaticConfig);

export const getProfile = cache(async () => {
  const p = await reader.singletons.profile.readOrThrow();
  const booking = p.bookingLinks.find((b) => b.primary) ?? p.bookingLinks[0];
  return { ...p, booking };
});
export const getRecruiter = cache(() => reader.singletons.recruiter.readOrThrow());
export const getHome = cache(() => reader.singletons.home.readOrThrow());
export const getSocials = cache(async () => (await reader.singletons.socials.readOrThrow()).items);
export const getAbout = cache(() => reader.singletons.about.readOrThrow());
export const getUi = cache(() => reader.singletons.ui.readOrThrow());

export const getExperience = cache(async () => {
  const all = await reader.collections.experience.all();
  return all.map((e) => ({ slug: e.slug, ...e.entry })).sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
});

export const getProjects = cache(async () => {
  const all = await reader.collections.projects.all();
  return all
    .map((e) => ({ slug: e.slug, ...e.entry, title: e.entry.title }))
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
});

export type Project = Awaited<ReturnType<typeof getProjects>>[number];

async function bodyOf(body: unknown): Promise<string> {
  if (typeof body === 'function') return String(await (body as () => Promise<unknown>)());
  return String(body ?? '');
}

export async function getProject(slug: string) {
  const e = await reader.collections.projects.read(slug);
  if (!e) return null;
  const source = await bodyOf(e.body);
  return { slug, ...e, source };
}

export const getTools = cache(async () => {
  const all = await reader.collections.tools.all();
  return all
    .map((e) => ({ slug: e.slug, ...e.entry }))
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
});

export type Tool = Awaited<ReturnType<typeof getTools>>[number];

export async function getTool(slug: string) {
  const e = await reader.collections.tools.read(slug);
  if (!e) return null;
  return { slug, ...e, source: await bodyOf(e.body) };
}

export function readingMinutes(source: string) {
  const words = source.replace(/<[^>]+>|[#*_`>\-]/g, ' ').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

export const getLogs = cache(async () => {
  const all = await reader.collections.logs.all();
  const logs = await Promise.all(
    all.map(async (l) => {
      const source = await bodyOf(l.entry.body);
      return { slug: l.slug, ...l.entry, source, minutes: readingMinutes(source) };
    }),
  );
  return logs.sort((a, b) => String(b.date).localeCompare(String(a.date)));
});

export type Log = Awaited<ReturnType<typeof getLogs>>[number];

export async function getLog(slug: string) {
  const logs = await getLogs();
  const i = logs.findIndex((l) => l.slug === slug);
  if (i < 0) return null;
  return { log: logs[i]!, newer: logs[i - 1] ?? null, older: logs[i + 1] ?? null };
}

/** Section headings (h2) of an MDX source, for the table of contents. */
export function headingsOf(source: string) {
  return [...source.matchAll(/^##\s+(.+)$/gm)].map((m) => {
    const text = m[1]!.trim();
    return { text, id: slugify(text) };
  });
}

export function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export function formatDate(d: string | null) {
  if (!d) return '';
  return new Date(d + 'T00:00:00Z').toLocaleDateString('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' });
}
