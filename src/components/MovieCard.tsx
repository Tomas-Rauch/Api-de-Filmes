import React from 'react';
import { Star, Heart, Calendar, Info } from 'lucide-react';
import { Movie } from '../types/movie';
import { tmdbService } from '../services/tmdb';

interface MovieCardProps {
  movie: Movie;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onShowDetails: () => void;
}

const MovieCard: React.FC<MovieCardProps> = ({ 
  movie, 
  isFavorite, 
  onToggleFavorite, 
  onShowDetails 
}) => {
  const posterUrl = tmdbService.getImageUrl(movie.poster_path);
  const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A';

  return (
    <div className="group relative bg-slate-800 rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105">
      <div className="aspect-[2/3] relative overflow-hidden">
        {posterUrl ? (
          <img
            src={posterUrl}
            alt={movie.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-slate-700 flex items-center justify-center">
            <span className="text-slate-400 text-sm">Sem imagem</span>
          </div>
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <div className="absolute top-2 right-2 flex space-x-2">
          <button
            onClick={onToggleFavorite}
            className={`p-2 rounded-full backdrop-blur-sm transition-all duration-200 ${
              isFavorite 
                ? 'bg-red-500 text-white' 
                : 'bg-black/50 text-white hover:bg-red-500'
            }`}
          >
            <Heart className="h-4 w-4" fill={isFavorite ? 'currentColor' : 'none'} />
          </button>
        </div>

        <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={onShowDetails}
            className="w-full flex items-center justify-center space-x-2 px-3 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-medium transition-colors"
          >
            <Info className="h-4 w-4" />
            <span>Detalhes</span>
          </button>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-white text-lg mb-2 line-clamp-2 leading-tight">
          {movie.title}
        </h3>
        
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 text-amber-500" fill="currentColor" />
            <span className="text-sm text-slate-300 font-medium">
              {movie.vote_average.toFixed(1)}
            </span>
          </div>
          
          <div className="flex items-center space-x-1 text-slate-400">
            <Calendar className="h-4 w-4" />
            <span className="text-sm">{releaseYear}</span>
          </div>
        </div>

        <p className="text-sm text-slate-400 line-clamp-3 leading-relaxed">
          {movie.overview || 'Sem descrição disponível.'}
        </p>
      </div>
    </div>
  );
};

export default MovieCard;