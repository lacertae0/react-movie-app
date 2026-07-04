import { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { fetchMovieById } from '../api/movieApi'
import Modal from '../components/Modal'
import useLocalStorage from '../hooks/useLocalStorage'

function MovieDetails() {
  const { id } = useParams()
  const [movie, setMovie] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [favorites, setFavorites] = useLocalStorage('favorites', [])

  const isFavorite = favorites.some((favorite) => favorite.imdbID === id)

  const closeModal = useCallback(() => {
    setIsModalOpen(false)
  }, [])

  function toggleFavorite() {
    if (!movie) return

    if (isFavorite) {
      setFavorites((prev) => prev.filter((favorite) => favorite.imdbID !== movie.imdbID))
      return
    }

    setFavorites((prev) => [
      ...prev,
      {
        imdbID: movie.imdbID,
        Title: movie.Title,
        Year: movie.Year,
        Poster: movie.Poster,
        Type: movie.Type,
      },
    ])
    setIsModalOpen(true)
  }

  useEffect(() => {
    let cancelled = false

    async function loadMovie() {
      setLoading(true)
      setError(null)

      try {
        const result = await fetchMovieById(id)
        if (!cancelled) {
          setMovie(result)
        }
      } catch (err) {
        if (!cancelled) {
          setMovie(null)
          setError(err.message || 'Failed to fetch movie details')
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadMovie()

    return () => {
      cancelled = true
    }
  }, [id])

  const poster =
    movie?.Poster
      ? movie.Poster
      : 'https://placehold.co/300x450?text=No+Poster'

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <Link
        to="/"
        className="mb-6 inline-flex items-center rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors duration-200 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
      >
        ← Back
      </Link>

      {loading && (
        <p className="text-center text-gray-600 dark:text-gray-400" role="status">
          Loading movie details...
        </p>
      )}

      {!loading && error && (
        <p
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700 dark:border-red-900 dark:bg-red-950/50 dark:text-red-300"
          role="alert"
        >
          {error}
        </p>
      )}

      {!loading && !error && movie && (
        <article className="grid gap-8 md:grid-cols-[240px_1fr] lg:grid-cols-[280px_1fr]">
          <img
            src={poster}
            alt={`${movie.Title} poster`}
            className="mx-auto aspect-2/3 w-full max-w-xs rounded-xl border border-gray-200 object-cover shadow-sm dark:border-gray-800 md:mx-0"
          />

          <div className="space-y-4 text-left">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                {movie.Title}
              </h1>
              <p className="mt-1 text-gray-500 dark:text-gray-400">{movie.Year}</p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {movie.imdbRating && (
                <p className="inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                  IMDb {movie.imdbRating}/10
                </p>
              )}

              <button
                type="button"
                onClick={toggleFavorite}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                  isFavorite
                    ? 'border border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950/40'
                    : 'bg-indigo-600 text-white hover:bg-indigo-500'
                }`}
              >
                {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
              </button>
            </div>

            <DetailRow label="Genre" value={movie.Genre} />
            <DetailRow label="Director" value={movie.Director} />
            <DetailRow label="Actors" value={movie.Actors} />
            <DetailRow label="Runtime" value={movie.Runtime} />

            {movie.Plot && (
              <div>
                <h2 className="mb-1 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Plot
                </h2>
                <p className="leading-relaxed text-gray-800 dark:text-gray-200">{movie.Plot}</p>
              </div>
            )}
          </div>
        </article>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title="Added to Favorites"
        autoCloseMs={3000}
      >
        <p>
          <span className="font-medium text-gray-900 dark:text-white">
            {movie?.Title}
          </span>{' '}
          has been added to your favorites.
        </p>
      </Modal>
    </main>
  )
}

function DetailRow({ label, value }) {
  return (
    <div>
      <h2 className="mb-1 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
        {label}
      </h2>
      <p className="text-gray-800 dark:text-gray-200">{value}</p>
    </div>
  )
}

export default MovieDetails
