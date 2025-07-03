import React, { useState } from 'react';
import { ChevronUp } from 'lucide-react';
import { Movie } from './types/movie';
import { useMovies } from './hooks/useMovies';
import { useFavorites } from './hooks/useFavorites';
import Header from './components/Header';
import FilterBar from './components/FilterBar';
import MovieCard from './components/MovieCard';
import MovieModal from './components/MovieModal';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';
import EmptyState from './components/EmptyState';

function App() {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [showFavorites, setShowFavorites] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  
  const { 
    movies, 
    genres, 
    loading, 
    error, 
    filters, 
    updateFilters, 
    loadMoreMovies, 
    currentPage, 
    totalPages, 
    refetch 
  } = useMovies();
  
  const { favorites, toggleFavorite, isFavorite } = useFavorites();

  const handleScroll = () => {
    const scrollTop = window.pageYOffset;
    setShowScrollTop(scrollTop > 400);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  React.useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const displayedMovies = showFavorites ? favorites : movies;

  return (
    <div className="min-h-screen bg-slate-900">
      <Header 
        filters={filters}
        onFiltersChange={updateFilters}
        favoritesCount={favorites.length}
        onShowFavorites={() => setShowFavorites(!showFavorites)}
      />
      
      {!showFavorites && (
        <FilterBar 
          filters={filters}
          genres={genres}
          onFiltersChange={updateFilters}
        />
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showFavorites && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Seus Favoritos</h2>
            <button
              onClick={() => setShowFavorites(false)}
              className="text-amber-500 hover:text-amber-400 transition-colors"
            >
              ← Voltar para descobrir filmes
            </button>
          </div>
        )}

        {error && (
          <ErrorMessage message={error} onRetry={refetch} />
        )}

        {loading && movies.length === 0 && (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        )}

        {!loading && displayedMovies.length === 0 && (
          <EmptyState 
            type={showFavorites ? 'favorites' : 'search'}
            message={filters.searchQuery ? `Nenhum filme encontrado para "${filters.searchQuery}"` : undefined}
          />
        )}

        {displayedMovies.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {displayedMovies.map(movie => (
              <MovieCard
                key={movie.id}
                movie={movie}
                isFavorite={isFavorite(movie.id)}
                onToggleFavorite={() => toggleFavorite(movie)}
                onShowDetails={() => setSelectedMovie(movie)}
              />
            ))}
          </div>
        )}

        {!showFavorites && movies.length > 0 && currentPage < totalPages && (
          <div className="flex justify-center mt-12">
            <button
              onClick={loadMoreMovies}
              disabled={loading}
              className="px-6 py-3 bg-amber-500 hover:bg-amber-600 disabled:bg-slate-600 text-white rounded-lg font-medium transition-colors flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <LoadingSpinner size="sm" />
                  <span>Carregando...</span>
                </>
              ) : (
                <span>Carregar mais filmes</span>
              )}
            </button>
          </div>
        )}
      </main>

      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          isOpen={!!selectedMovie}
          onClose={() => setSelectedMovie(null)}
          isFavorite={isFavorite(selectedMovie.id)}
          onToggleFavorite={() => toggleFavorite(selectedMovie)}
        />
      )}

      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 p-3 bg-amber-500 hover:bg-amber-600 text-white rounded-full shadow-lg transition-all duration-200 hover:scale-110"
        >
          <ChevronUp className="h-6 w-6" />
        </button>
      )}
    </div>
  );
}

export default App;