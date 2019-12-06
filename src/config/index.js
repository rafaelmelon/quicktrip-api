const { PORT, KEY_GOOGLE_PLACES, KEY_MAPBOX } = process.env;

const CONFIG = {
  PORT: PORT || 8080,
  API: {
    lang: "es",
    google: {
      api: "https://maps.googleapis.com/maps/api/",
      places: {
        key: KEY_GOOGLE_PLACES,
        autocomplete: "place/autocomplete/json?",
        findplacefromtext: "place/findplacefromtext/json?",
        nearbysearch: "place/nearbysearch/json?"
      }
    },
    mapbox: {
      api: "https://api.mapbox.com/",
      geocoding: {
        key: KEY_MAPBOX,
        places: "geocoding/v5/mapbox.places/"
      }
    }
  }
};

module.exports = CONFIG;
