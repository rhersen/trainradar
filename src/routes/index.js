export async function get({ params }) {
  console.log(params);
  const locationsPromise = fetch(
    'https://trafikverket-locations.netlify.app/geometry.json'
  );
  const response = await locationsPromise;
  return {
    body: {
      locations: Object.entries(await response.json()).map(
        ([signature, value]) => {
          const [, east, north] = /([\d.]+) ([\d.]+)/.exec(
            value.Geometry.WGS84
          );
          return { signature, east, north };
        }
      ),
    },
  };
}
