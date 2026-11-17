import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, Clock } from 'lucide-react';
import { AdConfig } from '../hooks/useAds';

interface InterstitialAdModalProps {
  adConfig: AdConfig;
  onClose: () => void;
}

export const InterstitialAdModal: React.FC<InterstitialAdModalProps> = ({
  onClose,
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

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="विज्ञापन"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-md animate-in fade-in"
    >
      <div className="relative w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl text-slate-100 overflow-hidden flex flex-col">
        {/* Top Control Bar */}
        <div className="p-3 sm:p-4 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500 text-slate-950 uppercase tracking-wider">
              विज्ञापन / Ad
            </span>
            <span className="text-xs text-slate-400 font-medium">प्रायोजित विज्ञापन</span>
          </div>

          <div className="flex items-center gap-2">
            {!canSkip ? (
              <span className="flex items-center gap-1 text-xs text-amber-400 font-mono bg-amber-500/10 px-2 py-1 rounded-lg border border-amber-500/20">
                <Clock className="w-3.5 h-3.5" />
                <span>{secondsRemaining}s</span>
              </span>
            ) : (
              <button
                onClick={onClose}
                className="flex items-center gap-1 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition"
              >
                <span>बंद करें</span>
                <X className="w-4 h-4 ml-0.5" />
              </button>
            )}
          </div>
        </div>

        {/* Ad Body Content */}
        <div className="p-6 text-center space-y-4">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-4xl shadow-2xl shadow-indigo-500/30">
            🌟
          </div>

          <div>
            <h3 className="text-xl font-bold text-white">
              चुटकुले और विचार — रोज़ नई हँसी
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              प्रायोजित विज्ञापन (Sponsored)
            </p>
          </div>

          <p className="text-sm text-slate-300 max-w-sm mx-auto leading-relaxed bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800">
            अपने दोस्तों और परिवार के साथ मज़ेदार हिंदी चुटकुले, शायरी और अनमोल विचार के रंगीन फोटो कार्ड रोज़ शेयर करें।
          </p>

          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={onClose}
              disabled={!canSkip}
              className={`px-6 py-2.5 rounded-2xl font-bold text-xs sm:text-sm transition shadow-lg ${
                canSkip
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 hover:opacity-90'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              {canSkip ? 'विज्ञापन बंद करें और जारी रखें' : `कृपया प्रतीक्षा करें (${secondsRemaining}s)`}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-950/70 border-t border-slate-800/80 text-center text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Sponsored Content</span>
        </div>
      </div>
    </div>
  );
};
