<script>
  export let locations;
  export let arrivals;

  let hoverText;

  function delayInSeconds(arrival) {
    const actual = Date.parse(arrival.TimeAtLocationWithSeconds);
    const advertised = Date.parse(arrival.AdvertisedTimeAtLocation);
    return (actual - advertised) * 1e-3;
  }

  function handleMouseOver(code, name) {
    return () => {
      if (arrivals[code]?.length === 1) {
        const [arrival] = arrivals[code];
        const company = arrival.ProductInformation?.[0]?.Description;
        hoverText = `${company} ${
          arrival.AdvertisedTrainIdent
        } är ${delayInSeconds(arrival)} sekunder sent i ${name}`;
      } else {
        hoverText = `${arrivals[code]?.length} tåg i ${name}`;
      }
    };
  }

  function delayClass(arrivals) {
    if (!arrivals || !arrivals.length) return 'passive';
    const delay = delayInSeconds(arrivals[0]);
    if (delay > 480) return 'delay-8';
    if (delay > 240) return 'delay-4';
    if (delay > 120) return 'delay-2';
    if (delay > 60) return 'delay-1';
    return 'on-time';
  }
</script>

<svg class="root" viewBox="0 0 16 16">
  {#each locations as { code, name, east, north }}
    <circle
      class={delayClass(arrivals[code])}
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

  .on-time {
    r: 0.05;
    fill: lightgreen;
  }

  .delay-1 {
    r: 0.05;
    fill: white;
  }

  .delay-2 {
    r: 0.05;
    fill: yellow;
  }

  .delay-4 {
    r: 0.05;
    fill: orange;
  }

  .delay-8 {
    r: 0.05;
    fill: red;
  }

  .passive {
    r: 0.02;
    fill: darkgray;
  }
</style>
