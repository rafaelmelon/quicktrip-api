const fetch = require("node-fetch");

const CONFIG = require("../config");

const getAutocomplete = (req, res) => {
  const { lang, mapbox } = CONFIG.API;
  const { values } = req.params;

  let url = new URL(`${mapbox.api}${mapbox.geocoding.places}${values}.json?`);
  let params = new URLSearchParams(url.search.slice(1));
  params.append("access_token", mapbox.geocoding.key);
  params.append("language", lang);
  params.append("types", "place");
  params.append("autocomplete", "true");
  const mergeUrl = url.toString() + params.toString();

  return fetch(mergeUrl)
    .then(response => response.json())
    .then(data => res.send(data.features))
    .catch(error => console.error("CONSOLE ERROR", error));
};

const getPlacesPhoto = photoreference => {
  const { lang, google } = CONFIG.API;

  let url = new URL(`${google.api}${google.places.photo}`);
  let params = new URLSearchParams(url.search.slice(1));
  params.append("key", google.places.key);
  params.append("maxwidth", "300");
  params.append("photoreference", photoreference);

  const mergeUrl = url.toString() + params.toString();

  return mergeUrl;
};

const parsePlaces = data =>
  data.results.map(result => ({
    photos: result.photos.map(photo => ({
      height: photo.height,
      link: getPlacesPhoto(photo.photo_reference)
    })),
    name: result.name,
    id: result.id,
    geometry: result.geometry
  }));

const getPlacesNearBySearch = (req, res, position) => {
  const { lang, google } = CONFIG.API;

  let url = new URL(`${google.api}${google.places.nearbysearch}`);
  let params = new URLSearchParams(url.search.slice(1));
  params.append("key", google.places.key);
  params.append("language", lang);
  params.append("radius", "20000");
  params.append("location", `${position.latitude}, ${position.longitude}`);
  params.append("type", "tourist_attraction,museum,point_of_interest");

  const mergeUrl = url.toString() + params.toString();

  return fetch(mergeUrl)
    .then(response => response.json())
    .then(data => res.send(parsePlaces(data)))
    .catch(error => console.error("CONSOLE ERROR", error));
};

const postSearch = (req, res) => {
  const { lang, mapbox } = CONFIG.API;
  const { name, position } = req.body;

  // Promise.all([getPlacesNearBySearch()]).then(responses => {
  //   const payload = responses[0];
  //   res.json(payload);
  // });

  // const search = name || `${position.latitude},${position.longitude}`;

  // let url = new URL(`${mapbox.api}${mapbox.geocoding.places}${search}.json?`);
  // let params = new URLSearchParams(url.search.slice(1));
  // params.append("access_token", mapbox.geocoding.key);
  // params.append("types", "address");
  // const mergeUrl = url.toString() + params.toString();

  // return fetch(mergeUrl)
  //   .then(response => response.json())
  //   .then(data => {
  //     res.send(data);
  //   })
  //   .catch(error => console.error("CONSOLE ERROR", error));

  return getPlacesNearBySearch(req, res, position);
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
