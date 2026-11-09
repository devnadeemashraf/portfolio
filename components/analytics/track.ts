/** Fire-and-forget custom event. No-ops when PostHog is not loaded. */
export function track(event: string, props?: Record<string, unknown>) {
  if (typeof window === 'undefined') return;
  const ph = (window as unknown as { posthog?: { capture: (e: string, p?: unknown) => void } }).posthog;
  ph?.capture(event, props);
}
