const express = require('express');
const db = require('./db');
var cors = require('cors')

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req,res) => {
  res.send("Server is ready.")
})


app.post('/api/data', async (req, res) => {
  try {
    //const result = await db.query('SELECT * FROM people');
    console.log(req.body)
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});