import Link from 'next/link'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <span
        className="font-accent text-8xl text-vermillion/30 leading-none mb-6"
        aria-hidden="true"
      >
        空
      </span>
      <h1 className="font-display text-3xl md:text-4xl text-sumi">
        Page Not Found
      </h1>
      <p className="font-body text-sm text-mist mt-4 max-w-md">
        Like a brushstroke carried away by the wind, this page has vanished into
        the void.
      </p>
      <div className="w-px h-8 bg-washi-medium my-8" aria-hidden="true" />
      <Link
        href="/"
        className="btn btn-primary text-xs"
      >
        Return Home
      </Link>
    </div>
  )
}
