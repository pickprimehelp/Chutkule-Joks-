import React, { useState } from 'react';
import { Capacitor } from '@capacitor/core';
import { X, Sparkles } from 'lucide-react';
import { AdConfig } from '../hooks/useAds';

interface AdBannerProps {
  adConfig: AdConfig;
  format?: 'inline' | 'sticky';
}

export const AdBanner: React.FC<AdBannerProps> = ({
  adConfig,
  format = 'inline',
}) => {
  const [isDismissed, setIsDismissed] = useState(false);

  // On native Android, AdMob native bottom banner handles banner display directly
  if (!adConfig.adsEnabled || isDismissed || Capacitor.isNativePlatform()) {
    return null;
  }

  if (format === 'sticky') {
    return (
      <aside
        aria-label="Sponsored Banner Ad"
        className="fixed bottom-0 left-0 right-0 z-30 p-2 bg-slate-950/95 border-t border-slate-800 shadow-2xl backdrop-blur-md animate-in slide-in-from-bottom"
      >
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500 text-slate-950">
              AD
            </span>
            <span className="text-slate-300 truncate">
              प्रायोजित विज्ञापन (Sponsored)
            </span>
          </div>

          <button
            onClick={() => setIsDismissed(true)}
            className="p-1 rounded text-slate-400 hover:text-white shrink-0"
            title="बंद करें"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </aside>
    );
  }

  return (
    <aside
      aria-label="Sponsored Ad"
      className="w-full my-5 p-3 sm:p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 [body.light_&]:from-slate-100 [body.light_&]:via-indigo-50 [body.light_&]:to-slate-100 border border-indigo-500/30 [body.light_&]:border-slate-200 shadow-md relative overflow-hidden"
    >
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-indigo-500/20 [body.light_&]:border-slate-200 text-[11px]">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded-md font-bold text-[10px] bg-amber-500 text-slate-950 uppercase tracking-wider">
            Ad
          </span>
          <span className="text-indigo-300 [body.light_&]:text-indigo-700 font-medium">
            प्रायोजित विज्ञापन (Sponsored)
          </span>
        </div>
        <button
          onClick={() => setIsDismissed(true)}
          className="text-slate-400 hover:text-white [body.light_&]:hover:text-slate-800 p-0.5 rounded transition"
          title="बंद करें"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-slate-950/50 [body.light_&]:bg-white border border-slate-800/80 [body.light_&]:border-slate-200">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-amber-500 to-indigo-600 flex items-center justify-center text-white text-xl shadow-md shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h4 className="font-bold text-xs sm:text-sm text-white [body.light_&]:text-slate-900 truncate">
              चुटकुले और विचार — रोज़ाना मुस्कान और सकारात्मक सोच
            </h4>
            <p className="text-[11px] text-slate-300 [body.light_&]:text-slate-600 mt-0.5 truncate">
              1000+ मजेदार जोक्स, शायरी और WhatsApp स्टेटस फोटो कार्ड बिल्कुल मुफ्त!
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};
