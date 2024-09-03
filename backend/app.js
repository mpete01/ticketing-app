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

//MIDDLEWARE

//CORS
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

//JWT verification
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



//API ENDPOINTS
app.get("/", (req,res) => {
  res.send("Server is ready.")
})


//USER REGISTRATION FOR users TABLE
app.post('/users/register', async (req, res) => {
  const { name, email, password, department } = req.body

  //hash password with bcrypt 
  let hashedPassword = await bcrypt.hash(password, 10)

  //check if the user will have admin previliges
  let is_admin = false
  if(department === "IT" || department === "Maintainence") {
    is_admin = true
  } else {
    is_admin = false
  }

  let query = await db.query(
    `SELECT username, email, password FROM users WHERE email = '${email}'`,
    (err) => {
      if(err){
        throw err
      }
    }
  )
  //check if user is already registered, if yes send back a message to client
  if(query.length > 0) {
    console.log("User already registered")
    res.send("User already registered")
  }
  //if user is not registered update database with the user's credentials and hashed password 
  else {
    storedUser = await db.query(
      `INSERT INTO users (username, email, password, department, is_admin)
      VALUES ('${name}', '${email}', '${hashedPassword}', '${department}', '${is_admin}')`
    )
    res.send("New user successfully registered")
  }
})


//USER LOGIN
app.post('/users/login', async (req, res) => {
  const { email, password } = req.body

  //Querying the user based on the provided email
  let query = await db.query(
    `SELECT id, username, email, password, is_admin FROM users WHERE email = '${email}'`,
    (err) => {
      if(err){
        throw err
      }
    }
  )
  
  //If there are no user do nothing and just return "No user found"
  if(query.length < 1){
    console.log("No user found")
    res.json({
      result: "No user found"
    })
  } 
  //If user is found compare credentials from database
  else {
    //Password comparison with bcrypt
    bcrypt.compare(password, query[0].password, (err, isMatch) => {
      if(err){
        throw err
      }
      //If passwords match, get the users id and assign a JWT based on the user's id in the database
      if(isMatch){
        const id = query[0].id
        const token = jwt.sign({id}, process.env.JWT_KEY, {
          expiresIn: "8h",
        })
        const is_admin = query[0].is_admin
        console.log("Successful authenitcation, email and password are correct")
        //sending back the token to client
        res.json({
          auth: false,
          token: token,
          is_admin: is_admin,
          result: query[0]
        })
      }
      //send back a response if password is incorrect
      else {
        console.log("Password is incorrect")
        res.send("Password is incorrect")
      }
    })
  }
})


//UPLOAD NEW TASK TO DATABASE
app.post('/tickets/uploadNewTicket', async (req, res) => {
  const { newTicketTitle, newTicket, loggedInUser, newTicketForUser, time } = req.body

  res.send("balls")
  const loggedInUserid = await db.query(
    `SELECT id FROM users
    WHERE email='${loggedInUser}'`
  )
  const assignedToUserDepartment = await db.query(
    `SELECT department FROM users WHERE email = '${newTicketForUser}'`
  )

  const departmentId = await db.query(
    `SELECT id from departments WHERE name = '${assignedToUserDepartment[0].department}'`
  )

  //add the ticket to database (not yet assigned to user)
  const addNewTicket = await db.query(
    `INSERT INTO tickets (title, description, created_at, creator_id, department_id)
    VALUES ('${newTicketTitle}', '${newTicket}', '${time}','${loggedInUserid[0].id}', '${departmentId[0].id}');`,
    (err) => {
      if(err){
        throw err
      }
    }
  )

  //assign newly created ticket to specified user
  const getNewTicketId = await db.query(
    `SELECT id FROM tickets
    WHERE created_at = '${time}'`
  )

  //assign ticekt to the user's department the ticket is assigned to
  const assignedToUsersDepartment = await db.query(`
    SELECT id FROM users WHERE email = '${newTicketForUser}'
  `)

  const assignNewTicket = await db.query(
    `INSERT INTO ticket_assignments (ticket_id, user_id)
    VALUES ('${getNewTicketId[0].id}', '${assignedToUsersDepartment[0].id}');`,
    (err) => {
      if(err){
        throw err
      }
    }
  )
})


//GET TICKETS FROM DATABASE OF THE CURRENT LOGGED IN USER'S DEPARTMENT
app.post('/tickets/getDepartmentTickets', async (req, res) => {
  const { currentUserEmail } = req.body

  const currentUserDepartment = await db.query(
    `SELECT department FROM users WHERE email = '${currentUserEmail}'`
  )

  let titles = []
  let descriptions = []
  let department = []
  let created_at = []
  const onDepartment = await db.query(`
    SELECT t.id, t.title, t.description
    FROM tickets t
    INNER JOIN departments d ON t.department_id = d.id
    WHERE d.name = '${currentUserDepartment[0].department}';
  `)
  for(let i = 0; i < onDepartment.length; i++){
    titles.push(onDepartment[i].title)
    descriptions.push(onDepartment[i].description)
    department.push(onDepartment[i].department_name)
    created_at.push(onDepartment[i].created_at)
  }

  res.send({
    "title": titles,
    "tickets": descriptions,
    "department": department,
    "created_at": created_at
  })
})


//GET TICKETS FROM DATABASE THAT IS ON THE CURRENT USER
app.post('/tickets/getTicketsOnUser', async (req, res) => {
  const { currentUserEmail } = req.body

  const currentUserId = await db.query(
    `SELECT id FROM users WHERE email = '${currentUserEmail}'`
  )
  let titles = []
  let descriptions = []
  const onUser = await db.query(
    `SELECT t.id, t.title, t.description
    FROM tickets t
    INNER JOIN ticket_assignments ta ON t.id = ta.ticket_id
    INNER JOIN users u ON ta.user_id = u.id
    WHERE u.id = '${currentUserId[0].id}'
    ORDER BY t.id ASC`
  )
  for(let i = 0; i < onUser.length; i++){
    titles.push(onUser[i].title)
    descriptions.push(onUser[i].description)
  }
  res.send({
    "title": titles,
    "tickets": descriptions
  })
})


//GET TICKETS CREATED BY CURRENT USER
app.post('/tickets/getTicketsByUser', async (req, res) => {
  const { currentUserEmail } = req.body

  let currentUserId = await db.query(
    `SELECT id, email FROM users WHERE email = '${currentUserEmail}' `
  )


  let titles = []
  let description = []
  let ids = []

  const byUser = await db.query(
    `SELECT id, title, description FROM tickets WHERE creator_id = '${currentUserId[0].id}' ORDER BY id ASC`
  )
  
  for(let i = 0; i < byUser.length; i++){
    titles.push(byUser[i].title)
    description.push(byUser[i].description)
    ids.push(byUser[i].id)
  }

  res.send({
    "id": ids,
    "title": titles,
    "tickets": description
  })
})


//DELETE TASK FROM DATABASE
app.post('/tasks/deleteTicket', async (req, res) => {
  const { delTicketIndex } = req.body

  //delete tickt assigment from database to prevent foreign key contraints
  const deleteForeginKey = await db.query(
    `DELETE FROM ticket_assignments WHERE ticket_id = '${delTicketIndex}'`
  )

  //delete actual ticket from database 
  const query = await db.query(
    `DELETE FROM tickets WHERE id = '${delTicketIndex}'`
  )

  res.json({
    "result": "Ticket deleted successfully"
  })
})


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});