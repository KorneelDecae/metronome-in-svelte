<script lang="ts">
  import { createMetronome } from '$lib/metronome';
  import { writable } from 'svelte/store';

  const { metronome, start, stop } = createMetronome(120, 4);
  let bpm = writable(120);

  $: metronome.update(s => ({ ...s, bpm: $bpm }));
</script>

<main class="container">
  <h1>Simple Metronome</h1>

  <div class="controls">
    <label>
      BPM:
      <input type="number" bind:value={$bpm} min="40" max="240" />
    </label>

    <button on:click={() => $metronome.isPlaying ? stop() : start()}>
      {#if $metronome.isPlaying}Stop{:else}Start{/if}
    </button>
  </div>
</main>

<style>
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 50px;
    font-family: sans-serif;
  }

  .controls {
    margin-top: 20px;
  }

  input {
    width: 60px;
    margin-left: 5px;
  }

  button {
    margin-left: 10px;
    padding: 5px 15px;
    font-size: 16px;
  }
</style>