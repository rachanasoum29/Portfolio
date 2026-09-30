export default function WorkLoading() {
  return (
    <div className="space-y-8" aria-busy="true" aria-live="polite">
      <div className="h-4 w-24 animate-pulse bg-surface" />
      <div className="h-8 w-48 animate-pulse bg-surface" />
      <div className="h-40 animate-pulse border border-line bg-surface/50" />
      <span className="sr-only">Loading…</span>
    </div>
  );
}
