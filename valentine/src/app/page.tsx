"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";

// =================== FINALE PAGE COMPONENT ===================
function FinalePage() {
  const [currentMsgIndex, setCurrentMsgIndex] = useState(0);
  const [showTitle, setShowTitle] = useState(false);
  const [showCards, setShowCards] = useState(false);
  const [showFinalMsg, setShowFinalMsg] = useState(false);
  const [particles, setParticles] = useState<number[]>([]);
  const [rosePetals, setRosePetals] = useState<number[]>([]);
  const [candleLights, setCandleLights] = useState<number[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const finaleMessages = [
    { text: "Every moment with you feels like magic", emoji: "✨", color: "from-pink-400/90 to-rose-400/90" },
    { text: "You are my heart's greatest treasure", emoji: "💎", color: "from-purple-400/90 to-pink-400/90" },
    { text: "In your eyes, I found my home", emoji: "🏡", color: "from-rose-300/90 to-pink-500/90" },
    { text: "Your smile is my favorite view", emoji: "😍", color: "from-pink-500/90 to-red-400/90" },
    { text: "With you, I am complete", emoji: "💕", color: "from-violet-400/90 to-pink-400/90" },
    { text: "You make my heart sing", emoji: "🎵", color: "from-fuchsia-400/90 to-rose-400/90" },
    { text: "Forever wouldn't be long enough with you", emoji: "♾️", color: "from-pink-400/90 to-purple-400/90" },
    { text: "You are my always and forever", emoji: "💖", color: "from-rose-400/90 to-red-500/90" },
  ];

  // Start music on mount
  useEffect(() => {
    audioRef.current = new Audio("/music.mp3");
    audioRef.current.volume = 0.5;
    audioRef.current.loop = true;
    audioRef.current.currentTime = 93; // Start at 1:33
    audioRef.current.play().catch(() => {});
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Sequence animations
  useEffect(() => {
    const t1 = setTimeout(() => setShowTitle(true), 500);
    const t2 = setTimeout(() => setShowCards(true), 1500);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  // Cycle through messages one at a time on cards
  useEffect(() => {
    if (!showCards) return;
    if (currentMsgIndex >= finaleMessages.length - 1) {
      const t = setTimeout(() => setShowFinalMsg(true), 2000);
      return () => clearTimeout(t);
    }
    const timer = setTimeout(() => setCurrentMsgIndex((p) => p + 1), 3000);
    return () => clearTimeout(timer);
  }, [showCards, currentMsgIndex, finaleMessages.length]);

  // Spawn particles continuously
  useEffect(() => {
    const interval = setInterval(() => {
      setParticles((prev) => [...prev, Date.now()].slice(-30));
    }, 300);
    return () => clearInterval(interval);
  }, []);

  // Spawn rose petals
  useEffect(() => {
    const interval = setInterval(() => {
      setRosePetals((prev) => [...prev, Date.now()].slice(-40));
    }, 200);
    return () => clearInterval(interval);
  }, []);

  // Create candlelight effect
  useEffect(() => {
    setCandleLights([1, 2, 3, 4, 5, 6]);
  }, []);

  return (
    <div className="finale-page">
      {/* Romantic gradient background */}
      <div className="finale-gradient-bg" />

      {/* Candlelight ambient glow */}
      {candleLights.map((id) => (
        <div
          key={id}
          className="candle-glow"
          style={{
            left: `${15 + (id - 1) * 14}%`,
            animationDelay: `${id * 0.3}s`,
          }}
        />
      ))}

      {/* Floating rose petals */}
      {rosePetals.map((id, i) => (
        <div
          key={id}
          className="rose-petal"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 2}s`,
            animationDuration: `${6 + Math.random() * 4}s`,
          }}
        >
          🌹
        </div>
      ))}

      {/* Floating love particles */}
      {particles.map((id, i) => (
        <div
          key={id}
          className="finale-particle"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 2}s`,
            fontSize: `${Math.random() * 20 + 14}px`,
          }}
        >
          {["💕", "✨", "💖", "🌹", "💗", "💝", "💓", "🎀"][i % 8]}
        </div>
      ))}

      {/* Music visualizer bars */}
      <div className="visualizer-container">
        {[...Array(24)].map((_, i) => (
          <div
            key={i}
            className="visualizer-bar"
            style={{
              animationDelay: `${i * 0.08}s`,
              height: `${Math.random() * 60 + 20}%`,
            }}
          />
        ))}
      </div>

      {/* Now Playing badge */}
      <div className="now-playing-badge">
        <div className="vinyl-disc">
          <div className="vinyl-inner" />
        </div>
        <div className="now-playing-text">
          <span className="np-label">Now Playing</span>
          <span className="np-title">Long Distance — Coke Studio</span>
        </div>
      </div>

      {/* Title */}
      {showTitle && (
        <div className="finale-hero">
          <h1 className="finale-main-title">My Dearest Valentine</h1>
          <p className="finale-subtitle">A love letter written in the stars</p>
          <div className="finale-heart-divider">
            <span className="divider-line" />
            <span className="divider-heart">💖</span>
            <span className="divider-line" />
          </div>
        </div>
      )}

      {/* Message Cards */}
      {showCards && (
        <div className="finale-cards-container">
          {finaleMessages.slice(0, currentMsgIndex + 1).map((msg, i) => (
            <div
              key={i}
              className={`finale-card bg-gradient-to-br ${msg.color}`}
              style={{ animationDelay: `${i * 0.15}s` }}
            >
              <span className="card-emoji">{msg.emoji}</span>
              <p className="card-text">{msg.text}</p>
            </div>
          ))}
        </div>
      )}

      {/* Final Forever Message */}
      {showFinalMsg && (
        <div className="finale-forever">
          <div className="forever-hearts">
            <span className="orbit-heart orbit-1">💕</span>
            <span className="orbit-heart orbit-2">💖</span>
            <span className="orbit-heart orbit-3">💗</span>
          </div>
          <p className="forever-text">Forever Yours</p>
          <p className="forever-sub">❤️ My Love, My Valentine ❤️</p>
          <div className="love-seal">
            <span className="seal-text">Sealed with a kiss</span>
            <span className="seal-emoji">💋</span>
          </div>
        </div>
      )}
    </div>
  );
}

const noButtonTexts = [
  "No 😊",
  "Are you sure? 🥺",
  "Really sure? 😢",
  "Please don't say no 💔",
  "Think again! 😭",
  "You're breaking my heart! 💔",
  "I'll be so sad 😿",
  "Give me a chance! 🥹",
  "Don't do this to me! 😩",
  "I'll cry! 😭😭",
  "Pretty please? 🙏",
  "Nooooo! 😫",
  "You can't say no! 💕",
  "I won't accept no! 🚫",
  "Final answer? 🤔",
];

const loveMessages = [
  "You make my heart skip a beat 💓",
  "Every moment with you is magical ✨",
  "You're my favorite notification 📱💕",
  "My heart chose you 💘",
  "You're the reason I smile 😊",
  "Together is my favorite place to be 💑",
  "You had me at hello 👋❤️",
  "You're my forever and always 🌹",
];

export default function Home() {
  const [noTextIndex, setNoTextIndex] = useState(0);
  const [noPosition, setNoPosition] = useState({ x: 0, y: 0 });
  const [hasMoved, setHasMoved] = useState(false);
  const [yesScale, setYesScale] = useState(1);
  const [accepted, setAccepted] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [showClickMe, setShowClickMe] = useState(false);
  const [clickMePhase, setClickMePhase] = useState(false);
  const [floatingHearts, setFloatingHearts] = useState<number[]>([]);
  const [sparkles, setSparkles] = useState<number[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Spawn floating hearts continuously from the start until Click Me is pressed
  useEffect(() => {
    if (clickMePhase) return;
    const interval = setInterval(() => {
      setFloatingHearts((prev) => [...prev, Date.now()].slice(-25));
    }, 400);
    return () => clearInterval(interval);
  }, [clickMePhase]);

  // Show messages one by one after acceptance
  useEffect(() => {
    if (!accepted) return;
    const timer = setTimeout(() => {
      setShowMessages(true);
    }, 1500);
    return () => clearTimeout(timer);
  }, [accepted]);

  useEffect(() => {
    if (!showMessages) return;
    if (currentMessageIndex >= loveMessages.length - 1) {
      const timer = setTimeout(() => setShowClickMe(true), 2000);
      return () => clearTimeout(timer);
    }
    const timer = setTimeout(() => {
      setCurrentMessageIndex((prev) => prev + 1);
    }, 2500);
    return () => clearTimeout(timer);
  }, [showMessages, currentMessageIndex]);

  const moveNoButton = useCallback(() => {
    if (!containerRef.current) return;
    const container = containerRef.current.getBoundingClientRect();
    const buttonWidth = 200;
    const buttonHeight = 60;
    const maxX = Math.max(container.width - buttonWidth - 20, 0);
    const maxY = Math.max(container.height - buttonHeight - 20, 0);
    const newX = Math.random() * maxX;
    const newY = Math.random() * maxY;
    setNoPosition({ x: newX, y: newY });
    setHasMoved(true);
    setNoTextIndex((prev) => Math.min(prev + 1, noButtonTexts.length - 1));
  }, []);

  const handleYes = () => {
    setAccepted(true);
    setSparkles(Array.from({ length: 20 }, (_, i) => i));
  };

  const handleClickMe = () => {
    setClickMePhase(true);
  };

  // =================== FINALE (CLICK ME) STATE ===================
  if (clickMePhase) {
    return <FinalePage />;
  }

  // =================== ACCEPTED STATE ===================
  if (accepted) {
    return (
      <div className="valentine-bg min-h-screen flex flex-col items-center justify-center overflow-hidden relative p-4">
        {/* Floating Hearts Background */}
        {floatingHearts.map((id, i) => (
          <div
            key={id}
            className="floating-heart"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              fontSize: `${Math.random() * 30 + 20}px`,
            }}
          >
            {["❤️", "💕", "💖", "💗", "💓", "💘", "💝"][i % 7]}
          </div>
        ))}

        {/* Sparkle Burst */}
        {sparkles.map((id) => (
          <div
            key={id}
            className="sparkle"
            style={{
              left: `${50 + (Math.random() - 0.5) * 40}%`,
              top: `${50 + (Math.random() - 0.5) * 40}%`,
              animationDelay: `${Math.random() * 0.5}s`,
            }}
          >
            ✨
          </div>
        ))}

        {/* Big Heart */}
        <div className="big-heart-container">
          <div className="big-heart">❤️</div>
        </div>

        <h1 className="text-4xl md:text-6xl font-bold text-pink-600 mt-8 text-center yay-text">
          Yaaay! You said YES! 🎉
        </h1>

        {/* Love Messages */}
        {showMessages && (
          <div className="mt-8 space-y-4 text-center max-w-lg">
            {loveMessages.slice(0, currentMessageIndex + 1).map((msg, i) => (
              <p
                key={i}
                className="message-appear text-xl md:text-2xl text-pink-700 font-medium"
                style={{ animationDelay: `${i * 0.3}s` }}
              >
                {msg}
              </p>
            ))}
          </div>
        )}

        {/* Click Me Button */}
        {showClickMe && !clickMePhase && (
          <div className="mt-10 click-me-appear">
            <Button
              onClick={handleClickMe}
              className="click-me-btn bg-gradient-to-r from-pink-500 via-red-500 to-pink-500 text-white text-xl md:text-2xl px-10 py-8 rounded-full shadow-2xl hover:shadow-pink-500/50 transition-all duration-300 cursor-pointer h-auto"
              size="lg"
            >
              ✨ Click Me ✨
            </Button>
          </div>
        )}
      </div>
    );
  }

  // =================== QUESTION STATE ===================
  return (
    <div
      ref={containerRef}
      className="valentine-bg min-h-screen flex flex-col items-center justify-center relative overflow-hidden p-4"
    >
      {/* Continuous floating hearts */}
      {floatingHearts.map((id, i) => (
        <div
          key={id}
          className="floating-heart"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 2}s`,
            fontSize: `${Math.random() * 25 + 18}px`,
            opacity: 0.5,
          }}
        >
          {["❤️", "💕", "💖", "💗", "💓", "💘", "💝"][i % 7]}
        </div>
      ))}

      {/* Question */}
      <div className="text-center z-10 mb-12">
        <div className="question-heart mb-6 text-7xl">💕</div>
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-pink-400 question-text">
          Will you be my
        </h1>
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-pink-500 mt-2 valentine-word">
          Valentine???
        </h1>
        <p className="text-pink-300/70 text-lg mt-4 animate-pulse">
          Please say yes 🥺👉👈
        </p>
      </div>

      {/* Buttons */}
      <div className="flex gap-6 items-center z-10">
        <Button
          onClick={handleYes}
          className="bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white font-bold rounded-full shadow-lg hover:shadow-green-500/50 transition-all duration-300 cursor-pointer h-auto"
          style={{
            transform: `scale(${yesScale})`,
            padding: "16px 40px",
            fontSize: "16px",
            minWidth: "140px",
          }}
          size="lg"
        >
          Yes! 💚
        </Button>
      </div>

      {/* The No Button that moves away */}
      <div
        className="z-20"
        style={
          !hasMoved
            ? { position: "relative", marginTop: "16px" }
            : {
                position: "absolute",
                left: `${noPosition.x}px`,
                top: `${noPosition.y}px`,
                transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
              }
        }
      >
        <Button
          onMouseEnter={moveNoButton}
          onTouchStart={(e) => {
            e.preventDefault();
            moveNoButton();
          }}
          onClick={(e) => {
            e.preventDefault();
            moveNoButton();
          }}
          variant="destructive"
          className="bg-gradient-to-r from-red-400 to-red-600 hover:from-red-500 hover:to-red-700 text-white font-bold rounded-full shadow-lg transition-all duration-300 whitespace-nowrap cursor-pointer h-auto"
          style={{ padding: "16px 40px", fontSize: "16px", minWidth: "140px" }}
          size="lg"
        >
          {noButtonTexts[noTextIndex]}
        </Button>
      </div>

      {/* Cute bear decoration */}
      <div className="mt-16 text-6xl animate-bounce z-10">🧸</div>
    </div>
  );
}
