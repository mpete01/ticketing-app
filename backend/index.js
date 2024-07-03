import express from 'express'
import { createRequire } from "module";
import pg from 'pg'
const { Pool } = pg
const require = createRequire(import.meta.url);
const app = express()

app.listen(8008, () => {
    console.log("server")
})

const pool = new Pool({
    host: 'localhost',
    user: 'postgres',
    password: "123456",
    port: 5432
    /*max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,*/
  })

const result = pool.query('SELECT * FROM people')
console.log(result.rows)


/*const { Pool } = require('pg')

const pool = new Pool({
    user: 'postgres',
    host: 'localhost', // Or your database server address
    database: 'db',
    password: '123456',
    port: 5432 // Default PostgreSQL port
  });

app.get('/all-from-people', async (req, res) => {
    try {
      const client = await pool.connect();
      const result = await client.query('SELECT * FROM people');
      client.release();
      res.json(result.rows); // Send the retrieved data
      console.log("success");
    } catch (error) {
      console.error('Error:', error);
      res.status(500).send('Error retrieving data from mytablew');
    }
  });*/