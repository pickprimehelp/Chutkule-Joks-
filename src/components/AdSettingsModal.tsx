import React, { useState } from 'react';
import {
  X,
  Check,
  Copy,
  ShieldCheck,
  Sparkles,
  ExternalLink,
  Play,
  RotateCcw,
  Sliders,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { AdConfig, GOOGLE_ADMOB_TEST_IDS } from '../hooks/useAds';

interface AdSettingsModalProps {
  adConfig: AdConfig;
  onUpdateConfig: (newConfig: Partial<AdConfig>) => void;
  onResetToTestIds: () => void;
  onTriggerInterstitialTest: () => void;
  onTriggerRewardedTest: () => void;
  onClose: () => void;
}

export const AdSettingsModal: React.FC<AdSettingsModalProps> = ({
  adConfig,
  onUpdateConfig,
  onResetToTestIds,
  onTriggerInterstitialTest,
  onTriggerRewardedTest,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'manage' | 'guide'>('manage');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Form states
  const [testMode, setTestMode] = useState(adConfig.testMode);
  const [adsEnabled, setAdsEnabled] = useState(adConfig.adsEnabled);
  const [appId, setAppId] = useState(adConfig.appId);
  const [bannerId, setBannerId] = useState(adConfig.bannerId);
  const [interstitialId, setInterstitialId] = useState(adConfig.interstitialId);
  const [nativeId, setNativeId] = useState(adConfig.nativeId);
  const [rewardedId, setRewardedId] = useState(adConfig.rewardedId);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleSave = () => {
    onUpdateConfig({
      testMode,
      adsEnabled,
      appId: appId.trim() || GOOGLE_ADMOB_TEST_IDS.appId,
      bannerId: bannerId.trim() || GOOGLE_ADMOB_TEST_IDS.bannerId,
      interstitialId: interstitialId.trim() || GOOGLE_ADMOB_TEST_IDS.interstitialId,
      nativeId: nativeId.trim() || GOOGLE_ADMOB_TEST_IDS.nativeId,
      rewardedId: rewardedId.trim() || GOOGLE_ADMOB_TEST_IDS.rewardedId,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleReset = () => {
    onResetToTestIds();
    setTestMode(true);
    setAdsEnabled(true);
    setAppId(GOOGLE_ADMOB_TEST_IDS.appId);
    setBannerId(GOOGLE_ADMOB_TEST_IDS.bannerId);
    setInterstitialId(GOOGLE_ADMOB_TEST_IDS.interstitialId);
    setNativeId(GOOGLE_ADMOB_TEST_IDS.nativeId);
    setRewardedId(GOOGLE_ADMOB_TEST_IDS.rewardedId);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Google AdMob Unit ID Manager"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in"
    >
      <div className="relative w-full max-w-2xl max-h-[92vh] flex flex-col rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl text-slate-100 overflow-hidden">
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
              📢
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg text-white flex items-center gap-2">
                <span>Google AdMob Ads यूनिट आईडी मैनेजर</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  {testMode ? 'टेस्ट आईडी एक्टिव' : 'कस्टम आईडी'}
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                वर्तमान में Google Test IDs सक्रिय हैं — अपनी वास्तविक Ad Unit ID यहाँ पेस्ट करें
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

        {/* Tab switcher */}
        <div className="flex border-b border-slate-800 px-4 pt-2.5 gap-2 bg-slate-950/40 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('manage')}
            className={`pb-2.5 px-3 border-b-2 flex items-center gap-1.5 transition ${
              activeTab === 'manage'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>विज्ञापन यूनिट्स &amp; टेस्ट</span>
          </button>

          <button
            onClick={() => setActiveTab('guide')}
            className={`pb-2.5 px-3 border-b-2 flex items-center gap-1.5 transition ${
              activeTab === 'guide'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>AdMob आईडी कैसे बनाएं (गाइड)</span>
          </button>
        </div>

        {/* Body content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1 text-xs">
          {activeTab === 'manage' ? (
            <>
              {/* Notice Banner */}
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-2.5 text-slate-200">
                <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="text-[11px] leading-relaxed">
                  <strong className="text-amber-300">गूगल एडमोब टेस्ट मोड चालू है:</strong> अभी ऐप में गूगल की ऑफिशियल टेस्ट यूनिट आईडी लगी हैं ताकि आप बैनर और इंटरस्टीशियल विज्ञापन लाइव टेस्ट कर सकें बिना किसी पॉलिसी उल्लंघन (Invalid Click Penalty) के।
                </div>
              </div>

              {/* Mode Toggle Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/80 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-white text-xs">गूगल टेस्ट मोड (Test Mode)</p>
                    <p className="text-[10px] text-slate-400">टेस्टिंग के लिए Google की आधिकारिक टेस्ट आईडी इस्तेमाल करें</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={testMode}
                      onChange={(e) => setTestMode(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500"></div>
                  </label>
                </div>

                <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/80 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-white text-xs">विज्ञापन सक्रिय रखें (Enable Ads)</p>
                    <p className="text-[10px] text-slate-400">ऐप में विज्ञापन दिखाना ऑन / ऑफ करें</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={adsEnabled}
                      onChange={(e) => setAdsEnabled(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                  </label>
                </div>
              </div>

              {/* Instant Test Buttons */}
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
                <p className="font-bold text-white text-xs flex items-center gap-1.5">
                  <Play className="w-3.5 h-3.5 text-emerald-400" />
                  <span>अभी टेस्ट करके देखें (Live Test Actions):</span>
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  <button
                    onClick={() => {
                      onClose();
                      onTriggerInterstitialTest();
                    }}
                    className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-semibold text-xs transition shadow flex items-center gap-1.5"
                  >
                    <span>🚀 टेस्ट फुल स्क्रीन विज्ञापन चलाएं (Interstitial)</span>
                  </button>

                  <button
                    onClick={() => {
                      onClose();
                      onTriggerRewardedTest();
                    }}
                    className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-semibold text-xs transition shadow flex items-center gap-1.5"
                  >
                    <span>🏆 टेस्ट रिवॉर्ड विज्ञापन चलाएं (Rewarded)</span>
                  </button>
                </div>
              </div>

              {/* Unit IDs Configuration Form */}
              <div className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-white text-xs">
                    {testMode
                      ? 'वर्तमान Google Test Ad Unit IDs (Active)'
                      : 'अपनी वास्तविक AdMob Unit IDs दर्ज करें'}
                  </h4>
                  <button
                    onClick={handleReset}
                    className="text-[11px] text-slate-400 hover:text-amber-400 flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>टेस्ट आईडी पर रीसेट करें</span>
                  </button>
                </div>

                {/* 1. App ID */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-semibold text-slate-300">
                      1. AdMob App ID:
                    </label>
                    <button
                      onClick={() => handleCopy(appId, 'appId')}
                      className="text-[10px] text-slate-400 hover:text-white flex items-center gap-0.5"
                    >
                      {copiedKey === 'appId' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>कॉपी</span>
                    </button>
                  </div>
                  <input
                    type="text"
                    value={appId}
                    onChange={(e) => setAppId(e.target.value)}
                    disabled={testMode}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 font-mono text-xs text-amber-300 border border-slate-800 disabled:opacity-75 focus:outline-none focus:border-amber-500"
                    placeholder="ca-app-pub-xxxxxxxxxxxxxxxx~yyyyyyyyyy"
                  />
                  <span className="text-[10px] text-slate-500">
                    AndroidManifest.xml या PWABuilder में उपयोग होती है।
                  </span>
                </div>

                {/* 2. Banner Ad Unit ID */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-semibold text-slate-300">
                      2. Banner Ad Unit ID (बैनर विज्ञापन):
                    </label>
                    <button
                      onClick={() => handleCopy(bannerId, 'bannerId')}
                      className="text-[10px] text-slate-400 hover:text-white flex items-center gap-0.5"
                    >
                      {copiedKey === 'bannerId' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>कॉपी</span>
                    </button>
                  </div>
                  <input
                    type="text"
                    value={bannerId}
                    onChange={(e) => setBannerId(e.target.value)}
                    disabled={testMode}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 font-mono text-xs text-emerald-400 border border-slate-800 disabled:opacity-75 focus:outline-none focus:border-amber-500"
                    placeholder="ca-app-pub-xxxxxxxxxxxxxxxx/zzzzzzzzzz"
                  />
                </div>

                {/* 3. Interstitial Ad Unit ID */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-semibold text-slate-300">
                      3. Interstitial Ad Unit ID (फुल स्क्रीन विज्ञापन):
                    </label>
                    <button
                      onClick={() => handleCopy(interstitialId, 'interstitialId')}
                      className="text-[10px] text-slate-400 hover:text-white flex items-center gap-0.5"
                    >
                      {copiedKey === 'interstitialId' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>कॉपी</span>
                    </button>
                  </div>
                  <input
                    type="text"
                    value={interstitialId}
                    onChange={(e) => setInterstitialId(e.target.value)}
                    disabled={testMode}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 font-mono text-xs text-indigo-400 border border-slate-800 disabled:opacity-75 focus:outline-none focus:border-amber-500"
                    placeholder="ca-app-pub-xxxxxxxxxxxxxxxx/aaaaaaaaaa"
                  />
                </div>

                {/* 4. Native Ad Unit ID */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-semibold text-slate-300">
                      4. Native Advanced Ad Unit ID (कार्ड्स के बीच विज्ञापन):
                    </label>
                    <button
                      onClick={() => handleCopy(nativeId, 'nativeId')}
                      className="text-[10px] text-slate-400 hover:text-white flex items-center gap-0.5"
                    >
                      {copiedKey === 'nativeId' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>कॉपी</span>
                    </button>
                  </div>
                  <input
                    type="text"
                    value={nativeId}
                    onChange={(e) => setNativeId(e.target.value)}
                    disabled={testMode}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 font-mono text-xs text-pink-400 border border-slate-800 disabled:opacity-75 focus:outline-none focus:border-amber-500"
                    placeholder="ca-app-pub-xxxxxxxxxxxxxxxx/bbbbbbbbbb"
                  />
                </div>

                {/* 5. Rewarded Video Ad Unit ID */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-semibold text-slate-300">
                      5. Rewarded Video Ad Unit ID (रिवॉर्ड विज्ञापन - वॉटरमार्क अनलॉक):
                    </label>
                    <button
                      onClick={() => handleCopy(rewardedId, 'rewardedId')}
                      className="text-[10px] text-slate-400 hover:text-white flex items-center gap-0.5"
                    >
                      {copiedKey === 'rewardedId' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>कॉपी</span>
                    </button>
                  </div>
                  <input
                    type="text"
                    value={rewardedId}
                    onChange={(e) => setRewardedId(e.target.value)}
                    disabled={testMode}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 font-mono text-xs text-cyan-400 border border-slate-800 disabled:opacity-75 focus:outline-none focus:border-amber-500"
                    placeholder="ca-app-pub-xxxxxxxxxxxxxxxx/cccccccccc"
                  />
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    यूज़र जब 'बिना वॉटरमार्क' फोटो डाउनलोड या शेयर करेंगे, तब यह वीडियो विज्ञापन चलेगा।
                  </span>
                </div>

                {/* AdMob Safety & Policy Protection Shield */}
                <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-slate-200">
                  <div className="flex items-center gap-2 mb-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span className="text-xs font-bold text-emerald-300">
                      AdMob Account Safety Shield (सक्रिय)
                    </span>
                  </div>
                  <ul className="text-[11px] text-slate-300 space-y-1 list-disc list-inside">
                    <li><strong className="text-white">3-मिनट कूलडाउन:</strong> इंटरस्टीशियल विज्ञापन बार-बार नहीं आएंगे (न्यूनतम 180 सेकंड का अंतर)।</li>
                    <li><strong className="text-white">फ्रीक्वेंसी लिमिट:</strong> कम से कम 8 बार शेयर या कार्ड देखने पर ही विज्ञापन ट्रिगर होगा।</li>
                    <li><strong className="text-white">अकाउंट प्रोटेक्शन:</strong> रिवॉर्ड ऐड देखने के तुरंत बाद इंटरस्टीशियल विज्ञापन पूरी तरह पॉज़ रहता है।</li>
                  </ul>
                </div>
              </div>
            </>
          ) : (

            /* GUIDE TAB */
            <div className="space-y-4 text-slate-300">
              <div className="p-3.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20">
                <h4 className="font-bold text-white text-xs mb-1">
                  Google AdMob से अपनी रियल Ad Unit ID कैसे निकालें:
                </h4>
                <p className="text-[11px] text-slate-300">
                  Google AdMob दुनिया का सबसे भरोसेमंद और सबसे ज्यादा कमाई (High eCPM) देने वाला नेटवर्क है।
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
                <h5 className="font-bold text-amber-400 text-xs">स्टेप-बाय-स्टेप प्रक्रिया:</h5>
                <ol className="list-decimal list-inside space-y-2 text-[11px] pl-1 leading-relaxed">
                  <li>
                    वेबसाइट <strong className="text-white">admob.google.com</strong> पर जाएं और अपने Google अकाउंट से साइन-अप करें।
                  </li>
                  <li>
                    बाएँ मेनू में <strong>Apps &gt; Add App</strong> पर क्लिक करें।
                  </li>
                  <li>
                    प्लेटफ़ॉर्म <strong>Android</strong> चुनें। क्या ऐप प्ले स्टोर पर लिस्टेड है? <strong>No</strong> चुनें (या बाद में लिंक करें)।
                  </li>
                  <li>
                    ऐप का नाम रखें: <code className="text-amber-300">Chutkule &amp; Vichar</code>। आपको आपकी <strong>App ID</strong> (उदा. <code className="text-emerald-400">ca-app-pub-xxxx~xxxx</code>) मिल जाएगी।
                  </li>
                  <li>
                    अब <strong>Add Ad Unit</strong> पर क्लिक करें:
                    <ul className="list-disc list-inside pl-4 mt-1 space-y-1 text-slate-400">
                      <li><strong>Banner:</strong> नाम दें <em>Main Banner</em> &gt; Create Ad Unit दबाएं।</li>
                      <li><strong>Interstitial:</strong> नाम दें <em>Card Share Interstitial</em> &gt; Create Ad Unit दबाएं।</li>
                      <li><strong>Native Advanced:</strong> नाम दें <em>Feed Native Ad</em> &gt; Create Ad Unit दबाएं।</li>
                    </ul>
                  </li>
                  <li>
                    मिली हुई Ad Unit IDs को कॉपी करके ऊपर <strong>"विज्ञापन यूनिट्स &amp; टेस्ट"</strong> टैब में पेस्ट कर दें!
                  </li>
                </ol>
              </div>

              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px]">
                <p className="font-bold text-amber-400 mb-0.5">⚠️ जरूरी प्ले स्टोर पॉलिसी नियम:</p>
                <p className="text-slate-300">
                  जब तक ऐप Google Play Store पर लाइव न हो और डाउनलोड्स न आने लगें, तब तक हमेशा <strong>Test IDs</strong> का ही उपयोग करें। ऐसा करने से आपका AdMob खाता सुरक्षित रहता है और कभी सस्पेंड नहीं होता!
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {savedSuccess && (
              <span className="text-xs text-emerald-400 font-bold flex items-center gap-1 animate-in fade-in">
                <Check className="w-4 h-4" />
                <span>आईडी सेव हो गई!</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition"
            >
              रद्द करें
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 hover:opacity-90 transition shadow-lg"
            >
              आईडी सेव करें (Save IDs)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
