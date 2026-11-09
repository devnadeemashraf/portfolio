export function AvailabilityPill({ label }: { label: string }) {
  return (
    <span className="pill">
      <span className="pill-dot" aria-hidden="true" />
      {label}
    </span>
  );
}
