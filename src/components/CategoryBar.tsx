import React, { useRef } from 'react';
import { CATEGORIES } from '../data/categories';
import { CategoryId, CategoryTheme } from '../types';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CategoryBarProps {
  selectedCategoryId: CategoryId;
  onSelectCategory: (id: CategoryId) => void;
  isFavoritesView: boolean;
  onExitFavorites: () => void;
}

export const CategoryBar: React.FC<CategoryBarProps> = ({
  selectedCategoryId,
  onSelectCategory,
  isFavoritesView,
  onExitFavorites,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const amount = direction === 'left' ? -250 : 250;
      scrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-3 pb-2">
      {/* Scroll Controls for Desktop */}
      <button
        onClick={() => scroll('left')}
        className="hidden md:flex absolute left-1 top-1/2 -translate-y-1/2 z-10 p-1.5 rounded-full bg-slate-800/80 [body.light_&]:bg-white/90 text-slate-300 [body.light_&]:text-slate-700 shadow-md border border-slate-700/50 [body.light_&]:border-slate-200 hover:scale-105 transition"
        title="Scroll left"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      <button
        onClick={() => scroll('right')}
        className="hidden md:flex absolute right-1 top-1/2 -translate-y-1/2 z-10 p-1.5 rounded-full bg-slate-800/80 [body.light_&]:bg-white/90 text-slate-300 [body.light_&]:text-slate-700 shadow-md border border-slate-700/50 [body.light_&]:border-slate-200 hover:scale-105 transition"
        title="Scroll right"
      >
        <ChevronRight className="w-4 h-4" />
      </button>

      {/* Horizontal Scroll Track */}
      <div
        ref={scrollRef}
        className="flex items-center gap-2.5 overflow-x-auto no-scrollbar scroll-smooth py-1 px-1"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategoryId === cat.id && !isFavoritesView;

          return (
            <button
              key={cat.id}
              onClick={() => {
                if (isFavoritesView) onExitFavorites();
                onSelectCategory(cat.id);
              }}
              style={{
                boxShadow: isSelected ? `0 8px 20px -4px ${cat.glowColor}` : undefined,
              }}
              className={`flex-shrink-0 flex items-center gap-2 px-3.5 py-2.5 rounded-2xl text-left transition-all duration-300 border ${
                isSelected
                  ? `bg-gradient-to-r ${cat.gradient} text-white font-bold border-transparent shadow-lg scale-[1.03]`
                  : 'bg-slate-800/60 [body.light_&]:bg-white/80 [body.amoled_&]:bg-neutral-900 border-slate-700/40 [body.light_&]:border-slate-200 text-slate-300 [body.light_&]:text-slate-700 hover:border-slate-500 [body.light_&]:hover:bg-slate-100 hover:scale-[1.01]'
              }`}
            >
              <span className="text-xl select-none">{cat.icon}</span>
              <div>
                <div className="flex items-center gap-1.5 leading-tight">
                  <span className="text-xs sm:text-sm font-semibold whitespace-nowrap">
                    {cat.hindiName}
                  </span>
                  <span
                    className={`text-[9px] px-1.5 py-0.2 rounded-md font-bold uppercase tracking-wider ${
                      isSelected
                        ? 'bg-black/25 text-white'
                        : 'bg-slate-700/60 [body.light_&]:bg-slate-200 text-slate-300 [body.light_&]:text-slate-600'
                    }`}
                  >
                    1000+
                  </span>
                </div>
                <span
                  className={`text-[10px] block font-normal whitespace-nowrap ${
                    isSelected ? 'text-white/85' : 'text-slate-400 [body.light_&]:text-slate-500'
                  }`}
                >
                  {cat.name}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
