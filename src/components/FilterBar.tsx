import React from 'react';
import { Filter, Calendar, Star, List } from 'lucide-react';
import { FilterOptions, Genre } from '../types/movie';

interface FilterBarProps {
  filters: FilterOptions;
  genres: Genre[];
  onFiltersChange: (filters: Partial<FilterOptions>) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ filters, genres, onFiltersChange }) => {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i);

  const sortOptions = [
    { value: 'popularity.desc', label: 'Mais Popular' },
    { value: 'popularity.asc', label: 'Menos Popular' },
    { value: 'vote_average.desc', label: 'Melhor Avaliação' },
    { value: 'vote_average.asc', label: 'Pior Avaliação' },
    { value: 'release_date.desc', label: 'Mais Recente' },
    { value: 'release_date.asc', label: 'Mais Antigo' }
  ];

  return (
    <div className="bg-slate-800 border-b border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center space-x-2 mb-4">
          <Filter className="h-5 w-5 text-slate-400" />
          <h2 className="text-lg font-semibold text-white">Filtros</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              <List className="h-4 w-4 inline mr-2" />
              Gênero
            </label>
            <select
              value={filters.genre}
              onChange={(e) => onFiltersChange({ genre: e.target.value })}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            >
              <option value="">Todos os gêneros</option>
              {genres.map(genre => (
                <option key={genre.id} value={genre.id}>
                  {genre.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              <Calendar className="h-4 w-4 inline mr-2" />
              Ano
            </label>
            <select
              value={filters.year}
              onChange={(e) => onFiltersChange({ year: e.target.value })}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            >
              <option value="">Todos os anos</option>
              {years.map(year => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              <Star className="h-4 w-4 inline mr-2" />
              Ordenar por
            </label>
            <select
              value={filters.sortBy}
              onChange={(e) => onFiltersChange({ sortBy: e.target.value })}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;