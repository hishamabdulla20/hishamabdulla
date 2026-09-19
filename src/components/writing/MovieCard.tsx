import Image from 'next/image'
import type { WritingArticleMeta } from '@/types/writing'

export function MovieCard({
  movie,
  priority = false,
}: {
  movie: WritingArticleMeta
  priority?: boolean
}) {
  const href = movie.type === 'opinion' ? `/opinions/${movie.slug}` : `/writing/${movie.slug}`
  const posterAlt = movie.imageAlt || `${movie.title} movie poster`

  return (
    <a className="movie-card" href={href} aria-label={`Read opinion on ${movie.title}`}>
      <div className="movie-card__poster-wrap">
        {movie.image ? (
          <Image
            src={movie.image}
            alt={posterAlt}
            width={455}
            height={674}
            sizes="(max-width: 480px) 100vw, (max-width: 860px) 50vw, (max-width: 1200px) 33vw, 25vw"
            priority={priority}
            loading={priority ? 'eager' : 'lazy'}
            className="movie-card__poster"
          />
        ) : (
          <div className="movie-card__poster-fallback">
            <span className="technical-label">{movie.title}</span>
          </div>
        )}
      </div>
      <div className="movie-card__body">
        <h2 className="movie-card__title">{movie.title}</h2>
        {movie.readingTime && (
          <span className="movie-card__meta technical-label">
            {movie.readingTime} <span className="movie-card__arrow" aria-hidden="true">↗</span>
          </span>
        )}
      </div>
    </a>
  )
}

