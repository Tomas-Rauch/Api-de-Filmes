import React from 'react';
import { Search, Film } from 'lucide-react';

interface EmptyStateProps {
  type: 'search' | 'favorites' | 'error';
  message?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ type, message }) => {
  const getIcon = () => {
    switch (type) {
      case 'search':
        return <Search className="h-16 w-16 text-slate-500" />;
      case 'favorites':
        return <Film className="h-16 w-16 text-slate-500" />;
      default:
        return <Film className="h-16 w-16 text-slate-500" />;
    }
  };

  const getTitle = () => {
    switch (type) {
      case 'search':
        return 'Nenhum filme encontrado';
      case 'favorites':
        return 'Nenhum favorito ainda';
      default:
        return 'Nenhum filme encontrado';
    }
  };

  const getDescription = () => {
    switch (type) {
      case 'search':
        return message || 'Tente ajustar seus filtros ou termos de busca';
      case 'favorites':
        return 'Adicione filmes aos seus favoritos para vê-los aqui';
      default:
        return message || 'Tente novamente mais tarde';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-12 text-center">
      {getIcon()}
      <h3 className="text-xl font-semibold text-white mb-2 mt-4">
        {getTitle()}
      </h3>
      <p className="text-slate-400 max-w-md">
        {getDescription()}
      </p>
    </div>
  );
};

export default EmptyState;