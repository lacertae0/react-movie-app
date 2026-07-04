import axios from 'axios'

const api = axios.create({
  baseURL: 'https://www.omdbapi.com/',
})

const API_KEY = 'thewdb'

export async function fetchMovies(searchTerm) {
  const { data } = await api.get('/', {
    params: {
      apikey: API_KEY,
      s: searchTerm.trim(),
    },
  })

  if (data.Response === 'False') {
    throw new Error(data.Error || 'No movies found')
  }

  return data.Search ?? []
}

export async function fetchMovieById(id) {
  const { data } = await api.get('/', {
    params: {
      apikey: API_KEY,
      i: id,
    },
  })

  if (data.Response === 'False') {
    throw new Error(data.Error || 'Movie not found')
  }

  return data
}

export default api
