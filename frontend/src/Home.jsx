import React, { useState, useEffect } from "react";
import './styles/Home.css';
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
//svg icons for the nav bar and header
import { faPlus, faRightFromBracket, faUser, faClock, faCircleCheck, faSun, faMoon } from '@fortawesome/free-solid-svg-icons';
//svg icons for the comment interactions
import { faTrashCan, faClipboard, faCheck, faComment } from '@fortawesome/free-solid-svg-icons';
import LoadTicketsByUser from "./components/TicketsByUser.jsx";
import LoadTicketsOnUser from "./components/TicketsOnUser.jsx";
import LoadTicketsOnUserDepartment from "./components/TicketsOnUserDepartment.jsx";
//import LoadSolvedTickets from "./components/AlreadySolvedTickets";


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

    const [colorPrimary, setColorPrimary] = useState('')//light mode primary color: rgb(244, 247, 254) - dark mode primary color: rgb(82, 85, 99)
    const [colorSecondary, setColorSecondary] = useState('')//light mode secondary color: rgb(48, 60, 115) - dark mode secondary color: rgb(217, 221, 230)
    const [isDarkmode, setIsDarkmode] = useState()
    const [icon, setIcon] = useState()
    const [theme, setTheme] = useState('')

    const root = document.documentElement
    
    //get current time upon reloading and displaying it
    useEffect(() => {
        const intervalId = setInterval(() => {
            setTime(new Date())
        }, 1000)
        return () => clearInterval(intervalId);
    },[])
    const formattedTime = time.toLocaleTimeString()


    //check the user's color theme preference on loading
    useEffect(()=> {
        if(localStorage.getItem("is_darkmode") !== false){
            setIsDarkmode(true)
            root.style.setProperty('--color-primary', 'rgb(244, 247, 254)')
            root.style.setProperty('--color-secondary', 'rgb(48, 60, 115)')
        } else {
            setIsDarkmode(false)
            root.style.setProperty('--color-primary', '#1E201E')
            root.style.setProperty('--color-secondary', 'rgb(244, 247, 254)')
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
            sessionStorage.removeItem("token")
            sessionStorage.removeItem("user")
            localStorage.setItem("is_darkmode", isDarkmode ? false : true)
            location.reload()
        }
    }, timeLeft)
    

    //get current logged in user
    const loggedInUser = sessionStorage.getItem("user")


    //add new task to UI and to the database too
    const addTicketPopup = () => {
        setTicketPopup(!ticketPopup)
    }
    const addTicket = async () => {
        if(newTicketTitle.trim() !== "" && newTicket.trim() !== "" && newTicketForUser.trim() !== ""){ /**/
            const sentTicket = await axios.post("http://localhost:3000/tickets/uploadNewTicket", { newTicketTitle, newTicket, loggedInUser, newTicketForUser, time })
            console.log(sentTicket)
            setNewTicketForUser("")
            setNewTicketTitle("")
            setNewTicket("")
            setTicketPopup(!ticketPopup)
            window.location.reload()
        }

    }

    //display already solved tickets
    const solvedTickets = () => {
        setSolvedTicketsPopup(!solvedTicketsPopup)
        const loadData = async () => {
            const response = await axios.post('http://localhost:3000/tickets/solvedTickets', { loggedInUser })
            setSolvedTicketTitles(response.data.title)
            setSolvedTicketDescription(response.data.description)
            setSolvedTicketSolution(response.data.solution)
        }
        loadData()
    }
    const closeSolvedPopup = () => {
        setSolvedTicketsPopup(!solvedTicketsPopup)
    }

    //handle logging out
    const logOut = () => {
        sessionStorage.removeItem("token")
        sessionStorage.removeItem("user")
        localStorage.setItem("is_darkmode", isDarkmode ? false : true)
        location.reload()
    }

    const toggleTheme = () => {
        setIsDarkmode(!isDarkmode)
        setColorPrimary(isDarkmode ? '#1E201E' : 'rgb(244, 247, 254)')
        setColorSecondary(isDarkmode ? 'rgb(244, 247, 254)' : 'rgb(48, 60, 115)')
        root.style.setProperty('--color-primary', colorPrimary)
        root.style.setProperty('--color-secondary', colorSecondary)
    }

    
    return <>
        <nav className="navbar">
            <ul className="navbar-nav">
                <li className="navbar-nav-element nav-user">
                    <FontAwesomeIcon icon={faUser} className="navbar-nav-element_icon nav-user_arrow"/>
                    <span className="navbar-nav-element_text nav-user_text" >{loggedInUser}</span>
                </li>
                <li className="navbar-nav-element">
                    <FontAwesomeIcon icon={isDarkmode ? faSun : faMoon} className="navbar-nav-element_icon nav-theme-icon"/>
                    <button className="navbar-nav-element_text nav-user_text theme-toggle" onClick={toggleTheme}>{isDarkmode ? "Light mode" : "Dark mode"}</button>
                </li>
                <li className="navbar-nav-element">
                    <FontAwesomeIcon icon={faClock} className="navbar-nav-element_icon"/>
                    <span className="navbar-nav-element_text">{formattedTime}</span>
                </li>
                <li className="navbar-nav-element">
                    <FontAwesomeIcon icon={faPlus} className="navbar-nav-element_icon" />
                    <button onClick={addTicketPopup} className="navbar-nav-element_text">Create ticket </button>
                </li>
                <li className="navbar-nav-element">
                    <FontAwesomeIcon icon={faCircleCheck} className="navbar-nav-element_icon"/>
                    <button className="navbar-nav-element_text header-content" onClick={solvedTickets}>Solved ickets</button>
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
        {ticketPopup && (
                <div className="modal">
                   <div onClick={addTicketPopup} className="overlay"></div>
                   <div className="modal-content">
                       <header className="modal-content_header">
                            <p className="modal-content_header-user">{loggedInUser}</p>
                            <button onClick={addTicketPopup} className="modal-content_header-close">X</button>
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
               </div>
            )}
        {solvedTicketsPopup && <div className="popup">
            <div className="popup-open"></div>
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
    </>
}

export default Homepage