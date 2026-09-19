'use client'

import { useMemo, useState } from 'react'
import type { WritingArticleMeta } from '@/types/writing'
import { MovieCard } from '@/components/writing/MovieCard'

type SortOption = 'default' | 'az' | 'za' | 'yearAsc' | 'yearDesc'

export function MovieGridWithSort({ movies }: { movies: WritingArticleMeta[] }) {
  const [sort, setSort] = useState<SortOption>('default')

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

  return (
    <div>
      <div className="movie-sort-container">
        <label htmlFor="movie-sort" className="sr-only">Sort movies</label>
        <div className="movie-sort-wrapper">
          <select
            id="movie-sort"
            className="movie-sort-select technical-label"
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
          >
            <option value="default">Sort by</option>
            <option value="az">A–Z</option>
            <option value="za">Z–A</option>
            <option value="yearAsc">Year: Oldest First</option>
            <option value="yearDesc">Year: Newest First</option>
          </select>
          <span className="movie-sort-caret" aria-hidden="true">▾</span>
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

