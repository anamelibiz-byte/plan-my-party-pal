import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Music, Loader2, ChevronLeft, ChevronRight, Sparkles, Check } from 'lucide-react';
import Header from '../components/Header';
import Sprinkles from '../components/Sprinkles';

const TRAITS = [
  'Silly', 'Kind', 'Brave', 'Creative', 'Adventurous',
  'Sweet', 'Smart', 'Energetic', 'Funny', 'Loving', 'Curious', 'Athletic',
];

const MUSIC_STYLES = [
  { value: 'pop', label: '🎵 Pop' },
  { value: 'country', label: '🤠 Country' },
  { value: 'rnb', label: '🎤 R&B' },
  { value: 'rock', label: '🎸 Rock' },
  { value: 'reggae', label: '🌴 Reggae' },
  { value: 'classical', label: '🎹 Classical' },
];

const VIBES = [
  { value: 'happy', label: '😄 Happy & Upbeat' },
  { value: 'sweet', label: '💕 Sweet & Emotional' },
  { value: 'silly', label: '🤣 Fun & Silly' },
];

const SINGERS = [
  { value: 'female', label: '👩 Female' },
  { value: 'male', label: '👨 Male' },
  { value: 'duet', label: '🎤 Duet' },
];

const TOTAL_STEPS = 5;

export default function SongBuilderPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form state
  const [childName, setChildName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [traits, setTraits] = useState([]);
  const [extraTraits, setExtraTraits] = useState('');
  const [accomplishment, setAccomplishment] = useState('');
  const [loves, setLoves] = useState('');
  const [musicStyle, setMusicStyle] = useState('');
  const [vibe, setVibe] = useState('');
  const [singerGender, setSingerGender] = useState('');
  const [email, setEmail] = useState('');

  // Guard: redirect if no session_id
  useEffect(() => {
    if (!sessionId) {
      navigate('/song');
    }
    // Pre-fill email from localStorage
    const saved = localStorage.getItem('pp_user_email');
    if (saved) setEmail(saved);
  }, [sessionId, navigate]);

  const toggleTrait = (trait) => {
    setTraits(prev =>
      prev.includes(trait)
        ? prev.filter(t => t !== trait)
        : prev.length < 5 ? [...prev, trait] : prev
    );
  };

  const canProceed = () => {
    if (step === 1) return childName.trim() && age && gender;
    if (step === 2) return traits.length > 0;
    if (step === 3) return loves.trim();
    if (step === 4) return musicStyle && vibe && singerGender;
    if (step === 5) return email.trim() && email.includes('@');
    return false;
  };

  const handleNext = () => {
    if (canProceed() && step < TOTAL_STEPS) setStep(s => s + 1);
  };

  const handleGenerate = async () => {
    if (!canProceed()) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/generate-song', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          childName: childName.trim(),
          age,
          gender,
          traits,
          extraTraits: extraTraits.trim(),
          accomplishment: accomplishment.trim(),
          loves: loves.trim(),
          musicStyle,
          vibe,
          singerGender,
          email: email.trim(),
        }),
      });
      const data = await res.json();
      if (data.success && data.audioDataUrl) {
        // Store in localStorage for result page
        localStorage.setItem('pp_song_result', JSON.stringify({
          audioDataUrl: data.audioDataUrl,
          childName: data.childName,
          musicStyle: data.musicStyle,
          email: data.email,
        }));
        navigate('/song/result');
      } else {
        setError(data.error || 'Something went wrong. Please try again.');
      }
    } catch {
      setError('Could not connect. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const progressPercent = ((step - 1) / (TOTAL_STEPS - 1)) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <Sprinkles />
      <Header />

      <div className="relative z-10 max-w-xl mx-auto px-4 py-10">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between text-xs text-gray-400 mb-2">
            <span>Step {step} of {TOTAL_STEPS}</span>
            <span>{Math.round(progressPercent)}% complete</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-pink-500 to-purple-500 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">

          {/* Step 1: Child Info */}
          {step === 1 && (
            <div>
              <div className="text-center mb-6">
                <div className="text-5xl mb-3">🎂</div>
                <h2 className="text-2xl font-black text-gray-800">The Birthday Star</h2>
                <p className="text-gray-500 text-sm mt-1">Tell us about who we're celebrating!</p>
              </div>
              <div className="flex flex-col gap-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Child's Name</label>
                  <input
                    type="text"
                    value={childName}
                    onChange={e => setChildName(e.target.value)}
                    placeholder="e.g. Emma, Jayden, Lily..."
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:border-pink-400 transition-colors"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Age They're Turning</label>
                  <input
                    type="number"
                    value={age}
                    onChange={e => setAge(e.target.value)}
                    placeholder="e.g. 5"
                    min="1"
                    max="18"
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:border-pink-400 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">They Are...</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: 'girl', label: '👧 Girl' },
                      { value: 'boy', label: '👦 Boy' },
                      { value: 'surprise', label: '🎉 Surprise!' },
                    ].map(opt => (
                      <button
                        key={opt.value}
                        onClick={() => setGender(opt.value)}
                        className={`py-3 rounded-xl font-semibold text-sm border-2 transition-all ${
                          gender === opt.value
                            ? 'border-pink-500 bg-pink-50 text-pink-700'
                            : 'border-gray-200 text-gray-600 hover:border-pink-300'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Personality */}
          {step === 2 && (
            <div>
              <div className="text-center mb-6">
                <div className="text-5xl mb-3">✨</div>
                <h2 className="text-2xl font-black text-gray-800">{childName || 'Their'} Personality</h2>
                <p className="text-gray-500 text-sm mt-1">Pick up to 5 traits that describe them best</p>
              </div>
              <div className="flex flex-wrap gap-2 mb-5">
                {TRAITS.map(trait => (
                  <button
                    key={trait}
                    onClick={() => toggleTrait(trait)}
                    className={`px-4 py-2 rounded-full text-sm font-semibold border-2 transition-all ${
                      traits.includes(trait)
                        ? 'border-pink-500 bg-pink-50 text-pink-700'
                        : 'border-gray-200 text-gray-600 hover:border-pink-300'
                    }`}
                  >
                    {traits.includes(trait) && <Check size={12} className="inline mr-1" />}
                    {trait}
                  </button>
                ))}
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Anything else about them? <span className="font-normal text-gray-400">(optional)</span></label>
                <textarea
                  value={extraTraits}
                  onChange={e => setExtraTraits(e.target.value)}
                  placeholder="e.g. loves making people laugh, always has a smile..."
                  rows={2}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:border-pink-400 transition-colors resize-none"
                />
              </div>
              {traits.length === 5 && (
                <p className="text-xs text-pink-500 mt-2 text-center">Max 5 traits selected ✓</p>
              )}
            </div>
          )}

          {/* Step 3: Their Year */}
          {step === 3 && (
            <div>
              <div className="text-center mb-6">
                <div className="text-5xl mb-3">🏆</div>
                <h2 className="text-2xl font-black text-gray-800">{childName || 'Their'} Amazing Year</h2>
                <p className="text-gray-500 text-sm mt-1">Help us make the song extra personal</p>
              </div>
              <div className="flex flex-col gap-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    What do they love most right now? <span className="text-pink-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={loves}
                    onChange={e => setLoves(e.target.value)}
                    placeholder="e.g. dinosaurs, soccer, painting, Taylor Swift..."
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:border-pink-400 transition-colors"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Something amazing they did this year <span className="font-normal text-gray-400">(optional)</span>
                  </label>
                  <input
                    type="text"
                    value={accomplishment}
                    onChange={e => setAccomplishment(e.target.value)}
                    placeholder="e.g. learned to ride a bike, started kindergarten..."
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:border-pink-400 transition-colors"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Music Preferences */}
          {step === 4 && (
            <div>
              <div className="text-center mb-6">
                <div className="text-5xl mb-3">🎸</div>
                <h2 className="text-2xl font-black text-gray-800">The Music</h2>
                <p className="text-gray-500 text-sm mt-1">Customize the sound of their song</p>
              </div>
              <div className="flex flex-col gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">Music Style</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {MUSIC_STYLES.map(style => (
                      <button
                        key={style.value}
                        onClick={() => setMusicStyle(style.value)}
                        className={`py-3 px-4 rounded-xl font-semibold text-sm border-2 transition-all ${
                          musicStyle === style.value
                            ? 'border-pink-500 bg-pink-50 text-pink-700'
                            : 'border-gray-200 text-gray-600 hover:border-pink-300'
                        }`}
                      >
                        {style.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">Song Vibe</label>
                  <div className="flex flex-col gap-2">
                    {VIBES.map(v => (
                      <button
                        key={v.value}
                        onClick={() => setVibe(v.value)}
                        className={`py-3 px-4 rounded-xl font-semibold text-sm border-2 transition-all text-left ${
                          vibe === v.value
                            ? 'border-pink-500 bg-pink-50 text-pink-700'
                            : 'border-gray-200 text-gray-600 hover:border-pink-300'
                        }`}
                      >
                        {v.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">Singer Voice</label>
                  <div className="grid grid-cols-3 gap-2">
                    {SINGERS.map(s => (
                      <button
                        key={s.value}
                        onClick={() => setSingerGender(s.value)}
                        className={`py-3 rounded-xl font-semibold text-sm border-2 transition-all ${
                          singerGender === s.value
                            ? 'border-pink-500 bg-pink-50 text-pink-700'
                            : 'border-gray-200 text-gray-600 hover:border-pink-300'
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Email + Generate */}
          {step === 5 && (
            <div>
              <div className="text-center mb-6">
                <div className="text-5xl mb-3">🎵</div>
                <h2 className="text-2xl font-black text-gray-800">Almost There!</h2>
                <p className="text-gray-500 text-sm mt-1">Enter your email to receive the song</p>
              </div>

              {/* Summary */}
              <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl p-4 mb-6 border border-pink-100">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Your Song Summary</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    `🎂 ${childName}, turning ${age}`,
                    `🎵 ${MUSIC_STYLES.find(s => s.value === musicStyle)?.label || ''}`,
                    `${VIBES.find(v => v.value === vibe)?.label || ''}`,
                    `${SINGERS.find(s => s.value === singerGender)?.label || ''} voice`,
                  ].filter(Boolean).map((item, i) => (
                    <span key={i} className="text-xs bg-white rounded-full px-3 py-1 text-gray-700 border border-pink-100 font-medium">
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-700 mb-2">Your Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@email.com"
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:border-pink-400 transition-colors"
                  autoFocus
                />
                <p className="text-xs text-gray-400 mt-2">We'll send your song here so you have it forever 🎁</p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              {loading ? (
                <div className="text-center py-8">
                  <div className="flex justify-center gap-2 text-3xl mb-4 animate-bounce">
                    🎵🎶🎵
                  </div>
                  <Loader2 size={32} className="animate-spin text-pink-500 mx-auto mb-3" />
                  <p className="font-bold text-gray-800 text-lg">Composing {childName}'s Song...</p>
                  <p className="text-gray-500 text-sm mt-1">Our AI is creating something magical — about 30–60 seconds ✨</p>
                </div>
              ) : (
                <button
                  onClick={handleGenerate}
                  disabled={!canProceed()}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-black text-lg py-4 rounded-2xl hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Sparkles size={20} />
                  Generate {childName ? `${childName}'s` : 'Their'} Song! 🎵
                </button>
              )}
            </div>
          )}

          {/* Navigation */}
          {step < TOTAL_STEPS && (
            <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-100">
              <button
                onClick={() => setStep(s => Math.max(1, s - 1))}
                disabled={step === 1}
                className="flex items-center gap-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 font-medium text-sm transition-colors"
              >
                <ChevronLeft size={16} /> Back
              </button>
              <button
                onClick={handleNext}
                disabled={!canProceed()}
                className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold px-8 py-3 rounded-xl hover:shadow-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Next <ChevronRight size={16} />
              </button>
            </div>
          )}

          {step === TOTAL_STEPS && !loading && (
            <button
              onClick={() => setStep(s => s - 1)}
              className="flex items-center gap-1 text-gray-400 hover:text-gray-600 font-medium text-sm transition-colors mt-4"
            >
              <ChevronLeft size={16} /> Back
            </button>
          )}
        </div>

        {/* Security note */}
        <p className="text-center text-gray-400 text-xs mt-4 flex items-center justify-center gap-1">
          🔒 Your info is only used to create {childName ? `${childName}'s` : 'your'} song and never shared.
        </p>
      </div>
    </div>
  );
}
