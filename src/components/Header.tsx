import React, { useState } from 'react';
import {
  Search,
  Heart,
  Bell,
  Sun,
  Moon,
  Smartphone,
  Star,
  Download,
  X,
  Share2,
  Check,
} from 'lucide-react';
import { CategoryTheme, ThemeMode } from '../types';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface HeaderProps {
  currentCategory: CategoryTheme;
  theme: ThemeMode;
  onCycleTheme: () => void;
  favoritesCount: number;
  onOpenFavorites: () => void;
  isFavoritesView: boolean;
  onOpenNotifications: () => void;
  onOpenRating: () => void;
  onOpenPlayStoreGuide: () => void;
  onOpenShareApp: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentCategory,
  theme,
  onCycleTheme,
  favoritesCount,
  onOpenFavorites,
  isFavoritesView,
  onOpenNotifications,
  onOpenRating,
  onOpenPlayStoreGuide,
  onOpenShareApp,
  searchQuery,
  onSearchChange,
}) => {
  const { isInstallable, install } = usePWAInstall();
  const [showSearchMobile, setShowSearchMobile] = useState(false);
  const [appShared, setAppShared] = useState(false);

  const handleShareApp = () => {
    onOpenShareApp();
  };

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md transition-colors duration-300 border-b border-slate-700/40 bg-slate-900/95 dark:bg-slate-900/95 [body.light_&]:bg-white/95 [body.light_&]:border-slate-200 [body.amoled_&]:bg-black/95 [body.amoled_&]:border-neutral-800 w-full max-w-full">
      {/* Category Theme dynamic accent bar */}
      <div
        className={`h-1.5 w-full bg-gradient-to-r ${currentCategory.gradient} transition-all duration-500`}
      />

      <div className="w-full max-w-7xl mx-auto px-2.5 sm:px-6 py-2 sm:py-2.5">
        <div className="flex items-center justify-between gap-1.5 sm:gap-3 w-full min-w-0">
          {/* Logo & App Branding */}
          <div
            className="flex items-center gap-2 cursor-pointer select-none min-w-0 flex-shrink"
            onClick={() => isFavoritesView && onOpenFavorites()}
          >
            <div
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-2xl flex-shrink-0 flex items-center justify-center text-lg sm:text-xl shadow-lg shadow-${currentCategory.baseColor}-500/20 bg-gradient-to-tr ${currentCategory.gradient} text-white transform hover:scale-105 active:scale-95 transition-transform`}
            >
              {currentCategory.icon}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm sm:text-lg tracking-tight [body.light_&]:text-slate-900 text-white truncate block">
                  चुटकुले &amp; विचार
                </span>
                <span className={`hidden xs:inline-block text-[9px] font-bold px-1.5 py-0.5 rounded-full ${currentCategory.badgeBg}`}>
                  1000+
                </span>
              </div>
              <p className="text-[11px] text-slate-400 [body.light_&]:text-slate-500 hidden sm:block truncate">
                Jokes, Quotes, Shayari &amp; Status
              </p>
            </div>
          </div>

          {/* Desktop Search Bar */}
          <div className="hidden md:flex flex-1 max-w-xs lg:max-w-md mx-3 relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder={`खोजें चुटकुले, शायरी या कोट्स... (${currentCategory.name})`}
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-10 py-1.5 text-xs sm:text-sm rounded-xl transition-all duration-200 bg-slate-800/80 [body.light_&]:bg-slate-100 [body.amoled_&]:bg-neutral-900 border border-slate-700/50 [body.light_&]:border-slate-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-amber-500 [body.light_&]:text-slate-900 text-slate-100 placeholder:text-slate-400"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Right Action Controls: Screen-fit and responsive on all devices */}
          <div className="flex items-center gap-1 sm:gap-1.5 flex-shrink-0">
            {/* Mobile Search Toggle */}
            <button
              onClick={() => setShowSearchMobile(!showSearchMobile)}
              className="md:hidden p-1.5 sm:p-2 rounded-xl text-slate-300 [body.light_&]:text-slate-600 hover:bg-slate-800 [body.light_&]:hover:bg-slate-100 transition active:scale-95"
              title="खोजें"
            >
              <Search className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* App Share Button (Promote App) */}
            <button
              onClick={handleShareApp}
              className="flex items-center gap-1 p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl text-xs font-semibold bg-indigo-500/15 text-indigo-400 [body.light_&]:text-indigo-600 border border-indigo-500/30 hover:bg-indigo-500/25 transition shadow-sm active:scale-95"
              title="ऐप दोस्तों के साथ शेयर करें (Share App)"
            >
              {appShared ? (
                <Check className="w-4 h-4 sm:w-3.5 sm:h-3.5 text-emerald-400" />
              ) : (
                <Share2 className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
              )}
              <span className="hidden sm:inline font-semibold">{appShared ? 'शेयर' : 'ऐप शेयर'}</span>
            </button>

            {/* PlayStore & APK Guide Button (Desktop/Tablet) */}
            <button
              onClick={onOpenPlayStoreGuide}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 transition shadow-sm"
              title="Play Store APK & GitHub Guide"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>APK गाइड</span>
            </button>

            {/* In-app Install Button (PWA) */}
            {isInstallable && (
              <button
                onClick={install}
                className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md shadow-orange-500/25 hover:opacity-95 transition"
                title="Install PWA on Device"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Install</span>
              </button>
            )}

            {/* Rating Button */}
            <button
              onClick={onOpenRating}
              className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl text-xs font-medium text-amber-400 bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 transition flex items-center gap-1 active:scale-95"
              title="रेट करें 5 Stars!"
            >
              <Star className="w-4 h-4 sm:w-3.5 sm:h-3.5 fill-amber-400 text-amber-400" />
              <span className="hidden md:inline font-semibold">रेट करें</span>
            </button>

            {/* Daily Notifications Button */}
            <button
              onClick={onOpenNotifications}
              className="relative p-1.5 sm:p-2 rounded-xl text-slate-300 [body.light_&]:text-slate-700 hover:bg-slate-800 [body.light_&]:hover:bg-slate-100 transition active:scale-95"
              title="दैनिक सूचनाएं (Daily Notifications)"
            >
              <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </button>

            {/* Favorites Button */}
            <button
              onClick={onOpenFavorites}
              className={`relative p-1.5 sm:p-2 rounded-xl transition active:scale-95 ${
                isFavoritesView
                  ? 'bg-rose-500 text-white shadow-md shadow-rose-500/30'
                  : 'text-slate-300 [body.light_&]:text-slate-700 hover:bg-slate-800 [body.light_&]:hover:bg-slate-100'
              }`}
              title="पसंदीदा (Favorites)"
            >
              <Heart className={`w-4 h-4 sm:w-5 sm:h-5 ${favoritesCount > 0 ? 'fill-rose-500 text-rose-500' : ''}`} />
              {favoritesCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-[9px] font-bold w-4 h-4 sm:w-4.5 sm:h-4.5 rounded-full flex items-center justify-center border border-slate-900 [body.light_&]:border-white">
                  {favoritesCount > 99 ? '99+' : favoritesCount}
                </span>
              )}
            </button>

            {/* Dark / Light / AMOLED Cycle */}
            <button
              onClick={onCycleTheme}
              className="p-1.5 sm:p-2 rounded-xl text-slate-300 [body.light_&]:text-slate-700 hover:bg-slate-800 [body.light_&]:hover:bg-slate-100 transition active:scale-95"
              title={`थीम बदलें (Current: ${theme})`}
            >
              {theme === 'dark' && <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-400" />}
              {theme === 'amoled' && <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />}
              {theme === 'light' && <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Input Expanded */}
        {showSearchMobile && (
          <div className="mt-2.5 md:hidden relative w-full animate-in fade-in duration-200">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="खोजें चुटकुले, शायरी, स्टेटस..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              autoFocus
              className="w-full pl-10 pr-10 py-2 rounded-xl text-xs sm:text-sm bg-slate-800 [body.light_&]:bg-slate-100 [body.amoled_&]:bg-neutral-900 border border-slate-700 [body.light_&]:border-slate-300 text-white [body.light_&]:text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  );
};
