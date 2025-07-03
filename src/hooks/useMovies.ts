import { useState, useEffect } from 'react';
import { Movie, Genre, FilterOptions } from '../types/movie';
import { tmdbService } from '../services/tmdb';

export const useMovies = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState<FilterOptions>({
    searchQuery: '',
    genre: '',
    year: '',
    sortBy: 'popularity.desc'
  });

  const fetchMovies = async (page = 1, currentFilters = filters) => {
    try {
      setLoading(true);
      setError(null);

      let response;
      
      if (currentFilters.searchQuery) {
        response = await tmdbService.searchMovies(currentFilters.searchQuery, page);
      } else {
        const discoverFilters: any = {
          sort_by: currentFilters.sortBy
        };

        if (currentFilters.genre) {
          discoverFilters.with_genres = currentFilters.genre;
        }

        if (currentFilters.year) {
          discoverFilters.year = currentFilters.year;
        }

        response = await tmdbService.discoverMovies(discoverFilters, page);
      }

      if (page === 1) {
        setMovies(response.results);
      } else {
        setMovies(prev => [...prev, ...response.results]);
      }

      setTotalPages(response.total_pages);
      setCurrentPage(page);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const fetchGenres = async () => {
    try {
      const response = await tmdbService.getGenres();
      setGenres(response.genres);
    } catch (err) {
      console.error('Failed to fetch genres:', err);
    }
  };

  const updateFilters = (newFilters: Partial<FilterOptions>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    setCurrentPage(1);
    fetchMovies(1, updatedFilters);
  };

  const loadMoreMovies = () => {
    if (currentPage < totalPages) {
      fetchMovies(currentPage + 1);
    }
  };

  useEffect(() => {
    fetchMovies();
    fetchGenres();
  }, []);

  return {
    movies,
    genres,
    loading,
    error,
    currentPage,
    totalPages,
    filters,
    updateFilters,
    loadMoreMovies,
    refetch: () => fetchMovies(1)
  };
};