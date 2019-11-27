const express = require('express');
const fetch = require('node-fetch');
const emojis = require('./emojis');

const router = express.Router();

const googlePlaces = {
  API: 'https://maps.googleapis.com/maps/api',
  KEY: process.env.API_KEY_PLACES
};

router.get('/', (req, res) => {
  res.json({
    message: 'API - 👋🌎🌍🌏'
  });
});

router.use('/emojis', emojis);

router.get('/autocomplete/:values', (req, res) => {
  const api = googlePlaces.API;
  const key = googlePlaces.KEY;
  const lang = 'es';
  const { values } = req.params;

  const url = `${api}/place/autocomplete/json?key=${key}&language=${lang}&input=${values}&types=(cities)`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      res.send(data.predictions);
    })
    .catch((error) => console.error('CONSOLE ERROR', error));
});

module.exports = router;
