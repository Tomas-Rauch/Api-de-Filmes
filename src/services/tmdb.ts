const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

if (!API_KEY) {
  throw new Error('TMDB API key is not configured. Please add VITE_TMDB_API_KEY to your .env file.');
}

export const tmdbService = {
  // Get popular movies
  getPopularMovies: async (page = 1) => {
    const response = await fetch(
      `${BASE_URL}/movie/popular?api_key=${API_KEY}&page=${page}&language=pt-BR`
    );
    if (!response.ok) {
      throw new Error('Failed to fetch popular movies');
    }
    return response.json();
  },

  // Search movies
  searchMovies: async (query: string, page = 1) => {
    const response = await fetch(
      `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}&language=pt-BR`
    );
    if (!response.ok) {
      throw new Error('Failed to search movies');
    }
    return response.json();
  },

  // Get movie details
  getMovieDetails: async (id: number) => {
    const response = await fetch(
      `${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=pt-BR`
    );
    if (!response.ok) {
      throw new Error('Failed to fetch movie details');
    }
    return response.json();
  },

  // Get genres
  getGenres: async () => {
    const response = await fetch(
      `${BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=pt-BR`
    );
    if (!response.ok) {
      throw new Error('Failed to fetch genres');
    }
    return response.json();
  },

  // Discover movies with filters
  discoverMovies: async (filters: any, page = 1) => {
    const params = new URLSearchParams({
      api_key: API_KEY,
      page: page.toString(),
      language: 'pt-BR',
      ...filters
    });

    const response = await fetch(`${BASE_URL}/discover/movie?${params}`);
    if (!response.ok) {
      throw new Error('Failed to discover movies');
    }
    return response.json();
  },

  // Get movie videos (trailers)
  getMovieVideos: async (id: number) => {
    const response = await fetch(
      `${BASE_URL}/movie/${id}/videos?api_key=${API_KEY}&language=pt-BR`
    );
    if (!response.ok) {
      throw new Error('Failed to fetch movie videos');
    }
    return response.json();
  },

  // Image URL helpers
  getImageUrl: (path: string, size = 'w500') => {
    return path ? `${IMAGE_BASE_URL}/${size}${path}` : null;
  },

  getBackdropUrl: (path: string, size = 'w1280') => {
    return path ? `${IMAGE_BASE_URL}/${size}${path}` : null;
  }
};