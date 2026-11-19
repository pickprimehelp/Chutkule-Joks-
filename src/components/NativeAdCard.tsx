import React, { useEffect, useRef, useState } from 'react';
import { Capacitor } from '@capacitor/core';
import { Star, Sparkles } from 'lucide-react';
import {
  AdConfig,
  NativeSlotStatus,
  getSharedNativeAdFeed,
  subscribeNativeSlotStatus,
} from '../hooks/useAds';

interface NativeAdCardProps {
  adConfig: AdConfig;
  slotKey?: string;
}

export const NativeAdCard: React.FC<NativeAdCardProps> = ({
  adConfig,
  slotKey = 'native_slot_default',
}) => {
  const nativeContainerRef = useRef<HTMLDivElement | null>(null);
  const [slotStatus, setSlotStatus] = useState<NativeSlotStatus>('loading');
  const [permanentlyFailed, setPermanentlyFailed] = useState(false);
  const retryCountRef = useRef(0);
  const isNative = Capacitor.isNativePlatform();

  useEffect(() => {
    if (!isNative || !adConfig.adsEnabled) return;

    let mounted = true;
    let retryTimer: ReturnType<typeof setTimeout> | null = null;
    retryCountRef.current = 0;
    setPermanentlyFailed(false);

    const unsubscribe = subscribeNativeSlotStatus(slotKey, (status) => {
      if (!mounted) return;
      setSlotStatus(status);

      if (status === 'loaded') {
        retryCountRef.current = 0;
        setPermanentlyFailed(false);
        return;
      }

      if (status === 'failed') {
        if (retryCountRef.current < 2) {
          const attempt = retryCountRef.current;
          retryCountRef.current += 1;
          const delayMs = attempt === 0 ? 5000 : 15000;
          retryTimer = setTimeout(() => {
            if (!mounted) return;
            setSlotStatus('loading');
            getSharedNativeAdFeed(adConfig.nativeId).then((feed) => {
              if (!mounted || !feed) return;
              feed.reload(slotKey).catch(() => {
                if (mounted && retryCountRef.current >= 2) {
                  setPermanentlyFailed(true);
                }
              });
            });
          }, delayMs);
        } else {
          setPermanentlyFailed(true);
        }
      }
    });

    const el = nativeContainerRef.current;
    if (el) {
      getSharedNativeAdFeed(adConfig.nativeId).then((feed) => {
        if (!mounted || !feed || !el) return;
        try {
          feed.attach(slotKey, el);
        } catch (err) {
          console.warn('NativeAdCard attach failed:', err);
          setPermanentlyFailed(true);
        }
      });
    }

    return () => {
      mounted = false;
      if (retryTimer) clearTimeout(retryTimer);
      unsubscribe();
      if (el) {
        getSharedNativeAdFeed(adConfig.nativeId).then((feed) => {
          if (feed && el) {
            try {
              feed.detach(el);
            } catch {
              // ignore
            }
          }
        });
      }
    };
  }, [isNative, adConfig.adsEnabled, adConfig.nativeId, slotKey]);

  if (!adConfig.adsEnabled) return null;

  if (isNative) {
    if (permanentlyFailed && slotStatus === 'failed') {
      return null;
    }

    return (
      <article
        aria-label="Sponsored Native Ad"
        className="relative my-2 flex flex-col justify-between p-4 rounded-3xl bg-slate-900/95 [body.light_&]:bg-white [body.amoled_&]:bg-neutral-950 border-2 border-amber-500/30 [body.light_&]:border-amber-300/70 shadow-xl"
      >
        <div className="flex items-center justify-between gap-2 mb-3 pb-2 border-b border-slate-800/80 [body.light_&]:border-slate-200 px-1">
          <div className="flex items-center gap-1.5">
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500 text-slate-950 uppercase tracking-wider">
              Ad
            </span>
            <span className="text-[11px] text-slate-400 font-medium">प्रायोजित विज्ञापन</span>
          </div>
          <span className="text-[10px] text-slate-500">Sponsored</span>
        </div>

        {/* NativeAdTemplate.Medium requires minimum 300px height and >=144px width */}
        <div className="relative w-full" style={{ width: '100%', height: '320px', minHeight: '320px' }}>
          <div
            ref={nativeContainerRef}
            className="w-full rounded-2xl"
            style={{ width: '100%', height: '320px', minHeight: '320px' }}
          />

          {slotStatus !== 'loaded' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-5 text-center pointer-events-none rounded-2xl bg-slate-950/60">
              <Sparkles className="w-6 h-6 text-amber-400 mb-2 animate-pulse" />
              <p className="text-xs text-slate-400">प्रायोजित विज्ञापन लोड हो रहा है...</p>
            </div>
          )}
        </div>
      </article>
    );
  }

  return (
    <article
      aria-label="Sponsored Ad"
      className="relative flex flex-col justify-between p-5 rounded-3xl bg-slate-900/90 [body.light_&]:bg-white [body.amoled_&]:bg-neutral-950 border border-indigo-500/30 [body.light_&]:border-slate-200 shadow-xl overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-36 h-36 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5">
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/20 text-amber-300 [body.light_&]:text-amber-700 border border-amber-500/30 uppercase tracking-wider">
              Ad
            </span>
            <span className="text-[11px] text-slate-400 font-medium">प्रायोजित</span>
          </div>
        </div>

        <div className="flex items-start gap-3 my-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl shadow-lg shrink-0">
            ⭐
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-sm sm:text-base text-white [body.light_&]:text-slate-900 truncate">
              दैनिक सुविचार व HD स्टेटस कार्ड
            </h4>
            <div className="flex items-center gap-1.5 mt-0.5">
              <div className="flex text-amber-400">
                <Star className="w-3 h-3 fill-amber-400" />
                <Star className="w-3 h-3 fill-amber-400" />
                <Star className="w-3 h-3 fill-amber-400" />
                <Star className="w-3 h-3 fill-amber-400" />
                <Star className="w-3 h-3 fill-amber-400" />
              </div>
              <span className="text-[11px] text-slate-400">4.9 • फ्री</span>
            </div>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 [body.light_&]:text-slate-700 leading-relaxed mt-2.5">
          हर दिन नए मज़ेदार चुटकुले, अनमोल विचार और खूबसूरत WhatsApp स्टेटस फोटो कार्ड अपने दोस्तों के साथ शेयर करें।
        </p>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-800/80 [body.light_&]:border-slate-200 flex items-center justify-between gap-2">
        <span className="text-[11px] text-slate-400">प्रायोजित विज्ञापन</span>
        <span className="text-xs text-indigo-400 font-semibold">Sponsored</span>
      </div>
    </article>
  );
};
