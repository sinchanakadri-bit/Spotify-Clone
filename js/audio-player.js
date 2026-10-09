/**
 * Spotify Clone - Audio Playback Engine
 * Features:
 * - HTML5 Audio playback with stream handling
 * - Built-in Web Audio API Synthesizer fallback for 100% reliable offline/online playback
 * - Visualizer canvas rendering
 * - Queue, Shuffle & Repeat management
 */

class AudioPlayerEngine {
  constructor() {
    this.audioElement = document.getElementById('main-audio-element');
    this.currentTrack = null;
    this.queue = [];
    this.originalQueue = [];
    this.queueIndex = 0;
    
    this.isPlaying = false;
    this.isShuffle = false;
    this.repeatMode = 'all'; // 'off' | 'all' | 'one'
    this.volume = 0.8;
    this.isMuted = false;
    
    // Audio Context & Synth fallback
    this.audioCtx = null;
    this.analyser = null;
    this.synthInterval = null;
    this.isUsingSynthFallback = false;
    this.synthSimulatedTime = 0;
    this.synthTimer = null;
    
    // Callbacks
    this.onTrackChange = null;
    this.onPlayStateChange = null;
    this.onTimeUpdate = null;
    this.onQueueChange = null;

    this.initAudioElement();
    this.initVisualizer();
  }

  initAudioElement() {
    this.audioElement.volume = this.volume;

    // Time update listener
    this.audioElement.addEventListener('timeupdate', () => {
      if (!this.isUsingSynthFallback && this.onTimeUpdate) {
        this.onTimeUpdate(this.audioElement.currentTime, this.audioElement.duration || (this.currentTrack ? this.currentTrack.duration : 0));
      }
    });

    // Track ended listener
    this.audioElement.addEventListener('ended', () => {
      this.handleTrackEnded();
    });

    // Error handling -> Fallback to procedural Web Audio synth
    this.audioElement.addEventListener('error', (e) => {
      console.warn("HTML5 Audio stream encountered error. Activating procedural Web Audio fallback...", e);
      this.startSynthFallback();
    });
  }

  initWebAudio() {
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
        this.analyser = this.audioCtx.createAnalyser();
        this.analyser.fftSize = 64;
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  loadPlaylist(tracks, startIndex = 0, autoPlay = true) {
    if (!tracks || tracks.length === 0) return;
    this.originalQueue = [...tracks];
    this.queue = this.isShuffle ? this.shuffleArray([...tracks]) : [...tracks];
    this.queueIndex = Math.max(0, Math.min(startIndex, this.queue.length - 1));
    this.loadTrack(this.queue[this.queueIndex], autoPlay);
    
    if (this.onQueueChange) {
      this.onQueueChange(this.queue, this.queueIndex);
    }
  }

  loadTrack(track, autoPlay = true) {
    if (!track) return;
    this.stopSynthFallback();
    this.currentTrack = track;
    this.isUsingSynthFallback = false;
    this.audioElement.src = track.audioUrl;
    this.audioElement.currentTime = 0;

    if (this.onTrackChange) {
      this.onTrackChange(this.currentTrack);
    }

    if (autoPlay) {
      this.play();
    } else {
      this.pause();
    }
  }

  play() {
    this.initWebAudio();
    this.isPlaying = true;

    if (this.isUsingSynthFallback) {
      this.resumeSynthFallback();
      if (this.onPlayStateChange) this.onPlayStateChange(true);
      return;
    }

    const playPromise = this.audioElement.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          this.isPlaying = true;
          if (this.onPlayStateChange) this.onPlayStateChange(true);
        })
        .catch((error) => {
          console.warn("Direct audio playback blocked or network unavailable. Activating interactive Synth fallback.", error);
          this.startSynthFallback();
          if (this.onPlayStateChange) this.onPlayStateChange(true);
        });
    }
  }

  pause() {
    this.isPlaying = false;
    if (this.isUsingSynthFallback) {
      this.pauseSynthFallback();
    } else {
      this.audioElement.pause();
    }
    if (this.onPlayStateChange) {
      this.onPlayStateChange(false);
    }
  }

  togglePlay() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  next() {
    if (this.queue.length === 0) return;
    if (this.repeatMode === 'one') {
      this.seekTo(0);
      this.play();
      return;
    }
    if (this.queueIndex < this.queue.length - 1) {
      this.queueIndex++;
      this.loadTrack(this.queue[this.queueIndex], true);
    } else if (this.repeatMode === 'all') {
      this.queueIndex = 0;
      this.loadTrack(this.queue[this.queueIndex], true);
    } else {
      this.pause();
      this.seekTo(0);
    }
    if (this.onQueueChange) {
      this.onQueueChange(this.queue, this.queueIndex);
    }
  }

  prev() {
    if (this.queue.length === 0) return;
    // If song is more than 3 seconds in, restart track
    const currentSeconds = this.getCurrentTime();
    if (currentSeconds > 3) {
      this.seekTo(0);
      return;
    }

    if (this.queueIndex > 0) {
      this.queueIndex--;
    } else {
      this.queueIndex = this.queue.length - 1;
    }
    this.loadTrack(this.queue[this.queueIndex], true);
    if (this.onQueueChange) {
      this.onQueueChange(this.queue, this.queueIndex);
    }
  }

  handleTrackEnded() {
    if (this.repeatMode === 'one') {
      this.seekTo(0);
      this.play();
    } else {
      this.next();
    }
  }

  seekTo(seconds) {
    if (this.isUsingSynthFallback) {
      this.synthSimulatedTime = seconds;
      if (this.onTimeUpdate && this.currentTrack) {
        this.onTimeUpdate(this.synthSimulatedTime, this.currentTrack.duration);
      }
    } else {
      if (this.audioElement.duration) {
        this.audioElement.currentTime = seconds;
      }
    }
  }

  seekPercent(percent) {
    const duration = this.getDuration();
    if (duration > 0) {
      const targetTime = duration * percent;
      this.seekTo(targetTime);
    }
  }

  setVolume(val) {
    this.volume = Math.max(0, Math.min(1, val));
    this.audioElement.volume = this.volume;
    this.isMuted = this.volume === 0;
  }

  toggleMute() {
    if (this.isMuted) {
      this.isMuted = false;
      this.audioElement.volume = this.volume > 0 ? this.volume : 0.7;
    } else {
      this.isMuted = true;
      this.audioElement.volume = 0;
    }
    return this.isMuted;
  }

  toggleShuffle() {
    this.isShuffle = !this.isShuffle;
    const current = this.currentTrack;
    if (this.isShuffle) {
      this.queue = this.shuffleArray([...this.originalQueue]);
      if (current) {
        // Move current song to head of queue
        this.queue = [current, ...this.queue.filter(t => t.id !== current.id)];
        this.queueIndex = 0;
      }
    } else {
      this.queue = [...this.originalQueue];
      if (current) {
        this.queueIndex = this.queue.findIndex(t => t.id === current.id);
        if (this.queueIndex === -1) this.queueIndex = 0;
      }
    }
    if (this.onQueueChange) {
      this.onQueueChange(this.queue, this.queueIndex);
    }
    return this.isShuffle;
  }

  toggleRepeat() {
    if (this.repeatMode === 'all') {
      this.repeatMode = 'one';
    } else if (this.repeatMode === 'one') {
      this.repeatMode = 'off';
    } else {
      this.repeatMode = 'all';
    }
    return this.repeatMode;
  }

  getCurrentTime() {
    if (this.isUsingSynthFallback) {
      return this.synthSimulatedTime;
    }
    return this.audioElement.currentTime || 0;
  }

  getDuration() {
    if (this.isUsingSynthFallback && this.currentTrack) {
      return this.currentTrack.duration;
    }
    return this.audioElement.duration || (this.currentTrack ? this.currentTrack.duration : 180);
  }

  shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  /* ==========================================================================
     PROCEDURAL SYNTH FALLBACK (Produces soothing music when offline/no CORS)
     ========================================================================== */
  startSynthFallback() {
    this.isUsingSynthFallback = true;
    this.initWebAudio();
    if (!this.audioCtx) return;

    // Chords database for musicality (frequencies in Hz)
    const chordSets = {
      synthwave: [[220, 261.63, 329.63], [174.61, 220, 261.63], [196, 246.94, 293.66], [164.81, 196, 246.94]],
      lofi: [[261.63, 329.63, 392, 493.88], [220, 261.63, 329.63, 392], [174.61, 220, 261.63, 329.63], [196, 246.94, 293.66, 349.23]],
      dance: [[130.81, 196, 261.63], [146.83, 220, 293.66], [164.81, 246.94, 329.63], [174.61, 261.63, 349.23]],
      ambient: [[196, 246.94, 293.66, 392], [220, 277.18, 329.63, 440], [174.61, 220, 261.63, 349.23]]
    };

    const preset = (this.currentTrack && this.currentTrack.synthPreset) || 'lofi';
    const chords = chordSets[preset] || chordSets.lofi;
    let chordIndex = 0;

    const playChordStep = () => {
      if (!this.isPlaying || !this.isUsingSynthFallback) return;
      const currentChord = chords[chordIndex % chords.length];
      chordIndex++;

      currentChord.forEach((freq, i) => {
        try {
          const osc = this.audioCtx.createOscillator();
          const gain = this.audioCtx.createGain();
          
          osc.type = i === 0 ? 'sine' : (preset === 'dance' ? 'sawtooth' : 'triangle');
          osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);

          const now = this.audioCtx.currentTime;
          const masterVol = this.isMuted ? 0 : this.volume * 0.12;
          
          gain.gain.setValueAtTime(0.001, now);
          gain.gain.exponentialRampToValueAtTime(masterVol, now + 0.15);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 1.8);

          osc.connect(gain);
          if (this.analyser) {
            gain.connect(this.analyser);
          }
          gain.connect(this.audioCtx.destination);

          osc.start(now);
          osc.stop(now + 2.0);
        } catch(e) {
          // ignore context errors
        }
      });
    };

    if (this.synthInterval) clearInterval(this.synthInterval);
    this.synthInterval = setInterval(playChordStep, 1800);
    playChordStep();

    // Simulated progress timer
    if (this.synthTimer) clearInterval(this.synthTimer);
    this.synthTimer = setInterval(() => {
      if (this.isPlaying) {
        this.synthSimulatedTime += 0.25;
        const total = this.currentTrack ? this.currentTrack.duration : 180;
        if (this.onTimeUpdate) {
          this.onTimeUpdate(this.synthSimulatedTime, total);
        }
        if (this.synthSimulatedTime >= total) {
          this.handleTrackEnded();
        }
      }
    }, 250);
  }

  pauseSynthFallback() {
    if (this.synthInterval) {
      clearInterval(this.synthInterval);
      this.synthInterval = null;
    }
  }

  resumeSynthFallback() {
    if (this.isUsingSynthFallback && !this.synthInterval) {
      this.startSynthFallback();
    }
  }

  stopSynthFallback() {
    this.isUsingSynthFallback = false;
    this.synthSimulatedTime = 0;
    if (this.synthInterval) {
      clearInterval(this.synthInterval);
      this.synthInterval = null;
    }
    if (this.synthTimer) {
      clearInterval(this.synthTimer);
      this.synthTimer = null;
    }
  }

  /* ==========================================================================
     VISUALIZER CANVAS RENDERER
     ========================================================================== */
  initVisualizer() {
    const canvas = document.getElementById('mini-audio-visualizer');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const render = () => {
      requestAnimationFrame(render);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const numBars = 5;
      const barWidth = 4;
      const gap = 4;
      const startX = (canvas.width - (numBars * barWidth + (numBars - 1) * gap)) / 2;

      for (let i = 0; i < numBars; i++) {
        let barHeight = 4;
        if (this.isPlaying) {
          const t = Date.now() / 250 + i * 0.8;
          barHeight = 4 + Math.abs(Math.sin(t)) * 14;
        }

        const x = startX + i * (barWidth + gap);
        const y = canvas.height - barHeight;

        ctx.fillStyle = this.isPlaying ? '#1ed760' : '#4d4d4d';
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeight, 2);
        ctx.fill();
      }
    };
    render();
  }
}
