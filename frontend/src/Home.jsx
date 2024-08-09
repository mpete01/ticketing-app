import React, { useState, useEffect } from "react";
import './styles/Home.css';
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { faClock } from '@fortawesome/free-solid-svg-icons';


function Homepage() {
    const [newTicket, setNewTicket] = useState("")
    const [newTicketTitle, setNewTicketTitle] = useState("")
    const [ticketTitle, setTicketTitle] = useState([])
    const [tickets, setTickets] = useState([])
    const [time, setTime] = useState(new Date())
    const [timeLeft, setTimeLeft] = useState(600)
    const [isTimerRunning, setIsTimerRunning] = useState(true)


    //get current time upon reloading and displaying it
    useEffect(() => {
        const intervalId = setInterval(() => {
            setTime(new Date())
        }, 1000)

        return () => clearInterval(intervalId);
    },[])
    const formattedTime = time.toLocaleTimeString()


    //get all the currently stored tasks by the logged in user and store them in the tasks variable
    useEffect(() => {
        const currentUserEmail = sessionStorage.getItem("user")
        //console.log(currentUserEmail)
        const query = async () => {
            try{
                const response = await axios.post('http://localhost:3000/tasks/getTasks', { currentUserEmail })
                setTicketTitle(response.data.title)
                setTickets(response.data.tickets)
            } catch(err){
                console.log(err)
            }
        }
        query()
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
            location.reload()
        }
    }, timeLeft)
    

    //get current logged in user
    const loggedInUser = sessionStorage.getItem("user")


    //add new task to UI and to the database too
    const addTask = async () => {
        if(newTicket.trim() !== "") {
            setTasks(t => [...t, newTicket])
            setNewTicket("")
            console.log(newTaskTitle)
            const uploadNewTask = await axios.post('http://localhost:3000/tasks/uploadNew', { newTicketTitle, newTicket, loggedInUser, time })
        } else {
            alert("Empty task. Try again!")
        }
    }


    //delete task from UI and database
    const deleteTask = async (index) =>{
        console.log("balls")
        //console.log(tasks[index])
        /*const updatedTasks = tasks.filter((_, i) => i !== index)
        setTasks(updatedTasks)
        const deletedTask = tasks[index]
       const deleteFromDb = await axios.post('http://localhost:3000/tasks/delTask', { deletedTask, loggedInUser })*/
    }


    //handle logging out
    const logOut = () => {
        sessionStorage.removeItem("token")
        sessionStorage.removeItem("user")
        location.reload()
    }
    //<div>{ticketTitle[index]}</div>
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
                    <span className="navbar-nav-element_text">Create ticket </span>
                </li>
                <li className="navbar-nav-element">
                    <FontAwesomeIcon icon={faRightFromBracket} className="navbar-nav-element_icon"/>
                    <button className="navbar-nav-element_text header-content" onClick={logOut}>Log out</button>
                </li>
            </ul>
        </nav>
        <header className="header">
            <div className="header-logOut">You will be logged out in: {isTimerRunning ? `${minutes}:${seconds < 10 ? '0' : ''}${seconds}` : null}</div>
        </header>
        <main className="main">
            <section className="main-ticketsByUser">
            <div className="tickets">
                    {tickets.map((ticket, index) =>
                        <li key={index}>
                            
                            <textarea name="ticket" id="ticket"  className="ticket" value={ticket}></textarea>
                        </li>
                    )}
                </div>
                <p>By User</p>
                <p>------------------------------------------</p>
            </section>
            <section className="main-ticketsOnUser">
                <div className="tickets">
                    {tickets.map((ticket, index) =>
                        <li key={index}>
                            
                            <textarea name="ticket" id="ticket"  className="ticket" value={ticket}></textarea>
                        </li>
                    )}
                </div>
                <p>On User</p>
                <p>------------------------------------------</p>
            </section>
            <section className="main-ticketsOnUserDepartment">
            <div className="tickets">
                    {tickets.map((ticket, index) =>
                        <li key={index}>
                            
                            <textarea name="ticket" id="ticket"  className="ticket" value={ticket}></textarea>
                        </li>
                    )}
                </div>
                <p>On User Department</p>
                <p>------------------------------------------</p>
            </section>
        </main>
    </>
    )
}

export default Homepage