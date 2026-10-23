import React, { useState, useEffect } from 'react';
import { X, Award, CheckCircle2, Clock, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { AdConfig } from '../hooks/useAds';

interface RewardedAdModalProps {
  adConfig: AdConfig;
  onClose: (rewardGranted: boolean) => void;
  title?: string;
  subtitle?: string;
}

export const RewardedAdModal: React.FC<RewardedAdModalProps> = ({
  adConfig,
  onClose,
  title = '🎬 वॉटरमार्क हटाने के लिए रिवॉर्ड विज्ञापन',
  subtitle = 'पूरा विज्ञापन देखकर बिना वॉटरमार्क वाली HD फोटो अनलॉक करें',
}) => {
  const [secondsRemaining, setSecondsRemaining] = useState(5);
  const [rewardReady, setRewardReady] = useState(false);

  useEffect(() => {
    if (secondsRemaining > 0) {
      const timer = setTimeout(() => {
        setSecondsRemaining((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setRewardReady(true);
      try {
        confetti({
          particleCount: 60,
          spread: 80,
          origin: { y: 0.6 },
        });
      } catch {}
    }
  }, [secondsRemaining]);

  const isTest = adConfig.testMode;
  const currentRewardedId = isTest
    ? 'ca-app-pub-3940256099942544/5224354917'
    : adConfig.rewardedId || 'ca-app-pub-3940256099942544/5224354917';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Google AdMob Rewarded Ad"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-md animate-in fade-in"
    >
      <div className="relative w-full max-w-md rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl text-slate-100 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-3.5 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500 text-slate-950 uppercase tracking-wider">
              {isTest ? 'Google Test Ad' : 'AdMob Rewarded'}
            </span>
            <span className="text-xs text-amber-300 font-semibold flex items-center gap-1">
              <Award className="w-3.5 h-3.5" />
              <span>रिवॉर्ड विज्ञापन</span>
            </span>
          </div>

          <div>
            {!rewardReady ? (
              <span className="flex items-center gap-1 text-xs text-slate-300 font-mono bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700">
                <Clock className="w-3 h-3 text-amber-400" />
                {secondsRemaining}s
              </span>
            ) : (
              <button
                onClick={() => onClose(true)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center text-3xl shadow-xl shadow-amber-500/20">
            {rewardReady ? '🎉' : '👑'}
          </div>

          <div>
            <h3 className="text-base sm:text-lg font-bold text-white">
              {title}
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              {rewardReady
                ? 'बधाई हो! वॉटरमार्क सफलतापूर्वक हटा दिया गया है!'
                : subtitle}
            </p>
          </div>

          {/* Ad Unit Details */}
          <div className="p-3 rounded-2xl bg-slate-950/90 border border-slate-800 text-left font-mono text-xs">
            <p className="text-[10px] text-slate-400 font-sans mb-0.5 flex items-center justify-between">
              <span>Google AdMob Rewarded Unit:</span>
              <span className="text-emerald-400">{isTest ? 'Test Mode' : 'Live'}</span>
            </p>
            <code className="text-emerald-400 break-all text-[11px]">{currentRewardedId}</code>
          </div>

          <button
            onClick={() => onClose(rewardReady)}
            disabled={!rewardReady}
            className={`w-full py-3 rounded-xl font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2 ${
              rewardReady
                ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/25 active:scale-95'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            {rewardReady ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>रिवॉर्ड पाएं (बिना वॉटरमार्क अनलॉक करें)</span>
              </>
            ) : (
              <span>विज्ञापन समाप्त होने की प्रतीक्षा करें ({secondsRemaining}s)</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
