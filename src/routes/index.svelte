<script>
  export let locations;
  export let arrivals;

  let station;

  function handleMouseOver(name) {
    return () => {
      station = name;
    };
  }
</script>

<svg class="root" viewBox="0 0 1 1">
  {#each locations as { code, name, east, north }}
    <circle
      class="dot"
      on:mouseover={handleMouseOver(name)}
      cx={east - 17.5}
      cy={59.8 - north}
      fill={arrivals[code] ? 'cyan' : 'lightgray'}
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
  }
</style>
