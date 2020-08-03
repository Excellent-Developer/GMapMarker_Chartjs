import { getName } from "country-list";

const countryInfo = require("./country.json");
const countryGeocode = require("./countrycode-to-latlng.json");

const arrangeCountryInfo = () => {
  const countries = {};
  const list = [];
  countryInfo.hits.hits.map((item) => {
    const geocode = countryGeocode[item._source.Country.toLocaleLowerCase()];
    if (geocode) {
      if (!countries[item._source.Country]) {
        countries[item._source.Country] = {
          lat: geocode[0],
          lng: geocode[1],
          name: getName(item._source.Country),
          sources: [item._source],
        };
        list.push(item._source.Country);
      } else {
        countries[item._source.Country].sources = arraySourceByDate(
          countries[item._source.Country].sources,
          item._source
        );
      }
    }
  });
  countries.list = list;
  return countries;
};

function arraySourceByDate(currentSources = [], newSource) {
  for (let i = 0; i < currentSources.length; i++) {
    if (currentSources[i].Date > newSource.Date) {
      currentSources.splice(i, 0, newSource);
      return currentSources;
    }
  }
  currentSources.splice(currentSources.length - 1, 0, newSource);
  return currentSources;
}

export default arrangeCountryInfo;
