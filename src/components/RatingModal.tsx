import React, { useState } from 'react';
import { Star, X, Heart, CheckCircle2, ThumbsUp } from 'lucide-react';
import confetti from 'canvas-confetti';

interface RatingModalProps {
  onClose: () => void;
}

export const RatingModal: React.FC<RatingModalProps> = ({ onClose }) => {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [feedback, setFeedback] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleRate = (value: number) => {
    setRating(value);
    if (value === 5) {
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    try {
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.5 },
      });
    } catch {}
    setTimeout(() => {
      onClose();
    }, 2800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-md rounded-3xl bg-slate-900 border border-slate-700 p-6 shadow-2xl text-slate-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {!isSubmitted ? (
          <div>
            <div className="text-center mb-5">
              <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-3xl">
                ⭐
              </div>
              <h3 className="text-xl font-bold text-white">
                आपको हमारा ऐप कैसा लगा?
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                आपकी रेटिंग और सुझाव हमें और बेहतर चुटकुले व विचार जोड़ने में मदद करते हैं!
              </p>
            </div>

            {/* Interactive Stars */}
            <div className="flex items-center justify-center gap-2 mb-6">
              {[1, 2, 3, 4, 5].map((star) => {
                const filled = (hoverRating || rating) >= star;
                return (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => handleRate(star)}
                    className="p-1 transform hover:scale-125 transition-transform"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        filled
                          ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]'
                          : 'text-slate-600'
                      }`}
                    />
                  </button>
                );
              })}
            </div>

            <div className="text-center text-sm font-semibold text-amber-400 mb-4">
              {rating === 5 && '🌟 बहुत शानदार! 5-Star Experience!'}
              {rating === 4 && '😊 बहुत अच्छा! Good App!'}
              {rating === 3 && '👍 ठीक-ठाक है!'}
              {rating <= 2 && '🙏 हम जल्द सुधार करेंगे!'}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <textarea
                  rows={3}
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="अपना कोई सुझाव या राय यहाँ लिखें (वैकल्पिक)..."
                  className="w-full p-3 rounded-xl text-xs bg-slate-800 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                >
                  बाद में
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg shadow-amber-500/25 transition"
                >
                  रेटिंग सबमिट करें
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="text-center py-6 animate-in zoom-in-95">
            <CheckCircle2 className="w-16 h-16 mx-auto mb-3 text-emerald-400" />
            <h4 className="text-xl font-bold text-white">बहुत-बहुत धन्यवाद! ❤️</h4>
            <p className="text-sm text-slate-300 mt-2">
              आपकी बहुमूल्य रेटिंग दर्ज कर ली गई है। हँसते रहिए और खुशियाँ बाँटते रहिए!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
