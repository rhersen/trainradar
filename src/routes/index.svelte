<script>
  export let locations;

  let hoverText;

  function handleMouseOver(arrivals, name, delay) {
    return () => {
      if (arrivals?.length === 1) {
        const [arrival] = arrivals;
        const company = arrival.ProductInformation?.[0]?.Description;
        hoverText = `${company} ${arrival.AdvertisedTrainIdent} är ${delay} sekunder sent i ${name}`;
      } else {
        hoverText = `${arrivals?.length} tåg i ${name}`;
      }
    };
  }

  function delayClass(delay) {
    if (delay === undefined) return 'no-trains';
    if (delay > 480) return 'delay-8';
    if (delay > 240) return 'delay-4';
    if (delay > 120) return 'delay-2';
    if (delay > 60) return 'delay-1';
    return 'on-time';
  }
</script>

<svg class="root" viewBox="0 0 9 9">
  {#each locations as { code, name, east, north, arrivals, delay }}
    <circle
      class={delayClass(delay)}
      on:mouseover={handleMouseOver(arrivals, name, delay)}
      cx={east - 11}
      cy={64 - north}
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

  .no-trains {
    r: 0.02;
    fill: darkgray;
  }
</style>
