import { writable, type Writable, get } from 'svelte/store';
import { onMount, onDestroy } from 'svelte';

export interface Metronome {
  bpm: number;
  isPlaying: boolean;
}

export function createMetronome(initialBpm = 120, beatsPerMeasure = 4) {
  const metronome = writable<Metronome>({ bpm: initialBpm, isPlaying: false });
  let audioCtx: AudioContext;
  let timeout: ReturnType<typeof setTimeout> | null = null;
  let currentBeat = 1;

  onMount(() => {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  });

  function playClick(): void {
    if (!audioCtx) return;

    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.type = 'square';
    oscillator.frequency.setValueAtTime(currentBeat === 1 ? 1500 : 1000, audioCtx.currentTime);
    gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);

    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.05);

    currentBeat = currentBeat < beatsPerMeasure ? currentBeat + 1 : 1;
  }

  function tick() {
    playClick();

    const bpmValue = get(metronome).bpm;
    timeout = setTimeout(tick, 60000 / bpmValue);
  }

  function start() {
    metronome.update(s => ({ ...s, isPlaying: true }));
    currentBeat = 1;
    tick();
  }

  function stop() {
    metronome.update(s => ({ ...s, isPlaying: false }));
    if (timeout) clearTimeout(timeout);
    timeout = null;
  }

  onDestroy(() => {
    if (timeout) clearTimeout(timeout);
  });

  return { metronome, start, stop, playClick };
}