import React, { useState, useMemo } from 'react';
import { CATEGORIES } from './data/categories';
import { getItemsForCategory, getDailyQuote } from './data/jokesData';
import { CategoryId, Item, ThemeMode } from './types';
import { useTheme } from './hooks/useTheme';
import { useFavorites } from './hooks/useFavorites';
import { useNotifications } from './hooks/useNotifications';
import { Header } from './components/Header';
import { CategoryBar } from './components/CategoryBar';
import { DailyQuoteBanner } from './components/DailyQuoteBanner';
import { JokeCard } from './components/JokeCard';
import { CardImageModal } from './components/CardImageModal';
import { RatingModal } from './components/RatingModal';
import { NotificationModal } from './components/NotificationModal';
import { PlayStoreGuideModal } from './components/PlayStoreGuideModal';
import { PrivacyPolicyModal } from './components/PrivacyPolicyModal';
import { ShareAppModal } from './components/ShareAppModal';
import { OfflineIndicator } from './components/OfflineIndicator';
import { useAds } from './hooks/useAds';
import { AdBanner } from './components/AdBanner';
import { NativeAdCard } from './components/NativeAdCard';
import { InterstitialAdModal } from './components/InterstitialAdModal';
import { RewardedAdModal } from './components/RewardedAdModal';
import { AdSettingsModal } from './components/AdSettingsModal';
import { CardReadyModal, CardReadyData } from './components/CardReadyModal';
import {
  Sparkles,
  Shuffle,
  ChevronDown,
  Heart,
  Smile,
  Search,
  Filter,
  ArrowUp,
  Download,
  Share2,
} from 'lucide-react';

const ITEMS_PER_PAGE = 24;

export default function App() {
  const { theme, cycleTheme } = useTheme();
  const {
    favorites,
    toggleFavorite,
    isFavorite,
    favoritesCount,
    clearAllFavorites,
  } = useFavorites();

  const {
    settings: notifSettings,
    saveSettings: saveNotifSettings,
    permission: notifPermission,
    requestPermission: requestNotifPermission,
    sendTestNotification,
    inAppAlert,
    dismissInAppAlert,
  } = useNotifications();

  // Active Category State
  const [selectedCategoryId, setSelectedCategoryId] = useState<CategoryId>('funny_jokes');
  const [isFavoritesView, setIsFavoritesView] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [displayCount, setDisplayCount] = useState<number>(ITEMS_PER_PAGE);

  // Modals state
  const [activeCardItem, setActiveCardItem] = useState<{ item: Item; categoryId: CategoryId } | null>(null);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [showPlayStoreGuide, setShowPlayStoreGuide] = useState(false);
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [showShareAppModal, setShowShareAppModal] = useState(false);
  const [showAdSettings, setShowAdSettings] = useState(false);
  const [cardReadyData, setCardReadyData] = useState<CardReadyData | null>(null);

  // AdMob & AdSense Ads Hook
  const {
    adConfig,
    updateAdConfig,
    resetToTestIds,
    isInterstitialOpen,
    isRewardedOpen,
    showInterstitial,
    showRewarded,
    closeInterstitial,
    closeRewarded,
    trackShareAction,
  } = useAds();



  // Daily Quote
  const [dailyCategorySeed, setDailyCategorySeed] = useState(0);

  const currentCategory = useMemo(() => {
    return CATEGORIES.find((c) => c.id === selectedCategoryId) || CATEGORIES[0];
  }, [selectedCategoryId]);

  // All 1000+ items for selected category
  const allCategoryItems = useMemo(() => {
    return getItemsForCategory(selectedCategoryId, 1050);
  }, [selectedCategoryId]);

  // Daily Item
  const dailyItem = useMemo(() => {
    const list = getItemsForCategory(selectedCategoryId, 50);
    const index = (new Date().getDate() + dailyCategorySeed) % list.length;
    return list[index] || list[0];
  }, [selectedCategoryId, dailyCategorySeed]);

  // Filtered items based on view & search
  const displayedItems = useMemo(() => {
    const sourceList = isFavoritesView ? favorites : allCategoryItems;

    if (!searchQuery.trim()) {
      return sourceList.slice(0, displayCount);
    }

    const query = searchQuery.toLowerCase().trim();
    const filtered = sourceList.filter(
      (item) =>
        item.text.toLowerCase().includes(query) ||
        (item.authorOrCharacter && item.authorOrCharacter.toLowerCase().includes(query)) ||
        (item.tags && item.tags.some((t) => t.toLowerCase().includes(query)))
    );

    return filtered.slice(0, displayCount);
  }, [isFavoritesView, favorites, allCategoryItems, searchQuery, displayCount]);

  const totalAvailableCount = useMemo(() => {
    if (isFavoritesView) return favorites.length;
    if (!searchQuery.trim()) return allCategoryItems.length;
    const query = searchQuery.toLowerCase().trim();
    return allCategoryItems.filter(
      (item) =>
        item.text.toLowerCase().includes(query) ||
        (item.authorOrCharacter && item.authorOrCharacter.toLowerCase().includes(query)) ||
        (item.tags && item.tags.some((t) => t.toLowerCase().includes(query)))
    ).length;
  }, [isFavoritesView, favorites, allCategoryItems, searchQuery]);

  const handleSelectCategory = (catId: CategoryId) => {
    setSelectedCategoryId(catId);
    setDisplayCount(ITEMS_PER_PAGE);
    setSearchQuery('');
  };

  const handleRandomShuffle = () => {
    const randomIdx = Math.floor(Math.random() * (allCategoryItems.length - 20));
    window.scrollTo({ top: 380, behavior: 'smooth' });
  };

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300 w-full max-w-full overflow-x-hidden">
      {/* Header */}
      <Header
        currentCategory={currentCategory}
        theme={theme}
        onCycleTheme={cycleTheme}
        favoritesCount={favoritesCount}
        onOpenFavorites={() => setIsFavoritesView(!isFavoritesView)}
        isFavoritesView={isFavoritesView}
        onOpenNotifications={() => setShowNotificationModal(true)}
        onOpenRating={() => setShowRatingModal(true)}
        onOpenPlayStoreGuide={() => setShowPlayStoreGuide(true)}
        onOpenShareApp={() => setShowShareAppModal(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {/* Category Bar with dynamic theme highlights */}
        <CategoryBar
          selectedCategoryId={selectedCategoryId}
          onSelectCategory={handleSelectCategory}
          isFavoritesView={isFavoritesView}
          onExitFavorites={() => setIsFavoritesView(false)}
        />

        {/* Favorites View Header or Normal Category Banner */}
        {isFavoritesView ? (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 my-4">
            <div className="flex flex-wrap items-center justify-between gap-3 p-5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-500/20 flex items-center justify-center text-rose-500">
                  <Heart className="w-5 h-5 fill-rose-500" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white [body.light_&]:text-slate-900">
                    आपके पसंदीदा चुटकुले और विचार (Favorites)
                  </h2>
                  <p className="text-xs text-slate-400 [body.light_&]:text-slate-500">
                    कुल सेव किए गए: {favorites.length}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {favorites.length > 0 && (
                  <button
                    onClick={clearAllFavorites}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 transition"
                  >
                    सभी हटाएं
                  </button>
                )}
                <button
                  onClick={() => setIsFavoritesView(false)}
                  className="px-4 py-1.5 rounded-xl text-xs font-bold bg-slate-800 [body.light_&]:bg-slate-200 text-white [body.light_&]:text-slate-900 hover:bg-slate-700 transition"
                >
                  श्रेणियों पर लौटें
                </button>
              </div>
            </div>
          </div>
        ) : (
          !searchQuery && (
            <DailyQuoteBanner
              item={dailyItem}
              category={currentCategory}
              onRefreshDaily={() => setDailyCategorySeed((s) => s + 1)}
              onRequestRewardedAd={(onSuccess) => showRewarded(onSuccess)}
              onShowCardReady={(data) => setCardReadyData(data)}
              onOpenCardModal={(item) =>
                setActiveCardItem({ item, categoryId: item.categoryId || currentCategory.id })
              }
            />

          )
        )}

        {/* Items Listing Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-3 mb-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-extrabold text-white [body.light_&]:text-slate-900 flex items-center gap-2">
                  <span>{isFavoritesView ? 'पसंदीदा' : currentCategory.hindiName}</span>
                  {!isFavoritesView && (
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full font-bold bg-gradient-to-r ${currentCategory.gradient} text-white shadow-sm`}
                    >
                      1000+ Items
                    </span>
                  )}
                </h2>
              </div>
              <p className="text-xs text-slate-400 [body.light_&]:text-slate-500 mt-0.5">
                {isFavoritesView
                  ? 'आपके द्वारा दिल से जोड़े गए चुटकुले व स्टेटस'
                  : currentCategory.tagline}
              </p>
            </div>

            {/* Quick Actions Bar */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-slate-400 [body.light_&]:text-slate-500">
                दिखा रहे हैं: {displayedItems.length} / {totalAvailableCount}
              </span>

              {!isFavoritesView && (
                <button
                  onClick={handleRandomShuffle}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 [body.light_&]:bg-slate-200 text-slate-300 [body.light_&]:text-slate-800 hover:bg-slate-700 transition"
                  title="Random Joke"
                >
                  <Shuffle className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">रैंडम</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Google AdMob Inline Banner */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <AdBanner
            adConfig={adConfig}
            format="inline"
            onOpenSettings={() => setShowAdSettings(true)}
          />
        </div>

        {/* Joke Cards Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {displayedItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {displayedItems.map((item, index) => {
                const itemCat =
                  CATEGORIES.find((c) => c.id === item.categoryId) || currentCategory;

                // Inject a Native Ad Card at position 4 and position 10 in the feed
                const showNativeAdHere = index === 3 || index === 9;

                return (
                  <React.Fragment key={item.id}>
                    {showNativeAdHere && (
                      <NativeAdCard
                        adConfig={adConfig}
                        onOpenSettings={() => setShowAdSettings(true)}
                      />
                    )}
                    <JokeCard
                      item={item}
                      category={itemCat}
                      isFav={isFavorite(item.id)}
                      onToggleFavorite={toggleFavorite}
                      onRequestRewardedAd={(onSuccess) => showRewarded(onSuccess)}
                      onShowCardReady={(data) => setCardReadyData(data)}
                      onOpenCardModal={(clicked) => {
                        trackShareAction();
                        setActiveCardItem({ item: clicked, categoryId: itemCat.id });
                      }}
                    />

                  </React.Fragment>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16 px-4 rounded-3xl bg-slate-800/30 [body.light_&]:bg-slate-100 border border-slate-700/50 [body.light_&]:border-slate-200 max-w-md mx-auto my-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-700/40 flex items-center justify-center text-3xl">
                {isFavoritesView ? '💔' : '🔍'}
              </div>
              <h3 className="text-lg font-bold text-white [body.light_&]:text-slate-900">
                {isFavoritesView
                  ? 'अभी कोई पसंदीदा चुटकुला सेव नहीं किया है'
                  : 'कोई परिणाम नहीं मिला'}
              </h3>
              <p className="text-xs text-slate-400 [body.light_&]:text-slate-500 mt-2">
                {isFavoritesView
                  ? 'किसी भी चुटकुले या विचार पर दिल (❤️) आइकन दबाकर उसे यहाँ सेव करें।'
                  : 'कृपया कोई अन्य शब्द लिखकर खोजें।'}
              </p>
              {isFavoritesView && (
                <button
                  onClick={() => setIsFavoritesView(false)}
                  className={`mt-4 px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r ${currentCategory.gradient}`}
                >
                  चुटकुले एक्सप्लोर करें
                </button>
              )}
            </div>
          )}

          {/* Load More Button */}
          {displayedItems.length < totalAvailableCount && (
            <div className="text-center mt-10 mb-6">
              <button
                onClick={() => setDisplayCount((prev) => prev + ITEMS_PER_PAGE)}
                className={`inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold text-white bg-gradient-to-r ${currentCategory.gradient} shadow-lg hover:opacity-95 transform hover:scale-[1.02] transition`}
              >
                <ChevronDown className="w-4 h-4" />
                <span>और लोड करें (+24 और देखें)</span>
              </button>
              <p className="text-xs text-slate-400 [body.light_&]:text-slate-500 mt-2">
                इस श्रेणी में 1000+ से अधिक चुटकुले और विचार मौजूद हैं!
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Floating Scroll to Top */}
      <button
        onClick={handleScrollToTop}
        className="fixed bottom-6 right-6 z-30 p-3 rounded-full bg-slate-800 [body.light_&]:bg-white text-white [body.light_&]:text-slate-900 border border-slate-700 [body.light_&]:border-slate-300 shadow-xl hover:scale-110 transition"
        title="Scroll to top"
      >
        <ArrowUp className="w-5 h-5" />
      </button>

      {/* Offline Status Alert */}
      <OfflineIndicator />

      {/* Card Image Creator Modal */}
      {activeCardItem && (
        <CardImageModal
          item={activeCardItem.item}
          category={
            CATEGORIES.find((c) => c.id === activeCardItem.categoryId) || currentCategory
          }
          onRequestRewardedAd={(onSuccess) => showRewarded(onSuccess)}
          onClose={() => setActiveCardItem(null)}
        />
      )}



      {/* 5-Star Rating Modal */}
      {showRatingModal && (
        <RatingModal onClose={() => setShowRatingModal(false)} />
      )}

      {/* Daily Notifications Modal */}
      {showNotificationModal && (
        <NotificationModal
          settings={notifSettings}
          permission={notifPermission}
          onSave={saveNotifSettings}
          onRequestPermission={requestNotifPermission}
          onClose={() => setShowNotificationModal(false)}
        />
      )}

      {/* In-App Notification Alert Toast */}
      {inAppAlert && (
        <div className="fixed top-18 right-4 left-4 sm:left-auto sm:max-w-md z-50 p-4 rounded-2xl bg-gradient-to-r from-indigo-900 to-slate-900 border-2 border-indigo-500/60 shadow-2xl text-white animate-in slide-in-from-top-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <span className="text-2xl select-none">🔔</span>
              <div>
                <h4 className="font-bold text-sm text-amber-300">{inAppAlert.title}</h4>
                <p className="text-xs text-slate-200 mt-1 whitespace-pre-line leading-relaxed font-medium">
                  {inAppAlert.body}
                </p>
              </div>
            </div>
            <button
              onClick={dismissInAppAlert}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Play Store APK & GitHub Guide Modal */}
      {showPlayStoreGuide && (
        <PlayStoreGuideModal
          onClose={() => setShowPlayStoreGuide(false)}
          onOpenPrivacyPolicy={() => setShowPrivacyPolicy(true)}
        />
      )}

      {/* Privacy Policy Modal */}
      {showPrivacyPolicy && (
        <PrivacyPolicyModal onClose={() => setShowPrivacyPolicy(false)} />
      )}

      {/* Share App Modal */}
      {showShareAppModal && (
        <ShareAppModal onClose={() => setShowShareAppModal(false)} />
      )}

      {/* AdMob & AdSense Unit IDs Manager Modal */}
      {showAdSettings && (
        <AdSettingsModal
          adConfig={adConfig}
          onUpdateConfig={updateAdConfig}
          onResetToTestIds={resetToTestIds}
          onTriggerInterstitialTest={showInterstitial}
          onTriggerRewardedTest={() => showRewarded()}
          onClose={() => setShowAdSettings(false)}
        />
      )}

      {/* Fullscreen Interstitial Ad Modal */}
      {isInterstitialOpen && (
        <InterstitialAdModal
          adConfig={adConfig}
          onClose={closeInterstitial}
          onOpenSettings={() => setShowAdSettings(true)}
        />
      )}

      {/* Rewarded Video Ad Modal */}
      {isRewardedOpen && (
        <RewardedAdModal
          adConfig={adConfig}
          onClose={closeRewarded}
        />
      )}

      {/* Card Ready & 100% Guaranteed Share/Download Modal */}
      {cardReadyData && (
        <CardReadyModal
          cardData={cardReadyData}
          onClose={() => setCardReadyData(null)}
        />
      )}

      {/* Footer */}
      <footer className="mt-auto py-6 border-t border-slate-800/80 bg-slate-950/60 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 चुटकुले &amp; विचार (Chutkule &amp; Vichar) • 100% Safe &amp; Family Friendly</p>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs">
            <button
              onClick={() => setShowAdSettings(true)}
              className="text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 transition"
              title="Google AdMob Unit ID Manager"
            >
              <span>📢</span>
              <span>AdMob Ads (टेस्ट आईडी)</span>
            </button>
            <button
              onClick={() => setShowShareAppModal(true)}
              className="hover:text-indigo-400 font-semibold flex items-center gap-1 transition"
            >
              📲 ऐप शेयर करें
            </button>
            <button
              onClick={() => setShowPrivacyPolicy(true)}
              className="hover:text-amber-400 underline transition"
            >
              गोपनीयता नीति (Privacy)
            </button>
            <button
              onClick={() => setShowPlayStoreGuide(true)}
              className="hover:text-emerald-400 underline transition"
            >
              Play Store गाइड
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
