<script>
  export let locations;
</script>

<svg width="100%" viewBox="0 0 16 16">
  {#each locations as { east, north }}
    <circle r=".04" cx={east - 10} cy={70 - north} />
  {/each}
</svg>
