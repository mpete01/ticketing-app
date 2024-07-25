const express = require('express');
require('dotenv').config()
const pgp = require('pg-promise')(/* options */)
const db = pgp('postgres://postgres:123456@localhost:5432/db')
const cors = require('cors');
const bcrypt = require('bcrypt');
const session = require('express-session')
const flash = require('express-flash')
const jwt = require('jsonwebtoken')

const app = express();
const port = process.env.SERVER_PORT;

app.use(cors({
  origin: '*',
  credentials: true
}));
app.use(express.json());

app.use(session({
  secret: "secret",
  resave: false,
  saveUninitialized: false
}))

app.use(flash())

const verifyJWT = (req, res, next) => {
  const token = req.headers["x-access-token"]
  if(!token){
    res.send("Token needed")
  } else {
    jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
      if(err){
        res.json({auth: false, message: "Failed to authenticate"})
      } else {
        req.id = decoded.id
        next()
      }
    })
  }
}


app.get("/", (req,res) => {
  res.send("Server is ready.")
})


app.post('/api/data', async (req, res) => {
  const { name, email, password } = req.body
  try {
    const result = await db.query(`SELECT * FROM users WHERE email = '${email}'`);
    console.log(result)
    res.send(result)
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error. Maybe The Server Is Not Running');
  }
});

app.get('/api/query', async  (req, res) => {
  try {
    const rows = await db.query(`SELECT * FROM users`)
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
    res.send("User already registered")
  } else {
    storedUser = await db.query(
      `INSERT INTO users (name, email, password)
      VALUES ('${name}', '${email}', '${hashedPassword}')`
    )
  }
})

app.get('/isUserAuthenticated', verifyJWT, (req, res) => {
  res.send("Faszkivan geci")
})

app.post('/users/login', async (req, res, passport) => {
  const { email, password } = req.body
  //let authUser = async () => {
    let query = await db.query(
      `SELECT id, name, email, password FROM users WHERE email = '${email}'`,
      (err) => {
        if(err){
          throw err
        }
        console.log(result)
      }
    )
    
    if(query.length < 1){
      console.log("No user found")
      res.json({
        result: "No user found"
      })
    } else {
      bcrypt.compare(password, query[0].password, (err, isMatch) => {
        if(err){
          throw err
        }
        //handle logic if email and password is correct
        if(isMatch){
          const id = query[0].id
          const token = jwt.sign({id}, process.env.JWT_KEY, {
            expiresIn: 3600,
          })
          console.log("Successful authenitcatin, email and password are correct")
          res.json({
            auth: false,
            token: token,
            result: query[0]
          })

        } else {
          console.log("Password is incorrect")
        }
    })
    //}
  }
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});