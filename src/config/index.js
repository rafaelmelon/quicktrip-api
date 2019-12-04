const CONFIG = {
  API: {
    lang: "es",
    google: "https://maps.googleapis.com/maps/api/",
    places: {
      key: process.env.API_KEY_PLACES,
      autocomplete: "place/autocomplete/json?",
      findplacefromtext: "place/findplacefromtext/json?",
      nearbysearch: "place/nearbysearch/json?",
    }
  }
};

module.exports = CONFIG;

