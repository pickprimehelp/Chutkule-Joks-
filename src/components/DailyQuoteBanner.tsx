import React, { useState } from 'react';
import { Item, CategoryTheme } from '../types';
import {
  Sparkles,
  Volume2,
  VolumeX,
  Copy,
  Check,
  RefreshCw,
  Image as ImageIcon,
  Loader2,
  Award,
  Download,
} from 'lucide-react';
import { shareCardDirectly, downloadCardDirectly } from '../utils/generateCardImage';
import { CardReadyData } from './CardReadyModal';

interface DailyQuoteBannerProps {
  item: Item;
  category: CategoryTheme;
  onRefreshDaily: () => void;
  onOpenCardModal: (item: Item) => void;
  onRequestRewardedAd?: (onSuccess: () => void) => void;
  onShowCardReady?: (data: CardReadyData) => void;
}

export const DailyQuoteBanner: React.FC<DailyQuoteBannerProps> = ({
  item,
  category,
  onRefreshDaily,
  onOpenCardModal,
  onRequestRewardedAd,
  onShowCardReady,
}) => {
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSharingWithWatermark, setIsSharingWithWatermark] = useState(false);
  const [isSharingWithoutWatermark, setIsSharingWithoutWatermark] = useState(false);
  const [isDownloadingWithWatermark, setIsDownloadingWithWatermark] = useState(false);
  const [isDownloadingWithoutWatermark, setIsDownloadingWithoutWatermark] = useState(false);
  const [shareStatus, setShareStatus] = useState<string | null>(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(`${item.text}\n\n— ${item.authorOrCharacter || category.hindiName}\n📲 (चुटकुले और विचार ऐप)`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Button 1: Share WITH WATERMARK (Instant free)
  const handleShareWithWatermark = async () => {
    setIsSharingWithWatermark(true);
    setShareStatus('फोटो कार्ड तैयार हो रहा है...');
    const result = await shareCardDirectly(item, category, true);
    setIsSharingWithWatermark(false);

    if (onShowCardReady && result.dataUrl) {
      onShowCardReady({
        imageUrl: result.dataUrl,
        blob: result.blob,
        filename: result.filename,
        text: item.text,
        hasWatermark: true,
        categoryName: category.hindiName,
      });
    }

    if (result.downloadedFallback) {
      setShareStatus('✅ कार्ड तैयार! WhatsApp व डाउनलोड उपलब्ध');
    } else if (result.success) {
      setShareStatus('✅ WhatsApp पर शेयर करें!');
    }
    setTimeout(() => setShareStatus(null), 3000);
  };

  // Button 2: Download WITH WATERMARK (Instant free)
  const handleDownloadWithWatermark = async () => {
    setIsDownloadingWithWatermark(true);
    setShareStatus('वाटरमार्क सहित कार्ड डाउनलोड हो रहा है...');
    const result = await downloadCardDirectly(item, category, true);
    setIsDownloadingWithWatermark(false);

    if (onShowCardReady && result.dataUrl) {
      onShowCardReady({
        imageUrl: result.dataUrl,
        blob: result.blob,
        filename: result.filename,
        text: item.text,
        hasWatermark: true,
        categoryName: category.hindiName,
      });
    }

    if (result.success) {
      setShareStatus('✅ फोटो कार्ड गैलरी में डाउनलोड हो गया!');
    } else {
      setShareStatus('✅ फोटो कार्ड तैयार है!');
    }
    setTimeout(() => setShareStatus(null), 3500);
  };

  // Button 3: Download WITHOUT WATERMARK (Watch Rewarded Ad)
  const handleDownloadWithoutWatermark = () => {
    if (onRequestRewardedAd) {
      onRequestRewardedAd(async () => {
        setIsDownloadingWithoutWatermark(true);
        setShareStatus('बिना वॉटरमार्क HD कार्ड तैयार हो रहा है...');
        const result = await downloadCardDirectly(item, category, false);
        setIsDownloadingWithoutWatermark(false);

        if (onShowCardReady && result.dataUrl) {
          onShowCardReady({
            imageUrl: result.dataUrl,
            blob: result.blob,
            filename: result.filename,
            text: item.text,
            hasWatermark: false,
            categoryName: category.hindiName,
          });
        }

        if (result.success) {
          setShareStatus('✅ बिना वॉटरमार्क HD कार्ड डाउनलोड हो गया!');
        } else {
          setShareStatus('✅ बिना वॉटरमार्क HD कार्ड तैयार है!');
        }
        setTimeout(() => setShareStatus(null), 3500);
      });
    } else {
      handleDownloadWithWatermark();
    }
  };

  // Button 4: Share WITHOUT WATERMARK (Watch Rewarded Ad)
  const handleShareWithoutWatermark = () => {
    if (onRequestRewardedAd) {
      onRequestRewardedAd(async () => {
        setIsSharingWithoutWatermark(true);
        setShareStatus('बिना वॉटरमार्क कार्ड तैयार हो रहा है...');
        const result = await shareCardDirectly(item, category, false);
        setIsSharingWithoutWatermark(false);

        if (onShowCardReady && result.dataUrl) {
          onShowCardReady({
            imageUrl: result.dataUrl,
            blob: result.blob,
            filename: result.filename,
            text: item.text,
            hasWatermark: false,
            categoryName: category.hindiName,
          });
        }

        if (result.downloadedFallback) {
          setShareStatus('✅ HD कार्ड तैयार! WhatsApp व डाउनलोड उपलब्ध');
        } else if (result.success) {
          setShareStatus('✅ WhatsApp पर शेयर करें!');
        }
        setTimeout(() => setShareStatus(null), 3000);
      });
    } else {
      handleShareWithWatermark();
    }
  };

  const handleSpeak = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(item.text);
    utterance.lang = 'hi-IN';
    utterance.rate = 0.95;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 my-4">
      <div
        style={{
          boxShadow: `0 14px 35px -10px ${category.glowColor}`,
        }}
        className="relative overflow-hidden rounded-3xl p-5 sm:p-7 border border-slate-700/60 [body.light_&]:border-slate-200 bg-gradient-to-br from-slate-800/90 via-slate-800/70 to-slate-900 [body.light_&]:from-white [body.light_&]:via-slate-50 [body.light_&]:to-white [body.amoled_&]:from-neutral-900 [body.amoled_&]:to-black transition-all duration-300"
      >
        {/* Ambient Glow */}
        <div
          style={{ backgroundColor: category.accentHex }}
          className="absolute -right-16 -top-16 w-48 h-48 rounded-full blur-3xl opacity-20 pointer-events-none"
        />

        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide text-white bg-gradient-to-r ${category.gradient} shadow-sm`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>आज का खास {category.hindiName}</span>
            </span>
            <span className="text-xs text-slate-400 [body.light_&]:text-slate-500 font-medium">
              Daily Dose
            </span>
          </div>

          <button
            onClick={onRefreshDaily}
            className="flex items-center gap-1 text-xs text-slate-400 [body.light_&]:text-slate-600 hover:text-white [body.light_&]:hover:text-black transition active:scale-95"
            title="नया बदलें (Refresh)"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>बदलें</span>
          </button>
        </div>

        {/* Text */}
        <p className="text-base sm:text-xl font-medium leading-relaxed [body.light_&]:text-slate-800 text-white my-3 select-text">
          "{item.text}"
        </p>

        {item.authorOrCharacter && (
          <p className="text-xs sm:text-sm italic font-semibold text-amber-400 [body.light_&]:text-amber-600 mb-3">
            — {item.authorOrCharacter}
          </p>
        )}

        {/* Action buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 mt-2 border-t border-slate-700/40 [body.light_&]:border-slate-200">
          <div className="flex items-center gap-2">
            {/* Audio Listen */}
            <button
              onClick={handleSpeak}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition ${
                isSpeaking
                  ? 'bg-amber-500 text-white'
                  : 'bg-slate-700/60 [body.light_&]:bg-slate-100 text-slate-300 [body.light_&]:text-slate-700 hover:bg-slate-700'
              }`}
              title="बोलकर सुनें"
            >
              {isSpeaking ? <VolumeX className="w-3.5 h-3.5 animate-pulse" /> : <Volume2 className="w-3.5 h-3.5" />}
              <span>{isSpeaking ? 'रुकें' : 'सुनें'}</span>
            </button>

            {/* Copy */}
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-700/60 [body.light_&]:bg-slate-100 text-slate-300 [body.light_&]:text-slate-700 hover:bg-slate-700 transition"
              title="Copy text"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'कॉपी हो गया' : 'कॉपी'}</span>
            </button>

            {/* Create Image Card Customizer */}
            <button
              onClick={() => onOpenCardModal(item)}
              className="flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-indigo-500/15 text-indigo-400 [body.light_&]:text-indigo-600 border border-indigo-500/30 hover:bg-indigo-500/25 transition active:scale-95"
              title="कस्टमाइज़ रंग व स्टाइल"
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">कस्टमाइज़</span>
            </button>
          </div>

          {/* MAIN BUTTONS: WATERMARK & REWARD AD */}
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            {/* BUTTON 1: WhatsApp Card With Watermark */}
            <button
              onClick={handleShareWithWatermark}
              disabled={isSharingWithWatermark || isDownloadingWithWatermark}
              className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-[#25D366] text-white hover:bg-[#20ba59] transition shadow-md shadow-emerald-500/25 disabled:opacity-60 active:scale-95"
              title="वाटरमार्क सहित तुरंत WhatsApp पर फोटो कार्ड शेयर करें (Free)"
            >
              {isSharingWithWatermark ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <svg className="w-3.5 h-3.5 fill-current flex-shrink-0" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.05 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
              )}
              <span>WhatsApp कार्ड</span>
            </button>

            {/* BUTTON 2: Download With Watermark */}
            <button
              onClick={handleDownloadWithWatermark}
              disabled={isDownloadingWithWatermark || isSharingWithWatermark}
              className="flex items-center justify-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-700/60 [body.light_&]:bg-slate-200 text-slate-100 [body.light_&]:text-slate-800 hover:bg-slate-700 transition shadow-sm disabled:opacity-60 active:scale-95"
              title="वाटरमार्क सहित कार्ड गैलरी में डाउनलोड करें"
            >
              {isDownloadingWithWatermark ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />
              ) : (
                <Download className="w-3.5 h-3.5 text-amber-400" />
              )}
              <span>डाउनलोड</span>
            </button>

            {/* BUTTON 3: Download Without Watermark (Reward Ad) */}
            <button
              onClick={handleDownloadWithoutWatermark}
              disabled={isDownloadingWithoutWatermark || isSharingWithoutWatermark}
              className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 transition shadow-md shadow-orange-500/25 disabled:opacity-60 active:scale-95"
              title="वीडियो ऐड देखकर बिना वॉटरमार्क वाला HD फोटो कार्ड डाउनलोड करें"
            >
              {isDownloadingWithoutWatermark ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Download className="w-3.5 h-3.5" />
              )}
              <span>डाउनलोड (Ad देखें)</span>
            </button>

            {/* BUTTON 4: WhatsApp Without Watermark (Reward Ad) */}
            <button
              onClick={handleShareWithoutWatermark}
              disabled={isSharingWithoutWatermark || isDownloadingWithoutWatermark}
              className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30 hover:bg-amber-500/25 transition shadow-sm disabled:opacity-60 active:scale-95"
              title="वीडियो ऐड देखकर बिना वॉटरमार्क वाला HD कार्ड WhatsApp पर शेयर करें"
            >
              {isSharingWithoutWatermark ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Award className="w-3.5 h-3.5" />
              )}
              <span>WhatsApp (Ad देखें)</span>
            </button>
          </div>
        </div>

        {/* Live Status Toast */}
        {shareStatus && (
          <div className="mt-3 text-center py-1 px-3 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-medium animate-pulse">
            {shareStatus}
          </div>
        )}
      </div>
    </div>
  );
};
