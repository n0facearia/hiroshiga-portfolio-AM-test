'use client'

import { usePathname } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { brushStroke } from '@/lib/animations'

const pageVariants = {
  initial: {
    opacity: 0,
    clipPath: 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)',
  },
  animate: {
    opacity: 1,
    clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
    transition: {
      duration: 0.6,
      ease: brushStroke,
    },
  },
  exit: {
    opacity: 0,
    clipPath: 'polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)',
    transition: {
      duration: 0.5,
      ease: brushStroke,
    },
  },
}

// Reduced motion variant — simple fade
const fadeVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
}

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  // Check reduced motion via matchMedia
  const prefersReduced =
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false

  const variants = prefersReduced ? fadeVariants : pageVariants

  return (
    <AnimatePresence mode="wait">
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
