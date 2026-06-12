import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'
import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'
import { PageTransition } from '@/components/PageTransition'
import { CustomCursor } from '@/components/CustomCursor'
import { ScrollProgress } from '@/components/ScrollProgress'
import { ThemeProvider } from '@/lib/theme-context'

const displayFont = localFont({
  src: [
    { path: './fonts/eb-garamond-400.ttf', weight: '400', style: 'normal' },
    { path: './fonts/eb-garamond-500.ttf', weight: '500', style: 'normal' },
    { path: './fonts/eb-garamond-600.ttf', weight: '600', style: 'normal' },
    { path: './fonts/eb-garamond-700.ttf', weight: '700', style: 'normal' },
  ],
  variable: '--font-display',
  display: 'swap',
})

const displayJpFont = localFont({
  src: [
    { path: './fonts/noto-serif-jp-400.ttf', weight: '400', style: 'normal' },
    { path: './fonts/noto-serif-jp-500.ttf', weight: '500', style: 'normal' },
    { path: './fonts/noto-serif-jp-600.ttf', weight: '600', style: 'normal' },
    { path: './fonts/noto-serif-jp-700.ttf', weight: '700', style: 'normal' },
  ],
  variable: '--font-display-jp',
  display: 'swap',
})

const bodyFont = localFont({
  src: [
    { path: './fonts/noto-sans-jp-300.ttf', weight: '300', style: 'normal' },
    { path: './fonts/noto-sans-jp-400.ttf', weight: '400', style: 'normal' },
    { path: './fonts/noto-sans-jp-500.ttf', weight: '500', style: 'normal' },
  ],
  variable: '--font-body',
  display: 'swap',
})

const accentFont = localFont({
  src: [{ path: './fonts/yuji-syuku-400.ttf', weight: '400', style: 'normal' }],
  variable: '--font-accent',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Hiroshige — Woodblock Prints of Edo',
    template: '%s — Hiroshige Portfolio',
  },
  description:
    'A visually immersive portfolio showcasing Utagawa Hiroshige\'s Japanese woodblock prints — The Fifty-Three Stations of the Tōkaidō and One Hundred Famous Views of Edo.',
  openGraph: {
    title: 'Hiroshige — Woodblock Prints of Edo',
    description:
      'Explore the masterpieces of Utagawa Hiroshige, one of the last great masters of ukiyo-e.',
    siteName: 'Hiroshige Portfolio',
    locale: 'en_US',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${displayFont.variable} ${displayJpFont.variable} ${bodyFont.variable} ${accentFont.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Prevent flash of wrong theme — runs before React hydrates */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var theme = localStorage.getItem('hiroshige-theme');
                if (!theme) {
                  theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                }
                if (theme === 'dark') {
                  document.documentElement.classList.add('dark');
                  document.documentElement.setAttribute('data-theme', 'sumi-dark');
                } else {
                  document.documentElement.setAttribute('data-theme', 'sumi-light');
                }
              } catch(e) {}
            `,
          }}
        />
        <meta name="color-scheme" content="light dark" />
      </head>
      <body className="ink-bg min-h-screen flex flex-col antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-washi focus:text-sumi focus:border focus:border-sumi focus:rounded-ink"
        >
          Skip to main content
        </a>

        <ThemeProvider>
          <Navigation />

          <CustomCursor />

          <ScrollProgress />

          <main id="main-content" className="flex-1">
            <PageTransition>{children}</PageTransition>
          </main>

          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}
