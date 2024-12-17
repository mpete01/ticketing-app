import React, { useState, useEffect } from "react";
import './styles/Home.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
//svg icons for the nav bar and header
import { faPlus, faRightFromBracket, faUser, faClock, faCircleCheck, faSun, faMoon, faUserPlus } from '@fortawesome/free-solid-svg-icons';
//svg icons for the comment interactions
import { faTrashCan, faClipboard, faCheck, faComment } from '@fortawesome/free-solid-svg-icons';
import LoadTicketsByUser from "./components/TicketsByUser.jsx";
import LoadTicketsOnUser from "./components/TicketsOnUser.jsx";
import LoadTicketsOnUserDepartment from "./components/TicketsOnUserDepartment.jsx";
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'


//May God himself provide guidance to those who dare to wander deeper in this codebase because only He knows what it does and how it works

function Homepage() {
    const [newTicket, setNewTicket] = useState("")
    const [newTicketTitle, setNewTicketTitle] = useState("")
    //new ticket assigned to specific user
    const [newTicketForUser, setNewTicketForUser] = useState("")
    //solved ticekt popup
    const [solvedTicketsPopup, setSolvedTicketsPopup] = useState(false)
    //solved tickets data
    const [solvedTicektTitles, setSolvedTicketTitles] = useState([])
    const [solvedTicketDescription, setSolvedTicketDescription] = useState([])
    const [solvedTicketSolution, setSolvedTicketSolution] = useState([])
    //parts of the timer and clock
    const [time, setTime] = useState(new Date())
    const [timeLeft, setTimeLeft] = useState(600)
    const [isTimerRunning, setIsTimerRunning] = useState(true)
    const [ticketPopup, setTicketPopup] = useState(false)
    //boolean for if the user is in IT and registration popup
    const [isIt, setIsIt] = useState(false)
    const [userRegister, setUserRegister] = useState(false)
    //user registration form states
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [department, setDepartment] = useState("Select your department")
    const [showPassword, setShowPassword] = useState(false)
    const [failedPopup, setFailedPopup] = useState(false)


    const root = document.documentElement
    
    //get current time upon reloading and displaying it
    useEffect(() => {
        const intervalId = setInterval(() => {
            setTime(new Date())
        }, 1000)
        return () => clearInterval(intervalId);
    },[])
    const formattedTime = time.toLocaleTimeString()

    useEffect(() => {
        const isUserAdmin = sessionStorage.getItem("is_admin")
        if (isUserAdmin) {
            setIsIt(true)
        } else{
            setIsIt(false)
        }
    }, [])


    //create a countdown for 10 minutes
    useEffect(() => {
        //create a timer
        const timerId = setInterval(() => {
            if(timeLeft > 0){
                setTimeLeft((prevTime) => prevTime - 1)
            }            
          }, 1000);
        
          //resetting timer when something is clicked
        window.addEventListener('click', handleReset)

        return () => {
            clearInterval(timerId)
            window.removeEventListener('click', handleReset)
        }
    }, [])
    const handleReset = () => {
        setTimeLeft(600)
    }
    const minutes = Math.floor(timeLeft / 60)
    const seconds = timeLeft % 60

    //if countdown is 0 JWT and the user is deleted from sessionStorage and needs to sign in again
    setTimeout(() => {
        if(timeLeft < 1){
            sessionStorage.clear()
            location.reload()
        }
    }, timeLeft)
    

    //get current logged in user
    const loggedInUser = sessionStorage.getItem("user")

    //add new task to UI and to the database too
    const addTicketPopup = () => {
        setTicketPopup(!ticketPopup)
        setNewTicketForUser("")
        setNewTicketTitle("")
        setNewTicket("")
    }
    const closeTicketPopup = () => {
        if(newTicketForUser === "" && newTicketTitle === "" && newTicket === ""){
            setNewTicketForUser("")
            setNewTicketTitle("")
            setNewTicket("")
            setTicketPopup(!ticketPopup)
        } else {
            setNewTicketForUser("")
            setNewTicketTitle("")
            setNewTicket("")
            location.reload()
        }
    }
    const addTicket = async () => {
        if(newTicketTitle.trim() !== "" && newTicket.trim() !== "" && newTicketForUser.trim() !== ""){ /**/
            // const sentTicket = await axios.post("http://localhost:3000/tickets/uploadNewTicket", { newTicketTitle, newTicket, loggedInUser, newTicketForUser, time })
            const response = await fetch('http://192.168.3.55:3000/tickets/uploadNewTicket', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ newTicketTitle, newTicket, loggedInUser, newTicketForUser, time })
            })
            const sentTicket = await response.json()

            if(sentTicket.result === "Ticket successfully created"){
                toast.success("Ticket successfully created")
                setTimeout(() => {
                    setNewTicketForUser("")
                    setNewTicketTitle("")
                    setNewTicket("")
                    setTicketPopup(!ticketPopup)
                    window.location.reload()
                }, 5000);
            }
            else {
                console.log(sentTicket.error)
                toast.error(sentTicket.errorMsg)
            }
        }
        else {
            toast.error("Please fill out every field")
        }
    }

    //display already solved tickets
    const solvedTickets = () => {
        setSolvedTicketsPopup(!solvedTicketsPopup)
        const loadData = async () => {
            // const response = await axios.post('http://localhost:3000/tickets/solvedTickets', { loggedInUser })
            const res = await fetch('http://192.168.3.55:3000/tickets/solvedTickets', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ loggedInUser })
            })
            const response = await res.json()
            setSolvedTicketTitles(response.title)
            setSolvedTicketDescription(response.description)
            setSolvedTicketSolution(response.solution)
        }
        loadData()
    }
    const closeSolvedPopup = () => {
        setSolvedTicketsPopup(!solvedTicketsPopup)
    }

    //register new user (only accessible for people in IT department)
    const registerUser = () => {
        setUserRegister(!userRegister)
    }
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
    const handleSubmit = async (e) => {
        e.preventDefault()
            //checks if any of the fields are empty, if yes alerts the user that they need to be filled
            if(!name || !email || !password) {
                toast.warn("Please fill out all the fields")
            }
            //checks if the pssword is at least 8 characters and contains numbers
            if(password.length >= 8 && /\d/.test(password)){
                //sending the user's data to the server to register it in the database
                try{
                    if(department === "Select your department"){
                        toast.error("No department was chosen")
                    } else{
                        console.log({ name, email, password, department })
                        const response = await fetch('http://192.168.3.55:3000/users/register', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ name, email, password, department })
                        })
                        const sentData = await response.json()
                        console.log(sentData)
                        if(sentData === "User already registered"){
                            toast.error("User already registered")
                        } else {
                            toast.success("User successfully registered")
                        }
                    }
                } catch(err){
                    console.log(err)
                }
            }
            //ask the user to enter valid email and password
            else {
                toast.error()
                setFailedPopup(!failedPopup)
                setEmail("")
                setPassword("")
                setName("")
            }
        }
    const closeRegisterUser = () => {
        setUserRegister(!userRegister)
    }


    //handle logging out
    const logOut = () => {
        sessionStorage.removeItem("token")
        sessionStorage.removeItem("user")
        location.reload()
    }



    return <>
        <nav className="navbar">
            <ul className="navbar-nav">
                <li className="navbar-nav-element nav-user">
                    <p className="navbar-nav-element_icon nav-title">{"\u{1F595}"}</p>
                    <span className="navbar-nav-element_text nav-title" >HEPA ticketing</span>
                </li>

                <li className="navbar-nav-element">
                    <FontAwesomeIcon icon={faPlus} className="navbar-nav-element_icon" />
                    <button onClick={addTicketPopup} className="navbar-nav-element_text">Create ticket </button>
                </li>
                <li className="navbar-nav-element">
                    <FontAwesomeIcon icon={faCircleCheck} className="navbar-nav-element_icon"/>
                    <button className="navbar-nav-element_text header-content" onClick={solvedTickets}>Solved ickets</button>
                </li>
                <li className="navbar-nav-element nav-user">
                    <FontAwesomeIcon icon={faUserPlus} className="navbar-nav-element_icon nav-user_plus"/>
                    <button disabled={isIt ? false : true} style={{ opacity: isIt ? 1 : 0.5 }} className="navbar-nav-element_text nav-user_text" onClick={registerUser}>Register user {isIt}</button>
                </li>
                <li className="navbar-nav-element">
                    <FontAwesomeIcon icon={faRightFromBracket} className="navbar-nav-element_icon"/>
                    <button className="navbar-nav-element_text header-content" onClick={logOut}>Log out</button>
                </li>
            </ul>
        </nav>
        <header className="header">
            <div className="help">
                <p className="help-icons">Solve ticket - <FontAwesomeIcon icon={faCheck}/></p>
                <p className="help-icons">Assign ticket to user - <FontAwesomeIcon icon={faClipboard}/></p>                   
                <p className="help-icons">Delete ticket -  <FontAwesomeIcon icon={faTrashCan}/></p>                    
                <p className="help-icons">Add comment - <FontAwesomeIcon icon={faComment}/></p>
            </div>
            <div className="header-logOut">You will be logged out in: {isTimerRunning ? `${minutes}:${seconds < 10 ? '0' : ''}${seconds}` : null}</div>
        </header>
        <main className="main">
            <LoadTicketsByUser />
            <LoadTicketsOnUser />
            <LoadTicketsOnUserDepartment />
        </main>
        {ticketPopup && <div className="modal">
            <div className="overlay"></div>
            <div className="modal-content">
                <header className="modal-content_header">
                    <p className="modal-content_header-user">balls: {loggedInUser}</p>
                    <button onClick={closeTicketPopup} className="modal-content_header-close">X</button>
                </header>
                <section className="modal-ticketSection">
                    <div className="modal-tiketSection_department-and-assignment">
                        <input type="email" className="assigned-to" placeholder="Assign to user (use email address)" value={newTicketForUser} onChange={(e) => setNewTicketForUser(e.target.value)}/>        
                    </div>
                    <input type="text" className="modal-ticketSection_ticket-title" placeholder="Title..." value={newTicketTitle} onChange={(e) => setNewTicketTitle(e.target.value)}/> <br />
                    <textarea name="ticket-body" className="modal-ticketSection_ticket-body" id="ticket-body" placeholder="Ticket explained" value={newTicket} onChange={(e) => setNewTicket(e.target.value)}></textarea>
                </section>
                <button onClick={addTicket} type="submit" className="modal-add-ticket_button">Add Ticket</button>           
            </div>
        </div>}
        {solvedTicketsPopup && <div className="popup">
            <div className="solved-tickets-header">
                <p className="solved-tickets-title">Solved tickets</p>
                <button className="assignment-close-btn assignment-btn" onClick={closeSolvedPopup}>Close</button>
            </div>
            <table className="solved-tickets-table">
                <thead className="solved-tickets-thead">
                    <tr className="thead-title-row">
                        <th className="title-row_titles title-row">Ticket Titles</th>
                        <th className="title-row_descriptions title-row">Ticket Descriptions</th>
                        <th className="title-row_solution title-row">Ticket Solution</th>
                    </tr>
                </thead>
                <tbody className="solved-tickets-tbody">
                    {solvedTicektTitles.map((_, index) =>
                    <tr key={index} className="solved-tickets_tr">
                        <td className="tickets-onUser-titles solved-tickets_td">{solvedTicektTitles[index]}</td>
                        <td className="tickets-onUser-description solved-tickets_td">{solvedTicketDescription[index]}</td>
                        <td className="tickets-onUser-solution solved-tickets_td">{solvedTicketSolution[index]}</td>
                    </tr>
                    )}
                </tbody>
            </table>
        </div>}
        {userRegister && <div className="modal">
                <form className="register-form">
                    <div className="register-form-title modal-content_header">Register<button onClick={closeRegisterUser}>X</button></div>
                    <input type="text" className="register-form-username input" value={name.trim()} id="register-username" placeholder="Enter a username" onChange={(e) => setName(e.target.value)} /><br />
                    <input type="text" className="register-form-email input" value={email.trim()} id="register-email" placeholder="Enter an email address" onChange={(e) => setEmail(e.target.value)}/><br />
                    <select name="departments" className="register-form-department">
                        <option  className="register-form-department_option" value="Select your department" onClick={(e) => setDepartment(e.target.value)}>Select your department</option>
                        <option className="register-form-department_option" value="IT" onClick={(e) => setDepartment(e.target.value)}>IT</option>
                        <option className="register-form-department_option" value="Maintanence" onClick={(e) => setDepartment(e.target.value)}>Maintainence</option>
                        <option className="register-form-department_option" value="HR" onClick={(e) => setDepartment(e.target.value)}>HR</option>
                        <option className="register-form-department_option" value="Marketing" onClick={(e) => setDepartment(e.target.value)}>Marketing</option>
                        <option className="register-form-department_option" value="Finance" onClick={(e) => setDepartment(e.target.value)}>Finance</option>
                        <option className="register-form-department_option" value="Open Office" onClick={(e) => setDepartment(e.target.value)}>Open Office</option>
                        option
                    </select>
                    <div className="password-input-field">
                        <input type={showPassword ? "text" : "password"} value={password.trim()} className="register-form-password input" id="register-password" placeholder="Enter a password" onChange={(e) => setPassword(e.target.value)} />
                        <button type="button" className="show-password" id="show-password" onClick={togglePasswordVisibility}>
                            {showPassword ? <i >&#128065;</i> : <i >&#128065;</i>}
                        </button>
                    </div>
                    <button type="submit" className="register-form-submitButton" onClick={handleSubmit}>Register</button>
                </form>
        </div>}
        <ToastContainer />
    </>
}

export default Homepage