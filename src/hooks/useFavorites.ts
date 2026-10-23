import { useEffect, useState } from 'react';
import { Item } from '../types';

const STORAGE_KEY = 'chutkule_favorites_v1';

export function useFavorites() {
  const [favorites, setFavorites] = useState<Item[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    } catch (e) {
      console.error('Failed to save favorites to localStorage', e);
    }
  }, [favorites]);

  const toggleFavorite = (item: Item) => {
    setFavorites((prev) => {
      const exists = prev.some((fav) => fav.id === item.id);
      if (exists) {
        return prev.filter((fav) => fav.id !== item.id);
      } else {
        return [item, ...prev];
      }
    });
  };

  const isFavorite = (id: string) => {
    return favorites.some((fav) => fav.id === id);
  };

  const clearAllFavorites = () => {
    setFavorites([]);
  };

  return {
    favorites,
    toggleFavorite,
    isFavorite,
    clearAllFavorites,
    favoritesCount: favorites.length,
  };
}
