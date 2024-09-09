import React, { useState, useEffect } from "react";
import './styles/Home.css';
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
//svg icons for the nav bar
import { faPlus, faRightFromBracket, faUser, faClock, faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { faTrashCan, faClipboard, faCheck, faComment, faCircleQuestion } from '@fortawesome/free-solid-svg-icons';
import LoadTicketsByUser from "./components/TicketsByUser.jsx";
import LoadTicketsOnUser from "./components/TicketsOnUser.jsx";
import LoadTicketsOnUserDepartment from "./components/TicketsOnUserDepartment.jsx"; 

function Homepage() {
    const [newTicket, setNewTicket] = useState("")
    const [newTicketTitle, setNewTicketTitle] = useState("")

    //new ticket assigned to specific user
    const [newTicketForUser, setNewTicketForUser] = useState("")

    const [time, setTime] = useState(new Date())
    const [timeLeft, setTimeLeft] = useState(600)
    const [isTimerRunning, setIsTimerRunning] = useState(true)
    const [ticketPopup, setTicketPopup] = useState(false)

    
    //get current time upon reloading and displaying it
    useEffect(() => {
        const intervalId = setInterval(() => {
            setTime(new Date())
        }, 1000)

        return () => clearInterval(intervalId);
    },[])
    const formattedTime = time.toLocaleTimeString()


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
    const solvedTickets = async () => {
        const solvedTicketsResponse = await axios.get('http://localhost:3000/tickets/solvedTickets')
        console.log(solvedTicketsResponse.data.message)
    }

    //handle logging out
    const logOut = () => {
        sessionStorage.removeItem("token")
        sessionStorage.removeItem("user")
        location.reload()
    }


    return(
    <>
        <nav className="navbar">
            <ul className="navbar-nav">
                <li className="navbar-nav-element nav-user">
                    <FontAwesomeIcon icon={faUser} className="navbar-nav-element_icon nav-user_arrow"/>
                    <span className="navbar-nav-element_text nav-user_text" >{loggedInUser}</span>
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
    </>
    )
}

export default Homepage