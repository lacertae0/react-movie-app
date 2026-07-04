import { useEffect, useState } from 'react'
import { fetchMovies } from '../api/movieApi'
import MovieCard from '../components/MovieCard'

const DEFAULT_QUERY = 'batman'

function Home() {
  const [searchInput, setSearchInput] = useState('')
  const [query, setQuery] = useState(DEFAULT_QUERY)
  const [isDefaultView, setIsDefaultView] = useState(true)
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function loadMovies() {
      setLoading(true)
      setError(null)

      try {
        const results = await fetchMovies(query)
        if (!cancelled) {
          setMovies(results)
        }
      } catch (err) {
        if (!cancelled) {
          setMovies([])
          setError(err.message || 'Failed to fetch movies')
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadMovies()

    return () => {
      cancelled = true
    }
  }, [query])

  function handleSubmit(event) {
    event.preventDefault()
    const nextQuery = searchInput.trim()
    if (!nextQuery) {
      setQuery(DEFAULT_QUERY)
      setIsDefaultView(true)
      return
    }
    setQuery(nextQuery)
    setIsDefaultView(false)
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8 space-y-4 text-left">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          Discover Movies
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
          <label htmlFor="movie-search" className="sr-only">
            Search movies
          </label>
          <input
            id="movie-search"
            type="search"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="Search for a movie..."
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 outline-none ring-indigo-500 transition-colors duration-200 focus:ring-2 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
          />
          <button
            type="submit"
            className="rounded-lg bg-indigo-600 px-5 py-2.5 font-medium text-white transition-colors duration-200 hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={loading}
          >
            Search
          </button>
        </form>
      </div>

      {loading && (
        <p className="text-center text-gray-600 dark:text-gray-400" role="status">
          Loading movies...
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

      {!loading && !error && movies.length === 0 && (
        <p className="text-center text-gray-600 dark:text-gray-400">
          No movies found for “{query}”.
        </p>
      )}

      {!loading && !error && movies.length > 0 && (
        <section aria-label="Movie results">
          <h2 className="mb-4 text-left text-lg font-semibold text-gray-800 dark:text-gray-200">
            {isDefaultView ? 'Featured movies' : `Results for “${query}”`}
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {movies.map((movie) => (
              <MovieCard key={movie.imdbID} movie={movie} />
            ))}
          </div>
        </section>
      )}
    </main>
  )
}

export default Home
