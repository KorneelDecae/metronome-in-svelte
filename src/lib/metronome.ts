import { writable, get } from 'svelte/store';

export type MetronomeState = {
  bpm: number;
  isPlaying: boolean;
  beat: number;
  beatsPerMeasure: number;
};

export function createMetronome(initialBpm = 120, initialBeats = 4) {
  const state = writable<MetronomeState>({
    bpm: initialBpm,
    isPlaying: false,
    beat: 0,
    beatsPerMeasure: initialBeats
  });

  let audioContext: AudioContext | null = null;
  let intervalId: number | null = null;
  let currentBeat = 0;

  function playClick(accent = false) {
    if (!audioContext) return;

    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();

    osc.type = 'square';
    osc.frequency.value = accent ? 1400 : 900;

    gain.gain.setValueAtTime(1, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(
      0.001,
      audioContext.currentTime + 0.05
    );

    osc.connect(gain);
    gain.connect(audioContext.destination);

    osc.start();
    osc.stop(audioContext.currentTime + 0.05);
  }

  function tick() {
    const { beatsPerMeasure } = get(state);

    const isAccent = currentBeat === 0;
    playClick(isAccent);

    state.update(s => ({
      ...s,
      beat: currentBeat
    }));

    currentBeat = (currentBeat + 1) % beatsPerMeasure;
  }

  function start() {
    if (get(state).isPlaying) return;

    audioContext = new AudioContext();
    currentBeat = 0;

    state.update(s => ({ ...s, isPlaying: true }));

    restartInterval();
  }

  function stop() {
    if (intervalId) clearInterval(intervalId);
    intervalId = null;

    audioContext?.close();
    audioContext = null;

    state.update(s => ({
      ...s,
      isPlaying: false,
      beat: 0
    }));
  }

  function restartInterval() {
    if (intervalId) clearInterval(intervalId);

    const { bpm } = get(state);
    const interval = (60 / bpm) * 1000;

    intervalId = window.setInterval(tick, interval);
  }

  let previousBeats = initialBeats;

state.subscribe(s => {
  if (s.isPlaying) {
    restartInterval();
  }

  if (s.beatsPerMeasure !== previousBeats) {
    currentBeat = 0;

    state.update(st => ({
      ...st,
      beat: 0
    }));

    previousBeats = s.beatsPerMeasure;
  }
});

  return {
    metronome: state,
    start,
    stop
  };
}