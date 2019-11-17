const dotenv = require('dotenv');
dotenv.config();

export const env = {
  ...process.env
};

export const handleError = err => {
  throw new Error(err.ErrorMessage);
};
