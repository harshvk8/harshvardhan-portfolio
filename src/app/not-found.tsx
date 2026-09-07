import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col items-center px-4 py-32 text-center sm:px-6">
      <p className="text-accent font-mono text-sm">404</p>
      <h1 className="mt-3 text-2xl font-semibold tracking-tight">
        This planet drifted out of orbit.
      </h1>
      <p className="text-muted mt-2 text-sm">The page you were looking for doesn&apos;t exist.</p>
      <Link
        href="/"
        className="border-border hover:bg-surface mt-6 rounded-md border px-4 py-2 text-sm font-medium"
      >
        Return home
      </Link>
    </div>
  );
}
