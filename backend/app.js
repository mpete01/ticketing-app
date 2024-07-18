const express = require('express');
const pgp = require('pg-promise')(/* options */)
const db = pgp('postgres://postgres:123456@localhost:5432/db')
const cors = require('cors');
const bcrypt = require('bcrypt');
const session = require('express-session')
const flash = require('express-flash')

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.use(session({
  secret: "secret",
  resave: false,
  saveUninitialized: false
}))

app.use(flash())

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

app.post('/users/register_post', async (req, res) => {
  const { name, email, password } = req.body

  //console.log({ name, email, password })
  let hashedPassword = await bcrypt.hash(password, 10)
  //console.log("Hashed password: " + hashedPassword)
  db.query(
    `SELECT * FROM users
    WHERE email = $1`,
    [email])
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});