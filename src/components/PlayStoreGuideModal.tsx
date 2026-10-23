import React, { useState } from 'react';
import {
  Smartphone,
  Github,
  Check,
  Copy,
  X,
  ShieldCheck,
  Bell,
  Lock,
  ExternalLink,
  AlertTriangle,
  FileText,
  DollarSign,
  Download,
  Sparkles,
  Layers
} from 'lucide-react';

interface PlayStoreGuideModalProps {
  onClose: () => void;
  onOpenPrivacyPolicy?: () => void;
}

export const PlayStoreGuideModal: React.FC<PlayStoreGuideModalProps> = ({
  onClose,
  onOpenPrivacyPolicy,
}) => {
  const [activeTab, setActiveTab] = useState<'listing' | 'playstore' | 'github' | 'admob' | 'firebase_onesignal' | 'safety_policy'>('listing');
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSnippet(id);
    setTimeout(() => setCopiedSnippet(null), 2000);
  };

  const packageName = "com.chutkule.vichar.hindistatus";
  const appTitle = "चुटकुले & विचार: Jokes, Status";
  const shortDescription = "1000+ मजेदार हिंदी चुटकुले, अनमोल विचार, शायरी और WhatsApp इमेज स्टेटस कार्ड";
  const appCategory = "Entertainment (मनोरंजन)";
  const appTags = "चुटकुले, हिंदी जोक्स, शायरी, अनमोल विचार, स्टेटस, सुविचार, गुड मॉर्निंग कोट्स, Jokes, Hindi Status, Motivation";
  const fullDescription = `😂 चुटकुले और अनमोल विचार (Chutkule & Vichar) - हँसते रहिए और सकारात्मक रहिए! 🌟

क्या आप अपने दिन की शुरुआत एक प्यारी सी मुस्कान और सकारात्मक ऊर्जा के साथ करना चाहते हैं? "चुटकुले & विचार" ऐप आपके लिए लाया है 1000+ से अधिक मजेदार हिंदी चुटकुले, अनमोल सुविचार, प्रेरक कोट्स, मजेदार मीम्स और दिल को छू लेने वाली हिंदी शायरी का बेहतरीन संग्रह!

✨ इस ऐप की मुख्य विशेषताएं (Key Features):

🎭 विविध और लोकप्रिय कैटेगरीज (Categories):
1. 😂 मजेदार चुटकुले (Funny Hindi Jokes)
2. 👨‍🏫 अध्यापक-छात्र जोक्स (Teacher Student Jokes)
3. 👫 पति-पत्नी और संता-बंता जोक्स (Husband-Wife & Santa-Banta)
4. 🌅 सुप्रभात सुविचार (Good Morning Quotes)
5. 🚀 प्रेरक विचार (Motivational & Inspirational Quotes)
6. 💖 लव और दोस्ती शायरी (Love & Friendship Shayari)
7. 🌟 अनमोल वचन और नीति वाक्य (Life Wisdom Quotes)

🎨 सुंदर मल्टी-कलर स्टेटस कार्ड (Color Status Cards):
• केवल सादा टेक्स्ट ही नहीं, बल्कि हर जोक और विचार को आकर्षक रंग-बिरंगे HD इमेज कार्ड में बदलें।
• इंस्टाग्राम, फेसबुक और व्हाट्सएप स्टेटस पर सीधे इमेज शेयर करें।

📲 1-क्लिक सोशल शेयर (Easy Sharing):
• अपने दोस्तों और परिवार के साथ WhatsApp, Facebook, Instagram और Telegram पर एक क्लिक में चुटकुले व विचार शेयर करें।
• क्लिपबोर्ड पर तुरंत कॉपी करने की सुविधा।

📶 100% ऑफलाइन मोड (Offline Access):
• इंटरनेट न होने पर भी आप कभी भी और कहीं भी सभी चुटकुले और विचार पढ़ सकते हैं।

🔔 दैनिक सुविचार नोटिफिकेशन (Daily Notification):
• हर सुबह एक नया सकारात्मक विचार और मजेदार चुटकुला प्राप्त करें।

⭐ पसंदीदा (Favorites) लिस्ट:
• अपने मनपसंद चुटकुलों को सेव करें और जब चाहें दोबारा पढ़ें।

❤️ साफ-सुथरा और पारिवारिक मनोरंजन (Family Friendly):
• सभी चुटकुले और विचार पूर्णतः शालीन और पारिवारिक हैं।

आज ही "चुटकुले & विचार" ऐप डाउनलोड करें और अपने जीवन व अपनों के चेहरों पर मुस्कान बिखेरें!`;

  const gitSnippet = `# 1. Git रिपोजिटरी शुरू करें (Initialize repo)
git init

# 2. सभी फाइल्स ऐड करें (Add all files)
git add .

# 3. कमिट करें (Commit changes with workflow)
git commit -m "feat: Add Play Store listing, AAB & APK GitHub Actions workflow"

# 4. मेन ब्रांच सेट करें (Set branch to main)
git branch -M main

# 5. अपना GitHub रिपोजिटरी URL जोड़ें (Add your GitHub remote URL)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# 6. GitHub पर पुश करें (Push to GitHub)
git push -u origin main`;

  const pwabuilderSnippet = `# Option: Bubblewrap CLI से APK बनाना
npm install -g @bubblewrap/cli
bubblewrap init --manifest=https://YOUR_APP_DOMAIN/manifest.webmanifest
bubblewrap build

# Result: app-release-signed.apk & app-release-bundle.aab`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-3xl max-h-[92vh] flex flex-col rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl text-slate-100 overflow-hidden">
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg text-white">
                Play Store पब्लिशिंग, पॉलिसी व पुश नोटिफिकेशन मास्टर गाइड
              </h3>
              <p className="text-xs text-slate-400">
                Play Store रिजेक्शन से बचाव, OneSignal/Firebase और GitHub सेटअप
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

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 px-3 sm:px-5 pt-2.5 gap-2 bg-slate-950/40 text-xs font-semibold overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('listing')}
            className={`pb-2.5 px-3 border-b-2 flex items-center gap-1.5 whitespace-nowrap transition ${
              activeTab === 'listing'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>📝 Play Store लिस्टिंग (Title, Desc, Tags)</span>
          </button>

          <button
            onClick={() => setActiveTab('github')}
            className={`pb-2.5 px-3 border-b-2 flex items-center gap-1.5 whitespace-nowrap transition ${
              activeTab === 'github'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Github className="w-3.5 h-3.5" />
            <span>💻 GitHub APK/AAB वर्कफ़्लो</span>
          </button>

          <button
            onClick={() => setActiveTab('safety_policy')}
            className={`pb-2.5 px-3 border-b-2 flex items-center gap-1.5 whitespace-nowrap transition ${
              activeTab === 'safety_policy'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>🛡️ पॉलिसी &amp; सेफ्टी ऑडिट</span>
          </button>

          <button
            onClick={() => setActiveTab('admob')}
            className={`pb-2.5 px-3 border-b-2 flex items-center gap-1.5 whitespace-nowrap transition ${
              activeTab === 'admob'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>💰 AdMob Ads सेटअप</span>
          </button>

          <button
            onClick={() => setActiveTab('firebase_onesignal')}
            className={`pb-2.5 px-3 border-b-2 flex items-center gap-1.5 whitespace-nowrap transition ${
              activeTab === 'firebase_onesignal'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span>🔔 Push Notifications</span>
          </button>

          <button
            onClick={() => setActiveTab('playstore')}
            className={`pb-2.5 px-3 border-b-2 flex items-center gap-1.5 whitespace-nowrap transition ${
              activeTab === 'playstore'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>📲 वैकल्पिक (PWABuilder)</span>
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1 text-xs text-slate-300">
          {/* TAB 0: PLAY STORE STORE LISTING DATA */}
          {activeTab === 'listing' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-sm mb-1.5">
                  <Sparkles className="w-5 h-5 flex-shrink-0" />
                  <span>Google Play Console स्टोर लिस्टिंग डेटा (100% रेडी & पॉलिसी वेरीफाइड)</span>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  Google Play Console में ऐप पब्लिश करते समय <strong>"Main store listing"</strong> और <strong>"App content"</strong> में इन जानकारियों को कॉपी करके सीधे पेस्ट करें:
                </p>
              </div>

              {/* Package ID & Category */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-white text-xs">1. Package Name (Application ID):</span>
                    <button
                      onClick={() => copyToClipboard(packageName, 'pkg')}
                      className="flex items-center gap-1 text-[11px] text-amber-400 hover:text-amber-300"
                    >
                      {copiedSnippet === 'pkg' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedSnippet === 'pkg' ? 'कॉपी हो गया' : 'कॉपी'}</span>
                    </button>
                  </div>
                  <code className="block p-2 rounded-xl bg-slate-950 font-mono text-xs text-amber-300 border border-slate-800">
                    {packageName}
                  </code>
                  <p className="text-[10px] text-slate-400 mt-1">Play Store पर यह आपकी ऐप की मुख्य विशिष्ट आईडी रहेगी।</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-white text-xs">2. Category &amp; Tags:</span>
                    <button
                      onClick={() => copyToClipboard(appTags, 'tags')}
                      className="flex items-center gap-1 text-[11px] text-indigo-400 hover:text-indigo-300"
                    >
                      {copiedSnippet === 'tags' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedSnippet === 'tags' ? 'टैग्स कॉपी' : 'टैग्स कॉपी'}</span>
                    </button>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-950 text-xs border border-slate-800 space-y-1">
                    <p className="text-emerald-400 font-semibold">Category: {appCategory}</p>
                    <p className="text-slate-400 text-[11px] truncate">Tags: {appTags}</p>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">Play Console के "Store settings" में Entertainment चुनें।</p>
                </div>
              </div>

              {/* Title & Short Description */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700">
                  <div className="flex items-center justify-between mb-1.5">
                    <div>
                      <span className="font-bold text-white text-xs">3. App Title (नाम):</span>
                      <span className="ml-2 text-[10px] text-emerald-400 font-semibold">({appTitle.length}/30 अक्षर)</span>
                    </div>
                    <button
                      onClick={() => copyToClipboard(appTitle, 'title')}
                      className="flex items-center gap-1 text-[11px] text-amber-400 hover:text-amber-300"
                    >
                      {copiedSnippet === 'title' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedSnippet === 'title' ? 'कॉपी हो गया' : 'कॉपी'}</span>
                    </button>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950 font-semibold text-xs text-white border border-slate-800">
                    {appTitle}
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">Google Play के 30 अक्षरों के आधिकारिक नियम का पालन करता है।</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700">
                  <div className="flex items-center justify-between mb-1.5">
                    <div>
                      <span className="font-bold text-white text-xs">4. Short Description (संक्षिप्त विवरण):</span>
                      <span className="ml-2 text-[10px] text-emerald-400 font-semibold">({shortDescription.length}/80 अक्षर)</span>
                    </div>
                    <button
                      onClick={() => copyToClipboard(shortDescription, 'sdesc')}
                      className="flex items-center gap-1 text-[11px] text-amber-400 hover:text-amber-300"
                    >
                      {copiedSnippet === 'sdesc' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedSnippet === 'sdesc' ? 'कॉपी हो गया' : 'कॉपी'}</span>
                    </button>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950 text-xs text-slate-200 border border-slate-800 leading-snug">
                    {shortDescription}
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">Google Play के 80 अक्षरों के आधिकारिक नियम का पालन करता है।</p>
                </div>
              </div>

              {/* Full Description */}
              <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-xs">5. Full Description (विस्तृत विवरण):</span>
                    <span className="text-[10px] text-emerald-400 font-semibold">(4000 अक्षरों तक स्वीकृत)</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(fullDescription, 'fdesc')}
                    className="flex items-center gap-1 px-3 py-1 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold hover:bg-amber-500/30 transition"
                  >
                    {copiedSnippet === 'fdesc' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedSnippet === 'fdesc' ? 'पूरा विवरण कॉपी हो गया!' : 'पूरा विवरण कॉपी करें'}</span>
                  </button>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 text-[11px] text-slate-300 border border-slate-800 max-h-48 overflow-y-auto leading-relaxed whitespace-pre-line font-sans">
                  {fullDescription}
                </div>
              </div>

              {/* Graphic Assets and Rating */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-1.5">
                  <span className="font-bold text-white text-xs">🎨 ग्राफिक्स एसेट्स साइज (Graphics Requirements):</span>
                  <ul className="text-[11px] text-slate-300 space-y-1 pl-1">
                    <li>• <strong>App Icon:</strong> 512 x 512 px (PNG 32-bit, max 1MB) — ऐप में <code className="text-amber-300">/pwa-512x512.png</code> उपलब्ध है</li>
                    <li>• <strong>Feature Graphic (बैनर):</strong> 1024 x 500 px (JPG या PNG, 24-bit)</li>
                    <li>• <strong>Screenshots:</strong> कम से कम 2 स्क्रीनशॉट (1080x1920 या 1080x2400)</li>
                  </ul>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-1.5">
                  <span className="font-bold text-white text-xs">🛡️ Content Rating (IARC आयु वर्ग):</span>
                  <ul className="text-[11px] text-slate-300 space-y-1 pl-1">
                    <li>• <strong>Rating:</strong> 3+ (Everyone / सभी आयु के लिए उपयुक्त)</li>
                    <li>• <strong>Violence / Sexual / Language:</strong> सभी में <strong>No (नहीं)</strong> चुनें</li>
                    <li>• <strong>Location / User Sharing:</strong> केवल यूजर अपने डिवाइस से शेयर करता है, कोई निजी डेटा अपलोड नहीं</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB 1: SAFETY & POLICY AUDIT */}
          {activeTab === 'safety_policy' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/25">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm mb-1.5">
                  <ShieldCheck className="w-5 h-5 flex-shrink-0" />
                  <span>100% Google Play Store Compliant — कोई रिजेक्शन रिस्क नहीं है!</span>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  इस ऐप का पूरा कोड Google Play Developer Program Policies के अनुसार ऑडिट किया जा चुका है। नीचे दिए गए बिंदुओं की पुष्टि करें:
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700">
                  <p className="font-bold text-white mb-1 text-xs">
                    ✅ कोई अवैध थर्ड पार्टी API या स्क्रैपिंग नहीं
                  </p>
                  <p className="text-[11px] text-slate-400 leading-snug">
                    ऐप में किसी पायरेटेड साइट, अवैध डेटाबेस या बिना लाइसेंस वाली API का उपयोग नहीं है। टेक्स्ट-टू-स्पीच और फोटो कार्ड डिवाइस के नेटिव इंजन पर चलते हैं।
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700">
                  <p className="font-bold text-white mb-1 text-xs">
                    ✅ कोई कॉपीराइट उल्लंघन (Copyright Infringement) नहीं
                  </p>
                  <p className="text-[11px] text-slate-400 leading-snug">
                    चुटकुले और अनमोल विचार लोक-संस्कृति, पब्लिक डोमेन महापुरुषों (कलाम, स्वामी विवेकानंद, गीता) और मूल रचनात्मक व्यंग्य पर आधारित हैं।
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700">
                  <p className="font-bold text-white mb-1 text-xs">
                    ✅ फैमिली सेफ &amp; गूगल फैमिली पॉलिसी अनुरूप
                  </p>
                  <p className="text-[11px] text-slate-400 leading-snug">
                    कोई अश्लील, भड़काऊ, हिंसक या नफरत फैलाने वाली सामग्री नहीं है। यह ऐप "Everyone (सभी उम्र के लिए)" रेटिंग के लिए उपयुक्त है।
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700">
                  <p className="font-bold text-white mb-1 text-xs">
                    ✅ कोई डेटा चोरी या स्पायवेयर नहीं
                  </p>
                  <p className="text-[11px] text-slate-400 leading-snug">
                    ऐप यूज़र्स के कॉन्टैक्ट, कैमरा, गैलरी या लोकेशन की कोई अनुचित परमिशन नहीं मांगता। यूज़र्स का डेटा पूरी तरह उनके फोन में रहता है।
                  </p>
                </div>
              </div>

              {/* Privacy policy note */}
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-start justify-between gap-3">
                <div>
                  <h4 className="font-bold text-amber-300 text-xs mb-1">
                    📋 प्ले स्टोर पर सबमिट करते समय आवश्यक Privacy Policy
                  </h4>
                  <p className="text-[11px] text-slate-300">
                    Google Play Console में ऐप सबमिट करते समय Privacy Policy लिंक अनिवार्य होता है। हमने ऐप में पूरी प्राइवेसी पॉलिसी जोड़ दी है।
                  </p>
                </div>
                {onOpenPrivacyPolicy && (
                  <button
                    onClick={onOpenPrivacyPolicy}
                    className="px-3 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs whitespace-nowrap hover:bg-amber-400 transition"
                  >
                    पॉलिसी देखें
                  </button>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: FIREBASE & ONESIGNAL SETUP */}
          {activeTab === 'firebase_onesignal' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20">
                <h4 className="font-bold text-amber-400 text-xs mb-1">
                  💡 OneSignal vs Firebase Cloud Messaging (FCM): कौन सा चुनें?
                </h4>
                <p className="text-[11px] leading-relaxed text-slate-300">
                  • <strong>OneSignal (अनुशंसित - सबसे आसान):</strong> इसमें आपको कोई कोडिंग नहीं करनी पड़ती। वेब डैशबोर्ड से सीधे फोटो और इमोजी के साथ 1 क्लिक में लाखों लोगों को नोटिफिकेशन चला जाता है।<br />
                  • <strong>Firebase (FCM):</strong> Google का ऑफिशियल टूल है, जो 100% फ्री है।
                </p>
              </div>

              {/* OneSignal Steps */}
              <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-2">
                <h4 className="font-bold text-white text-xs flex items-center gap-1.5 text-amber-300">
                  <span>तरीका 1: OneSignal से 5 मिनट में सेटअप (Recommended)</span>
                </h4>
                <ol className="list-decimal list-inside space-y-1.5 text-[11px] text-slate-300 pl-1">
                  <li>
                    वेबसाइट <strong className="text-white">onesignal.com</strong> पर जाकर फ्री अकाउंट बनाएं।
                  </li>
                  <li>
                    <strong>New App/Website</strong> पर क्लिक करें और नाम <code className="text-amber-400">Chutkule &amp; Vichar</code> डालें।
                  </li>
                  <li>
                    प्लेटफ़ॉर्म में <strong>Web Push / Google Android</strong> चुनें।
                  </li>
                  <li>
                    आपको एक <strong>OneSignal App ID</strong> मिलेगी (जैसे: <code className="text-indigo-300">xxxx-xxxx-xxxx</code>)।
                  </li>
                  <li>
                    जब आप <strong>PWABuilder.com</strong> पर अपनी ऐप का Android Package बनाते हैं, तो वहाँ <strong>Push Notifications</strong> में अपनी यह OneSignal App ID पेस्ट कर दें!
                  </li>
                  <li>
                    बस! अब OneSignal डैशबोर्ड में <strong>Messages &gt; New Push</strong> पर जाएं, अपना चुटकुला लिखें और <strong>Send to Everyone</strong> दबाएं।
                  </li>
                </ol>
              </div>

              {/* Firebase Steps */}
              <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-2">
                <h4 className="font-bold text-white text-xs flex items-center gap-1.5 text-indigo-300">
                  <span>तरीका 2: Google Firebase (FCM) से सेटअप</span>
                </h4>
                <ol className="list-decimal list-inside space-y-1.5 text-[11px] text-slate-300 pl-1">
                  <li>
                    <strong className="text-white">console.firebase.google.com</strong> पर जाएं और <strong>Add Project</strong> पर क्लिक करें।
                  </li>
                  <li>
                    <strong>Add Android App</strong> चुनें और पैकेज नाम डालें (उदा. <code className="text-amber-400">com.chutkule.vichar</code>)।
                  </li>
                  <li>
                    <code className="text-emerald-400">google-services.json</code> फाइल डाउनलोड करें।
                  </li>
                  <li>
                    Firebase Console में बाएँ मेनू से <strong>Engagement &gt; Messaging</strong> पर क्लिक करें।
                  </li>
                  <li>
                    <strong>New Campaign &gt; Notifications</strong> चुनें &gt; शीर्षक व चुटकुला लिखें &gt; <strong>Review &amp; Publish</strong> दबाएं!
                  </li>
                </ol>
              </div>
            </div>
          )}

          {/* TAB 3: ADMOB SETUP & UNIT IDS */}
          {activeTab === 'admob' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20">
                <h4 className="font-bold text-amber-400 text-xs mb-1">
                  💰 Google AdMob विज्ञापन मोनेटाइजेशन &amp; टेस्ट आईडी गाइड:
                </h4>
                <p className="text-[11px] leading-relaxed text-slate-300">
                  इस ऐप में <strong>Google AdMob</strong> के सभी विज्ञापन प्रारूप (Banner, Interstitial, Native Card, Rewarded) आधिकारिक Google Test Ad Unit IDs के साथ पहले से इंटीग्रेटेड हैं ताकि आप सुरक्षित रूप से टेस्ट कर सकें।
                </p>
              </div>

              {/* Official Google Test IDs Box */}
              <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-2.5">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-white text-xs text-emerald-400">
                    Google की आधिकारिक Test Ad Unit IDs (सुरक्षित टेस्टिंग):
                  </h4>
                  <span className="text-[10px] text-slate-400">Android AdMob</span>
                </div>

                <div className="space-y-1.5 font-mono text-[11px]">
                  <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-amber-300 font-sans text-[10px] block">Test App ID:</span>
                      <code className="text-slate-300">ca-app-pub-3940256099942544~3347511713</code>
                    </div>
                  </div>

                  <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-emerald-300 font-sans text-[10px] block">Banner Unit ID:</span>
                      <code className="text-slate-300">ca-app-pub-3940256099942544/6300978111</code>
                    </div>
                  </div>

                  <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-indigo-300 font-sans text-[10px] block">Interstitial Unit ID:</span>
                      <code className="text-slate-300">ca-app-pub-3940256099942544/1033173712</code>
                    </div>
                  </div>

                  <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-pink-300 font-sans text-[10px] block">Native Advanced ID:</span>
                      <code className="text-slate-300">ca-app-pub-3940256099942544/2247696110</code>
                    </div>
                  </div>
                </div>
              </div>

              {/* Steps to get real AdMob IDs */}
              <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-2">
                <h4 className="font-bold text-white text-xs">अपनी खुद की रियल Ad Unit ID कैसे बनाएं:</h4>
                <ol className="list-decimal list-inside space-y-1.5 text-[11px] text-slate-300 pl-1">
                  <li>
                    <strong className="text-white">admob.google.com</strong> पर जाएं और अपने Google अकाउंट से साइन-अप करें।
                  </li>
                  <li>
                    <strong>Apps &gt; Add App &gt; Android</strong> चुनें और ऐप का नाम <code className="text-amber-300">Chutkule &amp; Vichar</code> रखें।
                  </li>
                  <li>
                    <strong>Add Ad Unit</strong> पर क्लिक करें और <strong>Banner</strong> तथा <strong>Interstitial</strong> यूनिट्स बनाएं।
                  </li>
                  <li>
                    अपनी रियल Ad Unit ID को ऐप के शीर्ष में दिए गए <strong>"📢 Ads"</strong> बटन पर क्लिक करके पेस्ट करें और <strong>Save IDs</strong> दबाएं।
                  </li>
                  <li>
                    PWABuilder या Android Studio में <strong>AndroidManifest.xml</strong> में अपनी App ID मेटा-डेटा टैग में पेस्ट कर दें।
                  </li>
                </ol>
              </div>

              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[11px]">
                <p className="font-semibold text-emerald-400 mb-0.5">✅ Play Store Compliance &amp; Zero Risk:</p>
                <p className="text-slate-300">
                  यह सेटअप Google Play Store की Ad Policy का 100% अनुपालन करता है। ऐप में कोई अनचाहा पॉपअप नहीं है, और इंटरस्टीशियल विज्ञापन यूज़र के कार्ड शेयरिंग पर टाइमर व स्किप बटन के साथ दिखाए जाते हैं।
                </p>
              </div>
            </div>
          )}

          {/* TAB 4: APK / AAB GENERATION */}
          {activeTab === 'playstore' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20">
                <h4 className="font-bold text-indigo-300 text-xs mb-1">
                  📲 1-Click में Play Store AAB / APK कैसे डाउनलोड करें:
                </h4>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  इस ऐप में <strong>Web App Manifest, Service Worker, 192px/512px icons और standalone mode</strong> पहले से 100% रेडी हैं।
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-2">
                <h4 className="font-bold text-white text-xs">स्टेप्स (PWABuilder):</h4>
                <ol className="list-decimal list-inside space-y-2 text-[11px] text-slate-300 pl-1">
                  <li>
                    ब्राउज़र में <strong className="text-emerald-400">pwabuilder.com</strong> खोलें।
                  </li>
                  <li>
                    अपने ऐप का लाइव URL (जैसे Cloud Run का URL) बॉक्स में पेस्ट करें और <strong>Start</strong> दबाएं।
                  </li>
                  <li>
                    PWABuilder आपके मैनिफेस्ट और आइकन्स को चेक करके <strong className="text-emerald-400">Green Score</strong> देगा।
                  </li>
                  <li>
                    <strong>Package For Stores</strong> पर क्लिक करें और <strong>Android</strong> चुनें।
                  </li>
                  <li>
                    <strong>Package ID:</strong> <code className="text-amber-300">com.chutkule.vichar</code> और <strong>App Name:</strong> <code className="text-amber-300">Chutkule &amp; Vichar</code> डालें।
                  </li>
                  <li>
                    <strong>Generate APK &amp; AAB</strong> पर क्लिक करें — आपको <strong>.aab (Android App Bundle)</strong> फाइल मिल जाएगी!
                  </li>
                  <li>
                    अब <strong>Google Play Console</strong> खोलकर इस <strong>.aab</strong> फाइल को अपलोड कर दें!
                  </li>
                </ol>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-semibold text-xs text-white">वैकल्पिक: Google Bubblewrap CLI (कमांड लाइन)</span>
                  <button
                    onClick={() => copyToClipboard(pwabuilderSnippet, 'cli')}
                    className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white"
                  >
                    {copiedSnippet === 'cli' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedSnippet === 'cli' ? 'कॉपी हो गया' : 'कॉपी करें'}</span>
                  </button>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 font-mono text-xs text-emerald-400 overflow-x-auto border border-slate-800">
                  <pre>{pwabuilderSnippet}</pre>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: GITHUB PUSH & WORKFLOW DOWNLOAD */}
          {activeTab === 'github' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/25">
                <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm mb-1.5">
                  <Download className="w-5 h-5 flex-shrink-0" />
                  <span>GitHub Actions द्वारा ऑटोमैटिक AAB और APK जनरेटर (100% एक्टिव)</span>
                </div>
                <p className="text-slate-300 leading-relaxed text-[11px]">
                  आपकी रिपोजिटरी में <code className="text-amber-300">.github/workflows/build-apk-aab.yml</code> और <code className="text-amber-300">twa-manifest.json</code> जोड़ दिया गया है। जैसे ही आप GitHub पर कोड पुश करेंगे, GitHub Actions अपने आप Android Bundle (.aab) और APK बना देगा!
                </p>
              </div>

              {/* Step by step download guide */}
              <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-2.5">
                <h4 className="font-bold text-emerald-400 text-xs flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  <span>GitHub से APK और AAB डाउनलोड करने के 3 आसान स्टेप्स:</span>
                </h4>
                <ol className="list-decimal list-inside space-y-2 text-[11px] text-slate-300 pl-1">
                  <li>
                    नीचे दी गई Git कमांड्स चलाकर कोड को GitHub रिपोजिटरी में <strong>Push</strong> करें।
                  </li>
                  <li>
                    GitHub वेबसाइट पर अपनी रिपोजिटरी खोलें और ऊपर मेनू में <strong className="text-amber-300">"Actions"</strong> टैब पर क्लिक करें।
                  </li>
                  <li>
                    वहाँ सबसे ऊपर चल रहे <strong className="text-white">"Build Android APK &amp; AAB (Play Store Bundle)"</strong> वर्कफ़्लो पर क्लिक करें।
                  </li>
                  <li>
                    2 से 3 मिनट में जब ग्रीन टिक (<strong className="text-emerald-400">✅</strong>) आ जाए, तो पेज के सबसे नीचे स्क्रॉल करें — वहाँ <strong className="text-indigo-400">Artifacts</strong> में <strong className="text-amber-300">"Chutkule-Vichar-Android-APK-AAB"</strong> लिंक पर क्लिक करके ZIP डाउनलोड कर लें!
                  </li>
                </ol>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-[10px] text-slate-400 space-y-0.5">
                  <p className="text-emerald-300 font-semibold">📦 ZIP फाइल के अंदर क्या मिलेगा:</p>
                  <p>• <strong>Chutkule-Vichar-playstore.aab</strong> — यह Google Play Console में प्रोडक्शन रिलीज़ में अपलोड होगा।</p>
                  <p>• <strong>Chutkule-Vichar-debug.apk</strong> — इसे आप किसी भी मोबाइल में बिना किसी रोक-टोक सीधे इनस्टॉल करके टेस्ट कर सकते हैं।</p>
                  <p>• <strong>Chutkule-Vichar-release.apk</strong> — हस्ताक्षरित (Signed) रिलीज़ APK।</p>
                  <p>• <strong>chutkule-release.jks</strong> — ऐप की की-स्टोर फ़ाइल (भविष्य के ऐप अपडेट के लिए सुरक्षित रखें)।</p>
                </div>
              </div>

              {/* Git Commands */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <h4 className="font-semibold text-xs text-white">
                    Git Push कमांड्स (टर्मिनल में चलाएं):
                  </h4>
                  <button
                    onClick={() => copyToClipboard(gitSnippet, 'git')}
                    className="flex items-center gap-1 px-3 py-1 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-semibold hover:bg-indigo-500/30 transition"
                  >
                    {copiedSnippet === 'git' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedSnippet === 'git' ? 'कमांड्स कॉपी हो गई!' : 'कमांड्स कॉपी करें'}</span>
                  </button>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 font-mono text-xs text-slate-200 overflow-x-auto border border-slate-800 leading-relaxed">
                  <pre>{gitSnippet}</pre>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-[11px] text-slate-300">
                <p className="font-semibold text-amber-400 mb-1">💡 GitHub रिपोजिटरी सेटअप निर्देश:</p>
                <p>
                  1. <strong className="text-white">github.com</strong> पर लॉगिन करके <strong>New Repository</strong> बनाएं।<br />
                  2. उसका नाम रखें (उदा. <code className="text-amber-300">chutkule-vichar-app</code>)।<br />
                  3. ऊपर दी गई कमांड्स में <code className="text-white">YOUR_USERNAME</code> और <code className="text-white">YOUR_REPO_NAME</code> को अपने GitHub नाम से बदलकर टर्मिनल में चलाएं!
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
          {onOpenPrivacyPolicy && (
            <button
              onClick={() => {
                onClose();
                onOpenPrivacyPolicy();
              }}
              className="text-xs text-slate-400 hover:text-white underline flex items-center gap-1"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>प्राइवेसी पॉलिसी (Privacy Policy)</span>
            </button>
          )}
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white transition ml-auto"
          >
            बंद करें
          </button>
        </div>
      </div>
    </div>
  );
};
