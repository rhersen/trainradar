export async function get({ params }) {
  console.log(params);
  const locationsPromise = fetch(
    'https://trafikverket-locations.netlify.app/geometry.json'
  );
  const response = await locationsPromise;
  return {
    body: {
      locations: Object.entries(await response.json()).map(
        ([code, { Geometry, AdvertisedShortLocationName: name }]) => {
          const [, east, north] = /([\d.]+) ([\d.]+)/.exec(Geometry.WGS84);
          return { code, name, east, north };
        }
      ),
    },
  };
}
