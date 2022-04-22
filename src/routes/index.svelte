<script>
  export let locations;

  let hovered = { arrivals: [] };
  let zoom = 9;
  let e = 11;
  let n = 64;

  function handleMouseOver(arrivals, name) {
    return () => {
      if (arrivals) hovered = { arrivals, name };
      else hovered = { arrivals: [] };
    };
  }

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

  let lakes = [
    ['Vg', 'Vag', 'Gop', 'Lkp', 'Mst', 'Khn', 'Ksc', 'Sfl', 'Ål'],
    ['Hka', 'Bry', 'Kbg', 'Lmo', 'Mot', 'xVst'],
    ['Cst', 'Söc', 'Sgs', 'Ksu', 'Kör', 'Kp', 'Ssh', 'Ksu', 'Vå', 'Kän'],
    ['Ör', 'Aä', 'Et', 'Hgö'],
    ['Tåv', 'Ös', 'Svk'],
    ['Mrc', 'Gså', 'Rv', 'Tlg', 'In', 'Vka'],
  ];
</script>

<svg class="root" viewBox="0 0 {zoom} {zoom}">
  {#each lakes as lake}
    <polygon
      points={lake
        .map(
          (code) => `${locations[code].east - e},${n - locations[code].north}`
        )
        .join(' ')}
      fill="blue"
    />
  {/each}

  {#each Object.values(locations) as { code, name, east, north, arrivals }}
    <circle
      class={delayClass(maxDelay(arrivals))}
      on:mouseover={handleMouseOver(arrivals, name, code)}
      cx={east - e}
      cy={n - north}
    />
  {/each}
</svg>
<div>zoom<input type="range" max="16" bind:value={zoom} />{zoom}</div>
<div>east<input type="range" min="10" max="25" bind:value={e} />{e}</div>
<div>north<input type="range" min="55" max="85" bind:value={n} />{n}</div>
<h1>{hovered.name}</h1>
<ol>
  {#each hovered.arrivals as { company, AdvertisedTrainIdent, delay, from, to }}
    <li>
      {company}
      <a href="train/{AdvertisedTrainIdent}">{AdvertisedTrainIdent}</a>
      från {from}
      till {to}
      är {delay} sekunder sent
    </li>
  {/each}
</ol>

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
