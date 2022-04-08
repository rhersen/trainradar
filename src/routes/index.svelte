<script>
  export let locations;

  let station;

  function handleMouseOver(signature) {
    return () => {
      station = signature;
    };
  }
</script>

<svg class="root" viewBox="0 0 1 1">
  {#each locations as { signature, east, north }}
    <circle
      class="dot"
      on:mouseover={handleMouseOver(signature)}
      cx={east - 17.5}
      cy={59.8 - north}
    />
  {/each}
</svg>
<h1>{station}</h1>

<style>
  .root {
    background: black;
  }

  .dot {
    r: 0.005;
    fill: lightgray;
  }
</style>
