'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ThemeToggle } from './ThemeToggle'
import { useIsHoverable } from '@/hooks/useIsHoverable'

const navLinks = [
  { href: '/', label: 'Home', labelJp: 'ホーム' },
  { href: '/work', label: 'My Work', labelJp: '作品' },
  { href: '/about', label: 'About', labelJp: '詳細' },
]

const haikuLines = [
  '秋深き',
  '隣は何を',
  'する人ぞ',
]

export function Navigation() {
  const pathname = usePathname()
  const canHover = useIsHoverable()
  const [mobileOpen, setMobileOpen] = useState(false)

  const toggleMobile = useCallback(() => {
    setMobileOpen((prev) => !prev)
  }, [])

  const closeMobile = useCallback(() => {
    setMobileOpen(false)
  }, [])

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 px-6 md:px-12 py-4"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Site title — left */}
        <Link
          href="/"
          className="flex items-center gap-2 group"
          aria-label="Hiroshige Portfolio — Home"
        >
          <span className="font-accent text-2xl text-sumi leading-none">
            広重
          </span>
          <span className="hidden sm:inline font-display text-sm text-mist tracking-wider uppercase group-hover:text-sumi transition-colors duration-fast">
            Hiroshige
          </span>
        </Link>

        {/* Desktop nav — right */}
        <div className="hidden md:flex items-center gap-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href
            return (
              <motion.div
                key={link.href}
                className="relative"
                whileHover={canHover ? { scale: 1.05 } : undefined}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              >
                <Link
                  href={link.href}
                  className={`relative block px-3 py-2 text-sm uppercase tracking-[0.08em] transition-colors duration-fast ${
                    isActive ? 'text-sumi' : 'text-mist hover:text-sumi'
                  }`}
                >
                  {/* Kakejiku top rod — appears on hover */}
                  <motion.div
                    className="absolute top-0 left-1 right-1 h-[3px] rounded-b-sm"
                    style={{ background: 'linear-gradient(180deg, var(--sumi-deep) 0%, var(--sumi-deep) 50%, transparent 100%)' }}
                    initial={{ scaleY: 0, opacity: 0 }}
                    whileHover={{ scaleY: 1, opacity: 1 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                  />
                  {/* Kakejiku bottom rod — appears on hover */}
                  <motion.div
                    className="absolute bottom-0 left-1 right-1 h-[3px] rounded-t-sm"
                    style={{ background: 'linear-gradient(0deg, var(--sumi-deep) 0%, var(--sumi-deep) 50%, transparent 100%)' }}
                    initial={{ scaleY: 0, opacity: 0 }}
                    whileHover={{ scaleY: 1, opacity: 1 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                  />
                  {/* Subtle background fill on hover */}
                  <motion.div
                    className="absolute inset-0 -z-10 rounded-ink"
                    style={{ background: 'rgba(var(--washi-rgb), 0.6)' }}
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.25 }}
                  />
                  {link.label}
                  {isActive && (
                    <motion.div
                      layoutId="nav-underline"
                      className="absolute -bottom-1 left-3 right-3 h-[2px] bg-vermillion"
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                    />
                  )}
                </Link>
              </motion.div>
            )
          })}

          {/* Theme toggle — desktop */}
          <div className="pl-2 border-l border-washi-medium">
            <ThemeToggle />
          </div>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={toggleMobile}
          className="md:hidden flex flex-col items-center justify-center w-10 h-10 text-sumi"
          aria-label={mobileOpen ? 'Close navigation' : 'Open navigation'}
          aria-expanded={mobileOpen}
        >
          <span className="font-accent text-2xl leading-none">
            {mobileOpen ? '閉' : '道'}
          </span>
        </button>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-40 bg-washi flex flex-col items-center justify-center gap-8"
          >
            {/* Haiku poem */}
            <div className="flex flex-col items-center gap-2 mb-8">
              {haikuLines.map((line, i) => (
                <motion.span
                  key={line}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.15, duration: 0.4, ease: 'easeOut' }}
                  className="font-display-jp text-2xl text-sumi tracking-wider"
                >
                  {line}
                </motion.span>
              ))}
            </div>

            {/* Nav links */}
            <div className="flex flex-col items-center gap-6">
              {navLinks.map((link, i) => {
                const isActive = pathname === link.href
                return (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + i * 0.1, duration: 0.3 }}
                  >
                    <Link
                      href={link.href}
                      onClick={closeMobile}
                      className={`text-xl uppercase tracking-[0.12em] transition-colors duration-fast ${
                        isActive ? 'text-vermillion' : 'text-sumi hover:text-mist'
                      }`}
                    >
                      {link.label}
                      <span className="block text-xs tracking-wider text-mist mt-1 text-center">
                        {link.labelJp}
                      </span>
                    </Link>
                  </motion.div>
                )
              })}

              {/* Theme toggle — mobile */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-4"
              >
                <ThemeToggle />
              </motion.div>
            </div>

            {/* Close hint */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              onClick={closeMobile}
              className="absolute bottom-12 text-mist text-xs tracking-widest uppercase"
            >
              Tap to close
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
