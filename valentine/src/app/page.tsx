"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { saveVisitorName } from "./actions";

// =================== FINALE PAGE COMPONENT ===================
function FinalePage({ userName }: { userName: string }) {
  const [showTitle, setShowTitle] = useState(false);
  const [showBoxes, setShowBoxes] = useState(false);
  const [openedBoxes, setOpenedBoxes] = useState<boolean[]>([false, false, false, false, false, false]);
  const [showUnlockMsg, setShowUnlockMsg] = useState(false);
  const [allUnlocked, setAllUnlocked] = useState(false);
  const [showPromiseBtn, setShowPromiseBtn] = useState(false);
  const [showPromiseInterface, setShowPromiseInterface] = useState(false);
  const [showNameInHeart, setShowNameInHeart] = useState(false);
  const [showPinkyPromise, setShowPinkyPromise] = useState(false);
  const [finalTypewriter, setFinalTypewriter] = useState("");
  const [rosePetals, setRosePetals] = useState<number[]>([]);
  const [candleLights, setCandleLights] = useState<number[]>([]);
  const [heartBoxMessage, setHeartBoxMessage] = useState("");
  const [fireflies, setFireflies] = useState<Array<{ id: number; x: number; y: number; delay: number; duration: number }>>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const cuteMessages = [
    "💝 It's a surprise, open it later!",
    "🎁 Not yet, sweetheart!",
    "✨ Save the best for last!",
    "💕 This one is special, open others first!",
    "🌹 Patience, my love!"
  ];

  const giftBoxMessages = [
    { text: "Moments become magical when I'm with you", emoji: "✨", color: "from-pink-400/90 to-rose-400/90" },
    { text: "Your eyes are my biggest addiction", emoji: "👁️", color: "from-purple-400/90 to-pink-400/90" },
    { text: "Your smile is my favourite view", emoji: "😊", color: "from-rose-300/90 to-pink-500/90" },
    { text: "You complete me", emoji: "💕", color: "from-pink-500/90 to-red-400/90" },
    { text: "Forever wouldn't be long enough with you", emoji: "♾️", color: "from-violet-400/90 to-pink-400/90" },
    { text: "Touch my heart to see what is inside it", emoji: "💖", color: "from-fuchsia-400/90 to-rose-400/90", isHeart: true },
  ];

  const openedCount = openedBoxes.filter(Boolean).length;

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
    const t2 = setTimeout(() => setShowBoxes(true), 1500);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  // Check if user opened 3 boxes
  useEffect(() => {
    if (openedCount === 3 && !allUnlocked) {
      setShowUnlockMsg(true);
      setTimeout(() => {
        setAllUnlocked(true);
      }, 3000);
    }
  }, [openedCount, allUnlocked]);

  // Check if 5 boxes opened (can now open heart box)
  const first5Opened = openedBoxes.slice(0, 5).filter(Boolean).length;
  useEffect(() => {
    if (first5Opened === 5 && !openedBoxes[5]) {
      setHeartBoxMessage("💖 Now you can open this! 💖");
    }
  }, [first5Opened, openedBoxes]);

  // Final typewriter effect
  useEffect(() => {
    if (!showPinkyPromise) return;
    const fullText = "There are infinite worlds, Every version of me chooses you in Every one of them.";
    let index = 0;
    
    const interval = setInterval(() => {
      if (index <= fullText.length) {
        setFinalTypewriter(fullText.substring(0, index));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 60);
    
    return () => clearInterval(interval);
  }, [showPinkyPromise]);

  // Spawn rose petals - romantic rain effect
  useEffect(() => {
    const interval = setInterval(() => {
      setRosePetals((prev) => [...prev, Date.now()].slice(-50));
    }, 250);
    return () => clearInterval(interval);
  }, []);

  // Spawn fireflies
  useEffect(() => {
    // Initial fireflies
    const initialFireflies = Array.from({ length: 15 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 8 + Math.random() * 6
    }));
    setFireflies(initialFireflies);
    
    // Add new fireflies periodically
    const interval = setInterval(() => {
      setFireflies(prev => [
        ...prev.slice(-14),
        {
          id: Date.now(),
          x: Math.random() * 100,
          y: Math.random() * 100,
          delay: 0,
          duration: 8 + Math.random() * 6
        }
      ]);
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  // Create candlelight effect
  useEffect(() => {
    setCandleLights([1, 2, 3, 4, 5, 6]);
  }, []);

  const handleBoxClick = (index: number) => {
    if (openedBoxes[index]) return; // Already opened
    
    // Special handling for 6th box (heart box)
    if (index === 5) {
      const first5Count = openedBoxes.slice(0, 5).filter(Boolean).length;
      if (first5Count < 5) {
        // Show random cute message
        const randomMsg = cuteMessages[Math.floor(Math.random() * cuteMessages.length)];
        setHeartBoxMessage(randomMsg);
        setTimeout(() => setHeartBoxMessage(""), 2500);
        return;
      }
    }
    
    if (!allUnlocked && openedCount >= 3 && index !== 5) return; // Can't open more than 3 initially
    
    const newOpened = [...openedBoxes];
    newOpened[index] = true;
    setOpenedBoxes(newOpened);
  };

  const handleHeartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowNameInHeart(true);
    setTimeout(() => {
      setShowNameInHeart(false);
      setShowPromiseInterface(true);
    }, 3000);
  };

  const handlePromiseClick = () => {
    setShowPromiseBtn(true);
  };
  
  const handleFinalPromise = () => {
    setShowPinkyPromise(true);
  };

  // =================== NAME IN HEART TRANSITION ===================
  if (showNameInHeart) {
    return (
      <div className="name-in-heart-page">
        <div className="finale-gradient-bg" />
        
        {/* Fireflies */}
        {fireflies.map((firefly) => (
          <div
            key={firefly.id}
            className="firefly"
            style={{
              left: `${firefly.x}%`,
              top: `${firefly.y}%`,
              animationDelay: `${firefly.delay}s`,
              animationDuration: `${firefly.duration}s`,
            }}
          />
        ))}
        
        <div className="big-heart-with-name">
          <div className="heart-shape">💖</div>
          <div className="name-in-heart">{userName}</div>
        </div>
      </div>
    );
  }

  // =================== PROMISE INTERFACE ===================
  if (showPromiseInterface && !showPinkyPromise) {
    return <PromiseInterface userName={userName} onProceed={handleFinalPromise} />;
  }

  // =================== PINKY PROMISE FINALE ===================
  if (showPinkyPromise) {
    return (
      <div className="pinky-promise-page">
        {/* Rose bloom background */}
        <div className="rose-bloom-bg" />
        
        {/* Fireflies */}
        {fireflies.map((firefly) => (
          <div
            key={firefly.id}
            className="firefly"
            style={{
              left: `${firefly.x}%`,
              top: `${firefly.y}%`,
              animationDelay: `${firefly.delay}s`,
              animationDuration: `${firefly.duration}s`,
            }}
          />
        ))}
        
        {/* Rose petals */}
        {rosePetals.map((id) => {
          const size = ['size-sm', 'size-md', 'size-lg'][Math.floor(Math.random() * 3)];
          const shape = ['shape-1', 'shape-2', 'shape-3', 'shape-4'][Math.floor(Math.random() * 4)];
          const animation = `petalFall${Math.floor(Math.random() * 4) + 1}`;
          const duration = 10 + Math.random() * 8; // 10-18s
          return (
            <div
              key={id}
              className={`rose-petal-gradient ${size} ${shape}`}
              style={{
                left: `${Math.random() * 100}%`,
                animationName: animation,
                animationDuration: `${duration}s`,
                animationDelay: `${Math.random() * 3}s`,
                animationTimingFunction: 'ease-in-out',
                animationFillMode: 'forwards',
              }}
            />
          );
        })}

        {/* Pinky Promise Hands */}
        <div className="pinky-hands-container">
          <svg className="pinky-hands-svg" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
            {/* Left Hand */}
            <g className="hand-left-svg">
              {/* Palm */}
              <path d="M 80 180 Q 60 200 65 220 L 75 240 Q 80 250 90 245 L 120 230 Q 125 225 120 215 L 100 180 Z" 
                    stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
              {/* Thumb */}
              <path d="M 80 180 Q 70 165 75 145" 
                    stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
              {/* Index finger */}
              <path d="M 95 175 Q 95 145 95 120" 
                    stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
              {/* Middle finger */}
              <path d="M 105 172 Q 108 140 110 110" 
                    stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
              {/* Ring finger */}
              <path d="M 115 175 Q 120 145 122 125" 
                    stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
              {/* Pinky - extends to center */}
              <path d="M 122 182 Q 135 185 155 188 Q 175 190 195 185" 
                    stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round" className="pinky-left"/>
            </g>
            
            {/* Right Hand */}
            <g className="hand-right-svg">
              {/* Palm */}
              <path d="M 320 180 Q 340 200 335 220 L 325 240 Q 320 250 310 245 L 280 230 Q 275 225 280 215 L 300 180 Z" 
                    stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
              {/* Thumb */}
              <path d="M 320 180 Q 330 165 325 145" 
                    stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
              {/* Index finger */}
              <path d="M 305 175 Q 305 145 305 120" 
                    stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
              {/* Middle finger */}
              <path d="M 295 172 Q 292 140 290 110" 
                    stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
              {/* Ring finger */}
              <path d="M 285 175 Q 280 145 278 125" 
                    stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
              {/* Pinky - extends to center */}
              <path d="M 278 182 Q 265 185 245 188 Q 225 190 205 185" 
                    stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round" className="pinky-right"/>
            </g>
            
            {/* Connection link between pinkies */}
            <path d="M 195 185 Q 200 175 200 165 Q 200 175 205 185" 
                  stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round" className="pinky-link"/>
            
            {/* Heart above connection */}
            <path d="M 200 140 Q 195 135 190 140 Q 190 145 200 155 Q 210 145 210 140 Q 205 135 200 140" 
                  stroke="white" strokeWidth="2" fill="rgba(236, 72, 153, 0.3)" className="promise-heart"/>
          </svg>
          <div className="connection-glow" />
        </div>

        {/* Final Message */}
        <div className="final-message-container">
          <p className="final-typewriter-text">
            {finalTypewriter}
            {finalTypewriter.length < 91 && <span className="typewriter-cursor">|</span>}
          </p>
        </div>
      </div>
    );
  }

  // =================== GIFT BOX INTERFACE ===================
  return (
    <div className="finale-page">
      {/* Romantic gradient background */}
      <div className="finale-gradient-bg" />

      {/* Fireflies */}
      {fireflies.map((firefly) => (
        <div
          key={firefly.id}
          className="firefly"
          style={{
            left: `${firefly.x}%`,
            top: `${firefly.y}%`,
            animationDelay: `${firefly.delay}s`,
            animationDuration: `${firefly.duration}s`,
          }}
        />
      ))}

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

      {/* Gradient rose petals */}
      {rosePetals.map((id) => {
        const size = ['size-sm', 'size-md', 'size-lg'][Math.floor(Math.random() * 3)];
        const shape = ['shape-1', 'shape-2', 'shape-3', 'shape-4'][Math.floor(Math.random() * 4)];
        const animation = `petalFall${Math.floor(Math.random() * 4) + 1}`;
        const duration = 10 + Math.random() * 8; // 10-18s
        return (
          <div
            key={id}
            className={`rose-petal-gradient ${size} ${shape}`}
            style={{
              left: `${Math.random() * 100}%`,
              animationName: animation,
              animationDuration: `${duration}s`,
              animationDelay: `${Math.random() * 3}s`,
              animationTimingFunction: 'ease-in-out',
              animationFillMode: 'forwards',
            }}
          />
        );
      })}

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
          <span className="np-title">Chiro Odhora</span>
        </div>
      </div>

      {/* Title */}
      {showTitle && (
        <div className="finale-hero">
          <h1 className="finale-main-title">Choose Your Gifts</h1>
          {openedCount === 0 && (
            <p className="finale-subtitle">✨ You can only choose 3, so open wisely ✨</p>
          )}
          {openedCount > 0 && !allUnlocked && openedCount < 3 && (
            <p className="finale-subtitle">✨ You can only choose 3 ✨</p>
          )}
          {showUnlockMsg && openedCount < 6 && (
            <p className="finale-subtitle unlock-message">💝 Because I love you, I'm giving you the rest of the three boxes as well 💝</p>
          )}
          {heartBoxMessage && (
            <p className="finale-subtitle heart-box-msg">{heartBoxMessage}</p>
          )}
        </div>
      )}

      {/* Gift Boxes */}
      {showBoxes && (
        <div className="gift-boxes-container">
          {giftBoxMessages.map((gift, i) => (
            <div
              key={i}
              className={`gift-box ${openedBoxes[i] ? 'opened' : 'closed'} ${!allUnlocked && openedCount >= 3 && !openedBoxes[i] ? 'locked' : ''} ${i === 5 ? 'special-heart-box' : ''}`}
              onClick={() => handleBoxClick(i)}
              style={{ animationDelay: `${i * 0.15}s` }}
            >
              {!openedBoxes[i] ? (
                <div className={`gift-wrapper ${i === 5 ? 'special-wrapper' : ''}`}>
                  {i === 5 && <div className="crown-icon">👑</div>}
                  <div className="gift-box-top">{i === 5 ? '💝' : '🎁'}</div>
                  <div className="gift-bow">🎀</div>
                  <div className="gift-shimmer" />
                  {i === 5 && <div className="special-sparkles" />}
                </div>
              ) : (
                <div className={`gift-content bg-gradient-to-br ${gift.color}`}>
                  {gift.isHeart ? (
                    <div className="heart-gift" onClick={handleHeartClick} style={{ cursor: 'pointer' }}>
                      <div className="transparent-heart">❤️</div>
                      <div className="heart-glow" />
                    </div>
                  ) : (
                    <span className="gift-emoji">{gift.emoji}</span>
                  )}
                  <p className="gift-text">{gift.text}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

    </div>
  );
}

// =================== PROMISE INTERFACE COMPONENT ===================
function PromiseInterface({ userName, onProceed }: { userName: string; onProceed: () => void }) {
  const [rosePetals, setRosePetals] = useState<number[]>([]);
  const [showButton, setShowButton] = useState(false);
  const [fireflies, setFireflies] = useState<Array<{ id: number; x: number; y: number; delay: number; duration: number }>>([]);
  
  useEffect(() => {
    const t = setTimeout(() => setShowButton(true), 1000);
    return () => clearTimeout(t);
  }, []);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setRosePetals((prev) => [...prev, Date.now()].slice(-40));
    }, 200);
    return () => clearInterval(interval);
  }, []);
  
  // Spawn fireflies
  useEffect(() => {
    // Initial fireflies
    const initialFireflies = Array.from({ length: 15 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 8 + Math.random() * 6
    }));
    setFireflies(initialFireflies);
    
    // Add new fireflies periodically
    const interval = setInterval(() => {
      setFireflies(prev => [
        ...prev.slice(-14),
        {
          id: Date.now(),
          x: Math.random() * 100,
          y: Math.random() * 100,
          delay: 0,
          duration: 8 + Math.random() * 6
        }
      ]);
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="promise-interface">
      <div className="promise-bg" />
      
      {/* Fireflies */}
      {fireflies.map((firefly) => (
        <div
          key={firefly.id}
          className="firefly"
          style={{
            left: `${firefly.x}%`,
            top: `${firefly.y}%`,
            animationDelay: `${firefly.delay}s`,
            animationDuration: `${firefly.duration}s`,
          }}
        />
      ))}
      
      {/* Rose petals */}
      {rosePetals.map((id) => {
        const size = ['size-sm', 'size-md', 'size-lg'][Math.floor(Math.random() * 3)];
        const shape = ['shape-1', 'shape-2', 'shape-3', 'shape-4'][Math.floor(Math.random() * 4)];
        const animation = `petalFall${Math.floor(Math.random() * 4) + 1}`;
        const duration = 10 + Math.random() * 8; // 10-18s
        return (
          <div
            key={id}
            className={`rose-petal-gradient ${size} ${shape}`}
            style={{
              left: `${Math.random() * 100}%`,
              animationName: animation,
              animationDuration: `${duration}s`,
              animationDelay: `${Math.random() * 3}s`,
              animationTimingFunction: 'ease-in-out',
              animationFillMode: 'forwards',
            }}
          />
        );
      })}
      
      {/* Blooming Rose Animation */}
      <div className="blooming-rose-container">
        <div className="rose-bloom">
          <div className="rose-petal p1" />
          <div className="rose-petal p2" />
          <div className="rose-petal p3" />
          <div className="rose-petal p4" />
          <div className="rose-petal p5" />
          <div className="rose-center" />
        </div>
      </div>
      
      {showButton && (
        <div className="promise-btn-container">
          <div className="promise-to-name">
            <p className="text-2xl md:text-3xl text-pink-200 font-semibold mb-6 text-center">
              I promise you, {userName}...
            </p>
          </div>
          <Button
            onClick={onProceed}
            className="promise-btn bg-gradient-to-r from-rose-400 via-pink-500 to-red-500 text-white text-2xl px-12 py-8 rounded-full shadow-2xl hover:shadow-pink-500/50 transition-all duration-300 cursor-pointer h-auto"
            size="lg"
          >
            🌹 Forever 🌹
          </Button>
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
  "You said yes my love 💕",
  "and this is what my heart want to say to the universe",
  "Sorry Sunset, her eyes are prettier ✨",
  "Sorry Moonlight, her eyes shine softer 🌙",
  "Hey ocean, her eyes hold deeper secrets than you 🌊",
  "Not today rain, her eyes pour more emotion 💧",
  "Beautiful skies, but I have already seen heaven in her eyes 💫",
  "Sorry Mountain, her silence peaks louder ⛰️",
];

export default function Home() {
  const [userName, setUserName] = useState("");
  const [nameSubmitted, setNameSubmitted] = useState(false);
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
  const [acceptedTypewriterText, setAcceptedTypewriterText] = useState<string[]>([]);
  const [fireflies, setFireflies] = useState<Array<{id: number, x: number, y: number, delay: number, duration: number}>>([]);
  const [heartClicks, setHeartClicks] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  // Spawn floating hearts continuously from the start until Click Me is pressed
  useEffect(() => {
    if (clickMePhase) return;
    const interval = setInterval(() => {
      setFloatingHearts((prev) => [...prev, Date.now()].slice(-25));
    }, 400);
    return () => clearInterval(interval);
  }, [clickMePhase]);

  // Spawn fireflies on question page and accepted state (not clickMePhase)
  useEffect(() => {
    if (clickMePhase) return;
    
    // Initial fireflies
    const initialFireflies = Array.from({ length: 15 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 8 + Math.random() * 6
    }));
    setFireflies(initialFireflies);
    
    // Add new fireflies periodically
    const interval = setInterval(() => {
      setFireflies(prev => [
        ...prev.slice(-14),
        {
          id: Date.now(),
          x: Math.random() * 100,
          y: Math.random() * 100,
          delay: 0,
          duration: 8 + Math.random() * 6
        }
      ]);
    }, 3000);
    
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
    }, 3500);
    return () => clearTimeout(timer);
  }, [showMessages, currentMessageIndex]);

  // Typewriter effect for accepted messages
  useEffect(() => {
    if (!showMessages || currentMessageIndex < 0) return;
    const message = loveMessages[currentMessageIndex];
    let index = 0;
    const newTexts = [...acceptedTypewriterText];
    newTexts[currentMessageIndex] = '';
    setAcceptedTypewriterText(newTexts);
    
    const interval = setInterval(() => {
      if (index < message.length) {
        newTexts[currentMessageIndex] = message.substring(0, index + 1);
        setAcceptedTypewriterText([...newTexts]);
        index++;
      } else {
        clearInterval(interval);
      }
    }, 50);
    
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentMessageIndex, showMessages]);

  // Auto-scroll to latest message
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [currentMessageIndex, acceptedTypewriterText]);

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
    // Pick a random index different from current one
    setNoTextIndex((prev) => {
      let newIndex;
      do {
        newIndex = Math.floor(Math.random() * noButtonTexts.length);
      } while (newIndex === prev && noButtonTexts.length > 1);
      return newIndex;
    });
  }, []);

  const handleYes = () => {
    setAccepted(true);
    setSparkles(Array.from({ length: 20 }, (_, i) => i));
  };

  const handleClickMe = () => {
    setClickMePhase(true);
  };

  const handleBigHeartClick = () => {
    const newClicks = heartClicks + 1;
    setHeartClicks(newClicks);
    if (newClicks === 5) {
      window.open('https://github.com/Abdullah-Shahriar', '_blank');
    }
  };

  const formatNameToTitleCase = (name: string): string => {
    return name
      .trim()
      .split(' ')
      .map(word => 
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      )
      .join(' ');
  };

  const handleNameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (userName.trim()) {
      const inputValue = userName.trim();
      const formattedName = formatNameToTitleCase(inputValue);
      setUserName(formattedName);
      
      // ALWAYS save name to file FIRST - regardless of what happens next
      try {
        await saveVisitorName(formattedName);
      } catch (error) {
        console.error("Failed to save name:", error);
        // Continue anyway, don't block user experience
      }
      
      // Secret code Easter egg - Access visitor log
      if (inputValue === '0328') {
        window.location.href = '/visitors';
        return;
      }
      
      // Secret code Easter egg - GitHub profile
      if (inputValue === '8888') {
        window.location.href = 'https://github.com/Abdullah-Shahriar';
        return;
      }
      
      setNameSubmitted(true);
    }
  };

  // =================== NAME INPUT SCREEN ===================
  if (!nameSubmitted) {
    return (
      <div className="valentine-bg min-h-screen flex flex-col items-center justify-center relative overflow-hidden p-4">
        {/* Fireflies */}
        {fireflies.map((firefly) => (
          <div
            key={firefly.id}
            className="firefly"
            style={{
              left: `${firefly.x}%`,
              top: `${firefly.y}%`,
              animationDelay: `${firefly.delay}s`,
              animationDuration: `${firefly.duration}s`,
            }}
          />
        ))}

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

        <div className="name-input-container text-center z-10">
          <h1 className="text-4xl md:text-6xl font-bold text-pink-400 mb-8 question-text">
            Welcome! 💕
          </h1>
          <p className="text-xl md:text-2xl text-pink-300 mb-8">
            Please enter your name to begin...
          </p>
          <form onSubmit={handleNameSubmit} className="flex flex-col items-center gap-6">
            <input
              ref={nameInputRef}
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Your name"
              className="name-input px-6 py-4 text-xl md:text-2xl rounded-full border-2 border-pink-400 bg-white/10 backdrop-blur-md text-white placeholder-pink-200 focus:outline-none focus:ring-4 focus:ring-pink-500 focus:border-pink-500 text-center"
              autoFocus
            />
            <Button
              type="submit"
              className="bg-gradient-to-r from-pink-500 via-rose-500 to-red-500 text-white text-xl md:text-2xl px-10 py-6 rounded-full shadow-2xl hover:shadow-pink-500/50 transition-all duration-300 cursor-pointer h-auto"
              size="lg"
            >
              Continue ✨
            </Button>
          </form>
        </div>
      </div>
    );
  }

  // =================== FINALE (CLICK ME) STATE ===================
  if (clickMePhase) {
    return <FinalePage userName={userName} />;
  }

  // =================== ACCEPTED STATE ===================
  if (accepted) {
    return (
      <div className="valentine-bg min-h-screen flex flex-col items-center justify-center overflow-hidden relative p-4">
        {/* Fireflies */}
        {fireflies.map((firefly) => (
          <div
            key={firefly.id}
            className="firefly"
            style={{
              left: `${firefly.x}%`,
              top: `${firefly.y}%`,
              animationDelay: `${firefly.delay}s`,
              animationDuration: `${firefly.duration}s`,
            }}
          />
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
          <div className="big-heart" onClick={handleBigHeartClick} style={{ cursor: 'pointer' }}>❤️</div>
        </div>

        <h1 className="text-4xl md:text-6xl font-bold text-pink-600 mt-8 text-center yay-text">
          Yaaay! You said YES! 🎉
        </h1>

        {/* Love Messages */}
        {showMessages && (
          <div className="mt-8 space-y-4 text-center max-w-2xl max-h-[70vh] overflow-y-auto messages-container px-4">
            {loveMessages.slice(0, currentMessageIndex + 1).map((msg, i) => (
              <p
                key={i}
                className="message-appear text-xl md:text-2xl text-pink-700 font-medium typewriter"
                style={{ animationDelay: `${i * 0.3}s` }}
              >
                {acceptedTypewriterText[i] || ''}
                {acceptedTypewriterText[i] && acceptedTypewriterText[i].length < msg.length && (
                  <span className="typewriter-cursor">|</span>
                )}
              </p>
            ))}
            <div ref={messagesEndRef} />
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
      {/* Fireflies */}
      {fireflies.map((firefly) => (
        <div
          key={firefly.id}
          className="firefly"
          style={{
            left: `${firefly.x}%`,
            top: `${firefly.y}%`,
            animationDelay: `${firefly.delay}s`,
            animationDuration: `${firefly.duration}s`,
          }}
        />
      ))}

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

      {/* Blooming rose decoration */}
      <div className="mt-16 z-10">
        <div className="question-rose">
          <div className="rose-bloom-small">
            <div className="rose-petal-small rp1" />
            <div className="rose-petal-small rp2" />
            <div className="rose-petal-small rp3" />
            <div className="rose-petal-small rp4" />
            <div className="rose-petal-small rp5" />
            <div className="rose-center-small" />
          </div>
        </div>
      </div>
    </div>
  );
}
