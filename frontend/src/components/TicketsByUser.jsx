import React, { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan, faClipboard, faCheck, faComment } from '@fortawesome/free-solid-svg-icons';
import '../styles/Tickets.css';

function LoadTicketsByUser() {
    const [ticketTitlesByUser, setTicketTitlesByUser] = useState([])
    const [ticketsByUser, setTicketsByUser] = useState([])
    //given index of the ticket user wants to delete
    const [ticketIndex, setTicketIndex] = useState([])
    const [balls, setBalls] = useState("")

    const currentUserEmail = sessionStorage.getItem("user")

    useEffect(() => {
        const byUser = async () => {
            try {
                const byUserTickets = await axios.post('http://localhost:3000/tickets/getTicketsByUser', { currentUserEmail })
                setTicketTitlesByUser(byUserTickets.data.title)
                setTicketsByUser(byUserTickets.data.tickets)
                setTicketIndex(byUserTickets.data.id)
            } catch(err){
                console.log("error occoured")
            }
        }
        byUser()
    },[])

    const deleteTicket = async (index) => {
        //const delTask = await axios.post("http://localhost:3000/tasks/deleteTicket", { currentUserEmail })
        

    }

    return<>
        <section className="main-ticketsOnUser">
            <p>By User</p>
            <p>--------------------------------</p>
            <div className="tickets">
                {ticketsByUser.map((ticket, index) =>
                    <li key={index}>
                        <p className="tickets-onUser-titles">{ticketTitlesByUser[index]}</p>
                        <textarea name="ticket" id="ticket"  className="ticket" value={ticket}></textarea><br />
                        <button className="ticket-actions solve"><FontAwesomeIcon icon={faCheck} /></button>
                        <button className="ticket-actions change_owner"><FontAwesomeIcon icon={faClipboard} /></button>
                        <button className="ticket-actions delete" onClick={deleteTicket}><FontAwesomeIcon icon={faTrashCan} /></button>
                        <button className="ticket-actions comment"><FontAwesomeIcon icon={faComment} /></button>
                    </li>
                )}
            </div>
        </section>
    </>
}

export default LoadTicketsByUser