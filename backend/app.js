//May God himself those brave souls who dare to wander deep into this codebase
//because nobody else will, even I, the creator don't know how this worls and what it does

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

  console.log({ name, email, password, department })
  //check if user is already registered, if already registered length of the query is bigger 0
  const isUserAlreadyRegistered = await db.query(`SELECT id FROM users WHERE email = '${email}'`)
  if(isUserAlreadyRegistered.length > 0) {
    res.send({
      result: "already registered"
    })
  } else {
      try{
        //hash password with bcrypt 
        const hashedPassword = await bcrypt.hash(password, 10)

        //check if the user will have admin previliges
        let is_admin = false
        if(name === "IT" || department === "Maintainence") {
          is_admin = true
        } else {
          is_admin = false
        }

        //if user is not registered update database with the user's credentials and hashed password 
        const registerUser = await db.query(`INSERT INTO users (username, email, password, department, is_admin)
          VALUES ('${name}', '${email}', '${hashedPassword}', '${department}', '${is_admin}')`
        )

        res.send({
          result: "success"
        })

      } catch(err){
        res.send({
          error: err,
          result: "error occoured"
        })
      }
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
  const { newTicketTitle, newTicket, loggedInUser, newTicketForUser } = req.body

  //get the ID of the user who crreated the ticket
  const createdByUserId = await db.query(`SELECT id FROM users WHERE email = '${loggedInUser}'`)
  //get the ID of the iwner's ID
  const owner_id = await db.query(`SELECT id FROM users WHERE email = '${newTicketForUser}'`)

  if (owner_id.length === 0) {
    return res.send({
      result: "No user found, please enter a valid email address"
    })
  }
  //get the owner's department's ID
  const owners_department_id = await db.query(`SELECT d.id
    FROM departments d
    JOIN users u ON u.department = d.name
    WHERE u.id = ${owner_id[0].id};`
  )
  /*const keywordActions = {
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

      if(department !== undefined) {
        departmentId = await db.query(
          `SELECT id from department WHERE name = ${department}`
        )
      }
      else {
        const userDepartment = await db.query(
          `SELECT department FROM users WHERE email = '${newTicketForUser}'`
        )
        console.log(userDepartment)
        /*departmentId = await db.query(
          `SELECT id from departments WHERE name = '${userDepartment[0].department}'`//userDepartment[0].
        )
      }*/

  try {    
    //add the ticket to database (not yet assigned to user)
    const addNewTicket = await db.query(
      `INSERT INTO tickets (title, description, creator_id, owners_department_id, is_solved, owner_id)
        VALUES ('${newTicketTitle}', '${newTicket}', ${createdByUserId[0].id}, ${owners_department_id[0].id}, false, ${owner_id[0].id});`,
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
      console.error(err)
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
  try {
    const onDepartment = await db.query(`
      SELECT t.id, t.title, t.description, t.id
      FROM tickets t
      INNER JOIN departments d ON t.owners_department_id = d.id
      WHERE d.name = '${currentUserDepartment[0].department}' AND t.is_solved = false;
    `)
    for(let i = 0; i < onDepartment.length; i++){
      ids.push(onDepartment[i].id)
      titles.push(onDepartment[i].title)
      descriptions.push(onDepartment[i].description)
      department.push(onDepartment[i].department_name)
    }

    res.send({
      "ids": ids,
      "title": titles,
      "tickets": descriptions,
      "department": department
    })
  } catch (err) {
    console.log(err)
    res.send(err)
  }
})


//GET TICKETS FROM DATABASE THAT IS ON THE CURRENT USER
app.post('/tickets/getTicketsOnUser', async (req, res) => {
  const { currentUserEmail } = req.body
  
  let titles = []
  let descriptions = []
  let ids = []
  try {
    const onUser = await db.query(`SELECT t.id, t.title, t.description, t.is_solved, t.solution
      FROM tickets t
      JOIN users u ON t.owner_id = u.id
      WHERE u.email = '${currentUserEmail}' AND t.is_solved = FALSE
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
  } catch (err) {
      console.log(err)
      res.send(err)
  }
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
  //delete ticket from database 
  try {
    const deleteTicket = await db.query(
      `DELETE FROM tickets WHERE id = '${delTicketIndex}'`
    )

    res.json({
      result: "Ticket deleted successfully"
    })
  } catch (err) {
    res.send({
      result: err
    })
  }
})


//CHANGE OWNER OF THE TICKET
app.post('/tickets/reassignTickets', async (req, res) => {
  const { ticketToBeAssigned, assignedToUser } = req.body

  //get the ID of the user that is being assigned
  const newOwnerId = await db.query(`SELECT id FROM users WHERE email = '${assignedToUser}'`)

  if(newOwnerId.length === 0) {
    return res.send({
      result: "No user found"
    })
  }

  try {
    const changeOwner = await db.query(`UPDATE tickets
      SET owner_id = ${newOwnerId[0].id}
      WHERE id = ${ticketToBeAssigned}`, (err) => {
        if(err){
          throw err
        }
      })
    res.json({
      "result": `Ticket ownership changed successfully`
    })
  } catch (err) {
      console.log(err)
      res.send({
        result: err
      })
  }
})


//LOAD ALREADY EXISTING TICKET COMMENTS
app.post('/tikcets/existingComments', async (req, res) => {
  const { commentTicketId } = req.body
  
  try{
    const existingComments = await db.query(`SELECT comment, created_by FROM ticket_comments WHERE ticket_id = '${commentTicketId}'`)

    comments = []
    created_by = []

    for(let i = 0; i < existingComments.length; i++){
      comments.push(existingComments[i].comment)
      created_by.push(existingComments[i].created_by)
    }
    
    res.send({
      "comments": comments,
      "created_by": created_by
    })
  } catch(err) {
    res.send({
      result: "error"
    })
  }
})


//ADD NEW COMMENT
app.post('/tickets/addNewComment', async (req, res) => {
  const { tempIndex, currentUserEmail, newComment } = req.body

  console.log(tempIndex)

  try {
    const addComment = await db.query(`INSERT INTO ticket_comments (ticket_id, comment, created_by)
      VALUES (${tempIndex}, '${newComment}', '${currentUserEmail}')`)//dd
    res.send({
      result: "success"
    })
  } catch(err) {
      console.log(err)
      res.send({
        result: "error"
      })
  }
})


//SOLVE TICKETS
app.post('/ticekts/solveTickets', async (req, res) => {
  const { solvedTicketId, currentUserEmail, ticketSolution } = req.body
  //console.log({ solvedTicketId, currentUserEmail, ticketSolution })
  try{
    const setIsSolved = await db.query(`UPDATE tickets SET is_solved = true, solution = '${ticketSolution}' WHERE id = ${solvedTicketId}`, err => {
      if(err){
        throw err
      }
    })
    
    res.send({
      result: "success"
    })
  } catch(err){
    console.log(err)
    res.send({
      result: "err"
    })
  }
})


//GET ALREADY SOLVED TICKETS
app.post('/tickets/solvedTickets', async (req, res) => {
  const { loggedInUser } = req.body

  try{
      const query = await db.query(`SELECT t.*
          FROM tickets t
          JOIN departments d ON t.owners_department_id = d.id
          JOIN users u ON u.department = d.name
          WHERE u.email = '${loggedInUser}' AND t.is_solved = TRUE;`
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
        result: "success",
        title: title,
        description: description,
        solution: solution
      })
  } catch(err){
      res.send({
        result: "error",
        error: err
      })
  }
})


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});