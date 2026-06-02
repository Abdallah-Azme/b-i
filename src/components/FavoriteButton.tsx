import React from 'react';
import { Heart } from 'lucide-react';
import { useFavoritesStore } from '@/hooks/useFavoritesStore';
import { cn } from '@/utils';

interface FavoriteButtonProps {
  projectId: number | string;
  className?: string;
  size?: number;
}

export const FavoriteButton: React.FC<FavoriteButtonProps> = ({ projectId, className = "", size = 20 }) => {
  const { toggleFavorite, isFavorite } = useFavoritesStore();
  const active = isFavorite(projectId);

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavorite(projectId);
      }}
      className={cn(
        "p-2 rounded-full transition-all duration-300",
        className,
        active 
          ? "bg-brand-gold text-black scale-110 shadow-lg shadow-brand-gold/20" 
          : "bg-black/40 text-white scale-100 hover:scale-110 transition-transform"
      )}
      aria-label={active ? "Remove from favorites" : "Add to favorites"}
    >
      <Heart 
        size={size} 
        fill={active ? "currentColor" : "none"} 
        className={active ? "animate-bounce-once" : ""}
      />
    </button>
  );
};
