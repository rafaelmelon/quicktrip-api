const mcache = require('memory-cache');

export const cacheMiddleware = duration => {
  return (req, res, next) => {
    let key = '__express__' + req.originalUrl || req.url;
    let cachedBody = mcache.get(key);

    if (cachedBody) {
      res.send(cachedBody);
      return;
    } else {
      res.sendResponse = res.send;
      res.send = body => {
        mcache.put(key, body, duration * 1000);
        res.sendResponse(body);
      };
      next();
    }
  };
};

export const corsMiddleware = (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "quicktrip-app.herokuapp.com");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

  // if (req.method === 'OPTIONS') {
  //   return res.status(200).end();
  // }

  return next();
};
