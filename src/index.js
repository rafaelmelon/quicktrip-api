const app = require('./app');
const CONFIG = require("./config");

const port = CONFIG.PORT;
app.listen(port, () => {
  /* eslint-disable no-console */
  console.log(`Listening: http://localhost:${port}`);
  /* eslint-enable no-console */
});
