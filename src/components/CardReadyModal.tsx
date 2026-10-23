import React, { useState, useEffect } from 'react';
import { X, Download, Sparkles, CheckCircle2, Award, Share2, ExternalLink } from 'lucide-react';
import { getWhatsAppUrl, downloadImageBlob } from '../utils/shareUtils';

export interface CardReadyData {
  imageUrl: string;
  blob: Blob;
  filename: string;
  text: string;
  hasWatermark: boolean;
  categoryName?: string;
}

interface CardReadyModalProps {
  cardData: CardReadyData | null;
  onClose: () => void;
}

export const CardReadyModal: React.FC<CardReadyModalProps> = ({ cardData, onClose }) => {
  const [blobDownloadUrl, setBlobDownloadUrl] = useState<string>('');
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [canNativeShare, setCanNativeShare] = useState(false);

  useEffect(() => {
    if (!cardData?.blob) {
      setBlobDownloadUrl('');
      return;
    }

    // Force application/octet-stream so browser download manager saves file
    const octetBlob = new Blob([cardData.blob], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(octetBlob);
    setBlobDownloadUrl(url);

    // Check if device supports sharing file directly (Android/iOS Chrome/Safari)
    try {
      const testFile = new File([cardData.blob], cardData.filename, { type: 'image/png' });
      if (typeof navigator !== 'undefined' && navigator.canShare && navigator.canShare({ files: [testFile] })) {
        setCanNativeShare(true);
      }
    } catch {
      setCanNativeShare(false);
    }

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [cardData]);

  if (!cardData) return null;

  const whatsAppShareText = `${cardData.text}\n\n📲 फोटो कार्ड देखें! (चुटकुले और विचार ऐप)`;
  const whatsAppUrl = getWhatsAppUrl(whatsAppShareText);

  // Direct 1-Tap Download Handler
  const handleDownloadClick = () => {
    const success = downloadImageBlob(cardData.blob, cardData.filename);
    if (success) {
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 4000);
    }
  };

  // Native Android/iOS Device Save / Share
  const handleNativeShare = async () => {
    try {
      const file = new File([cardData.blob], cardData.filename, { type: 'image/png' });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'चुटकुले और विचार',
          text: whatsAppShareText,
        });
      }
    } catch (e: any) {
      if (e?.name !== 'AbortError') {
        handleDownloadClick();
      }
    }
  };

  // Open in new tab fallback
  const handleOpenImage = () => {
    const imgWindow = window.open();
    if (imgWindow) {
      imgWindow.document.write(
        `<title>${cardData.filename}</title><body style="margin:0;background:#0f172a;display:flex;align-items:center;justify-content:center;min-height:100vh;"><img src="${cardData.imageUrl}" style="max-width:100%;max-height:100vh;object-fit:contain;"/></body>`
      );
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="फोटो कार्ड तैयार है"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in"
    >
      <div className="relative w-full max-w-sm sm:max-w-md rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl text-slate-100 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-3.5 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold flex items-center gap-1 ${
                cardData.hasWatermark
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950'
              }`}
            >
              {cardData.hasWatermark ? (
                <>
                  <Sparkles className="w-3 h-3" />
                  <span>वाटरमार्क सहित कार्ड</span>
                </>
              ) : (
                <>
                  <Award className="w-3 h-3" />
                  <span>बिना वॉटरमार्क HD कार्ड</span>
                </>
              )}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition"
            title="बंद करें"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 overflow-y-auto flex flex-col items-center text-center space-y-3.5">
          {/* Card Preview Image */}
          <div className="relative rounded-2xl overflow-hidden shadow-2xl border-2 border-slate-700 max-h-[44vh] bg-slate-950 flex items-center justify-center group">
            <img
              src={cardData.imageUrl}
              alt="Generated Joke Card"
              className="max-h-[44vh] w-auto object-contain rounded-xl select-none"
            />
          </div>

          {/* Status Message */}
          <div className="text-center">
            <h3 className="text-sm sm:text-base font-bold text-white flex items-center justify-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>फोटो कार्ड तैयार है!</span>
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              नीचे दिए गए बटन से सीधे गैलरी में डाउनलोड करें या WhatsApp पर भेजें
            </p>
          </div>

          {/* Success Banner */}
          {downloadSuccess && (
            <div className="w-full p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 text-xs font-semibold animate-pulse">
              ✅ डाउनलोड शुरू हो गया! फ़ोन के 'Downloads' फ़ोल्डर या गैलरी में चेक करें।
            </div>
          )}

          {/* PRIMARY ACTION BUTTONS */}
          <div className="w-full space-y-2">
            {/* Button 1: DIRECT DOWNLOAD BUTTON (Uses octet-stream Blob URL) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                onClick={handleDownloadClick}
                className="w-full py-2.5 px-3 rounded-xl font-extrabold text-xs sm:text-sm bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 flex items-center justify-center gap-2 shadow-lg shadow-orange-500/25 active:scale-95 transition-all"
                title="फोटो कार्ड सीधे फ़ोन में डाउनलोड करें"
              >
                <Download className="w-4 h-4 flex-shrink-0" />
                <span>कार्ड डाउनलोड करें</span>
              </button>

              {/* Native Save to Photos / Share Sheet for Android */}
              {canNativeShare ? (
                <button
                  onClick={handleNativeShare}
                  className="w-full py-2.5 px-3 rounded-xl font-extrabold text-xs sm:text-sm bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25 active:scale-95 transition-all"
                  title="फ़ोन गैलरी में सेव या शेयर करें"
                >
                  <Share2 className="w-4 h-4 flex-shrink-0" />
                  <span>गैलरी में सेव / शेयर</span>
                </button>
              ) : (
                <a
                  href={blobDownloadUrl}
                  download={cardData.filename}
                  className="w-full py-2.5 px-3 rounded-xl font-extrabold text-xs sm:text-sm bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center justify-center gap-2 active:scale-95 transition-all"
                >
                  <Download className="w-4 h-4 flex-shrink-0 text-amber-400" />
                  <span>फ़ाइल सेव करें</span>
                </a>
              )}
            </div>

            {/* Button 2: WhatsApp Direct Open Link */}
            <a
              href={whatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                setTimeout(onClose, 2500);
              }}
              className="w-full py-2.5 px-4 rounded-xl font-extrabold text-xs sm:text-sm bg-[#25D366] hover:bg-[#20ba59] text-white flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 active:scale-95 transition-all"
            >
              <svg className="w-4 h-4 fill-current flex-shrink-0" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.05 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              <span>WhatsApp पर शेयर करें</span>
            </a>
          </div>

          {/* Long press helper hint */}
          <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-[11px] text-amber-300/90 leading-relaxed">
            💡 <strong>गैलरी में सेव करने की आसान टिप:</strong> ऊपर दिख रही फोटो पर १ सेकंड उंगली दबाकर रखें (Long Press) और <strong>'Save image'</strong> या <strong>'Download'</strong> चुनें।
          </div>

          <button
            onClick={handleOpenImage}
            className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 transition"
          >
            <ExternalLink className="w-3 h-3" />
            <span>फोटो नई विंडो में खोलें</span>
          </button>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-950/80 border-t border-slate-800 text-center">
          <button
            onClick={onClose}
            className="w-full py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 transition"
          >
            बंद करें
          </button>
        </div>
      </div>
    </div>
  );
};
