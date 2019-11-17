const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const cors = require('cors');

import { googlePlaces, corsOptions } from './config/index';
import { cacheMiddleware } from './middleware/index';
import { env } from './utils/index';

const app = express();
const port = env.PORT || 8080;

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);

app.use(cors())

app.get('/places/:values', cacheMiddleware(100), (req, res) => {
  const api = googlePlaces.API;
  const key = googlePlaces.KEY;
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

app.listen(port, () => console.log(`API listening on port ${port}`));
