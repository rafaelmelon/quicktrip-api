const fetch = require("node-fetch");

const CONFIG = require("../config");

const getAutocomplete = (req, res) => {
  const { API } = CONFIG;
  const { values } = req.params;

  let url = new URL(`${API.google}${API.places.autocomplete}`);
  let params = new URLSearchParams(url.search.slice(1));
  params.append("key", API.places.key);
  params.append("language", API.lang);
  params.append("input", values);
  params.append("types", "(cities)");
  const mergeUrl = url.toString() + params.toString();

  return fetch(mergeUrl)
    .then(response => response.json())
    .then(data => {
      res.send(data.predictions);
    })
    .catch(error => console.error("CONSOLE ERROR", error));
};

const getPlacesNearBySearch = (req, res) => {
  const { API } = CONFIG;

  let url = new URL(`${API.google}${API.places.nearbysearch}`);
  let params = new URLSearchParams(url.search.slice(1));
  params.append("key", API.places.key);
  params.append("language", API.lang);
  params.append("location", "40.4165,-3.702562");
  params.append("type", "restaurant");
  const mergeUrl = url.toString() + params.toString();

  return fetch(mergeUrl)
    .then(response => response.json())
    .then(data => data)
    .catch(error => console.error("CONSOLE ERROR", error));
};

const postSearch = (req, res) => {
  const { API } = CONFIG;
  const { description, place_id } = req.body;

  Promise.all([getPlacesNearBySearch()]).then(responses => {
    const payload = responses[0];
    res.json(payload);
  });
};

const getGeoDirections = input => {
  const { origin, destination, mode, units, currentLang } = input;
  const url = URI("https://maps.googleapis.com/maps/api/directions/json");

  url.addSearch("key", GOOGLE_MAPS_KEY);
  url.addSearch("language", currentLang);
  url.addSearch("units", units || "metric");
  url.addSearch("mode", mode || "driving");
  url.addSearch("origin", `${origin.latitude},${origin.longitude}`);
  url.addSearch(
    "destination",
    `${destination.latitude},${destination.longitude}`
  );

  return getJSON(url.toString()).then(json => {
    const routes = json.routes;

    if (routes && routes[0] && routes[0].legs && routes[0].legs[0]) {
      const steps = routes[0].legs[0].steps || [];

      return {
        mode,
        units,
        origin,
        destination,
        steps: steps.map(step => {
          const { distance, duration, html_instructions } = step;

          return `<b>${distance.text} - ${duration.text}</b>: ${html_instructions}`;
        })
      };
    }
  });
};

module.exports = {
  getAutocomplete,
  postSearch,
  getGeoDirections
};
