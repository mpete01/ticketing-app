const express = require('express');
const db = require('./db');
//const cors = require('cors')

const app = express();
//app.use(cors)

app.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM people');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});