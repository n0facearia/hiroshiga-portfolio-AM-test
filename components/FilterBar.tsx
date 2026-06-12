'use client'

import { useCallback, useState } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { brushStroke } from '@/lib/animations'
import { useReducedMotion } from '@/hooks/useReducedMotion'

const filters = [
  { value: 'all', label: 'All', labelJp: '全て' },
  { value: 'One Hundred Famous Views of Edo', label: 'Edo', labelJp: '江戸名所' },
  { value: 'Fifty-Three Stations of the Tōkaidō', label: 'Tōkaidō', labelJp: '東海道' },
  { value: 'Eight Views of Ōmi', label: 'Ōmi', labelJp: '近江八景' },
  { value: 'Famous Places of Kyōto', label: 'Kyōto', labelJp: '京都名所' },
  { value: 'Thirty-six Views of Mount Fuji', label: 'Fuji', labelJp: '富嶽三十六景' },
  { value: 'The Sixty-nine Stations of the Kisokaidō', label: 'Kisokaidō', labelJp: '木曽街道' },
]

export function FilterBar() {
  const reduced = useReducedMotion()
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const activeFilter = searchParams.get('series') || 'all'
  const [hoveredTab, setHoveredTab] = useState<string | null>(null)

  const setFilter = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value === 'all') {
        params.delete('series')
      } else {
        params.set('series', value)
      }
      const query = params.toString()
      router.push(query ? `${pathname}?${query}` : pathname, { scroll: false })
    },
    [searchParams, router, pathname]
  )

  return (
    <div className="flex items-center gap-1 border-b border-washi-medium" role="tablist" aria-label="Filter by series">
      {filters.map((filter) => {
        const isActive = activeFilter === filter.value
        const isHovered = hoveredTab === filter.value
        return (
          <button
            key={filter.value}
            onClick={() => setFilter(filter.value)}
            role="tab"
            aria-selected={isActive}
            onMouseEnter={() => setHoveredTab(filter.value)}
            onMouseLeave={() => setHoveredTab(null)}
            className={`relative px-4 py-3 text-xs uppercase tracking-widest ${
              isActive ? 'text-sumi' : 'text-mist'
            }`}
          >
            {/* Text with hover effects — vermillion + wider tracking */}
            <span
              className="transition-[color,letter-spacing] duration-200 ease-out"
              style={{
                color: isHovered ? 'var(--vermillion)' : undefined,
                letterSpacing: isHovered ? '0.01em' : undefined,
              }}
            >
              <span className="hidden sm:inline">{filter.label}</span>
              <span className="sm:hidden">{filter.labelJp}</span>
            </span>

            {/* Hover brushstroke underline — pathLength 0→1 */}
            {!reduced && (
              <span className="absolute -bottom-0.5 left-2 right-2 h-[2px] overflow-visible pointer-events-none">
                <svg
                  className="w-full h-full"
                  viewBox="0 0 100 2"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <motion.path
                    d="M0,1 L100,1"
                    style={{ stroke: 'var(--vermillion)' }}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    fill="none"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{
                      pathLength: isHovered ? 1 : 0,
                      opacity: isHovered ? 1 : 0,
                    }}
                    transition={{
                      pathLength: isHovered
                        ? { duration: 0.4, ease: brushStroke }
                        : { duration: 0.2 },
                      opacity: { duration: 0.2 },
                    }}
                  />
                </svg>
              </span>
            )}

            {/* Reduced-motion underline — simple opacity */}
            {reduced && (
              <span
                className="absolute bottom-0 left-2 right-2 h-px bg-vermillion pointer-events-none transition-opacity duration-200"
                style={{ opacity: isHovered ? 1 : 0.3 }}
              />
            )}

            {/* Active tab underline — layoutId persists across navigation */}
            {isActive && (
              <motion.div
                layoutId="filter-underline"
                className="absolute bottom-0 left-2 right-2 h-0.5 bg-vermillion"
                transition={{ duration: 0.2 }}
              />
            )}
          </button>
        )
      })}
    </div>
  )
}
