const dotenv = require('dotenv');

const result = dotenv.config({ path: '.env' });
if (result.error) {
  throw result.error;
}

module.exports = result.parsed;
