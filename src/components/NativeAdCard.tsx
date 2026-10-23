import React, { useState } from 'react';
import { ExternalLink, Star, ShieldCheck, Sparkles, Eye, Settings } from 'lucide-react';
import { AdConfig } from '../hooks/useAds';

interface NativeAdCardProps {
  adConfig: AdConfig;
  onOpenSettings?: () => void;
}

export const NativeAdCard: React.FC<NativeAdCardProps> = ({
  adConfig,
  onOpenSettings,
}) => {
  const [copied, setCopied] = useState(false);
  const isTest = adConfig.testMode;
  const currentNativeId = isTest
    ? 'ca-app-pub-3940256099942544/2247696110'
    : adConfig.nativeId || 'ca-app-pub-3940256099942544/2247696110';

  if (!adConfig.adsEnabled) return null;

  return (
    <article
      aria-label="Google AdMob Native Card"
      className="relative flex flex-col justify-between p-5 rounded-3xl bg-slate-900/90 [body.light_&]:bg-white [body.amoled_&]:bg-neutral-950 border-2 border-dashed border-indigo-500/40 shadow-xl overflow-hidden group hover:border-indigo-500/70 transition-all duration-300"
    >
      {/* Background ambient glow */}
      <div className="absolute top-0 right-0 w-36 h-36 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

      <div>
        {/* Top Header: Ad Badge & Test ID indicator */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5">
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase tracking-wider">
              {isTest ? 'Google Test Ad' : 'प्रायोजित / Ad'}
            </span>
            <span className="text-[11px] text-slate-400 font-medium">Native Advanced</span>
          </div>

          {onOpenSettings && (
            <button
              onClick={onOpenSettings}
              className="p-1 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-slate-800 transition"
              title="Ads Settings"
            >
              <Settings className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Sponsor Profile & App Details */}
        <div className="flex items-start gap-3 my-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl shadow-lg shrink-0">
            ⭐
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-sm sm:text-base text-white [body.light_&]:text-slate-900 truncate">
              Google AdMob Test App
            </h4>
            <div className="flex items-center gap-1.5 mt-0.5">
              <div className="flex text-amber-400">
                <Star className="w-3 h-3 fill-amber-400" />
                <Star className="w-3 h-3 fill-amber-400" />
                <Star className="w-3 h-3 fill-amber-400" />
                <Star className="w-3 h-3 fill-amber-400" />
                <Star className="w-3 h-3 fill-amber-400" />
              </div>
              <span className="text-[11px] text-slate-400">4.9 • फ्री ऐप</span>
            </div>
          </div>
        </div>

        {/* Body Text */}
        <p className="text-xs sm:text-sm text-slate-300 [body.light_&]:text-slate-700 leading-relaxed mt-2.5">
          "यह एक टेस्ट नेटिव विज्ञापन कार्ड है (Native Ad)। जब आप अपना वास्तविक Ad Unit ID डालेंगे, तो यहाँ आपके Google AdMob के असली विज्ञापन दिखाई देंगे।"
        </p>

        {/* Ad Unit ID snippet preview */}
        <div className="mt-3 p-2 rounded-xl bg-slate-950/70 border border-slate-800 text-[10px] font-mono text-emerald-400 truncate">
          <span className="text-slate-400 font-sans mr-1">Unit:</span>
          {currentNativeId}
        </div>
      </div>

      {/* Action Footer */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 [body.light_&]:border-slate-200 flex items-center justify-between gap-2">
        <span className="text-[11px] text-slate-400">Google Certified Ad</span>
        {onOpenSettings ? (
          <button
            onClick={onOpenSettings}
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 transition shadow-md"
          >
            आईडी कॉन्फ़िगर करें
          </button>
        ) : (
          <span className="text-xs text-indigo-400 font-medium">AdMob Ready</span>
        )}
      </div>
    </article>
  );
};
