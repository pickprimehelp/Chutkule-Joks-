import React, { useState } from 'react';
import { Bell, X, Check, Clock, Sparkles, Send, ShieldAlert, ShieldCheck, HelpCircle, CheckCircle } from 'lucide-react';
import { NotificationSettings, CategoryId } from '../types';
import { CATEGORIES } from '../data/categories';

interface NotificationModalProps {
  settings: NotificationSettings;
  permission: NotificationPermission;
  onSave: (settings: NotificationSettings) => void;
  onRequestPermission: () => Promise<NotificationPermission>;
  onClose: () => void;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({
  settings,
  permission: initialPermission,
  onSave,
  onRequestPermission,
  onClose,
}) => {
  const [enabled, setEnabled] = useState(settings.enabled);
  const [time, setTime] = useState(settings.time);
  const [category, setCategory] = useState<CategoryId | 'all'>(settings.category);
  const [permission, setPermission] = useState<NotificationPermission>(initialPermission);
  const [showHelp, setShowHelp] = useState(false);

  const handleToggle = async () => {
    if (!enabled) {
      if (permission !== 'granted') {
        const res = await onRequestPermission();
        setPermission(res);
        if (res === 'granted') {
          setEnabled(true);
        }
      } else {
        setEnabled(true);
      }
    } else {
      setEnabled(false);
    }
  };

  const handleAskPermission = async () => {
    const res = await onRequestPermission();
    setPermission(res);
    if (res === 'granted') {
      setEnabled(true);
    }
  };

  const handleSave = () => {
    onSave({
      enabled,
      time,
      category,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-700 p-5 sm:p-6 shadow-2xl text-slate-100 max-h-[92vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-4">
          <div className="w-14 h-14 mx-auto mb-2.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-3xl shadow-inner">
            🔔
          </div>
          <h3 className="text-xl font-extrabold text-white">
            डेली नोटिफिकेशन कैसे चालू करें?
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            हर रोज़ अपने चुने समय पर चुटकुले और अनमोल विचार प्राप्त करें
          </p>
        </div>

        {/* Permission Status Box */}
        <div className="mb-4 p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300">ब्राउज़र अनुमति (Status):</span>
            {permission === 'granted' ? (
              <span className="flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <ShieldCheck className="w-3.5 h-3.5" /> स्वीकृत (Allowed)
              </span>
            ) : permission === 'denied' ? (
              <span className="flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30">
                <ShieldAlert className="w-3.5 h-3.5" /> ब्लॉक है (Blocked)
              </span>
            ) : (
              <button
                onClick={handleAskPermission}
                className="text-xs font-bold px-3 py-1 rounded-full bg-amber-500 text-slate-950 hover:bg-amber-400 transition"
              >
                अनुमति दें (Allow Permission)
              </button>
            )}
          </div>

          {/* Blocked or Help Guidance */}
          {permission === 'denied' && (
            <div className="mt-2.5 pt-2.5 border-t border-slate-700/60 text-xs text-rose-300 space-y-1">
              <p className="font-semibold flex items-center gap-1.5 text-rose-400">
                <ShieldAlert className="w-4 h-4 flex-shrink-0" />
                नोटिफिकेशन ब्लॉक हो गया है! इसे ऐसे चालू करें:
              </p>
              <ol className="list-decimal list-inside text-[11px] text-slate-300 space-y-1 pl-1">
                <li>अपने ब्राउज़र में ऊपर एड्रेस बार में 🔒 (ताला/Lock) या ⚙️ आइकन पर टैप करें।</li>
                <li><strong>Permissions (अनुमतियाँ)</strong> &gt; <strong>Notifications</strong> चुनें।</li>
                <li>वहाँ <strong>Allow (अनुमति दें)</strong> पर क्लिक करें और पेज रिफ्रेश करें।</li>
              </ol>
            </div>
          )}
        </div>

        <div className="space-y-4">
          {/* Main Toggle Switch */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700">
            <div>
              <p className="text-sm font-bold text-white">दैनिक नोटिफिकेशन चालू रखें</p>
              <p className="text-xs text-slate-400">
                {enabled ? '✅ चालू है (Notification is Active)' : '❌ बंद है (Turn on to receive daily dose)'}
              </p>
            </div>
            <button
              onClick={handleToggle}
              className={`w-13 h-7 rounded-full p-1 transition-colors duration-200 ease-in-out ${
                enabled ? 'bg-emerald-500 shadow-md shadow-emerald-500/30' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform duration-200 ease-in-out ${
                  enabled ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Time Picker & Quick Presets */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-semibold text-slate-300">
                नोटिफिकेशन का समय (Delivery Time)
              </label>
              <span className="text-xs text-amber-400 font-bold">{time}</span>
            </div>

            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-800 border border-slate-700">
              <Clock className="w-4 h-4 text-slate-400 ml-1" />
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full bg-transparent text-white text-sm font-semibold focus:outline-none"
              />
            </div>

            {/* Quick Presets */}
            <div className="flex items-center gap-2 mt-2">
              <button
                type="button"
                onClick={() => setTime('08:00')}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition ${
                  time === '08:00'
                    ? 'border-indigo-400 bg-indigo-500/20 text-white font-bold'
                    : 'border-slate-700 bg-slate-800/80 text-slate-400 hover:text-white'
                }`}
              >
                🌅 सुबह 8:00 AM
              </button>
              <button
                type="button"
                onClick={() => setTime('13:00')}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition ${
                  time === '13:00'
                    ? 'border-indigo-400 bg-indigo-500/20 text-white font-bold'
                    : 'border-slate-700 bg-slate-800/80 text-slate-400 hover:text-white'
                }`}
              >
                ☀️ दोपहर 1:00 PM
              </button>
              <button
                type="button"
                onClick={() => setTime('20:00')}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition ${
                  time === '20:00'
                    ? 'border-indigo-400 bg-indigo-500/20 text-white font-bold'
                    : 'border-slate-700 bg-slate-800/80 text-slate-400 hover:text-white'
                }`}
              >
                🌙 रात 8:00 PM
              </button>
            </div>
          </div>

          {/* Preferred Category */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              पसंदीदा श्रेणी (Preferred Topic)
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as CategoryId | 'all')}
              className="w-full p-2.5 rounded-xl text-xs font-medium bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">🌟 सभी श्रेणियों से मिक्स (Mix of All Categories)</option>
              {CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.icon} {cat.hindiName} ({cat.name})
                </option>
              ))}
            </select>
          </div>

          {/* Action Save Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
            >
              बंद करें
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/25 transition"
            >
              सेटिंग्स सेव करें
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

