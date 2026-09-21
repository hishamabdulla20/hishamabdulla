import Image from 'next/image'
import Link from 'next/link'
import type { WritingArticleMeta } from '@/types/writing'

export function MovieCard({
  movie,
}: {
  movie: WritingArticleMeta
}) {
  const href = movie.type === 'take' ? `/takes/${movie.slug}` : `/writing/${movie.slug}`
  const posterAlt = movie.imageAlt || `${movie.title} movie poster`
  const metadata = movie.category === 'movies' ? movie.releaseYear : movie.readingTime

  return (
    <Link className="movie-card" href={href} aria-label={`Read opinion on ${movie.title}`}>
      <div className="movie-card__poster-wrap">
        {movie.image ? (
          <Image
            src={movie.image}
            alt={posterAlt}
            width={455}
            height={674}
            sizes="(max-width: 340px) 220px, (max-width: 640px) calc(50vw - 1.5rem), (max-width: 820px) calc(33.3vw - 1.5rem), (max-width: 1060px) calc(25vw - 1.5rem), 190px"
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
        {metadata && (
          <span className="movie-card__meta technical-label">
            {metadata} <span className="movie-card__arrow" aria-hidden="true">↗</span>
          </span>
        )}
      </div>
    </Link>
  )
}
