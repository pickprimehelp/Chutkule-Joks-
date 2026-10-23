import React, { useState, useEffect } from 'react';
import { X, Sparkles, Star, ExternalLink, ShieldCheck, Clock } from 'lucide-react';
import { AdConfig } from '../hooks/useAds';

interface InterstitialAdModalProps {
  adConfig: AdConfig;
  onClose: () => void;
  onOpenSettings?: () => void;
}

export const InterstitialAdModal: React.FC<InterstitialAdModalProps> = ({
  adConfig,
  onClose,
  onOpenSettings,
}) => {
  const [secondsRemaining, setSecondsRemaining] = useState(5);
  const [canSkip, setCanSkip] = useState(false);

  useEffect(() => {
    if (secondsRemaining > 0) {
      const timer = setTimeout(() => {
        setSecondsRemaining((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setCanSkip(true);
    }
  }, [secondsRemaining]);

  const isTest = adConfig.testMode;
  const currentInterstitialId = isTest
    ? 'ca-app-pub-3940256099942544/1033173712'
    : adConfig.interstitialId || 'ca-app-pub-3940256099942544/1033173712';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Google AdMob Interstitial Ad"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-md animate-in fade-in"
    >
      <div className="relative w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl text-slate-100 overflow-hidden flex flex-col">
        {/* Top Control Bar */}
        <div className="p-3 sm:p-4 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500 text-slate-950 uppercase tracking-wider">
              {isTest ? 'Google Test Ad' : 'विज्ञापन / Ad'}
            </span>
            <span className="text-xs text-slate-400 font-medium">फुल स्क्रीन इंटरस्टीशियल विज्ञापन</span>
          </div>

          <div className="flex items-center gap-2">
            {!canSkip ? (
              <span className="flex items-center gap-1 text-xs text-amber-400 font-mono bg-amber-500/10 px-2 py-1 rounded-lg border border-amber-500/20">
                <Clock className="w-3.5 h-3.5" />
                <span>{secondsRemaining}s बाद छोड़ें</span>
              </span>
            ) : (
              <button
                onClick={onClose}
                className="flex items-center gap-1 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition"
              >
                <span>विज्ञापन छोड़ें</span>
                <X className="w-4 h-4 ml-0.5" />
              </button>
            )}
          </div>
        </div>

        {/* Ad Body Content */}
        <div className="p-6 text-center space-y-4">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-4xl shadow-2xl shadow-indigo-500/30">
            🚀
          </div>

          <div>
            <h3 className="text-xl font-bold text-white">
              Google AdMob Interstitial Ad
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              (यह एक टेस्ट फुल स्क्रीन विज्ञापन है)
            </p>
          </div>

          <p className="text-sm text-slate-300 max-w-sm mx-auto leading-relaxed bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800">
            "जब यूज़र फोटो कार्ड शेयर करेंगे या ऐप में एक्टिविटी करेंगे, तो आपकी AdMob Interstitial Ad इसी तरह फुल स्क्रीन में प्रदर्शित होगी।"
          </p>

          {/* Unit ID Snippet */}
          <div className="p-3 rounded-2xl bg-slate-950/90 border border-slate-800 text-left font-mono text-xs">
            <div className="text-[11px] text-slate-400 font-sans mb-1 flex items-center justify-between">
              <span>सक्रिय Interstitial Ad Unit ID:</span>
              <span className="text-emerald-400 font-semibold">{isTest ? 'Test Mode' : 'Live ID'}</span>
            </div>
            <code className="text-emerald-400 break-all">{currentInterstitialId}</code>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold text-xs sm:text-sm hover:opacity-90 transition shadow-lg"
            >
              विज्ञापन बंद करें & जारी रखें
            </button>
            {onOpenSettings && (
              <button
                onClick={() => {
                  onClose();
                  onOpenSettings();
                }}
                className="px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs transition border border-slate-700"
              >
                आईडी बदलें
              </button>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-950/70 border-t border-slate-800/80 text-center text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Google Play Developer Policy Compliant • User Controlled Skip</span>
        </div>
      </div>
    </div>
  );
};
