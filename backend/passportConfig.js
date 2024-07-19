const LocalStrategy = require('passport-local').Strategy
//const pgp = require('pg-promise')(/* options */)
//const db = pgp('postgres://postgres:123456@localhost:5432/db')
const db = require('./db')
const bcrypt = require('bcrypt');
const { authenticate } = require('passport');

function init(){
    let authUser = async () => {
        let query = await db.query(`SELECT * from users`)
        console.log(query)
    }
    //}
    
    /*passport.use(new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'password'
        }, authenticateUser()
    ))*/
}
init()