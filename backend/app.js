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

  const trimmedName = name.trim()
  const trimmedDepartment = department.trim()

  //hash password with bcrypt 
  let hashedPassword = await bcrypt.hash(password, 10)

  //check if the user will have admin previliges
  let is_admin = false
  if(trimmedDepartment === "IT" || trimmedDepartment === "Maintainence") {
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
      VALUES ('${trimmedName}', '${email}', '${hashedPassword}', '${trimmedDepartment}', '${is_admin}')`
    )
    res.send("New user successfully registered")
  }
})


//USER LOGIN
app.post('/users/login', async (req, res) => {
  const { email, password } = req.body

  //Querying the user based on the provided email
  let query = await db.query(
    `SELECT id, username, email, password, department, is_admin FROM users WHERE email = '${email}'`,
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
          department: query[0].department,
          query: query[0],
          result: "Successful authenitcation, email and password are correct"
        })
      }
      //send back a response if password is incorrect
      else {
        console.log("Password is incorrect")
        res.json({
          result: "Password is incorrect"
      })
      }
    })
  }
})


//UPLOAD NEW TICKET TO DATABASE
app.post('/tickets/uploadNewTicket', async (req, res) => {
  const { newTicketTitle, newTicket, loggedInUser, newTicketForUser, time } = req.body
  let department;
  let departmentId;

  //console.log({ newTicketTitle, newTicket, loggedInUser, newTicketForUser, time })
  const keywordActions = {
    phone: "Maintainence",
    storage: "IT",
  };

      const wordSearch = () => {
        const actions = [];
            Object.keys(keywordActions).forEach((keyword) => {
                if (newTicket.toLowerCase().includes(keyword)) {
                  actions.push(keywordActions[keyword]);
                }
              });
        return actions;
      };    
      
      const search = () => {
        const actions = wordSearch();
          actions.forEach((action) => {
            switch (action) {
              case "Maintainence":
                department = "Maintainence"
                console.log("Assigned to Maintainence")
                break;
              case "IT":
                department = "IT"
                console.log("Assigned to IT")
                break;
              default:
                console.log("No assignment action taken.");
            }
          });
      };
      search()
      console.log(department)
      if(department !== undefined) {
        departmentId = await db.query(
          `SELECT id from department WHERE name = ${department}`
        )
      }
      else {
        const userDepartment = await db.query(
          `SELECT department FROM users WHERE email = '${newTicketForUser}'`
        )
        departmentId = await db.query(
          `SELECT id from departments WHERE name = '${userDepartment[0].department}'`
        )
      }
      try {
          const loggedInUserid = await db.query(
            `SELECT id FROM users
            WHERE email='${loggedInUser}'`
          )
      
          //add the ticket to database (not yet assigned to user)
          const addNewTicket = await db.query(
            `INSERT INTO tickets (title, description, created_at, creator_id, department_id, is_solved)
            VALUES ('${newTicketTitle}', '${newTicket}', '${time}','${loggedInUserid[0].id}', '${departmentId}', false);`,
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
          res.json({
            result: "Ticket successfully created"    
          })
        } catch (err) {
          console.error("Error: " + err)
          res.json({
            error: err,
            errorMsg: "An error occoured"
          })
        }
})


//GET TICKETS FROM DATABASE OF THE CURRENT LOGGED IN USER'S DEPARTMENT
app.post('/tickets/getDepartmentTickets', async (req, res) => {
  const { currentUserEmail } = req.body

  const currentUserDepartment = await db.query(
    `SELECT department FROM users WHERE email = '${currentUserEmail}'`
  )

  let ids = []
  let titles = []
  let descriptions = []
  let department = []
  let created_at = []

  const onDepartment = await db.query(`
    SELECT t.id, t.title, t.description, t.id
    FROM tickets t
    INNER JOIN departments d ON t.department_id = d.id
    WHERE d.name = '${currentUserDepartment[0].department}' AND t.is_solved = false;
  `)
  for(let i = 0; i < onDepartment.length; i++){
    ids.push(onDepartment[i].id)
    titles.push(onDepartment[i].title)
    descriptions.push(onDepartment[i].description)
    department.push(onDepartment[i].department_name)
    created_at.push(onDepartment[i].created_at)
  }

  res.send({
    "ids": ids,
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
  let ids = []
  const onUser = await db.query(
    `SELECT t.id, t.title, t.description, t.id
    FROM tickets t
    INNER JOIN ticket_assignments ta ON t.id = ta.ticket_id
    INNER JOIN users u ON ta.user_id = u.id
    WHERE u.id = '${currentUserId[0].id}' AND t.is_solved = false
    ORDER BY t.id ASC`
  )

  for(let i = 0; i < onUser.length; i++){
    ids.push(onUser[i].id)
    titles.push(onUser[i].title)
    descriptions.push(onUser[i].description)
  }
  res.send({
    "ids": ids,
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
    `SELECT id, title, description FROM tickets WHERE creator_id = '${currentUserId[0].id}' AND is_solved = false ORDER BY id ASC`
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


//DELETE TICKET FROM DATABASE
app.post('/tickets/deleteTicket', async (req, res) => {
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


//TIKCET REASSIGNMENT
app.post('/tickets/reassignTickets', async (req, res) => {
  const { ticketToBeAssigned, assignedToUser } = req.body

  //get the ID of the user that is being assigned
  const newUserId = await db.query(`SELECT id FROM users WHERE email = '${assignedToUser}'`)

  const reassignment = await db.query(`
    UPDATE ticket_assignments
    SET user_id = '${newUserId[0].id}'
    WHERE ticket_id = '${ticketToBeAssigned}';`, (err) => {
      if(err){
        throw err
      }
    })
  res.json({
    "result": `Ticket successfully reassigned to ${assignedToUser}`
  })
})


//LOAD ALREADY EXISTING TICKETS
app.post('/tikcets/existingComments', async (req, res) => {
  const { commentTicketId, currentUserEmail } = req.body

  //const submittingUserId = await db.query(`SELECT id FROM users WHERE email = '${currentUserEmail}'`)

  const existingComments = await db.query(`SELECT comment, created_by, created_at FROM ticket_comments WHERE ticket_id = '${commentTicketId}'`)// AND is_solved = false`)

  comments = []
  created_by = []
  created_at = []
  for(let i = 0; i < existingComments.length; i++){
    comments.push(existingComments[i].comment)
    created_by.push(existingComments[i].created_by)
    created_at.push(existingComments[i].created_at)
  }
  
  res.send({
    "comments": comments,
    "created_by": created_by,
    "created_at": created_at
  })
  /*const submitNewComment = await db.query(`INSERT INTO ticket_comments (ticket_id, user_id, comment, created_at)
    VALUES ('${commentTicketId}', '${submittingUserId}', :comment)`
  )*/
})


//SOLVE TICKETS
app.post('/ticekts/solveTickets', async (req, res) => {
  const { solvedTicketId, currentUserEmail, ticketSolution } = req.body
  const setIsSolved = await db.query(`UPDATE tickets SET is_solved = true, solution = '${ticketSolution}' WHERE id = '${solvedTicketId}'`, err => {
    if(err){
      throw err
    } else {
      res.json({
        result: `Ticket is solved. It was solved by ${currentUserEmail}`
      })
    }
  })
})


//GET ALREADY SOLVED TICKETS
app.post('/tickets/solvedTickets', async (req, res) => {
  const { loggedInUser } = req.body
  
  //get current user's user ID and department ID
  const user_departmentId = await db.query(`
    SELECT u.id, d.id AS department_id
    FROM users u
    INNER JOIN departments d ON u.department = d.name
    WHERE u.email = '${loggedInUser}'`
  )


  const query = await db.query(`SELECT title, description, solution FROM tickets 
    WHERE is_solved = true AND department_id = '${user_departmentId[0].department_id}'`
  )
  
  let title = []
  let description = []
  let solution = []

  for(let i = 0; i < query.length; i++){
    title.push(query[i].title)
    description.push(query[i].description)
    solution.push(query[i].solution)
  }

  res.json({
    title: title,
    description: description,
    solution: solution
  })
})


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});