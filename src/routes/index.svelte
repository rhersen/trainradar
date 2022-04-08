<script>
  export let locations;
</script>

<svg class="root" viewBox="0 0 1 1">
  {#each locations as { east, north }}
    <circle class="dot" cx={east - 17.5} cy={59.8 - north} />
  {/each}
</svg>

<style>
  .root {
    background: black;
  }

  .dot {
    r: 0.005;
    fill: lightgray;
  }
</style>
