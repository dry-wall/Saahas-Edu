import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { 
  textToTokens, 
  dotsToLetter, 
  chordToContraction, 
  brailleLetters 
} from '../../utils/BrailleEngine'; // Ensure casing matches filesystem

const ALLOWED_KEYS = ["f", "d", "s", "j", "k", "l"];

const BrailleTrainer = () => {
  // --- UI State ---
  const [mode, setMode] = useState('reading'); 
  const [inputText, setInputText] = useState("");
  const [tokens, setTokens] = useState([]);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // --- Braille Input Mode State ---
  const [currentChord, setCurrentChord] = useState(new Set());
  const [typedText, setTypedText] = useState("");
  const [tokenHistory, setTokenHistory] = useState([]);

  // --- Audio Logic ---
  const audioCtx = useRef(null);

  // Stable playSound function to satisfy React Compiler
  const playSound = useCallback((freq, duration) => {
    if (!soundEnabled) return;
    if (!audioCtx.current) {
      audioCtx.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    const osc = audioCtx.current.createOscillator();
    const gain = audioCtx.current.createGain();
    osc.frequency.value = freq;
    osc.connect(gain);
    gain.connect(audioCtx.current.destination);
    osc.start();
    setTimeout(() => {
      try { osc.stop(); } catch (e) { /* Oscillator already stopped */ }
    }, duration);
  }, [soundEnabled]);

  // Memoized sound triggers
  const sounds = useMemo(() => ({
    small: () => playSound(700, 100),
    commit: () => playSound(520, 160),
    space: () => playSound(400, 100),
    error: () => playSound(200, 300),
  }), [playSound]);

  // --- Handlers ---
  const handleConversion = () => {
    const newTokens = textToTokens(inputText);
    setTokens(newTokens);
  };

  // Logic to commit a chord (used in braille-input mode)
  const commitChord = useCallback(() => {
    if (currentChord.size === 0) return;
    const sortedKey = [...currentChord].sort().join("");
    
    // Priority: Grade 2 Contraction -> Grade 1 Letter
    const result = chordToContraction[sortedKey] || dotsToLetter[sortedKey];

    if (result) {
      setTypedText(prev => prev + result);
      setTokenHistory(prev => [...prev, { text: result, chars: result.length }]);
      sounds.commit();
    } else {
      sounds.error();
    }
    setCurrentChord(new Set());
  }, [currentChord, sounds]);

  // --- Keyboard Event Listener (Braille Input Mode) ---
  useEffect(() => {
    if (mode !== 'braille-input') return;

    const onKeyDown = (e) => {
      const key = e.key.toLowerCase();

      if (ALLOWED_KEYS.includes(key)) {
        e.preventDefault();
        setCurrentChord(prev => new Set(prev).add(key));
        return;
      }

      if (e.key === "Enter") {
        e.preventDefault();
        commitChord();
      } else if (e.key === " ") {
        e.preventDefault();
        setTypedText(prev => prev + " ");
        setTokenHistory(prev => [...prev, { text: " ", chars: 1 }]);
        sounds.space();
        setCurrentChord(new Set());
      } else if (e.key === "Backspace") {
        e.preventDefault();
        if (tokenHistory.length > 0) {
          const last = tokenHistory[tokenHistory.length - 1];
          setTypedText(prev => prev.slice(0, -last.chars));
          setTokenHistory(prev => prev.slice(0, -1));
          sounds.error();
        }
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [mode, commitChord, sounds, tokenHistory]);

  // --- Render Helpers ---
  const renderBrailleCard = (token, idx) => {
    const isContraction = token.display.length > 1 || 
                         (token.dots && !brailleLetters[token.display.toLowerCase()]);

    return (
      <div key={idx} className="flex flex-col items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100 min-w-[85px] animate-in fade-in zoom-in duration-300">
        {isContraction && (
          <span className="text-[10px] font-black text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full mb-2 uppercase tracking-tighter">Grade 2</span>
        )}
        <div className="grid grid-cols-2 gap-3 mb-3">
          {/* Visualizing 1-2-3 (Left) and 4-5-6 (Right) */}
          <div className="space-y-2">
            {['f', 'd', 's'].map(k => (
              <div key={k} className={`w-3.5 h-3.5 rounded-full transition-all duration-300 ${token.dots?.includes(k) ? 'bg-purple-600 shadow-[0_0_8px_rgba(147,51,234,0.4)]' : 'bg-gray-200'}`} />
            ))}
          </div>
          <div className="space-y-2">
            {['j', 'k', 'l'].map(k => (
              <div key={k} className={`w-3.5 h-3.5 rounded-full transition-all duration-300 ${token.dots?.includes(k) ? 'bg-purple-600 shadow-[0_0_8px_rgba(147,51,234,0.4)]' : 'bg-gray-200'}`} />
            ))}
          </div>
        </div>
        <span className="text-sm font-mono font-black text-gray-800 uppercase tracking-widest">{token.display === " " ? "SPC" : token.display}</span>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 min-h-screen font-sans selection:bg-purple-100">
      {/* Mode Switcher */}
      <div className="flex flex-wrap justify-between items-center gap-4 bg-white p-4 rounded-3xl border border-gray-100 shadow-sm mb-8">
        <div className="flex bg-gray-100 p-1.5 rounded-2xl">
          {['reading', 'braille-input'].map((m) => (
            <button
              key={m}
              onClick={() => { setMode(m); setTokens([]); setInputText(""); }}
              className={`px-6 py-2.5 rounded-xl text-sm font-black transition-all ${mode === m ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}
            >
              {m.replace('-', ' ').toUpperCase()}
            </button>
          ))}
        </div>
        <button 
          onClick={() => setSoundEnabled(!soundEnabled)}
          className={`p-2 rounded-xl border transition-all ${soundEnabled ? 'border-purple-200 text-purple-600 bg-purple-50' : 'border-gray-200 text-gray-400'}`}
        >
          {soundEnabled ? '🔊 Sound On' : '🔇 Sound Off'}
        </button>
      </div>

      {/* Input or Output Logic */}
      <div className="space-y-8">
        {mode === 'reading' ? (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
              <textarea
                className="w-full h-32 p-4 border-none text-xl focus:ring-0 outline-none resize-none placeholder:text-gray-300 font-medium"
                placeholder="Type text to see UEB Grade 2 cards..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
              />
              <button 
                onClick={handleConversion}
                className="w-full bg-purple-600 text-white py-4 rounded-2xl font-black text-lg hover:bg-purple-700 transition-all hover:shadow-xl active:scale-[0.98]"
              >
                CONVERT TO BRAILLE
              </button>
            </div>

            <div className="flex flex-wrap gap-4 justify-center">
              {tokens.length > 0 ? (
                tokens.map((t, i) => t.display !== " " ? renderBrailleCard(t, i) : <div key={i} className="w-10" />)
              ) : (
                <div className="text-gray-300 italic py-20">Nothing to display yet.</div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm text-center">
            <h3 className="text-gray-400 text-xs font-black uppercase tracking-[0.2em] mb-6">Chord Entry Mode</h3>
            <div className="min-h-[140px] p-8 bg-gray-900 text-purple-400 rounded-2xl font-mono text-3xl flex items-center justify-center relative border-[6px] border-gray-800 shadow-inner">
              {typedText || <span className="opacity-20">BUILD CHORDS...</span>}
              <span className="ml-2 w-1.5 h-10 bg-purple-400 animate-pulse"></span>
            </div>
            
            <div className="mt-8 flex justify-center gap-4">
              {ALLOWED_KEYS.map(k => (
                <div 
                  key={k} 
                  className={`w-14 h-14 flex items-center justify-center rounded-2xl border-b-4 font-black text-lg transition-all 
                  ${currentChord.has(k) ? 'bg-purple-600 border-purple-800 text-white translate-y-1' : 'bg-white border-gray-200 text-gray-300'}`}
                >
                  {k.toUpperCase()}
                </div>
              ))}
            </div>
            <p className="mt-8 text-xs text-gray-400 font-bold uppercase tracking-widest">
              Hold dots + Enter to commit · Space for gap · Backspace to delete
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrailleTrainer;