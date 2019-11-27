const getPlacesDetail = ({ id }) =>
  fetch(
    `${googlePlaces.API}/place/details/json?key=${googlePlaces.KEY}&place_id=${id}&fields=name,rating,formatted_phone_number,geometry`
  ).then(response => {
    if (response.status >= 400) {
      throw new Error("Bad response from server");
    }
    return response.json();
  });

const getPlaceNearbysearch = ({ data }) => {
  console.log("getPlaceNearbysearch", data);

  return fetch(
    `${googlePlaces.API}/place/nearbysearch/json?key=${googlePlaces.KEY}&language="es"&location=-33.8670522,151.1957362&type=restaurant&keyword=cruise`
  ).then(response => {
    if (response.status >= 400) {
      throw new Error("Bad response from server");
    }
    return response.json();
  });
};

app.post("/places", (req, res) => {
  const {
    description,
    id,
    matched_substrings,
    place_id,
    reference,
    structured_formatting,
    terms,
    types
  } = req.body;

  // description: "Madrid, España"
  // id: "8e431ef5ad3b7c115999d19fe4aa09e195cae372"
  // matched_substrings: [{length: 6, offset: 0}]
  // place_id: "ChIJgTwKgJcpQg0RaSKMYcHeNsQ"
  // reference: "ChIJgTwKgJcpQg0RaSKMYcHeNsQ"
  // structured_formatting: {main_text: "Madrid", main_text_matched_substrings: [{length: 6, offset: 0}], secondary_text: "España"}
  // terms: [{offset: 0, value: "Madrid"}, {offset: 8, value: "España"}]
  // types: ["locality", "political", "geocode"]

  Promise.all([getPlacesDetail(id), getPlaceNearbysearch(doc)])
    .then(data => {
      console.log("DATA", data);
      res.send("SUCCESSS!");
    })
    .catch(error => console.log(error));
  res.send(description);
});