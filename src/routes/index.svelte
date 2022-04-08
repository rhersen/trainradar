<script>
  export let locations;
  export let arrivals;

  let hoverText;

  function handleMouseOver(code, name) {
    return () => {
      if (arrivals[code]?.length === 1) {
        const [
          {
            TimeAtLocationWithSeconds,
            AdvertisedTimeAtLocation,
            AdvertisedTrainIdent,
          },
        ] = arrivals[code];
        const actual = Date.parse(TimeAtLocationWithSeconds);
        const advertised = Date.parse(AdvertisedTimeAtLocation);
        hoverText = `Tåg ${AdvertisedTrainIdent} är ${
          (actual - advertised) * 1e-3
        } sekunder sent i ${name}`;
      } else {
        hoverText = `${arrivals[code]?.length} tåg i ${name}`;
      }
    };
  }
</script>

<svg class="root" viewBox="0 0 16 16">
  {#each locations as { code, name, east, north }}
    <circle
      class={arrivals[code] ? 'active' : 'passive'}
      on:mouseover={handleMouseOver(code, name)}
      cx={east - 10}
      cy={70 - north}
    />
  {/each}
</svg>
<h1>{hoverText}</h1>

<style>
  .root {
    background: black;
  }

  .active {
    r: 0.05;
    fill: lightgreen;
  }

  .passive {
    r: 0.02;
    fill: darkgray;
  }
</style>
