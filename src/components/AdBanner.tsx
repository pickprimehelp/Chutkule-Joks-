import React, { useState } from 'react';
import { Sparkles, ExternalLink, X, Info, ShieldAlert } from 'lucide-react';
import { AdConfig } from '../hooks/useAds';

interface AdBannerProps {
  adConfig: AdConfig;
  format?: 'inline' | 'sticky';
  onOpenSettings?: () => void;
}

export const AdBanner: React.FC<AdBannerProps> = ({
  adConfig,
  format = 'inline',
  onOpenSettings,
}) => {
  const [isDismissed, setIsDismissed] = useState(false);
  const [showIdDetails, setShowIdDetails] = useState(false);

  if (!adConfig.adsEnabled || isDismissed) {
    return null;
  }

  const isTest = adConfig.testMode;
  const currentBannerId = isTest
    ? 'ca-app-pub-3940256099942544/6300978111'
    : adConfig.bannerId || 'ca-app-pub-3940256099942544/6300978111';

  if (format === 'sticky') {
    return (
      <aside
        aria-label="Google AdMob Test Banner"
        className="fixed bottom-0 left-0 right-0 z-30 p-2 bg-slate-950/95 border-t border-slate-800 shadow-2xl backdrop-blur-md animate-in slide-in-from-bottom"
      >
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500 text-slate-950">
              {isTest ? 'TEST AD' : 'AD'}
            </span>
            <span className="text-slate-300 truncate">
              {isTest
                ? 'Google AdMob टेस्ट बैनर विज्ञापन (Play Store Compliant)'
                : 'प्रायोजित विज्ञापन (Sponsored Ad)'}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {onOpenSettings && (
              <button
                onClick={onOpenSettings}
                className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px]"
              >
                Ads सेटिंग्स
              </button>
            )}
            <button
              onClick={() => setIsDismissed(true)}
              className="p-1 rounded text-slate-400 hover:text-white"
              title="Close Ad"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    );
  }

  return (
    <aside
      aria-label="Google AdMob Inline Banner"
      className="w-full my-6 p-3 sm:p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/30 shadow-lg relative overflow-hidden"
    >
      {/* Test Ad Watermark Bar */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-indigo-500/20 text-[11px]">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded-md font-bold text-[10px] bg-amber-500 text-slate-950 uppercase tracking-wider">
            {isTest ? 'Google AdMob Test Ad' : 'विज्ञापन / Ad'}
          </span>
          <span className="text-indigo-300 font-medium">
            {isTest ? 'बैनर विज्ञापन (Banner 320x50 / 728x90)' : 'Sponsored'}
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-slate-400">
          <button
            onClick={() => setShowIdDetails(!showIdDetails)}
            className="hover:text-indigo-300 transition flex items-center gap-1"
            title="Ad Unit ID info"
          >
            <Info className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-[10px]">
              {showIdDetails ? 'ID छुपाएं' : 'Unit ID देखें'}
            </span>
          </button>
          {onOpenSettings && (
            <button
              onClick={onOpenSettings}
              className="hover:text-white transition px-1.5 py-0.5 rounded text-[10px] bg-slate-800"
            >
              बदलें
            </button>
          )}
        </div>
      </div>

      {/* Details Bar if expanded */}
      {showIdDetails && (
        <div className="mb-3 p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] font-mono text-emerald-400 break-all">
          <p className="text-[10px] text-slate-400 font-sans mb-0.5">
            सक्रिय बैनर Ad Unit ID (Active Unit):
          </p>
          <code>{currentBannerId}</code>
        </div>
      )}

      {/* Banner Creative Body */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-2.5 rounded-xl bg-slate-950/50 border border-slate-800/80">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-500 to-indigo-600 flex items-center justify-center text-white text-xl shadow-md shrink-0">
            🎁
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h4 className="font-bold text-xs sm:text-sm text-white">
                Google AdMob Test Creative
              </h4>
              <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/20">
                Live Test
              </span>
            </div>
            <p className="text-[11px] text-slate-300 mt-0.5">
              यह Google की आधिकारिक टेस्ट विज्ञापन यूनिट है। अपनी रियल आईडी डालने के लिए सेटिंग्स खोलें।
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          {onOpenSettings ? (
            <button
              onClick={onOpenSettings}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-400 hover:to-indigo-500 text-white shadow-sm transition whitespace-nowrap"
            >
              आईडी बदलें
            </button>
          ) : (
            <span className="text-[10px] text-slate-400 italic">Play Store Ready</span>
          )}
        </div>
      </div>
    </aside>
  );
};
