const express = require('express');
const request = require('request');

import { GooglePlaces } from '../config/index';

import { cacheMiddleware } from '../middleware/index';

let router = express.Router();

router.get('/places/:values', cacheMiddleware(100), (req, res, next) => {
  const api = GooglePlaces.API;
  const key = GooglePlaces.KEY;
  const lang = 'es';
  const values = req.params.values;

  const options = {
    url: `${api}/place/autocomplete/json?key=${key}&input=${values}&types=(cities)&language=${lang}`
  };
  request(options, (error, response, body) => {
    if (!error && response.statusCode == 200) {
      const info = JSON.parse(body);
      res.send(info);
    } else {
      res.status(res.statusCode).json(null);
    }
  });
});

export default router;
