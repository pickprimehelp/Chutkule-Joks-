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
  bannerFrequency: 6,
  interstitialFrequency: 8,
  cooldownSeconds: 180,
};

const LAST_INTERSTITIAL_KEY = 'chutkule_last_interstitial_ts';
const LAST_REWARDED_KEY = 'chutkule_last_rewarded_ts';

let sharedNativeAdFeed: NativeAdFeed | null = null;
let sharedNativeFeedPromise: Promise<NativeAdFeed | null> | null = null;

export async function getSharedNativeAdFeed(nativeAdId: string): Promise<NativeAdFeed | null> {
  if (!Capacitor.isNativePlatform()) return null;
  if (sharedNativeAdFeed) return sharedNativeAdFeed;
  if (sharedNativeFeedPromise) return sharedNativeFeedPromise;

  sharedNativeFeedPromise = (async () => {
    try {
      const feed = await NativeAdFeed.create({
        feedId: 'chutkule_main_feed',
        adId: nativeAdId,
        template: NativeAdTemplate.Medium,
        isTesting: false,
        androidScrollSnapshot: Capacitor.getPlatform() === 'android',
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

export function useAds() {
  const adConfig = ADMOB_CONFIG;

  const [isInterstitialOpen, setIsInterstitialOpen] = useState(false);
  const [isRewardedOpen, setIsRewardedOpen] = useState(false);
  const [onRewardedCallback, setOnRewardedCallback] = useState<(() => void) | null>(null);
  const [, setShareCount] = useState(0);

  const isNative = Capacitor.isNativePlatform();
  const interstitialReadyRef = useRef(false);
  const rewardedReadyRef = useRef(false);
  const initializedRef = useRef(false);

  const preloadNativeInterstitial = useCallback(async () => {
    if (!Capacitor.isNativePlatform() || !adConfig.adsEnabled) return;
    try {
      interstitialReadyRef.current = false;
      await AdMob.prepareInterstitial({
        adId: adConfig.interstitialId,
        isTesting: false,
      });
      interstitialReadyRef.current = true;
    } catch {
      interstitialReadyRef.current = false;
    }
  }, [adConfig.adsEnabled, adConfig.interstitialId]);

  const preloadNativeRewarded = useCallback(async () => {
    if (!Capacitor.isNativePlatform() || !adConfig.adsEnabled) return;
    try {
      rewardedReadyRef.current = false;
      await AdMob.prepareRewardVideoAd({
        adId: adConfig.rewardedId,
        isTesting: false,
      });
      rewardedReadyRef.current = true;
    } catch {
      rewardedReadyRef.current = false;
    }
  }, [adConfig.adsEnabled, adConfig.rewardedId]);

  // Initialize Native Google AdMob SDK on Android
  useEffect(() => {
    if (!isNative || !adConfig.adsEnabled || initializedRef.current) return;
    initializedRef.current = true;

    const initAdMob = async () => {
      try {
        await AdMob.initialize({
          initializeForTesting: false,
        });

        // 1. Show Adaptive Bottom Banner Ad
        await AdMob.showBanner({
          adId: adConfig.bannerId,
          adSize: BannerAdSize.ADAPTIVE_BANNER,
          position: BannerAdPosition.BOTTOM_CENTER,
          isTesting: false,
        });

        // 2. Listen for Interstitial Dismiss to preload next
        await AdMob.addListener(InterstitialAdPluginEvents.Dismissed, () => {
          interstitialReadyRef.current = false;
          preloadNativeInterstitial();
        });

        // 3. Preload Interstitial & Rewarded Ads
        preloadNativeInterstitial();
        preloadNativeRewarded();
      } catch (err) {
        console.warn('AdMob native init warning:', err);
      }
    };

    initAdMob();
  }, [isNative, adConfig.adsEnabled, adConfig.bannerId, preloadNativeInterstitial, preloadNativeRewarded]);

  /**
   * Safe Interstitial Trigger with Frequency Capping & Cooldown Protection
   */
  const showInterstitial = useCallback(
    async (force: boolean = false) => {
      if (!adConfig.adsEnabled) return false;

      const now = Date.now();
      const cooldownMs = (adConfig.cooldownSeconds || 180) * 1000;

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
        if (now - lastRewarded < 240000) return false;
      }

      try {
        localStorage.setItem(LAST_INTERSTITIAL_KEY, String(now));
      } catch {
        // ignore
      }

      if (Capacitor.isNativePlatform()) {
        try {
          if (!interstitialReadyRef.current) {
            await preloadNativeInterstitial();
          }
          if (interstitialReadyRef.current) {
            await AdMob.showInterstitial();
            interstitialReadyRef.current = false;
            return true;
          }
        } catch {
          // Fallback to web interstitial modal below
        }
      }

      setIsInterstitialOpen(true);
      return true;
    },
    [adConfig.adsEnabled, adConfig.cooldownSeconds, preloadNativeInterstitial]
  );

  /**
   * Action tracker (called on share/download)
   */
  const trackShareAction = useCallback(() => {
    setShareCount((prev) => {
      const next = prev + 1;
      const freq = Math.max(adConfig.interstitialFrequency || 8, 6);

      if (adConfig.adsEnabled && next % freq === 0) {
        setTimeout(() => {
          showInterstitial(false);
        }, 1200);
      }
      return next;
    });
  }, [adConfig.adsEnabled, adConfig.interstitialFrequency, showInterstitial]);

  /**
   * Trigger Rewarded Ad (per-action basis: watches video ad to unlock that single clean export)
   */
  const showRewarded = useCallback(
    async (onRewardSuccess?: () => void) => {
      if (!adConfig.adsEnabled) {
        if (onRewardSuccess) onRewardSuccess();
        return;
      }

      if (Capacitor.isNativePlatform()) {
        try {
          if (!rewardedReadyRef.current) {
            await preloadNativeRewarded();
          }

          if (rewardedReadyRef.current) {
            let earned = false;
            const rewardHandle = await AdMob.addListener(RewardAdPluginEvents.Rewarded, () => {
              earned = true;
            });
            const dismissHandle = await AdMob.addListener(RewardAdPluginEvents.Dismissed, () => {
              rewardHandle.remove();
              dismissHandle.remove();
              rewardedReadyRef.current = false;
              preloadNativeRewarded();

              if (earned) {
                try {
                  localStorage.setItem(LAST_REWARDED_KEY, String(Date.now()));
                } catch {}
                if (onRewardSuccess) onRewardSuccess();
              }
            });

            const rewardItem = await AdMob.showRewardVideoAd();
            if (rewardItem) {
              earned = true;
            }
            return;
          }
        } catch {
          // Fallback to web rewarded modal if native video failed to load
        }
      }

      if (onRewardSuccess) {
        setOnRewardedCallback(() => onRewardSuccess);
      }
      setIsRewardedOpen(true);
    },
    [adConfig.adsEnabled, preloadNativeRewarded]
  );

  const closeInterstitial = useCallback(() => {
    setIsInterstitialOpen(false);
  }, []);

  const closeRewarded = useCallback(
    (rewardGranted: boolean) => {
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

  return {
    adConfig,
    isInterstitialOpen,
    isRewardedOpen,
    showInterstitial,
    showRewarded,
    closeInterstitial,
    closeRewarded,
    trackShareAction,
  };
}
