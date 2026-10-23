import React, { useState } from 'react';
import { X, Share2, Copy, Check, MessageCircle, Send, QrCode, Sparkles } from 'lucide-react';

import { openWhatsAppDirect } from '../utils/shareUtils';

interface ShareAppModalProps {
  onClose: () => void;
}

export const ShareAppModal: React.FC<ShareAppModalProps> = ({ onClose }) => {
  const [copied, setCopied] = useState(false);
  const appUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const shareMessage = `😂 *चुटकुले और विचार ऐप (Chutkule & Vichar)* 🚀\n\n👉 1000+ मजेदार चुटकुले, मोटिवेशनल कोट्स, सुप्रभात विचार और शायरी!\n📲 अभी मुफ्त में इस्तेमाल करें या डाउनलोड करें:\n${appUrl}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleWhatsApp = () => {
    openWhatsAppDirect(shareMessage);
  };


  const handleTelegram = () => {
    window.open(`https://t.me/share/url?url=${encodeURIComponent(appUrl)}&text=${encodeURIComponent(shareMessage)}`, '_blank');
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'चुटकुले & विचार ऐप',
          text: shareMessage,
          url: appUrl,
        });
      } catch {}
    } else {
      handleCopyLink();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-md rounded-3xl bg-slate-900 border border-slate-700 p-5 sm:p-6 shadow-2xl text-slate-100 max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-5">
          <div className="w-14 h-14 mx-auto mb-2.5 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-3xl shadow-lg shadow-orange-500/25 text-white">
            😂
          </div>
          <h3 className="text-xl font-extrabold text-white">
            ऐप दोस्तों के साथ शेयर करें
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            अपने परिवार और दोस्तों को भी 1000+ चुटकुलों और विचारों से जोड़ें!
          </p>
        </div>

        {/* App Mini Preview Card */}
        <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 mb-5 flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-2xl flex-shrink-0 text-white shadow-md">
            ✨
          </div>
          <div className="overflow-hidden">
            <h4 className="text-sm font-bold text-white truncate">चुटकुले &amp; विचार (Hub)</h4>
            <p className="text-xs text-amber-400 font-semibold">1000+ चुटकुले • कोट्स • स्टेटस</p>
            <p className="text-[11px] text-slate-400 truncate">{appUrl}</p>
          </div>
        </div>

        {/* Share Buttons Stack */}
        <div className="space-y-2.5">
          {/* WhatsApp Direct */}
          <button
            onClick={handleWhatsApp}
            className="w-full flex items-center justify-center gap-2.5 py-3 px-4 rounded-2xl text-sm font-bold bg-[#25D366] text-white hover:bg-[#20ba59] transition shadow-lg shadow-emerald-500/25"
          >
            <MessageCircle className="w-5 h-5" />
            <span>WhatsApp पर शेयर करें</span>
          </button>

          {/* Native Mobile Share Sheet */}
          {typeof navigator !== 'undefined' && 'share' in navigator && (
            <button
              onClick={handleNativeShare}
              className="w-full flex items-center justify-center gap-2.5 py-3 px-4 rounded-2xl text-sm font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition shadow-lg shadow-indigo-500/25"
            >
              <Share2 className="w-5 h-5" />
              <span>अन्य ऐप्स पर शेयर करें</span>
            </button>
          )}

          {/* Telegram */}
          <button
            onClick={handleTelegram}
            className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-2xl text-xs font-semibold bg-[#229ED9]/20 text-[#229ED9] border border-[#229ED9]/40 hover:bg-[#229ED9]/30 transition"
          >
            <Send className="w-4 h-4" />
            <span>Telegram पर शेयर करें</span>
          </button>

          {/* Copy Link */}
          <button
            onClick={handleCopyLink}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400 font-bold">लिंक व इनवाइट टेक्स्ट कॉपी हो गया!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>ऐप लिंक कॉपी करें (Copy Link)</span>
              </>
            )}
          </button>
        </div>

        {/* Footer Note */}
        <p className="text-[11px] text-center text-slate-500 mt-4">
          यह 100% सुरक्षित और मुफ्त वेब व मोबाइल ऐप है।
        </p>
      </div>
    </div>
  );
};
