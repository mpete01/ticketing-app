import React, { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan, faClipboard, faCheck, faComment } from '@fortawesome/free-solid-svg-icons';
import TicektAssignment from "./TicketAssignment";
import '../styles/Tickets.css';

function LoadTicketsByUser() {
    //store the tickets' title, body and index that is on the current user
    const [ticketTitlesByUser, setTicketTitlesByUser] = useState([])
    const [ticketsByUser, setTicketsByUser] = useState([])
    const [ticketIndex, setTicketIndex] = useState([])
    //delete button disable state (only enabled for IT and Maintainence)
    const [isDisabled, setIsDisabled] = useState(true)
    //ticket assignment to other user popup state manager
    const [popup, setPopup] = useState(false)

    const currentUserEmail = sessionStorage.getItem("user")
    const isUserAdmin = sessionStorage.getItem("is_admin")

    

    useEffect(() => {
        const byUser = async (e) => {
            try {
                const byUserTickets = await axios.post('http://localhost:3000/tickets/getTicketsByUser', { currentUserEmail })
                setTicketTitlesByUser(byUserTickets.data.title)
                setTicketsByUser(byUserTickets.data.tickets)
                setTicketIndex(byUserTickets.data.id)
            } catch(err){
                console.log("error occoured")
            }
            if(isUserAdmin === "true"){
                setIsDisabled(false)
            } else {
                setIsDisabled(true)
            }
        }
        byUser()
    },[])

    //delete ticket from database based on its index (only for admins)
    const deleteTicket = async (index) => {
        const delTicketIndex = ticketIndex[index]
        //const delTask = await axios.post("http://localhost:3000/tasks/deleteTicket", { delTicketIndex })
        window.location.reload();
    }

    const assignToUser = (index) => {
        const ticketToBeAssigned = ticketIndex[index]
        console.log(ticketToBeAssigned)
        setPopup(!popup)
    }

    return <>
        <section className="main-ticketsOnUser">
            <p>By User {isUserAdmin}</p>
            <p>--------------------------------</p>
            <div className="tickets">
                {ticketsByUser.map((ticket, index) =>
                    <li key={index}>
                        <p className="tickets-onUser-titles">{ticketIndex[index]}</p>
                        <p className="tickets-onUser-titles">{ticketTitlesByUser[index]}</p>
                        <textarea name="ticket" id="ticket"  className="ticket" value={ticket}></textarea><br />
                        <button className="ticket-actions solve"><FontAwesomeIcon icon={faCheck}/></button>
                        <button className="ticket-actions change_owner" onClick={() => assignToUser(index)}><FontAwesomeIcon icon={faClipboard} /></button>
                        <button className="ticket-actions delete" disabled={isDisabled} onClick={() => deleteTicket(index)} ><FontAwesomeIcon icon={faTrashCan} /></button>
                        <button className="ticket-actions comment"><FontAwesomeIcon icon={faComment} /></button>
                    </li>
                )}
            </div>
            {popup && <TicektAssignment />}
        </section>
    </>
}

export default LoadTicketsByUser