/** Shown while the 3D bundle loads (and as the Suspense fallback). */
export function UniverseLoader() {
  return (
    <div className="bg-background absolute inset-0 grid place-items-center overflow-hidden">
      <div className="starfield absolute inset-0 opacity-40" />
      <div
        className="absolute h-40 w-40 rounded-full blur-3xl"
        style={{ background: "radial-gradient(closest-side, #6d5cff, transparent)" }}
      />
      <p className="text-muted relative font-mono text-xs tracking-[0.3em] uppercase">
        Loading universe
      </p>
    </div>
  );
}
