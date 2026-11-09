export function PageHead({ label, title, lead }: { label: string; title: string; lead: string }) {
  return (
    <div className="container page-head">
      <p className="label">{label}</p>
      <h1 className="display page-title">{title}</h1>
      <p className="lead page-lead">{lead}</p>
    </div>
  );
}
