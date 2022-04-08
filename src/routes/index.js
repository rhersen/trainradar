export async function get({ params }) {
  console.log(params);
  const locationsPromise = fetch(
    'https://trafikverket-locations.netlify.app/short.json'
  );
  let response = await locationsPromise;
  return { body: { locations: await response.json() } };
}
