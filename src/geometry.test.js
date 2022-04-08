import { expect, test } from 'vitest';

test('should', () => {
  const data = {
    A: {
      AdvertisedShortLocationName: 'Alingsås',
      Geometry: {
        SWEREF99TM: 'POINT (353852 6423240)',
        WGS84: 'POINT (12.53218546120595 57.92690516993427)',
      },
    },
    Acm: {
      AdvertisedShortLocationName: 'Avesta centrum',
      Geometry: {
        SWEREF99TM: 'POINT (565001 6668391)',
        WGS84: 'POINT (16.17060693896951 60.1472930337373)',
      },
    },
  };

  const [, east, north] = /([\d.]+) ([\d.]+)/.exec(data.A.Geometry.WGS84);
  expect(east).toBe('12.53218546120595');
  expect(north).toBe('57.92690516993427');
  expect(
    Object.entries(data).map(([signature, value]) => {
      const [, east, north] = /([\d.]+) ([\d.]+)/.exec(value.Geometry.WGS84);
      return { signature, east, north };
    })
  ).toEqual([
    {
      signature: 'A',
      east: '12.53218546120595',
      north: '57.92690516993427',
    },
    {
      signature: 'Acm',
      east: '16.17060693896951',
      north: '60.1472930337373',
    },
  ]);
});
