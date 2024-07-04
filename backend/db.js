const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  password: '123456',
  host: 'localhost',
  port: 5432, // default Postgres port
  database: 'db'
});

module.exports = {
  query: (text, params) => pool.query(text, params)
};