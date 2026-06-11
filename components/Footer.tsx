import Link from 'next/link'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative mt-24 px-6 md:px-12 py-8 border-t border-washi-medium">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Seal mark */}
        <div className="flex items-center gap-3">
          <span
            className="font-accent text-lg text-vermillion leading-none border border-vermillion px-2 py-1 rounded-ink"
            aria-hidden="true"
          >
            広重
          </span>
          <span className="text-xs text-mist tracking-wider uppercase">
            Utagawa Hiroshige
          </span>
        </div>

        {/* Links */}
        <nav className="flex items-center gap-6" aria-label="Footer navigation">
          <Link
            href="/"
            className="text-xs text-mist hover:text-sumi uppercase tracking-widest transition-colors duration-fast"
          >
            Home
          </Link>
          <Link
            href="/work"
            className="text-xs text-mist hover:text-sumi uppercase tracking-widest transition-colors duration-fast"
          >
            Gallery
          </Link>
          <Link
            href="/about"
            className="text-xs text-mist hover:text-sumi uppercase tracking-widest transition-colors duration-fast"
          >
            About
          </Link>
        </nav>

        {/* Copyright */}
        <p className="text-xs text-mist tracking-wider">
          <span aria-hidden="true">© </span>
          {currentYear}
          {' '}Hiroshige Portfolio
          {' '}
          <span className="hidden sm:inline">
            — All artwork images are public domain via Wikimedia Commons
          </span>
        </p>
      </div>
    </footer>
  )
}
