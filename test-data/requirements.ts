const testCases = [
  {
    description:
      'Filter vehicles with year between 2015 and 2019 and with less than 200k km (Njuškalo)',
    url: '/',
    searchTerm: 'Audi',
    yearFrom: 2015,
    yearTo: 2019,
    minKm: 0,
    maxKm: 200000,
  },
  {
    description:
      'Filter vehicles with year between 2018 and 2022 and with less than 100k km (Bolha)',
    url: process.env.BOLHA_URL,
    searchTerm: 'BMW',
    yearFrom: 2018,
    yearTo: 2022,
    minKm: 0,
    maxKm: 100000,
  },
];

export default testCases;
