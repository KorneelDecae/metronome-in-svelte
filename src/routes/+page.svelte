<script lang="ts">
  import { createMetronome } from '$lib/metronome';
  import { writable } from 'svelte/store';

  const { metronome, start, stop } = createMetronome(120, 4);
  let bpm = writable(120);

  $: metronome.update(s => ({ ...s, bpm: $bpm }));
</script>

<main class="app">
  <div class="card">
    <h1>Korneel's Metronome</h1>

    <div class="bpm-section">
      <div class="bpm-value">{$bpm}</div>
      <div class="bpm-label">BPM</div>
    </div>

    <input
      type="range"
      min="40"
      max="240"
      bind:value={$bpm}
      class="slider"
    />

    <button
      class="control {$metronome.isPlaying ? 'stop' : 'start'}"
      on:click={() => $metronome.isPlaying ? stop() : start()}
    >
      {#if $metronome.isPlaying}Stop{:else}Start{/if}
    </button>
  </div>
</main>

<style>
  /* --- Reset & overflow fix --- */
  :global(html, body) {
    margin: 0;
    padding: 0;
    height: 100%;
    overflow: hidden; /* voorkomt mini-scrollbars */
    background: #1c1f1a;
  }

  .app {
    height: 100vh;
    width: 100vw;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  /* --- Card --- */
  .card {
    width: 320px;
    padding: 40px 30px;
    border-radius: 28px;
    background: rgba(35, 40, 30, 0.85);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    box-shadow:
      0 10px 30px rgba(0, 0, 0, 0.4),
      inset 0 1px 0 rgba(255, 255, 255, 0.05);
    text-align: center;
    font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif;
    color: #f5f5f5;
  }

  h1 {
    font-size: 18px;
    font-weight: 500;
    margin-bottom: 40px;
    letter-spacing: 0.5px;
    opacity: 0.85;
  }

  /* --- BPM display --- */
  .bpm-section {
    margin-bottom: 30px;
  }

  .bpm-value {
    font-size: 64px;
    font-weight: 600;
    color: #4f6f3a; /* donker olijfgroen */
    line-height: 1;
  }

  .bpm-label {
    font-size: 13px;
    letter-spacing: 2px;
    opacity: 0.5;
    margin-top: 5px;
  }

  /* --- Slider --- */
  .slider {
    width: 100%;
    margin-bottom: 40px;
    accent-color: #4f6f3a;
  }

  /* --- Button --- */
  .control {
    width: 140px;
    height: 140px;
    border-radius: 50%;
    border: none;
    font-size: 17px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .start {
    background: #4f6f3a;
    color: #ffffff;
  }

  .stop {
    background: #2e3b24;
    color: #ffffff;
    border: 1px solid #4f6f3a;
  }

  .control:hover {
    transform: scale(1.03);
  }

  .control:active {
    transform: scale(0.97);
  }
</style>