const express = require('express');
const pgp = require('pg-promise')(/* options */)
const db = pgp('postgres://postgres:123456@localhost:5432/db')
const cors = require('cors');
const bcrypt = require('bcrypt');
const session = require('express-session')
const flash = require('express-flash')

const app = express();
const port = 3000;

app.use(cors({
  origin: '*',
  methods: ["GET", "POST"],
  credentials: true
}));
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
    const rows = await db.query(`SELECT * FROM users WHERE email = $1`, ['kacsa.nyomozo@email.com'])
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

app.post('/users/register', async (req, res) => {
  const { name, email, password } = req.body
  //console.log(`name: ${ name }\t email: ${ email }\t password: ${ password }\n`)
  let hashedPassword = await bcrypt.hash(password, 10)

  let query = await db.query(
    `SELECT name, email, password FROM users WHERE email = '${email}'`,
    (err) => {
      if(err){
        throw err
      }
    })
  if(query.length > 0) {
    console.log("User already registered")
  } else {
    storedUser = await db.query(
      `INSERT INTO users (name, email, password)
      VALUES ('${name}', '${email}', '${hashedPassword}')`
    )
  }
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});