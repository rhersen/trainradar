import _ from 'lodash';

export async function get({ params }) {
  console.log(params);
  const announcementPromise = fetch(
    'https://api.trafikinfo.trafikverket.se/v2/data.json',
    {
      method: 'POST',
      body: getBody({ since: '15:00' }),
      headers: {
        'Content-Type': 'application/xml',
        Accept: 'application/json',
      },
    }
  );
  const locationsPromise = fetch(
    'https://trafikverket-locations.netlify.app/geometry.json'
  );

  const responses = await Promise.all([announcementPromise, locationsPromise]);
  const json = [];

  for (let i = 0; i < responses.length; i++)
    if (responses[i].ok) json.push(await responses[i].json());
    else
      return {
        status: responses[i].status,
        body: { msg: responses[i].statusText },
      };

  const arrivals = _.groupBy(
    _.filter(
      _.get(json[0], 'RESPONSE.RESULT.0.TrainAnnouncement'),
      ({ ProductInformation, FromLocation, ToLocation }) =>
        ProductInformation?.length || FromLocation?.length || ToLocation?.length
    ).map((arrival) => ({
      ...arrival,
      company: arrival.ProductInformation?.[0]?.Description,
      delay: delayInSeconds(arrival),
      from: locationName(arrival.FromLocation, json[1]),
      to: locationName(arrival.ToLocation, json[1]),
    })),
    'LocationSignature'
  );

  return {
    body: {
      locations: _.mapValues(
        json[1],
        ({ Geometry, AdvertisedShortLocationName: name }, code) => {
          const [, east, north] = /([\d.]+) ([\d.]+)/.exec(Geometry.WGS84);
          return {
            name,
            east,
            north,
            arrivals: arrivals[code] ? arrivals[code] : [],
          };
        }
      ),
    },
  };
}

function delayInSeconds(arrival) {
  const actual = Date.parse(arrival.TimeAtLocationWithSeconds);
  const advertised = Date.parse(arrival.AdvertisedTimeAtLocation);
  return (actual - advertised) * 1e-3;
}

function getBody({ since }) {
  return `
<REQUEST>
    <LOGIN authenticationkey='${process.env.TRAFIKVERKET_API_KEY}'/>
    <QUERY sseurl='false' objecttype='TrainAnnouncement' schemaversion='1.6'>
        <FILTER>
            <GT name='TimeAtLocation' value='$dateadd(-0.00:${since})'/>
            <EQ name='ActivityType' value='Ankomst'/>
        </FILTER>
        <INCLUDE>AdvertisedTrainIdent</INCLUDE>
        <INCLUDE>AdvertisedTimeAtLocation</INCLUDE>
        <INCLUDE>FromLocation</INCLUDE>
        <INCLUDE>LocationSignature</INCLUDE>
        <INCLUDE>ProductInformation</INCLUDE>
        <INCLUDE>TimeAtLocationWithSeconds</INCLUDE>
        <INCLUDE>ToLocation</INCLUDE>
    </QUERY>
</REQUEST>
`;
}

function locationName(location, locations) {
  return _.join(
    _.map(
      _.map(location, 'LocationName'),
      (l) => locations[l].AdvertisedShortLocationName
    )
  );
}
