import React, { useState } from 'react';
import { Item, CategoryTheme } from '../types';
import {
  Heart,
  Share2,
  Copy,
  Check,
  Volume2,
  VolumeX,
  Sparkles,
  ThumbsUp,
  Loader2,
  Palette,
  Award,
  Download,
} from 'lucide-react';
import { shareCardDirectly, downloadCardDirectly } from '../utils/generateCardImage';
import { CardReadyData } from './CardReadyModal';

interface JokeCardProps {
  item: Item;
  category: CategoryTheme;
  isFav: boolean;
  onToggleFavorite: (item: Item) => void;
  onOpenCardModal: (item: Item) => void;
  onRequestRewardedAd?: (onSuccess: () => void) => void;
  onShowCardReady?: (data: CardReadyData) => void;
}

export const JokeCard: React.FC<JokeCardProps> = ({
  item,
  category,
  isFav,
  onToggleFavorite,
  onOpenCardModal,
  onRequestRewardedAd,
  onShowCardReady,
}) => {
  const [likes, setLikes] = useState(item.likes);
  const [hasLiked, setHasLiked] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSharingWithWatermark, setIsSharingWithWatermark] = useState(false);
  const [isSharingWithoutWatermark, setIsSharingWithoutWatermark] = useState(false);
  const [isDownloadingWithWatermark, setIsDownloadingWithWatermark] = useState(false);
  const [isDownloadingWithoutWatermark, setIsDownloadingWithoutWatermark] = useState(false);
  const [shareStatus, setShareStatus] = useState<string | null>(null);

  const handleLike = () => {
    if (!hasLiked) {
      setLikes((prev) => prev + 1);
      setHasLiked(true);
    } else {
      setLikes((prev) => prev - 1);
      setHasLiked(false);
    }
  };

  const handleCopy = () => {
    const textToCopy = `${item.text}\n\n— ${item.authorOrCharacter || category.hindiName}\n📲 (चुटकुले और विचार ऐप)`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // 1. WhatsApp Share WITH WATERMARK (Instant Free)
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

  // 2. Direct Download WITH WATERMARK (Instant Free to Gallery)
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

  // 3. Direct Download WITHOUT WATERMARK (Watch Rewarded Ad -> Download Clean HD Card)
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

  // 4. WhatsApp Share WITHOUT WATERMARK (Watch Rewarded Ad -> Share Clean HD Card)
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
    <div
      style={{
        borderColor: isFav ? category.accentHex : undefined,
      }}
      className="group relative flex flex-col justify-between rounded-3xl p-5 transition-all duration-300 border bg-slate-800/60 [body.light_&]:bg-white [body.amoled_&]:bg-neutral-900/90 border-slate-700/60 [body.light_&]:border-slate-200/90 hover:shadow-2xl hover:-translate-y-1 backdrop-blur-sm"
    >
      {/* Top Header: Category Tag & Favorite Heart */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-sm ${category.badgeBg}`}>
            {category.icon} {category.hindiName}
          </span>
          {item.authorOrCharacter && (
            <span className="text-[11px] text-slate-400 [body.light_&]:text-slate-500 font-medium truncate max-w-[140px]">
              {item.authorOrCharacter}
            </span>
          )}
        </div>

        <button
          onClick={() => onToggleFavorite(item)}
          className={`p-2 rounded-2xl transition-all active:scale-90 ${
            isFav
              ? 'text-rose-500 bg-rose-500/15 ring-1 ring-rose-500/30'
              : 'text-slate-400 hover:text-rose-500 hover:bg-slate-700/50 [body.light_&]:hover:bg-slate-100'
          }`}
          title={isFav ? 'पसंदीदा से हटाएं' : 'पसंदीदा में जोड़ें'}
        >
          <Heart className={`w-4 h-4 transition-transform ${isFav ? 'fill-rose-500 scale-110' : ''}`} />
        </button>
      </div>

      {/* Main Joke / Quote Text */}
      <div className="my-2 flex-grow">
        <p className="text-sm sm:text-base leading-relaxed [body.light_&]:text-slate-800 text-slate-100 whitespace-pre-line font-medium selection:bg-amber-500 selection:text-white">
          {item.text}
        </p>
      </div>

      {/* Tags */}
      {item.tags && item.tags.length > 0 && (
        <div className="flex items-center gap-1.5 flex-wrap my-2">
          {item.tags.map((tag, i) => (
            <span
              key={i}
              className="text-[10px] text-slate-400 [body.light_&]:text-slate-500 font-medium bg-slate-700/30 [body.light_&]:bg-slate-100 px-2 py-0.5 rounded-lg"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* 4 CARD ACTION BUTTONS: WATERMARK & WITHOUT WATERMARK (DOWNLOAD + SHARE) */}
      <div className="mt-3 mb-2 p-2.5 rounded-2xl bg-gradient-to-r from-slate-900/90 via-slate-800/80 to-slate-900/90 [body.light_&]:from-slate-100/90 [body.light_&]:to-slate-50 border border-slate-700/60 [body.light_&]:border-slate-200 space-y-2">
        {/* ROW 1: Free Instant Actions (With Watermark) */}
        <div>
          <div className="flex items-center justify-between text-[10px] font-semibold text-slate-400 [body.light_&]:text-slate-500 mb-1 px-1">
            <span className="flex items-center gap-1 text-emerald-400">
              <Sparkles className="w-3 h-3" />
              <span>वाटरमार्क सहित (Free)</span>
            </span>
            <span className="text-[10px] text-slate-500">1-टैप</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {/* BUTTON 1: WhatsApp Status WITH WATERMARK (Instant Free) */}
            <button
              onClick={handleShareWithWatermark}
              disabled={isSharingWithWatermark || isDownloadingWithWatermark}
              className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-extrabold bg-[#25D366] text-white hover:bg-[#20ba59] active:scale-95 transition-all shadow-md shadow-emerald-500/20 disabled:opacity-50"
              title="वाटरमार्क सहित तुरंत WhatsApp पर शेयर करें (Free)"
            >
              {isSharingWithWatermark ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <svg className="w-3.5 h-3.5 fill-current flex-shrink-0" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.05 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
              )}
              <span className="truncate">WhatsApp कार्ड</span>
            </button>

            {/* BUTTON 2: Download Card WITH WATERMARK (Instant Free to Gallery) */}
            <button
              onClick={handleDownloadWithWatermark}
              disabled={isDownloadingWithWatermark || isSharingWithWatermark}
              className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-bold bg-slate-800 [body.light_&]:bg-slate-200 text-slate-100 [body.light_&]:text-slate-800 hover:bg-slate-700 [body.light_&]:hover:bg-slate-300 active:scale-95 transition-all shadow-sm border border-slate-600/50 [body.light_&]:border-slate-300 disabled:opacity-50"
              title="गैलरी में फोटो कार्ड डाउनलोड करें (वॉटरमार्क सहित)"
            >
              {isDownloadingWithWatermark ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />
              ) : (
                <Download className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
              )}
              <span className="truncate">कार्ड डाउनलोड</span>
            </button>
          </div>
        </div>

        {/* ROW 2: Rewarded Ad Unlocked Actions (Without Watermark) */}
        <div className="pt-1.5 border-t border-slate-800 [body.light_&]:border-slate-200">
          <div className="flex items-center justify-between text-[10px] font-semibold text-slate-400 [body.light_&]:text-slate-500 mb-1 px-1">
            <span className="flex items-center gap-1 text-amber-400">
              <Award className="w-3 h-3" />
              <span>बिना वॉटरमार्क (Reward Ad देखें)</span>
            </span>
            <span className="text-[10px] text-amber-400/90 font-bold">HD Clean</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {/* BUTTON 3: Download Card WITHOUT WATERMARK (Watch Ad) */}
            <button
              onClick={handleDownloadWithoutWatermark}
              disabled={isDownloadingWithoutWatermark || isSharingWithoutWatermark}
              className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-extrabold bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 active:scale-95 transition-all shadow-md shadow-orange-500/25 disabled:opacity-50"
              title="वीडियो ऐड देखकर बिना वॉटरमार्क HD फोटो कार्ड डाउनलोड करें"
            >
              {isDownloadingWithoutWatermark ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Download className="w-3.5 h-3.5 flex-shrink-0" />
              )}
              <span className="truncate">डाउनलोड (Ad देखें)</span>
            </button>

            {/* BUTTON 4: Share Card WITHOUT WATERMARK (Watch Ad) */}
            <button
              onClick={handleShareWithoutWatermark}
              disabled={isSharingWithoutWatermark || isDownloadingWithoutWatermark}
              className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30 hover:bg-amber-500/25 active:scale-95 transition-all shadow-sm disabled:opacity-50"
              title="वीडियो ऐड देखकर बिना वॉटरमार्क HD कार्ड सीधे WhatsApp पर शेयर करें"
            >
              {isSharingWithoutWatermark ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Award className="w-3.5 h-3.5 flex-shrink-0" />
              )}
              <span className="truncate">WhatsApp (Ad देखें)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Floating Status Notification */}
      {shareStatus && (
        <div className="text-center py-1.5 px-3 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-medium my-1 animate-pulse">
          {shareStatus}
        </div>
      )}

      {/* Secondary Bottom Toolbar: Likes, Speech, Copy & Designer Modal */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-700/40 [body.light_&]:border-slate-200 text-slate-400">
        <div className="flex items-center gap-1">
          {/* Like */}
          <button
            onClick={handleLike}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-medium transition active:scale-90 ${
              hasLiked
                ? 'text-amber-400 bg-amber-400/15'
                : 'hover:text-slate-200 [body.light_&]:hover:text-slate-800 hover:bg-slate-700/40'
            }`}
            title="पसंद करें"
          >
            <ThumbsUp className={`w-3.5 h-3.5 ${hasLiked ? 'fill-amber-400' : ''}`} />
            <span>{likes}</span>
          </button>

          {/* Text-to-Speech Hindi Voice */}
          <button
            onClick={handleSpeak}
            className={`p-1.5 rounded-xl transition ${
              isSpeaking
                ? 'text-amber-400 bg-amber-400/15 animate-pulse'
                : 'hover:text-slate-200 [body.light_&]:hover:text-slate-800 hover:bg-slate-700/40'
            }`}
            title={isSpeaking ? 'रुकें' : 'हिंदी आवाज़ में सुनें'}
          >
            {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>

          {/* Copy Plain Text */}
          <button
            onClick={handleCopy}
            className="p-1.5 rounded-xl hover:text-slate-200 [body.light_&]:hover:text-slate-800 hover:bg-slate-700/40 transition active:scale-90"
            title="टेक्स्ट कॉपी करें"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Custom Card Style Designer */}
        <button
          onClick={() => onOpenCardModal(item)}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-medium text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10 transition active:scale-95"
          title="कस्टमाइज़ रंग व बैकग्राउंड"
        >
          <Palette className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">कस्टमाइज़</span>
        </button>
      </div>
    </div>
  );
};
