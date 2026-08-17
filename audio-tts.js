/**
 * ====================================================================
 * EDUKIDS - AUDIO & TEXT-TO-SPEECH (TTS) ENGINE
 * Web Audio API synthesizer for instant zero-dependency sound effects
 * & Web Speech API for Indonesian spoken narration for kindergarten kids.
 * ====================================================================
 */

// Web Audio Context initialization
let audioCtx = null;

function getAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

// Sound Synthesis: Pop / Click
function playPop() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    const now = ctx.currentTime;
    osc.frequency.setValueAtTime(400, now);
    osc.frequency.exponentialRampToValueAtTime(800, now + 0.08);
    
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start(now);
    osc.stop(now + 0.08);
  } catch (e) {
    console.warn('Audio play error:', e);
  }
}

// Sound Synthesis: Correct Answer Chime
function playCorrect() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const startTime = ctx.currentTime + (idx * 0.09);
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime);
      
      gain.gain.setValueAtTime(0.25, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.25);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(startTime);
      osc.stop(startTime + 0.25);
    });
  } catch (e) {
    console.warn('Audio play error:', e);
  }
}

// Sound Synthesis: Wrong Answer (Gentle Boing)
function playWrong() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const now = ctx.currentTime;
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(250, now);
    osc.frequency.exponentialRampToValueAtTime(130, now + 0.25);
    
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start(now);
    osc.stop(now + 0.25);
  } catch (e) {
    console.warn('Audio play error:', e);
  }
}

// Sound Synthesis: Victory Fanfare
function playFanfare() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const notes = [
      { f: 523.25, d: 0.15 }, // C5
      { f: 659.25, d: 0.15 }, // E5
      { f: 783.99, d: 0.15 }, // G5
      { f: 1046.50, d: 0.45 } // C6
    ];
    let time = ctx.currentTime;
    notes.forEach(note => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(note.f, time);
      
      gain.gain.setValueAtTime(0.3, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + note.d);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(time);
      osc.stop(time + note.d);
      time += note.d * 0.85;
    });
  } catch (e) {
    console.warn('Audio play error:', e);
  }
}

// Sound Synthesis: Magic Star Ding
function playStarDing() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const now = ctx.currentTime;
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1318.51, now); // E6
    osc.frequency.exponentialRampToValueAtTime(1760.00, now + 0.15); // A6
    
    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start(now);
    osc.stop(now + 0.3);
  } catch (e) {
    console.warn('Audio play error:', e);
  }
}

// ==========================================
// TEXT-TO-SPEECH (TTS) NARRATOR FOR KIDS
// ==========================================
let currentUtterance = null;
let isSpeaking = false;

function speakText(text, callback) {
  if (!('speechSynthesis' in window)) {
    console.warn('SpeechSynthesis is not supported in this browser.');
    if (callback) callback();
    return;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  // Create utterance
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'id-ID';
  utterance.rate = 0.95; // Slightly slower for kindergarten kids
  utterance.pitch = 1.25; // Friendly higher pitch like cartoon mascot

  // Find Indonesian voice if available
  const voices = window.speechSynthesis.getVoices();
  const idVoice = voices.find(v => v.lang.includes('id') || v.lang.includes('ID') || v.name.toLowerCase().includes('indonesia'));
  if (idVoice) {
    utterance.voice = idVoice;
  }

  // Visual status feedback
  const mascotBubble = document.getElementById('mascot-speech-bubble');
  const mascotText = document.getElementById('mascot-speech-text');
  if (mascotBubble && mascotText) {
    mascotText.innerText = text;
    mascotBubble.classList.add('active');
  }

  utterance.onstart = () => {
    isSpeaking = true;
    document.body.classList.add('is-narrating');
    const mascot = document.getElementById('komi-mascot-img');
    if (mascot) mascot.classList.add('talking');
  };

  utterance.onend = () => {
    isSpeaking = false;
    document.body.classList.remove('is-narrating');
    const mascot = document.getElementById('komi-mascot-img');
    if (mascot) mascot.classList.remove('talking');
    if (callback) callback();
  };

  utterance.onerror = () => {
    isSpeaking = false;
    document.body.classList.remove('is-narrating');
    const mascot = document.getElementById('komi-mascot-img');
    if (mascot) mascot.classList.remove('talking');
    if (callback) callback();
  };

  currentUtterance = utterance;
  window.speechSynthesis.speak(utterance);
}

function stopSpeaking() {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    isSpeaking = false;
    document.body.classList.remove('is-narrating');
    const mascot = document.getElementById('komi-mascot-img');
    if (mascot) mascot.classList.remove('talking');
  }
}

// Pre-load voices
if ('speechSynthesis' in window) {
  window.speechSynthesis.onvoiceschanged = () => {
    // Voices cached
  };
}

// Global exports
window.EduAudio = {
  playPop,
  playCorrect,
  playWrong,
  playFanfare,
  playStarDing,
  speakText,
  stopSpeaking
};
