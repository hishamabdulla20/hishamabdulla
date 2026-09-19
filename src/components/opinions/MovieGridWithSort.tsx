'use client'

import { useMemo, useState, useRef, useEffect } from 'react'
import type { WritingArticleMeta } from '@/types/writing'
import { MovieCard } from '@/components/writing/MovieCard'

type SortOption = 'default' | 'az' | 'za' | 'yearAsc' | 'yearDesc'

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'default', label: 'Default Order' },
  { value: 'az', label: 'A–Z' },
  { value: 'za', label: 'Z–A' },
  { value: 'yearAsc', label: 'Year: Oldest First' },
  { value: 'yearDesc', label: 'Year: Newest First' },
]

export function MovieGridWithSort({ movies }: { movies: WritingArticleMeta[] }) {
  const [sort, setSort] = useState<SortOption>('default')
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') setIsOpen(false)
  }

  const sortedMovies = useMemo(() => {
    if (sort === 'default') return movies

    return [...movies].sort((a, b) => {
      if (sort === 'az') return a.title.localeCompare(b.title)
      if (sort === 'za') return b.title.localeCompare(a.title)
      
      const yearA = a.movieYear ? parseInt(a.movieYear, 10) : (a.releaseYear ? parseInt(a.releaseYear, 10) : 0)
      const yearB = b.movieYear ? parseInt(b.movieYear, 10) : (b.releaseYear ? parseInt(b.releaseYear, 10) : 0)

      if (sort === 'yearAsc') {
        if (yearA === yearB) return a.title.localeCompare(b.title)
        return yearA - yearB
      }
      if (sort === 'yearDesc') {
        if (yearA === yearB) return a.title.localeCompare(b.title)
        return yearB - yearA
      }
      return 0
    })
  }, [movies, sort])

  const selectedLabel = SORT_OPTIONS.find(o => o.value === sort)?.label || 'Default Order'

  return (
    <div>
      <div 
        className="movie-sort-container" 
        ref={containerRef} 
        onKeyDown={handleKeyDown}
      >
        <div className="movie-sort-custom">
          <span className="movie-sort-label technical-label">SORT BY</span>
          <button
            type="button"
            className="movie-sort-trigger technical-label"
            onClick={() => setIsOpen(!isOpen)}
            aria-haspopup="listbox"
            aria-expanded={isOpen}
          >
            {selectedLabel}
            <span className="movie-sort-caret" aria-hidden="true">↓</span>
          </button>
          
          <ul 
            className={`movie-sort-menu ${isOpen ? 'is-open' : ''}`} 
            role="listbox"
            aria-label="Sort movies"
          >
            {SORT_OPTIONS.map((option) => (
              <li key={option.value} role="none">
                <button
                  type="button"
                  role="option"
                  aria-selected={sort === option.value}
                  className={`movie-sort-option ${sort === option.value ? 'is-selected' : ''}`}
                  onClick={() => {
                    setSort(option.value)
                    setIsOpen(false)
                  }}
                >
                  {option.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="movie-poster-grid">
        {sortedMovies.map((movie) => (
          <MovieCard movie={movie} key={movie.slug} />
        ))}
      </div>
    </div>
  )
}
