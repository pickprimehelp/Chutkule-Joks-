import { useState, useCallback, useEffect, useRef } from 'react';
import { Capacitor } from '@capacitor/core';
import {
  AdMob,
  BannerAdPosition,
  BannerAdSize,
  InterstitialAdPluginEvents,
  RewardAdPluginEvents,
  NativeAdFeed,
  NativeAdTemplate,
  NativeAdPluginEvents,
} from '@capacitor-community/admob';

export interface AdConfig {
  adsEnabled: boolean;
  appId: string;
  bannerId: string;
  interstitialId: string;
  nativeId: string;
  rewardedId: string;
  bannerFrequency: number;
  interstitialFrequency: number;
  cooldownSeconds: number;
}

export const ADMOB_CONFIG: AdConfig = {
  adsEnabled: true,
  appId: 'ca-app-pub-7584087725069099~9245908893',
  bannerId: 'ca-app-pub-7584087725069099/8644018522',
  interstitialId: 'ca-app-pub-7584087725069099/6779527659',
  nativeId: 'ca-app-pub-7584087725069099/6738318569',
  rewardedId: 'ca-app-pub-7584087725069099/2840282642',
  bannerFrequency: 16,
  interstitialFrequency: 5,
  cooldownSeconds: 120, // 2-minute policy-safe cooldown between interstitials
};

const LAST_INTERSTITIAL_KEY = 'chutkule_last_interstitial_ts';
const LAST_REWARDED_KEY = 'chutkule_last_rewarded_ts';
const DAILY_INTERSTITIAL_KEY = 'chutkule_daily_interstitial_count';

// AdMob Invalid Activity & Policy Protection Thresholds
const MAX_DAILY_INTERSTITIALS = 8;
const MIN_SESSION_AGE_MS = 15000; // Wait 15s after app open before showing interstitial
const POST_REWARD_COOLDOWN_MS = 90000; // 90s gap after rewarded ad
const RETRY_DELAYS_MS = [4000, 12000, 30000, 60000];

// Singleton AdMob initialization promise shared across Banner, Interstitial, Rewarded, and NativeAdFeed
let adMobInitPromise: Promise<boolean> | null = null;

export function ensureAdMobInitialized(): Promise<boolean> {
  if (!Capacitor.isNativePlatform()) return Promise.resolve(false);
  if (adMobInitPromise) return adMobInitPromise;

  adMobInitPromise = (async () => {
    try {
      await AdMob.initialize({
        initializeForTesting: false,
      });
      // Give Google Play Services MobileAds adapters a brief moment to settle
      await new Promise((resolve) => setTimeout(resolve, 400));
      return true;
    } catch (err) {
      console.warn('AdMob initialize error:', err);
      adMobInitPromise = null;
      return false;
    }
  })();

  return adMobInitPromise;
}

export type NativeSlotStatus = 'loading' | 'loaded' | 'failed';
type NativeSlotListener = (status: NativeSlotStatus) => void;

let sharedNativeAdFeed: NativeAdFeed | null = null;
let sharedNativeFeedPromise: Promise<NativeAdFeed | null> | null = null;
const nativeSlotStatusMap = new Map<string, NativeSlotStatus>();
const nativeSlotSubscribers = new Map<string, Set<NativeSlotListener>>();

function notifyNativeSlotSubscribers(slotKey: string, status: NativeSlotStatus) {
  nativeSlotStatusMap.set(slotKey, status);
  const subs = nativeSlotSubscribers.get(slotKey);
  if (subs) {
    subs.forEach((cb) => cb(status));
  }
}

export function subscribeNativeSlotStatus(
  slotKey: string,
  listener: NativeSlotListener
): () => void {
  let set = nativeSlotSubscribers.get(slotKey);
  if (!set) {
    set = new Set();
    nativeSlotSubscribers.set(slotKey, set);
  }
  set.add(listener);

  const existing = nativeSlotStatusMap.get(slotKey);
  if (existing) {
    listener(existing);
  }

  return () => {
    const currentSet = nativeSlotSubscribers.get(slotKey);
    if (currentSet) {
      currentSet.delete(listener);
      if (currentSet.size === 0) {
        nativeSlotSubscribers.delete(slotKey);
      }
    }
  };
}

export async function getSharedNativeAdFeed(nativeAdId: string): Promise<NativeAdFeed | null> {
  if (!Capacitor.isNativePlatform()) return null;
  if (sharedNativeAdFeed) return sharedNativeAdFeed;
  if (sharedNativeFeedPromise) return sharedNativeFeedPromise;

  sharedNativeFeedPromise = (async () => {
    try {
      const initialized = await ensureAdMobInitialized();
      if (!initialized) {
        sharedNativeFeedPromise = null;
        return null;
      }

      const feed = await NativeAdFeed.create({
        feedId: 'chutkule_main_feed',
        adId: nativeAdId,
        template: NativeAdTemplate.Medium,
        isTesting: false,
        androidScrollSnapshot: Capacitor.getPlatform() === 'android',
        style: {
          backgroundColor: '#0F172A',
          headlineColor: '#FFFFFF',
          bodyColor: '#CBD5E1',
          callToActionBackgroundColor: '#F59E0B',
          callToActionTextColor: '#09090B',
          cornerRadius: 16,
          borderColor: '#334155',
          borderWidth: 1,
        },
      });

      await feed.addListener(NativeAdPluginEvents.Loaded, (event) => {
        notifyNativeSlotSubscribers(event.slotKey, 'loaded');
      });

      await feed.addListener(NativeAdPluginEvents.FailedToLoad, (event) => {
        notifyNativeSlotSubscribers(event.slotKey, 'failed');
      });

      sharedNativeAdFeed = feed;
      return feed;
    } catch (err) {
      console.warn('NativeAdFeed init failed:', err);
      sharedNativeFeedPromise = null;
      return null;
    }
  })();

  return sharedNativeFeedPromise;
}

function getTodayDateString(): string {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

function getDailyInterstitialCount(): number {
  try {
    const raw = localStorage.getItem(DAILY_INTERSTITIAL_KEY);
    if (!raw) return 0;
    const parsed = JSON.parse(raw);
    if (parsed.date === getTodayDateString()) {
      return Number(parsed.count) || 0;
    }
  } catch {
    // ignore
  }
  return 0;
}

function incrementDailyInterstitialCount(): void {
  try {
    const current = getDailyInterstitialCount();
    localStorage.setItem(
      DAILY_INTERSTITIAL_KEY,
      JSON.stringify({ date: getTodayDateString(), count: current + 1 })
    );
  } catch {
    // ignore
  }
}

export function useAds() {
  const adConfig = ADMOB_CONFIG;

  const [isInterstitialOpen, setIsInterstitialOpen] = useState(false);
  const [isRewardedOpen, setIsRewardedOpen] = useState(false);
  const [onRewardedCallback, setOnRewardedCallback] = useState<(() => void) | null>(null);
  const [adNotice, setAdNotice] = useState<string | null>(null);
  const [, setActionCount] = useState(0);

  const isNative = Capacitor.isNativePlatform();
  const interstitialReadyRef = useRef(false);
  const rewardedReadyRef = useRef(false);
  const initializedRef = useRef(false);
  const appStartTimeRef = useRef(Date.now());
  const isShowingInterstitialRef = useRef(false);
  const isShowingRewardedRef = useRef(false);

  const interstitialPreloadRef = useRef<Promise<boolean> | null>(null);
  const rewardedPreloadRef = useRef<Promise<boolean> | null>(null);
  const interstitialRetryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rewardedRetryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const interstitialRetryCountRef = useRef(0);
  const rewardedRetryCountRef = useRef(0);
  const noticeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showNotice = useCallback((message: string) => {
    setAdNotice(message);
    if (noticeTimerRef.current) clearTimeout(noticeTimerRef.current);
    noticeTimerRef.current = setTimeout(() => {
      setAdNotice(null);
    }, 4500);
  }, []);

  const preloadNativeInterstitial = useCallback(async (): Promise<boolean> => {
    if (!Capacitor.isNativePlatform() || !adConfig.adsEnabled) return false;
    if (interstitialReadyRef.current) return true;
    if (interstitialPreloadRef.current) return interstitialPreloadRef.current;

    if (interstitialRetryTimerRef.current) {
      clearTimeout(interstitialRetryTimerRef.current);
      interstitialRetryTimerRef.current = null;
    }

    interstitialPreloadRef.current = (async () => {
      try {
        const ok = await ensureAdMobInitialized();
        if (!ok) return false;

        await AdMob.prepareInterstitial({
          adId: adConfig.interstitialId,
          isTesting: false,
        });
        interstitialReadyRef.current = true;
        interstitialRetryCountRef.current = 0;
        return true;
      } catch (err) {
        console.warn('Interstitial prepare failed:', err);
        interstitialReadyRef.current = false;
        const attempt = interstitialRetryCountRef.current;
        if (attempt < RETRY_DELAYS_MS.length) {
          interstitialRetryCountRef.current = attempt + 1;
          const delay = RETRY_DELAYS_MS[attempt];
          interstitialRetryTimerRef.current = setTimeout(() => {
            interstitialRetryTimerRef.current = null;
            void preloadNativeInterstitial();
          }, delay);
        }
        return false;
      } finally {
        interstitialPreloadRef.current = null;
      }
    })();

    return interstitialPreloadRef.current;
  }, [adConfig.adsEnabled, adConfig.interstitialId]);

  const preloadNativeRewarded = useCallback(async (): Promise<boolean> => {
    if (!Capacitor.isNativePlatform() || !adConfig.adsEnabled) return false;
    if (rewardedReadyRef.current) return true;
    if (rewardedPreloadRef.current) return rewardedPreloadRef.current;

    if (rewardedRetryTimerRef.current) {
      clearTimeout(rewardedRetryTimerRef.current);
      rewardedRetryTimerRef.current = null;
    }

    rewardedPreloadRef.current = (async () => {
      try {
        const ok = await ensureAdMobInitialized();
        if (!ok) return false;

        await AdMob.prepareRewardVideoAd({
          adId: adConfig.rewardedId,
          isTesting: false,
        });
        rewardedReadyRef.current = true;
        rewardedRetryCountRef.current = 0;
        return true;
      } catch (err) {
        console.warn('Rewarded prepare failed:', err);
        rewardedReadyRef.current = false;
        const attempt = rewardedRetryCountRef.current;
        if (attempt < RETRY_DELAYS_MS.length) {
          rewardedRetryCountRef.current = attempt + 1;
          const delay = RETRY_DELAYS_MS[attempt];
          rewardedRetryTimerRef.current = setTimeout(() => {
            rewardedRetryTimerRef.current = null;
            void preloadNativeRewarded();
          }, delay);
        }
        return false;
      } finally {
        rewardedPreloadRef.current = null;
      }
    })();

    return rewardedPreloadRef.current;
  }, [adConfig.adsEnabled, adConfig.rewardedId]);

  // Initialize Native Google AdMob SDK on Android
  useEffect(() => {
    if (!isNative || !adConfig.adsEnabled || initializedRef.current) return;
    initializedRef.current = true;

    const handles: Array<{ remove: () => Promise<void> }> = [];
    let cancelled = false;

    const initAdMob = async () => {
      try {
        const ok = await ensureAdMobInitialized();
        if (!ok || cancelled) return;

        // 1. Show Adaptive Bottom Banner Ad cleanly at bottom
        AdMob.showBanner({
          adId: adConfig.bannerId,
          adSize: BannerAdSize.ADAPTIVE_BANNER,
          position: BannerAdPosition.BOTTOM_CENTER,
          margin: 0,
          isTesting: false,
        }).catch((err) => console.warn('Banner show warning:', err));

        // 2. Interstitial Lifecycle Listeners
        const h1 = await AdMob.addListener(InterstitialAdPluginEvents.Dismissed, () => {
          isShowingInterstitialRef.current = false;
          interstitialReadyRef.current = false;
          interstitialRetryCountRef.current = 0;
          void preloadNativeInterstitial();
        });
        const h2 = await AdMob.addListener(InterstitialAdPluginEvents.FailedToShow, () => {
          isShowingInterstitialRef.current = false;
          interstitialReadyRef.current = false;
          void preloadNativeInterstitial();
        });
        const h3 = await AdMob.addListener(InterstitialAdPluginEvents.Showed, () => {
          try {
            localStorage.setItem(LAST_INTERSTITIAL_KEY, String(Date.now()));
            incrementDailyInterstitialCount();
          } catch {
            // ignore
          }
        });
        handles.push(h1, h2, h3);

        // 3. Preload Interstitial & Rewarded Ads (staggered slightly to avoid network contention)
        void preloadNativeInterstitial();
        setTimeout(() => {
          if (!cancelled) void preloadNativeRewarded();
        }, 800);
      } catch (err) {
        console.warn('AdMob native init warning:', err);
      }
    };

    initAdMob();

    return () => {
      cancelled = true;
      handles.forEach((h) => void h.remove());
    };
  }, [isNative, adConfig.adsEnabled, adConfig.bannerId, preloadNativeInterstitial, preloadNativeRewarded]);

  /**
   * Policy-Safe Interstitial Trigger:
   * - 15s initial warmup after app start
   * - 2-minute cooldown between interstitials
   * - 90s cooldown after any rewarded ad
   * - Max 8 interstitials per day to prevent invalid activity
   */
  const showInterstitial = useCallback(
    async (force: boolean = false) => {
      if (!adConfig.adsEnabled) return false;
      if (isShowingInterstitialRef.current || isShowingRewardedRef.current) return false;

      const now = Date.now();
      if (!force && now - appStartTimeRef.current < MIN_SESSION_AGE_MS) {
        return false;
      }

      if (!force && getDailyInterstitialCount() >= MAX_DAILY_INTERSTITIALS) {
        return false;
      }

      const cooldownMs = (adConfig.cooldownSeconds || 120) * 1000;
      let lastShown = 0;
      let lastRewarded = 0;
      try {
        lastShown = Number(localStorage.getItem(LAST_INTERSTITIAL_KEY) || '0');
        lastRewarded = Number(localStorage.getItem(LAST_REWARDED_KEY) || '0');
      } catch {
        // ignore
      }

      if (!force) {
        if (now - lastShown < cooldownMs) return false;
        if (now - lastRewarded < POST_REWARD_COOLDOWN_MS) return false;
      }

      if (Capacitor.isNativePlatform()) {
        isShowingInterstitialRef.current = true;
        try {
          if (!interstitialReadyRef.current) {
            await preloadNativeInterstitial();
          }
          if (interstitialReadyRef.current) {
            await AdMob.showInterstitial();
            interstitialReadyRef.current = false;
            return true;
          }
        } catch (err) {
          console.warn('Interstitial show failed:', err);
        }
        isShowingInterstitialRef.current = false;
        return false;
      }

      // Web preview fallback only
      isShowingInterstitialRef.current = true;
      try {
        localStorage.setItem(LAST_INTERSTITIAL_KEY, String(now));
        incrementDailyInterstitialCount();
      } catch {
        // ignore
      }
      setIsInterstitialOpen(true);
      return true;
    },
    [adConfig.adsEnabled, adConfig.cooldownSeconds, preloadNativeInterstitial]
  );

  /**
   * Natural User Action Tracker (category switch, card share/download, customizer open)
   */
  const trackShareAction = useCallback(() => {
    setActionCount((prev) => {
      const next = prev + 1;
      const freq = Math.max(adConfig.interstitialFrequency || 5, 4);

      if (adConfig.adsEnabled && next % freq === 0) {
        setTimeout(() => {
          void showInterstitial(false);
        }, 900);
      }
      return next;
    });
  }, [adConfig.adsEnabled, adConfig.interstitialFrequency, showInterstitial]);

  /**
   * User-Initiated Rewarded Video Ad
   */
  const showRewarded = useCallback(
    async (onRewardSuccess?: () => void) => {
      if (!adConfig.adsEnabled) {
        if (onRewardSuccess) onRewardSuccess();
        return;
      }

      if (isShowingRewardedRef.current) return;
      isShowingRewardedRef.current = true;

      if (Capacitor.isNativePlatform()) {
        let rewardHandle: { remove: () => Promise<void> } | null = null;
        let dismissHandle: { remove: () => Promise<void> } | null = null;
        let failShowHandle: { remove: () => Promise<void> } | null = null;
        let settled = false;
        let earned = false;

        const cleanupListeners = () => {
          void rewardHandle?.remove();
          void dismissHandle?.remove();
          void failShowHandle?.remove();
          rewardHandle = null;
          dismissHandle = null;
          failShowHandle = null;
        };

        const finishRewardFlow = (didEarn: boolean, failedMsg?: string) => {
          if (settled) return;
          settled = true;
          cleanupListeners();
          rewardedReadyRef.current = false;
          isShowingRewardedRef.current = false;
          rewardedRetryCountRef.current = 0;
          void preloadNativeRewarded();

          if (didEarn) {
            try {
              localStorage.setItem(LAST_REWARDED_KEY, String(Date.now()));
            } catch {
              // ignore
            }
            if (onRewardSuccess) onRewardSuccess();
          } else if (failedMsg) {
            showNotice(failedMsg);
          }
        };

        try {
          if (!rewardedReadyRef.current) {
            showNotice('🎬 वीडियो विज्ञापन लोड हो रहा है...');
            await preloadNativeRewarded();
          }

          if (!rewardedReadyRef.current) {
            isShowingRewardedRef.current = false;
            rewardedRetryCountRef.current = 0;
            void preloadNativeRewarded();
            showNotice(
              '⚠️ अभी रिवॉर्ड विज्ञापन उपलब्ध नहीं है। कृपया थोड़ी देर बाद प्रयास करें या फ्री बटन से डाउनलोड करें।'
            );
            return;
          }

          rewardHandle = await AdMob.addListener(RewardAdPluginEvents.Rewarded, () => {
            earned = true;
          });
          dismissHandle = await AdMob.addListener(RewardAdPluginEvents.Dismissed, () => {
            finishRewardFlow(
              earned,
              earned ? undefined : 'पूरा वीडियो विज्ञापन देखने पर ही बिना वॉटरमार्क कार्ड अनलॉक होगा।'
            );
          });
          failShowHandle = await AdMob.addListener(RewardAdPluginEvents.FailedToShow, () => {
            finishRewardFlow(
              false,
              '⚠️ विज्ञापन लोड नहीं हो सका। कृपया कुछ सेकंड बाद पुनः प्रयास करें।'
            );
          });

          const rewardItem = await AdMob.showRewardVideoAd();
          if (rewardItem) {
            earned = true;
          }
          return;
        } catch (err) {
          console.warn('Rewarded ad show error:', err);
          if (!settled) {
            finishRewardFlow(
              earned,
              earned
                ? undefined
                : 'पूरा वीडियो विज्ञापन देखने पर ही बिना वॉटरमार्क कार्ड अनलॉक होगा।'
            );
          }
          return;
        }
      }

      // Web preview fallback only
      if (onRewardSuccess) {
        setOnRewardedCallback(() => onRewardSuccess);
      }
      setIsRewardedOpen(true);
    },
    [adConfig.adsEnabled, preloadNativeRewarded, showNotice]
  );

  const closeInterstitial = useCallback(() => {
    isShowingInterstitialRef.current = false;
    setIsInterstitialOpen(false);
  }, []);

  const closeRewarded = useCallback(
    (rewardGranted: boolean) => {
      isShowingRewardedRef.current = false;
      setIsRewardedOpen(false);
      if (rewardGranted) {
        const now = Date.now();
        try {
          localStorage.setItem(LAST_REWARDED_KEY, String(now));
        } catch {
          // ignore
        }

        if (onRewardedCallback) {
          onRewardedCallback();
          setOnRewardedCallback(null);
        }
      } else {
        setOnRewardedCallback(null);
      }
    },
    [onRewardedCallback]
  );

  const dismissAdNotice = useCallback(() => {
    setAdNotice(null);
  }, []);

  return {
    adConfig,
    isInterstitialOpen,
    isRewardedOpen,
    adNotice,
    dismissAdNotice,
    showInterstitial,
    showRewarded,
    closeInterstitial,
    closeRewarded,
    trackShareAction,
  };
}
