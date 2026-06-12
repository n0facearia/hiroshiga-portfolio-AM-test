'use client'

import { usePathname } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { brushStroke } from '@/lib/animations'
import { useReducedMotion } from '@/hooks/useReducedMotion'

/**
 * Opacity-only page transition (no clipPath).
 * clipPath in the initial state could interfere with IntersectionObserver
 * inside child components (BioSection, Timeline), preventing useInView
 * from firing when parent clips the element's visual box.
 *
 * Using the project's existing useReducedMotion hook (useState + useEffect)
 * instead of window.matchMedia() in render avoids hydration mismatches.
 */
const pageVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: 0.6, ease: brushStroke },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.4, ease: brushStroke },
  },
}

const fadeVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
}

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const prefersReduced = useReducedMotion()
  const variants = prefersReduced ? fadeVariants : pageVariants

  return (
    <AnimatePresence mode="popLayout">
      <motion.div
        key={pathname}
        variants={variants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
