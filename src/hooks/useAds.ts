import { useState, useCallback } from 'react';

export interface AdConfig {
  testMode: boolean; // default true for testing
  adsEnabled: boolean;
  appId: string;
  bannerId: string;
  interstitialId: string;
  nativeId: string;
  rewardedId: string;
  bannerFrequency: number; // Every N items
  interstitialFrequency: number; // Every N card shares (safe default: 8)
  cooldownSeconds: number; // Minimum seconds between interstitial ads (default: 180s / 3 min)
}

// Google AdMob Official Test IDs for Android:
// https://developers.google.com/admob/android/test-ads
export const GOOGLE_ADMOB_TEST_IDS: AdConfig = {
  testMode: true,
  adsEnabled: true,
  appId: 'ca-app-pub-3940256099942544~3347511713',
  bannerId: 'ca-app-pub-3940256099942544/6300978111',
  interstitialId: 'ca-app-pub-3940256099942544/1033173712',
  nativeId: 'ca-app-pub-3940256099942544/2247696110',
  rewardedId: 'ca-app-pub-3940256099942544/5224354917',
  bannerFrequency: 6,
  interstitialFrequency: 8, // Safe frequency: every 8 shares (never rapid-fire)
  cooldownSeconds: 180, // 3 minutes minimum interval to protect AdMob account
};

const STORAGE_KEY = 'chutkule_vichar_ad_config_v2';
const LAST_INTERSTITIAL_KEY = 'chutkule_last_interstitial_ts';
const LAST_REWARDED_KEY = 'chutkule_last_rewarded_ts';

export function useAds() {
  const [adConfig, setAdConfig] = useState<AdConfig>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return { ...GOOGLE_ADMOB_TEST_IDS, ...JSON.parse(stored) };
      }
    } catch {
      // ignore
    }
    return GOOGLE_ADMOB_TEST_IDS;
  });

  const [isInterstitialOpen, setIsInterstitialOpen] = useState(false);
  const [isRewardedOpen, setIsRewardedOpen] = useState(false);
  const [onRewardedCallback, setOnRewardedCallback] = useState<(() => void) | null>(null);
  const [shareCount, setShareCount] = useState(0);

  // Persist settings
  const updateAdConfig = useCallback((newConfig: Partial<AdConfig>) => {
    setAdConfig((prev) => {
      const updated = { ...prev, ...newConfig };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  }, []);

  const resetToTestIds = useCallback(() => {
    setAdConfig(GOOGLE_ADMOB_TEST_IDS);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(GOOGLE_ADMOB_TEST_IDS));
    } catch {
      // ignore
    }
  }, []);

  /**
   * Safe Interstitial Trigger with Strict Frequency Capping & Cooldown Protection
   * To prevent AdMob account suspension, interstitials will NEVER show:
   * 1. More frequently than adConfig.cooldownSeconds (default 180 seconds / 3 min)
   * 2. Within 4 minutes after watching a Rewarded Ad
   */
  const showInterstitial = useCallback((force: boolean = false) => {
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
      // Strict AdMob Safety Checks:
      // 1. Is cooldown period still active?
      if (now - lastShown < cooldownMs) {
        const remaining = Math.ceil((cooldownMs - (now - lastShown)) / 1000);
        console.log(`[AdMob Safety Shield] Interstitial skipped. Cooldown remaining: ${remaining}s`);
        return false;
      }

      // 2. Was a rewarded ad watched recently? (at least 4 min gap)
      if (now - lastRewarded < 240000) {
        console.log('[AdMob Safety Shield] Interstitial skipped: Rewarded ad recently watched.');
        return false;
      }
    }

    // Record timestamp and show
    try {
      localStorage.setItem(LAST_INTERSTITIAL_KEY, String(now));
    } catch {
      // ignore
    }
    setIsInterstitialOpen(true);
    return true;
  }, [adConfig.adsEnabled, adConfig.cooldownSeconds]);

  /**
   * Action tracker (called on share/download).
   * Ensures interstitials only pop up after sufficient organic activity AND after cooldown has passed.
   */
  const trackShareAction = useCallback(() => {
    setShareCount((prev) => {
      const next = prev + 1;
      const freq = Math.max(adConfig.interstitialFrequency || 8, 6);

      if (adConfig.adsEnabled && next % freq === 0) {
        // Attempt to show interstitial safely (checks 3-min cooldown)
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
  const showRewarded = useCallback((onRewardSuccess?: () => void) => {
    if (!adConfig.adsEnabled) {
      if (onRewardSuccess) onRewardSuccess();
      return;
    }
    if (onRewardSuccess) {
      setOnRewardedCallback(() => onRewardSuccess);
    }
    setIsRewardedOpen(true);
  }, [adConfig.adsEnabled]);

  const closeInterstitial = useCallback(() => {
    setIsInterstitialOpen(false);
  }, []);

  const closeRewarded = useCallback((rewardGranted: boolean) => {
    setIsRewardedOpen(false);
    if (rewardGranted) {
      // Record rewarded ad completion timestamp for interstitial cooldown
      const now = Date.now();
      try {
        localStorage.setItem(LAST_REWARDED_KEY, String(now));
      } catch {
        // ignore
      }

      // Execute single reward action
      if (onRewardedCallback) {
        onRewardedCallback();
        setOnRewardedCallback(null);
      }
    } else {
      setOnRewardedCallback(null);
    }
  }, [onRewardedCallback]);

  return {
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
  };
}
