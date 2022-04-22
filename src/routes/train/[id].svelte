<script>
  export let locations;
  export let id;

  function maxDelay(arrivals) {
    if (!arrivals.length) return undefined;
    return arrivals.map(delayInSeconds).reduce((a, b) => (a > b ? a : b));
  }

  function delayInSeconds(arrival) {
    const actual = Date.parse(arrival.TimeAtLocationWithSeconds);
    const advertised = Date.parse(arrival.AdvertisedTimeAtLocation);
    return (actual - advertised) * 1e-3;
  }

  function delayClass(delay) {
    if (delay === undefined) return 'no-trains';
    if (delay > 480) return 'delay-8';
    if (delay > 240) return 'delay-4';
    if (delay > 120) return 'delay-2';
    if (delay > 60) return 'delay-1';
    return 'on-time';
  }

  function x(east) {
    return east - 11;
  }

  function y(north) {
    return 64 - north;
  }

  let lakes = [
    ['Vg', 'Vag', 'Gop', 'Lkp', 'Mst', 'Khn', 'Ksc', 'Sfl', 'Ål'],
    ['Hka', 'Bry', 'Kbg', 'Lmo', 'Mot', 'xVst'],
    ['Cst', 'Söc', 'Sgs', 'Ksu', 'Kör', 'Kp', 'Ssh', 'Ksu', 'Vå', 'Kän'],
    ['Ör', 'Aä', 'Et', 'Hgö'],
    ['Tåv', 'Ös', 'Svk'],
    ['Mrc', 'Gså', 'Rv', 'Tlg', 'In', 'Vka'],
  ].map((lake) =>
    lake
      .map((code) => `${x(locations[code].east)},${y(locations[code].north)}`)
      .join(' ')
  );
</script>

<svg class="root" viewBox="0 0 9 9">
  {#each lakes as points}
    <polygon {points} fill="blue" />
  {/each}

  {#each Object.values(locations) as { code, name, east, north, arrivals }}
    <circle class={delayClass(maxDelay(arrivals))} cx={x(east)} cy={y(north)} />
  {/each}
</svg>
<h1>{id}</h1>

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
