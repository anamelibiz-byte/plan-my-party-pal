import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Download, Music, Play, Pause, RotateCcw, Sparkles, Heart, Loader2 } from 'lucide-react';
import Header from '../components/Header';
import Sprinkles from '../components/Sprinkles';

// Simple confetti component
function Confetti() {
  const pieces = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * 3}s`,
    duration: `${2.5 + Math.random() * 2}s`,
    color: ['#ec4899', '#f43f5e', '#a855f7', '#3b82f6', '#fbbf24', '#10b981'][Math.floor(Math.random() * 6)],
    size: `${6 + Math.random() * 8}px`,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {pieces.map(p => (
        <div
          key={p.id}
          className="absolute top-0 rounded-sm opacity-80"
          style={{
            left: p.left,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            animation: `confettiFall ${p.duration} ${p.delay} ease-in forwards`,
          }}
        />
      ))}
      <style>{`
        @keyframes confettiFall {
          0% { transform: translateY(-20px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

export default function SongResultPage() {
  const navigate = useNavigate();
  const audioRef = useRef(null);

  const [songData, setSongData] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showConfetti, setShowConfetti] = useState(true);
  const [copied, setCopied] = useState(false);
  const [upsellLoading, setUpsellLoading] = useState(false);
  const [upsellError, setUpsellError] = useState('');

  useEffect(() => {
    // Load song data from localStorage
    const stored = localStorage.getItem('pp_song_result');
    if (!stored) {
      navigate('/song');
      return;
    }
    try {
      setSongData(JSON.parse(stored));
      // Mark this user as a paying customer to unlock the $4.99 upsell
      localStorage.setItem('pp_song_purchased', 'true');
    } catch {
      navigate('/song');
    }

    // Hide confetti after 4s
    const timer = setTimeout(() => setShowConfetti(false), 4000);
    return () => clearTimeout(timer);
  }, [navigate]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) setCurrentTime(audioRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) setDuration(audioRef.current.duration);
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handleSeek = (e) => {
    if (!audioRef.current || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const pct = x / rect.width;
    audioRef.current.currentTime = pct * duration;
    setCurrentTime(pct * duration);
  };

  const handleDownload = () => {
    if (!songData?.audioDataUrl) return;
    const link = document.createElement('a');
    link.href = songData.audioDataUrl;
    link.download = `${songData.childName || 'birthday'}-song.mp3`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleAnotherSong = async () => {
    setUpsellLoading(true);
    setUpsellError('');
    try {
      const res = await fetch('/api/create-song-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: songData?.email, discountMode: true }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setUpsellError('Could not start checkout. Please try again.');
      }
    } catch {
      setUpsellError('Could not connect. Please try again.');
    } finally {
      setUpsellLoading(false);
    }
  };

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const progressPct = duration ? (currentTime / duration) * 100 : 0;

  if (!songData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50">
        <div className="text-center">
          <div className="text-4xl mb-3 animate-spin">🎵</div>
          <p className="text-gray-500">Loading your song...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      {showConfetti && <Confetti />}
      <Sprinkles />
      <Header />

      <div className="relative z-10 max-w-xl mx-auto px-4 py-10">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4 animate-bounce">🎉</div>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-800 leading-tight">
            {songData.childName ? `${songData.childName}'s Song` : 'Your Song'} is Ready!
          </h1>
          <p className="text-gray-500 mt-2">One-of-a-kind. Made just for them. 💕</p>
        </div>

        {/* Audio Player Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 mb-6">
          {/* Animated music visual */}
          <div className="flex justify-center items-end gap-1 h-12 mb-6">
            {Array.from({ length: 20 }, (_, i) => (
              <div
                key={i}
                className={`w-1.5 rounded-full transition-all ${isPlaying ? 'bg-pink-500' : 'bg-gray-200'}`}
                style={{
                  height: isPlaying ? `${20 + Math.sin(i * 0.8) * 20 + Math.random() * 10}px` : '8px',
                  animation: isPlaying ? `wave ${0.5 + (i % 5) * 0.1}s ease-in-out infinite alternate` : 'none',
                  animationDelay: `${i * 0.05}s`,
                }}
              />
            ))}
          </div>
          <style>{`
            @keyframes wave {
              from { height: 8px; }
              to { height: 44px; }
            }
          `}</style>

          {/* Song title */}
          <div className="text-center mb-6">
            <p className="text-xl font-black text-gray-800">
              🎵 {songData.childName ? `Happy Birthday, ${songData.childName}!` : 'Happy Birthday!'}
            </p>
            {songData.musicStyle && (
              <p className="text-sm text-gray-400 mt-1 capitalize">{songData.musicStyle} • AI-Generated</p>
            )}
          </div>

          {/* Hidden audio element */}
          {songData.audioDataUrl && (
            <audio
              ref={audioRef}
              src={songData.audioDataUrl}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onEnded={handleEnded}
              preload="auto"
            />
          )}

          {/* Progress bar */}
          <div
            className="w-full h-2 bg-gray-100 rounded-full cursor-pointer mb-3 overflow-hidden"
            onClick={handleSeek}
          >
            <div
              className="h-full bg-gradient-to-r from-pink-500 to-purple-500 rounded-full transition-all"
              style={{ width: `${progressPct}%` }}
            />
          </div>

          {/* Time */}
          <div className="flex justify-between text-xs text-gray-400 mb-6">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => {
                if (audioRef.current) {
                  audioRef.current.currentTime = 0;
                  setCurrentTime(0);
                }
              }}
              className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 transition-all"
              title="Restart"
            >
              <RotateCcw size={18} />
            </button>

            <button
              onClick={togglePlay}
              className="w-16 h-16 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-all hover:scale-105"
            >
              {isPlaying ? <Pause size={28} /> : <Play size={28} className="ml-1" />}
            </button>

            <button
              onClick={handleDownload}
              className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 transition-all"
              title="Download MP3"
            >
              <Download size={18} />
            </button>
          </div>
        </div>

        {/* Download Button */}
        <button
          onClick={handleDownload}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-black text-lg py-4 rounded-2xl hover:shadow-xl transition-all mb-4"
        >
          <Download size={20} />
          Download MP3
        </button>

        {/* Email confirmation */}
        {songData.email && (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-6 text-center">
            <p className="text-green-700 text-sm">
              ✅ We also emailed your song to <strong>{songData.email}</strong>
            </p>
          </div>
        )}

        {/* Share row */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6">
          <p className="text-sm font-bold text-gray-700 mb-3 text-center">Share the love 🎁</p>
          <div className="flex gap-3">
            <button
              onClick={() => {
                navigator.clipboard?.writeText(window.location.origin + '/song');
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="flex-1 py-2.5 rounded-xl border-2 border-gray-200 text-sm font-semibold text-gray-600 hover:border-pink-300 transition-all"
            >
              {copied ? '✅ Copied!' : '🔗 Copy Link'}
            </button>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.origin + '/song')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-2.5 rounded-xl border-2 border-gray-200 text-sm font-semibold text-gray-600 hover:border-pink-300 transition-all text-center"
            >
              📘 Share
            </a>
          </div>
        </div>

        {/* Upsell card — discounted repeat purchase */}
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-pink-200 rounded-3xl p-6 mb-4">
          {/* Disappearing offer banner */}
          <div className="bg-rose-500 text-white text-xs font-bold text-center py-1.5 px-3 rounded-xl mb-4 tracking-wide uppercase">
            ⚡ One-Time Offer — Only Available on This Page
          </div>
          <div className="flex items-start gap-3 mb-4">
            <span className="text-3xl">🎵</span>
            <div>
              <h3 className="font-black text-gray-800 text-lg leading-tight">Create Another Song</h3>
              <p className="text-gray-500 text-sm mt-1">You've already done the hard part! Add a personalized song for another child at a special returning customer rate.</p>
              <p className="text-rose-500 text-xs font-semibold mt-2">⚠️ Leave this page and this offer disappears — you'll pay full price next time.</p>
            </div>
          </div>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-gray-400 line-through text-sm">$14.99</span>
            <span className="text-2xl font-black text-pink-600">$4.99</span>
            <span className="bg-pink-100 text-pink-700 text-xs font-bold px-2 py-1 rounded-full">67% OFF</span>
          </div>
          {upsellError && (
            <p className="text-red-500 text-sm mb-3">{upsellError}</p>
          )}
          <button
            onClick={handleAnotherSong}
            disabled={upsellLoading}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold py-3 rounded-xl hover:shadow-lg transition-all disabled:opacity-50"
          >
            {upsellLoading ? (
              <><Loader2 size={18} className="animate-spin" /> Starting checkout...</>
            ) : (
              <><Music size={18} /> Get Another Song for $4.99 →</>
            )}
          </button>
        </div>

        {/* Back to planner */}
        <div className="flex flex-col gap-3">
          <Link
            to="/app"
            className="flex items-center justify-center gap-2 text-gray-400 hover:text-gray-600 font-medium text-sm transition-colors"
          >
            <Sparkles size={16} />
            Back to Party Planner
          </Link>
        </div>

        {/* Footer note */}
        <p className="text-center text-gray-300 text-xs mt-8 flex items-center justify-center gap-1">
          Made with <Heart size={10} className="text-pink-300" /> by Party Plann
        </p>
      </div>
    </div>
  );
}
