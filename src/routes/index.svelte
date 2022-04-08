<script>
  export let locations;
</script>

<svg class="root" viewBox="0 0 16 16">
  {#each locations as { east, north }}
    <circle class="dot" cx={east - 10} cy={70 - north} />
  {/each}
</svg>

<style>
  .root {
    background: black;
  }

  .dot {
    r: 0.04;
    fill: lightgray;
  }
</style>
