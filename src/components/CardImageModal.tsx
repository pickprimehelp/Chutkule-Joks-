import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Item, CategoryTheme } from '../types';
import {
  X,
  Download,
  Share2,
  Sparkles,
  Check,
  Type,
  Palette,
  Layers,
  Smile,
  Award,
  CheckCircle2,
} from 'lucide-react';
import { shareImageToWhatsApp, downloadImageBlob, dataUrlToBlob } from '../utils/shareUtils';

interface CardImageModalProps {
  item: Item;
  category: CategoryTheme;
  onClose: () => void;
  onRequestRewardedAd?: (onSuccess: () => void) => void;
  isWatermarkUnlocked?: boolean;
}

type AspectRatio = 'story' | 'square' | 'portrait';

interface CardThemeOption {
  id: string;
  name: string;
  gradient: [string, string, string];
  textColor: string;
  quoteColor: string;
  borderGlow: string;
}

const CARD_THEMES: CardThemeOption[] = [
  {
    id: 'category',
    name: '🎨 कैटेगरी रंग (Dynamic)',
    gradient: ['#FF512F', '#F09819', '#E11D48'],
    textColor: '#FFFFFF',
    quoteColor: '#FFE082',
    borderGlow: 'rgba(255, 255, 255, 0.45)',
  },
  {
    id: 'royal_gold',
    name: '👑 शाही गोल्ड (Royal Gold)',
    gradient: ['#78350F', '#B45309', '#F59E0B'],
    textColor: '#FFFFFF',
    quoteColor: '#FEF08A',
    borderGlow: 'rgba(254, 240, 138, 0.5)',
  },
  {
    id: 'sunset',
    name: '🌅 अंगार सनसेट (Sunset Flame)',
    gradient: ['#E11D48', '#F97316', '#FBBF24'],
    textColor: '#FFFFFF',
    quoteColor: '#FEF3C7',
    borderGlow: 'rgba(251, 191, 36, 0.5)',
  },
  {
    id: 'rose_romantic',
    name: '💖 रोमांटिक रोज़ (Rose Pink)',
    gradient: ['#831843', '#BE185D', '#FB7185'],
    textColor: '#FFFFFF',
    quoteColor: '#FFF1F2',
    borderGlow: 'rgba(251, 113, 133, 0.5)',
  },
  {
    id: 'emerald',
    name: '🌿 एमराल्ड ग्रीन (Emerald Glow)',
    gradient: ['#064E3B', '#059669', '#10B981'],
    textColor: '#FFFFFF',
    quoteColor: '#D1FAE5',
    borderGlow: 'rgba(16, 185, 129, 0.5)',
  },
  {
    id: 'ocean',
    name: '🌊 गहरा सागर (Ocean Blue)',
    gradient: ['#0C4A6E', '#0284C7', '#38BDF8'],
    textColor: '#FFFFFF',
    quoteColor: '#E0F2FE',
    borderGlow: 'rgba(56, 189, 248, 0.5)',
  },
  {
    id: 'royal_violet',
    name: '🔮 रॉयल पर्पल (Violet Magic)',
    gradient: ['#4C1D95', '#7C3AED', '#C084FC'],
    textColor: '#FFFFFF',
    quoteColor: '#F3E8FF',
    borderGlow: 'rgba(192, 132, 252, 0.5)',
  },
  {
    id: 'amoled_neon',
    name: '🖤 अमोलेड नियॉन (Dark Neon)',
    gradient: ['#09090B', '#18181B', '#27272A'],
    textColor: '#F4F4F5',
    quoteColor: '#38BDF8',
    borderGlow: 'rgba(56, 189, 248, 0.6)',
  },
];

const EMOJI_STICKERS = ['😂', '🤣', '💖', '🔥', '🙏', '✨', '👏', '💯', '🌸', '😎'];

export const CardImageModal: React.FC<CardImageModalProps> = ({
  item,
  category,
  onClose,
  onRequestRewardedAd,
  isWatermarkUnlocked = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('story');
  const [selectedThemeId, setSelectedThemeId] = useState<string>('category');
  const [hasUnlockedWatermark, setHasUnlockedWatermark] = useState<boolean>(isWatermarkUnlocked);
  const [fontSize, setFontSize] = useState<number>(38);
  const [selectedEmoji, setSelectedEmoji] = useState<string>('😂');
  const [isExporting, setIsExporting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const activeTheme =
    CARD_THEMES.find((t) => t.id === selectedThemeId) || CARD_THEMES[0];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Watermark removal via Rewarded Ad
  const handleUnlockWatermarkWithAd = (callbackAfterUnlock?: () => void) => {
    if (onRequestRewardedAd) {
      onRequestRewardedAd(() => {
        setHasUnlockedWatermark(true);
        showToast('🎉 बधाई हो! वॉटरमार्क हट गया है!');
        if (callbackAfterUnlock) {
          setTimeout(callbackAfterUnlock, 400);
        }
      });
    } else {
      setHasUnlockedWatermark(true);
      showToast('🎉 वॉटरमार्क हट गया है!');
      if (callbackAfterUnlock) {
        setTimeout(callbackAfterUnlock, 400);
      }
    }
  };

  const drawCard = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 1080;
    let height = 1920; // 9:16
    if (aspectRatio === 'square') {
      height = 1080; // 1:1
    } else if (aspectRatio === 'portrait') {
      height = 1350; // 4:5
    }

    canvas.width = width;
    canvas.height = height;

    // 1. Draw rich background gradient
    const grad = ctx.createLinearGradient(0, 0, width, height);
    if (selectedThemeId === 'category') {
      const [c1, c2, c3] = category.cardGradients || ['#FF512F', '#F09819', '#E11D48'];
      grad.addColorStop(0, c1);
      grad.addColorStop(0.5, c2);
      grad.addColorStop(1, c3);
    } else {
      grad.addColorStop(0, activeTheme.gradient[0]);
      grad.addColorStop(0.5, activeTheme.gradient[1]);
      grad.addColorStop(1, activeTheme.gradient[2]);
    }
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Decorative radial light shine for depth
    const radial = ctx.createRadialGradient(width * 0.85, height * 0.12, 40, width * 0.85, height * 0.12, 600);
    radial.addColorStop(0, 'rgba(255, 255, 255, 0.35)');
    radial.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = radial;
    ctx.fillRect(0, 0, width, height);

    const radialBottom = ctx.createRadialGradient(width * 0.15, height * 0.88, 40, width * 0.15, height * 0.88, 550);
    radialBottom.addColorStop(0, 'rgba(255, 255, 255, 0.22)');
    radialBottom.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = radialBottom;
    ctx.fillRect(0, 0, width, height);

    // 2. Inner card container - Frosted glass with subtle shadow
    const margin = 65;
    const cardW = width - margin * 2;
    const cardH = height - margin * 2;

    ctx.save();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.24)';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
    ctx.shadowBlur = 45;
    ctx.beginPath();
    ctx.roundRect(margin, margin, cardW, cardH, 44);
    ctx.fill();
    ctx.restore();

    // Glowing border outline
    ctx.strokeStyle = activeTheme.borderGlow;
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.roundRect(margin, margin, cardW, cardH, 44);
    ctx.stroke();

    // 3. Category Header Badge
    const headerY = margin + 85;
    ctx.fillStyle = activeTheme.quoteColor;
    ctx.font = 'bold 36px "Outfit", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`${category.icon}  ${category.hindiName.toUpperCase()}`, width / 2, headerY);

    // Decorative separator line
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(width / 2 - 140, headerY + 28);
    ctx.lineTo(width / 2 + 140, headerY + 28);
    ctx.stroke();

    // 4. Large Artistic Decorative Quote Marks
    ctx.fillStyle = 'rgba(255, 255, 255, 0.22)';
    ctx.font = 'bold 160px "Rozha One", serif';
    ctx.textAlign = 'center';
    ctx.fillText('“', width / 2, headerY + 130);

    // Selected Emoji Badge
    if (selectedEmoji) {
      ctx.font = '72px sans-serif';
      ctx.fillText(selectedEmoji, width / 2, headerY + 210);
    }

    // 5. Wrap & Render Joke / Quote text
    ctx.fillStyle = activeTheme.textColor;
    ctx.font = `600 ${fontSize}px "Hind", "Outfit", sans-serif`;
    ctx.textAlign = 'center';

    const maxTextWidth = cardW - 130;
    const words = item.text.split('\n');
    const lines: string[] = [];

    for (const paragraph of words) {
      if (!paragraph.trim()) {
        lines.push('');
        continue;
      }
      const pWords = paragraph.split(' ');
      let currentLine = '';
      for (const w of pWords) {
        const testLine = currentLine ? `${currentLine} ${w}` : w;
        if (ctx.measureText(testLine).width > maxTextWidth) {
          lines.push(currentLine);
          currentLine = w;
        } else {
          currentLine = testLine;
        }
      }
      if (currentLine) lines.push(currentLine);
    }

    const lineHeight = fontSize * 1.52;
    const totalBlockHeight = lines.length * lineHeight;
    const centerY = (margin + cardH) / 2 + 60;
    let textY = centerY - totalBlockHeight / 2;

    for (const line of lines) {
      if (line) {
        ctx.fillText(line, width / 2, textY);
      }
      textY += lineHeight;
    }

    // 6. Character / Author attribution
    if (item.authorOrCharacter) {
      ctx.fillStyle = activeTheme.quoteColor;
      ctx.font = 'italic 500 32px "Hind", sans-serif';
      ctx.fillText(`— ${item.authorOrCharacter}`, width / 2, textY + 35);
    }

    // 7. Watermark banner at the bottom (RENDERED ONLY IF NOT UNLOCKED VIA REWARD AD)
    if (!hasUnlockedWatermark) {
      const wmBoxY = height - margin - 75;
      ctx.save();
      ctx.fillStyle = 'rgba(0, 0, 0, 0.42)';
      ctx.beginPath();
      ctx.roundRect(width / 2 - 290, wmBoxY - 30, 580, 60, 30);
      ctx.fill();
      ctx.restore();

      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 24px "Hind", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('📲 चुटकुले और विचार ऐप • Daily Status', width / 2, wmBoxY + 7);
    }
  }, [aspectRatio, selectedThemeId, hasUnlockedWatermark, fontSize, selectedEmoji, item, category, activeTheme]);

  useEffect(() => {
    drawCard();
  }, [drawCard]);

  // Download Action
  const executeDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setIsExporting(true);
    try {
      const dataUrl = canvas.toDataURL('image/png');
      const blob = dataUrlToBlob(dataUrl);
      const tag = hasUnlockedWatermark ? 'clean' : 'watermark';
      const filename = `chutkule-${category.id}-${tag}-${Date.now()}.png`;
      downloadImageBlob(blob, filename);
      setIsExporting(false);
      showToast(hasUnlockedWatermark ? '✅ बिना वॉटरमार्क फोटो गैलरी में सेव हो गई!' : '✅ फोटो गैलरी में सेव हो गई!');
    } catch {
      setIsExporting(false);
    }
  };

  // Direct WhatsApp Share Action
  const executeWhatsAppShare = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsExporting(true);
    try {
      const dataUrl = canvas.toDataURL('image/png');
      const blob = dataUrlToBlob(dataUrl);
      const tag = hasUnlockedWatermark ? 'clean' : 'watermark';
      const filename = `chutkule-${category.id}-${tag}-${Date.now()}.png`;
      const result = await shareImageToWhatsApp(blob, item.text, filename);
      setIsExporting(false);

      if (result.method === 'download_and_whatsapp') {
        showToast('✅ फोटो सेव हो गई! WhatsApp खुल रहा है...');
      } else {
        showToast('✅ WhatsApp पर शेयर करें!');
      }
    } catch {
      setIsExporting(false);
    }
  };

  // Native Generic Share Action
  const executeGenericShare = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsExporting(true);
    canvas.toBlob(async (blob) => {
      if (!blob) return;
      const tag = hasUnlockedWatermark ? 'clean' : 'watermark';
      const filename = `chutkule-${category.id}-${tag}-${Date.now()}.png`;
      const file = new File([blob], filename, { type: 'image/png' });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            files: [file],
            title: `${category.hindiName} - चुटकुले और विचार`,
          });
        } catch {
          // ignore cancel
        }
      } else {
        executeDownload();
      }
      setIsExporting(false);
    }, 'image/png');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-4xl max-h-[95vh] flex flex-col md:flex-row overflow-hidden rounded-3xl bg-slate-900 border border-slate-700/80 shadow-2xl text-slate-100">
        {/* Floating Toast Notification */}
        {toastMessage && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-2xl bg-emerald-600 text-white text-xs sm:text-sm font-bold shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-top-4">
            <Check className="w-4 h-4" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-white transition-all shadow-lg active:scale-95"
          title="बंद करें (Close)"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left: Canvas Live Preview Area */}
        <div className="flex-1 bg-gradient-to-b from-slate-950 to-slate-900 p-4 sm:p-6 flex flex-col items-center justify-center min-h-[360px] md:min-h-[520px] relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent pointer-events-none" />
          <canvas
            ref={canvasRef}
            className="max-h-[50vh] md:max-h-[72vh] w-auto max-w-full rounded-2xl shadow-2xl border border-white/15 object-contain transform transition-transform hover:scale-[1.01]"
          />

          <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-400">
            {hasUnlockedWatermark ? (
              <span className="flex items-center gap-1 text-emerald-400 font-bold bg-emerald-500/15 px-2.5 py-1 rounded-full border border-emerald-500/30">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>वॉटरमार्क हटाया गया (Clean HD)</span>
              </span>
            ) : (
              <span className="flex items-center gap-1 text-slate-400 bg-slate-800/80 px-2.5 py-1 rounded-full border border-slate-700">
                <span>वॉटरमार्क सहित • नीचे रिवॉर्ड ऐड देखकर हटाएं</span>
              </span>
            )}
          </div>
        </div>

        {/* Right: Customization Controls Panel */}
        <div className="w-full md:w-88 p-4 sm:p-5 overflow-y-auto space-y-4 border-t md:border-t-0 md:border-l border-slate-800 bg-slate-900/95 max-h-[48vh] md:max-h-[92vh]">
          <div>
            <h3 className="font-bold text-lg text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span>फोटो कार्ड स्टूडियो</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              WhatsApp Status, Instagram Story व Facebook पोस्ट के लिए तैयार करें
            </p>
          </div>

          {/* 1. Primary Action Buttons (2 DISTINCT BUTTONS: WATERMARK & REWARD AD) */}
          <div className="space-y-2 pt-1 pb-3 border-b border-slate-800">
            {/* BUTTON 1: With Watermark WhatsApp Share (Instant Free) */}
            <button
              onClick={executeWhatsAppShare}
              disabled={isExporting}
              className="w-full flex items-center justify-center gap-2.5 py-3 px-4 rounded-2xl text-xs sm:text-sm font-extrabold bg-[#25D366] text-white hover:bg-[#20ba59] active:scale-[0.98] transition-all shadow-lg shadow-emerald-500/25"
            >
              <svg className="w-5 h-5 fill-current flex-shrink-0" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.05 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              <span>1. वाटरमार्क सहित WhatsApp शेयर (Free)</span>
            </button>

            {/* BUTTON 2: Without Watermark (Requires Rewarded Ad) */}
            <button
              onClick={() => {
                if (hasUnlockedWatermark) {
                  executeDownload();
                } else {
                  handleUnlockWatermarkWithAd(() => executeDownload());
                }
              }}
              disabled={isExporting}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl text-xs sm:text-sm font-extrabold bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 active:scale-[0.98] transition-all shadow-lg shadow-orange-500/25"
            >
              <Award className="w-5 h-5 flex-shrink-0" />
              <span>
                {hasUnlockedWatermark
                  ? '2. बिना वॉटरमार्क डाउनलोड करें (Clean HD)'
                  : '2. बिना वॉटरमार्क डाउनलोड (🎬 Ad देखें)'}
              </span>
            </button>

            {/* Secondary Actions Row */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={executeDownload}
                disabled={isExporting}
                className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 active:scale-95 transition"
              >
                <Download className="w-3.5 h-3.5 text-amber-400" />
                <span>गैलरी में सेव</span>
              </button>

              <button
                onClick={executeGenericShare}
                disabled={isExporting}
                className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 active:scale-95 transition"
              >
                <Share2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>अन्य ऐप्स</span>
              </button>
            </div>
          </div>


          {/* 2. REWARDED ADS WATERMARK UNLOCK SECTION */}
          <div>
            {!hasUnlockedWatermark ? (
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-amber-500/15 border border-amber-500/40 text-slate-100 shadow-inner">
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-amber-400 flex-shrink-0" />
                    <span className="text-xs font-extrabold text-amber-300">वॉटरमार्क हटाएं</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/25 text-amber-300 border border-amber-500/40">
                    Watch Ad
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed mb-3">
                  डिफ़ॉल्ट रूप से फोटो वॉटरमार्क के साथ सेव होती है। एक छोटा वीडियो विज्ञापन देखकर बिना वॉटरमार्क वाली साफ HD फोटो अनलॉक करें!
                </p>
                <button
                  onClick={() => handleUnlockWatermarkWithAd()}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 shadow-md shadow-orange-500/25 active:scale-95 transition-all"
                >
                  <span>🎬 वीडियो विज्ञापन देखें और वॉटरमार्क हटाएं</span>
                </button>
              </div>
            ) : (
              <div className="p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <div>
                    <span className="text-xs font-bold text-emerald-300 block">वॉटरमार्क हटाया गया (Clean HD)</span>
                    <span className="text-[10px] text-emerald-400/90">आपकी यह फोटो बिना किसी वॉटरमार्क के तैयार है</span>
                  </div>
                </div>
                <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse flex-shrink-0" />
              </div>
            )}
          </div>

          {/* 3. Aspect Ratio Switcher */}
          <div>
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 mb-1.5">
              <Layers className="w-3.5 h-3.5 text-amber-400" />
              <span>फोटो साइज (Aspect Ratio)</span>
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                onClick={() => setAspectRatio('story')}
                className={`py-2 px-1 rounded-xl text-[11px] font-bold border transition text-center ${
                  aspectRatio === 'story'
                    ? 'bg-amber-500 text-white border-amber-400 shadow-md shadow-amber-500/20'
                    : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-700'
                }`}
              >
                9:16 (Status)
              </button>
              <button
                onClick={() => setAspectRatio('square')}
                className={`py-2 px-1 rounded-xl text-[11px] font-bold border transition text-center ${
                  aspectRatio === 'square'
                    ? 'bg-amber-500 text-white border-amber-400 shadow-md shadow-amber-500/20'
                    : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-700'
                }`}
              >
                1:1 (Square)
              </button>
              <button
                onClick={() => setAspectRatio('portrait')}
                className={`py-2 px-1 rounded-xl text-[11px] font-bold border transition text-center ${
                  aspectRatio === 'portrait'
                    ? 'bg-amber-500 text-white border-amber-400 shadow-md shadow-amber-500/20'
                    : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-700'
                }`}
              >
                4:5 (Post)
              </button>
            </div>
          </div>

          {/* 4. Color Themes Selector */}
          <div>
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 mb-1.5">
              <Palette className="w-3.5 h-3.5 text-amber-400" />
              <span>बैकग्राउंड रंग व स्टाइल</span>
            </label>
            <div className="grid grid-cols-2 gap-1.5 max-h-36 overflow-y-auto pr-1">
              {CARD_THEMES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSelectedThemeId(t.id)}
                  className={`p-2 rounded-xl text-[11px] font-medium border text-left flex items-center gap-2 transition ${
                    selectedThemeId === t.id
                      ? 'border-amber-400 bg-amber-500/20 text-white font-bold ring-1 ring-amber-400'
                      : 'border-slate-800 bg-slate-800/80 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <span
                    className="w-3.5 h-3.5 rounded-full flex-shrink-0 shadow-sm"
                    style={{
                      background: `linear-gradient(135deg, ${t.gradient[0]}, ${t.gradient[1]})`,
                    }}
                  />
                  <span className="truncate">{t.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 5. Emoji Sticker Selector */}
          <div>
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 mb-1.5">
              <Smile className="w-3.5 h-3.5 text-amber-400" />
              <span>इमोजी स्टिकर जोड़ें</span>
            </label>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {EMOJI_STICKERS.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => setSelectedEmoji(selectedEmoji === emoji ? '' : emoji)}
                  className={`text-lg p-1.5 rounded-xl border transition flex-shrink-0 ${
                    selectedEmoji === emoji
                      ? 'bg-amber-500/30 border-amber-400 scale-110 shadow-sm'
                      : 'bg-slate-800 border-slate-700 hover:bg-slate-700'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* 6. Font Size Slider */}
          <div>
            <div className="flex justify-between items-center text-xs mb-1">
              <span className="font-semibold text-slate-300 flex items-center gap-1">
                <Type className="w-3.5 h-3.5 text-amber-400" />
                <span>अक्षर का आकार (Font Size)</span>
              </span>
              <span className="text-amber-400 font-bold">{fontSize}px</span>
            </div>
            <input
              type="range"
              min="26"
              max="52"
              step="2"
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              className="w-full accent-amber-500 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
