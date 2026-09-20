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
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [query, setQuery] = useState('')
  const sortContainerRef = useRef<HTMLDivElement>(null)
  const searchButtonRef = useRef<HTMLButtonElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (sortContainerRef.current && !sortContainerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (isSearchOpen) searchInputRef.current?.focus()
  }, [isSearchOpen])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== 'Escape') return

    setIsOpen(false)
    if (isSearchOpen) {
      setQuery('')
      setIsSearchOpen(false)
      searchButtonRef.current?.focus()
    }
  }

  const visibleMovies = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase()
    const filteredMovies = normalizedQuery
      ? movies.filter((movie) => {
          const searchableFields = [
            movie.title,
            movie.movieYear,
            movie.releaseYear,
            movie.director,
            movie.coDirector,
            movie.genres,
          ]

          return searchableFields.some((field) =>
            field?.toLocaleLowerCase().includes(normalizedQuery),
          )
        })
      : movies

    if (sort === 'default') return filteredMovies

    return [...filteredMovies].sort((a, b) => {
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
  }, [movies, query, sort])

  const selectedLabel = SORT_OPTIONS.find(o => o.value === sort)?.label || 'Default Order'

  const toggleSearch = () => {
    setIsOpen(false)
    if (isSearchOpen) setQuery('')
    setIsSearchOpen(!isSearchOpen)
  }

  const clearSearch = () => {
    setQuery('')
    searchInputRef.current?.focus()
  }

  return (
    <div className="movie-grid-wrapper">
      <div 
        className="movie-sort-container" 
        onKeyDown={handleKeyDown}
      >
        <div className="movie-search">
          <button
            ref={searchButtonRef}
            type="button"
            className="movie-search-toggle"
            aria-label={isSearchOpen ? 'Close movie search' : 'Open movie search'}
            aria-controls="movie-search-input"
            aria-expanded={isSearchOpen}
            onClick={toggleSearch}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="10.75" cy="10.75" r="6.25" />
              <path d="m15.5 15.5 4 4" />
            </svg>
          </button>
          <div
            className={`movie-search-field${isSearchOpen ? ' is-open' : ''}`}
            aria-hidden={!isSearchOpen}
          >
            <input
              ref={searchInputRef}
              id="movie-search-input"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search movies..."
              aria-label="Search movies"
              tabIndex={isSearchOpen ? 0 : -1}
            />
            {query && (
              <button
                type="button"
                className="movie-search-clear"
                aria-label="Clear movie search"
                onClick={clearSearch}
              >
                ×
              </button>
            )}
          </div>
        </div>
        <div className="movie-sort-custom" ref={sortContainerRef}>
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
        {visibleMovies.length > 0 ? (
          visibleMovies.map((movie) => <MovieCard movie={movie} key={movie.slug} />)
        ) : (
          <p className="movie-grid-empty" role="status" aria-live="polite">No movies found.</p>
        )}
      </div>
    </div>
  )
}
