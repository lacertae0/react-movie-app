import { Link } from 'react-router-dom'

function MovieCard({ movie, onRemove }) {
  const poster =
    movie.Poster && movie.Poster !== 'N/A'
      ? movie.Poster
      : 'https://placehold.co/300x450?text=No+Poster'

  return (
    <article className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:border-indigo-300 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900 dark:hover:border-indigo-700">
      <Link to={`/movie/${movie.imdbID}`} className="block">
        <div className="overflow-hidden">
          <img
            src={poster}
            alt={`${movie.Title} poster`}
            className="aspect-2/3 w-full bg-gray-100 object-cover transition-transform duration-300 ease-out group-hover:scale-105 dark:bg-gray-800"
            loading="lazy"
          />
        </div>
        <div className="space-y-1 p-4 text-left">
          <h2 className="line-clamp-2 text-base font-semibold text-gray-900 transition-colors duration-200 group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400">
            {movie.Title}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {movie.Year}
            {movie.Type ? ` · ${movie.Type}` : ''}
          </p>
        </div>
      </Link>

      {onRemove && (
        <div className="px-4 pb-4">
          <button
            type="button"
            onClick={onRemove}
            className="w-full rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition-colors duration-200 hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950/40"
          >
            Remove
          </button>
        </div>
      )}
    </article>
  )
}

export default MovieCard
