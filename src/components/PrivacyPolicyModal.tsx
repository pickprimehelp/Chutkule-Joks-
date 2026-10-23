import React from 'react';
import { ShieldCheck, X, Lock, FileText, CheckCircle2 } from 'lucide-react';

interface PrivacyPolicyModalProps {
  onClose: () => void;
}

export const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-2xl max-h-[92vh] flex flex-col rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl text-slate-100 overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg text-white">
                गोपनीयता नीति (Privacy Policy &amp; Terms)
              </h3>
              <p className="text-xs text-slate-400">
                Google Play Store नीतियों के 100% अनुरूप
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs text-slate-300 leading-relaxed flex-1">
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>
              यह ऐप किसी भी यूजर का व्यक्तिगत डेटा, संपर्क, स्थान (Location) या फोन का डेटा एकत्र नहीं करता है।
            </span>
          </div>

          <section>
            <h4 className="font-bold text-sm text-white mb-1.5">1. परिचय (Introduction)</h4>
            <p>
              "चुटकुले &amp; विचार" (Chutkule &amp; Vichar) ऐप उपयोगकर्ताओं के मनोरंजन और दैनिक प्रेरणा के लिए बनाया गया एक सुरक्षित एप्लिकेशन है। हम उपयोगकर्ता की गोपनीयता (Privacy) का पूरा सम्मान करते हैं।
            </p>
          </section>

          <section>
            <h4 className="font-bold text-sm text-white mb-1.5">2. डेटा संग्रह और सुरक्षा (Data Collection &amp; Safety)</h4>
            <ul className="list-disc list-inside space-y-1 ml-1 text-slate-300">
              <li><strong>कोई व्यक्तिगत डेटा नहीं:</strong> हम आपका नाम, ईमेल, फोन नंबर या कोई भी संवेदनशील जानकारी सर्वर पर सेव नहीं करते।</li>
              <li><strong>लोकल स्टोरेज (Offline Storage):</strong> आपके द्वारा सेव किए गए पसंदीदा चुटकुले (Favorites) और डार्क मोड केवल आपके ही फोन की मेमोरी में सुरक्षित रहते हैं।</li>
              <li><strong>कोई ट्रैकिंग नहीं:</strong> ऐप में कोई हानिकारक स्पायवेयर या अनधिकृत बैकग्राउंड ट्रैकिंग कोड नहीं है।</li>
            </ul>
          </section>

          <section>
            <h4 className="font-bold text-sm text-white mb-1.5">3. आवश्यक अनुमतियाँ (App Permissions)</h4>
            <ul className="list-disc list-inside space-y-1 ml-1 text-slate-300">
              <li><strong>नोटिफिकेशन्स (POST_NOTIFICATIONS):</strong> केवल उपयोगकर्ता की सहमति से दैनिक चुटकुला या विचार भेजने के लिए।</li>
              <li><strong>इंटरनेट (INTERNET):</strong> ऐप के वेब कंटेंट को लोड करने और सोशल मीडिया पर शेयर करने के लिए।</li>
            </ul>
          </section>

          <section>
            <h4 className="font-bold text-sm text-white mb-1.5">4. सामग्री नीति और कॉपीराइट (Content &amp; Fair Use Policy)</h4>
            <p>
              इस एप्लिकेशन में शामिल चुटकुले, अनमोल विचार और शायरी लोक-संस्कृति, प्रेरक महापुरुषों के सार्वजनिक कथनों (Public Domain) और मनोरंजन हेतु तैयार की गई सामग्री हैं। यह ऐप किसी जाति, धर्म, संप्रदाय, लिंग या व्यक्ति विशेष की भावनाओं को ठेस पहुँचाने के उद्देश्य से नहीं बनाया गया है।
            </p>
          </section>

          <section>
            <h4 className="font-bold text-sm text-white mb-1.5">5. बच्चों की गोपनीयता (Children's Privacy - COPPA / Play Family Policy)</h4>
            <p>
              यह एप्लिकेशन सभी आयु वर्ग (General Audience / Family Friendly) के लिए उपयुक्त है। इसमें कोई अश्लील, भ्रामक, हिंसात्मक या अनुचित सामग्री नहीं है।
            </p>
          </section>

          <section>
            <h4 className="font-bold text-sm text-white mb-1.5">6. संपर्क (Contact Developer)</h4>
            <p>
              किसी भी प्रश्न, सुझाव या कॉपीराइट संबंधी पूछताछ के लिए आप डेवलपर से संपर्क कर सकते हैं:<br />
              <strong className="text-amber-400">Email:</strong> support@chutkulevichar.app
            </p>
          </section>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex justify-between items-center">
          <span className="text-[11px] text-slate-500">अंतिम अपडेट: 2026</span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition"
          >
            समझ गया (Accept &amp; Close)
          </button>
        </div>
      </div>
    </div>
  );
};
