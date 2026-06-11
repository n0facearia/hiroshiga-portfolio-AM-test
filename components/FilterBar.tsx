'use client'

import { useCallback } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { motion } from 'framer-motion'

const filters = [
  { value: 'all', label: 'All', labelJp: '全て' },
  { value: 'Tōkaidō', label: 'Tōkaidō', labelJp: '東海道' },
  { value: 'Edo', label: 'Famous Views of Edo', labelJp: '江戸名所' },
]

export function FilterBar() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const activeFilter = searchParams.get('series') || 'all'

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
        return (
          <button
            key={filter.value}
            onClick={() => setFilter(filter.value)}
            role="tab"
            aria-selected={isActive}
            className={`relative px-4 py-3 text-xs uppercase tracking-widest transition-colors duration-fast ${
              isActive ? 'text-sumi' : 'text-mist hover:text-sumi'
            }`}
          >
            <span className="hidden sm:inline">{filter.label}</span>
            <span className="sm:hidden">{filter.labelJp}</span>
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
