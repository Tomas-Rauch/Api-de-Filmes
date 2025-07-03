import React, { useState, useEffect } from 'react';
import { X, Star, Calendar, Clock, DollarSign, Globe, Heart, Play } from 'lucide-react';
import { Movie, MovieDetails } from '../types/movie';
import { tmdbService } from '../services/tmdb';

interface MovieModalProps {
  movie: Movie;
  isOpen: boolean;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

const MovieModal: React.FC<MovieModalProps> = ({ 
  movie, 
  isOpen, 
  onClose, 
  isFavorite, 
  onToggleFavorite 
}) => {
  const [movieDetails, setMovieDetails] = useState<MovieDetails | null>(null);
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && movie) {
      fetchMovieDetails();
      fetchTrailer();
    }
  }, [isOpen, movie]);

  const fetchMovieDetails = async () => {
    try {
      setLoading(true);
      const details = await tmdbService.getMovieDetails(movie.id);
      setMovieDetails(details);
    } catch (error) {
      console.error('Error fetching movie details:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTrailer = async () => {
    try {
      const videos = await tmdbService.getMovieVideos(movie.id);
      const trailer = videos.results.find(
        (video: any) => video.type === 'Trailer' && video.site === 'YouTube'
      );
      setTrailerKey(trailer?.key || null);
    } catch (error) {
      console.error('Error fetching trailer:', error);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatRuntime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  if (!isOpen) return null;

  const backdropUrl = tmdbService.getBackdropUrl(movie.backdrop_path);
  const posterUrl = tmdbService.getImageUrl(movie.poster_path);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-black/75 transition-opacity" onClick={onClose} />
        
        <div className="relative inline-block align-bottom bg-slate-900 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          {backdropUrl && (
            <div className="relative h-64 sm:h-80 overflow-hidden">
              <img
                src={backdropUrl}
                alt={movie.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />
            </div>
          )}
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
          >
            <X className="h-6 w-6" />
          </button>

          <div className="relative px-6 py-6">
            <div className="flex flex-col sm:flex-row sm:space-x-6">
              {posterUrl && (
                <div className="flex-shrink-0 mb-4 sm:mb-0">
                  <img
                    src={posterUrl}
                    alt={movie.title}
                    className="w-48 h-72 object-cover rounded-lg mx-auto sm:mx-0"
                  />
                </div>
              )}
              
              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                    {movie.title}
                  </h2>
                  <button
                    onClick={onToggleFavorite}
                    className={`p-2 rounded-full transition-all duration-200 ${
                      isFavorite 
                        ? 'bg-red-500 text-white' 
                        : 'bg-slate-800 text-white hover:bg-red-500'
                    }`}
                  >
                    <Heart className="h-6 w-6" fill={isFavorite ? 'currentColor' : 'none'} />
                  </button>
                </div>

                {movieDetails?.tagline && (
                  <p className="text-amber-400 italic mb-4">{movieDetails.tagline}</p>
                )}

                <div className="flex flex-wrap items-center gap-4 mb-4">
                  <div className="flex items-center space-x-1">
                    <Star className="h-5 w-5 text-amber-500" fill="currentColor" />
                    <span className="text-white font-medium">
                      {movie.vote_average.toFixed(1)}
                    </span>
                    <span className="text-slate-400 text-sm">
                      ({movie.vote_count} avaliações)
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-1 text-slate-400">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(movie.release_date).getFullYear()}</span>
                  </div>
                  
                  {movieDetails?.runtime && (
                    <div className="flex items-center space-x-1 text-slate-400">
                      <Clock className="h-4 w-4" />
                      <span>{formatRuntime(movieDetails.runtime)}</span>
                    </div>
                  )}
                </div>

                {movieDetails?.genres && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {movieDetails.genres.map(genre => (
                      <span
                        key={genre.id}
                        className="px-3 py-1 bg-slate-800 text-slate-300 rounded-full text-sm"
                      >
                        {genre.name}
                      </span>
                    ))}
                  </div>
                )}

                <p className="text-slate-300 mb-6 leading-relaxed">
                  {movie.overview}
                </p>

                {trailerKey && (
                  <div className="mb-6">
                    <a
                      href={`https://www.youtube.com/watch?v=${trailerKey}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                    >
                      <Play className="h-4 w-4" />
                      <span>Assistir Trailer</span>
                    </a>
                  </div>
                )}

                {loading ? (
                  <div className="animate-pulse">
                    <div className="h-4 bg-slate-800 rounded mb-2"></div>
                    <div className="h-4 bg-slate-800 rounded mb-2"></div>
                    <div className="h-4 bg-slate-800 rounded"></div>
                  </div>
                ) : (
                  movieDetails && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                      {movieDetails.budget > 0 && (
                        <div className="flex items-center space-x-2">
                          <DollarSign className="h-4 w-4 text-slate-400" />
                          <span className="text-slate-400">Orçamento:</span>
                          <span className="text-white">{formatCurrency(movieDetails.budget)}</span>
                        </div>
                      )}
                      
                      {movieDetails.revenue > 0 && (
                        <div className="flex items-center space-x-2">
                          <DollarSign className="h-4 w-4 text-slate-400" />
                          <span className="text-slate-400">Receita:</span>
                          <span className="text-white">{formatCurrency(movieDetails.revenue)}</span>
                        </div>
                      )}
                      
                      <div className="flex items-center space-x-2">
                        <Globe className="h-4 w-4 text-slate-400" />
                        <span className="text-slate-400">Idioma:</span>
                        <span className="text-white">{movie.original_language.toUpperCase()}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <span className="text-slate-400">Status:</span>
                        <span className="text-white">{movieDetails.status}</span>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieModal;