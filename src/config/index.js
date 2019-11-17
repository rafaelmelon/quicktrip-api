import { env } from '../utils/index';

export const googlePlaces = {
  API: 'https://maps.googleapis.com/maps/api',
  KEY: env.API_KEY_PLACES
};

const whitelist = ['https://quicktrip-app.herokuapp.com'];
export const corsOptions = {
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};
