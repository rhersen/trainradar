import _ from 'lodash';

export async function get({ params }) {
  console.log(params);
  const announcementPromise = fetch(
    'https://api.trafikinfo.trafikverket.se/v2/data.json',
    {
      method: 'POST',
      body: getBody({ since: '04:00' }),
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
    _.get(json[0], 'RESPONSE.RESULT.0.TrainAnnouncement'),
    'LocationSignature'
  );

  return {
    body: {
      locations: Object.entries(json[1]).map(
        ([code, { Geometry, AdvertisedShortLocationName: name }]) => {
          const [, east, north] = /([\d.]+) ([\d.]+)/.exec(Geometry.WGS84);
          return { code, name, east, north, arrivals: arrivals[code] };
        }
      ),
    },
  };
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
        <INCLUDE>LocationSignature</INCLUDE>
        <INCLUDE>ProductInformation</INCLUDE>
        <INCLUDE>TimeAtLocationWithSeconds</INCLUDE>
        <INCLUDE>ToLocation</INCLUDE>
    </QUERY>
</REQUEST>
`;
}
