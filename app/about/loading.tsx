/**
 * Page: About (loading)
 * Route: /about
 * What it does: Shows a minimal loading skeleton during client-side
 *   navigation to /about, while the async server component fetches data.
 * Renders: Subtle ink-wash pulse with a centered loading indicator.
 * Auth: public
 */

export default function AboutLoading() {
  return (
    <div className="relative z-10 pt-24 min-h-screen flex flex-col items-center justify-center">
      {/* Ink wash pulse */}
      <div className="relative w-16 h-16 mb-6" aria-hidden="true">
        <div className="absolute inset-0 rounded-full bg-sumi/5 animate-ping" />
        <div className="absolute inset-2 rounded-full bg-sumi/10" />
      </div>

      <p className="font-body text-xs text-mist uppercase tracking-[0.15em] animate-pulse">
        Loading
      </p>
    </div>
  )
}
