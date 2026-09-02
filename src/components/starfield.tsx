/** Decorative starfield + radial glow. Sits behind hero content. */
export function Starfield() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="starfield absolute inset-0" />
      <div
        className="absolute top-0 left-1/2 h-[420px] w-[820px] -translate-x-1/2 -translate-y-1/3 rounded-full opacity-40 blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side, color-mix(in oklab, var(--accent) 35%, transparent), transparent)",
        }}
      />
    </div>
  );
}
