import MovieCard from '../components/MovieCard'
import useLocalStorage from '../hooks/useLocalStorage'

function Favorites() {
  const [favorites, setFavorites] = useLocalStorage('favorites', [])

  function removeFavorite(id) {
    setFavorites((prev) => prev.filter((movie) => movie.imdbID !== id))
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-8 text-left text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
        Favorites
      </h1>

      {favorites.length === 0 ? (
        <p className="text-center text-gray-600 dark:text-gray-400">
          No favorite movies yet. Add some from a movie’s details page.
        </p>
      ) : (
        <section
          aria-label="Favorite movies"
          className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
        >
          {favorites.map((movie) => (
            <MovieCard
              key={movie.imdbID}
              movie={movie}
              onRemove={() => removeFavorite(movie.imdbID)}
            />
          ))}
        </section>
      )}
    </main>
  )
}

export default Favorites
