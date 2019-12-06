const fetch = require("node-fetch");

const isString = str => typeof str === "string" || str instanceof String;
const isArray = array => Array.isArray(array);
const isArrayContain = array => isArray(array) && array.length > 0;

const request = (url, queries) => {

  let params = new URLSearchParams(url.search.slice(1));
  params.append("key", google.places.key);
  params.append("language", lang);
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

module.exports = {
  isString,
  isArray,
  isArrayContain,
  isInArray,
  request
};
