const { Pool } = require('pg');
const ENV = process.env.NODE_ENV || 'development';

console.log(ENV, 'env <-----')

require('dotenv').config({
  path: `${__dirname}/.env.${ENV}`,
});

console.log(process.env.DATABASE_URL , '<---- database url')

if (!process.env.PGDATABASE && !process.env.DATABASE_URL) {
  throw new Error('PGDATABASE not set');
}

const config = {};

if (ENV === 'production') {
  config.connectionString = process.env.DATABASE_URL;
  config.max = 2;
}

module.exports = new Pool(config)
