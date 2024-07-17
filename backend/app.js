const express = require('express');
const pgp = require('pg-promise')(/* options */)
const db = pgp('postgres://postgres:123456@localhost:5432/db')
const cors = require('cors')

const app = express();
const port = 3000;

app.use(cors());
//app.use(express.urlencoded({extended: false}));

app.get("/", (req,res) => {
  res.send("Server is ready.")
})


app.post('/api/data', async (req, res) => {
  try {
    //const result = await db.query('SELECT * FROM people');
    console.log(req.body)
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error. Maybe The Server Is Not Running');
  }
});

app.get('/api/query', async  (req, res) => {
  try {
    const rows = await db.query('SELECT * FROM users')
    console.log("Successful query")
    res.json(rows)
  } catch (err) {
    console.log(err)
    res.status(500).send("Internal Server Error. Maybe The Server Is Not Running")
  }
})

app.get('/users/register', (req, res) => {
  console.log('Register path')
})

app.get('/users/login', (req, res) => {
  console.log('Login path')
})

app.get('/users/dashboard', (req, res) => {
  console.log('Dashboard path')
})

app.post('/users/register', (req, res) => {
  const { name, email, password } = req.data

  console.log({ name, email, password })
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});