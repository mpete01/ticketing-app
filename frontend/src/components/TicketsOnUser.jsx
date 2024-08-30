import React, { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan, faClipboard, faCheck, faComment } from '@fortawesome/free-solid-svg-icons';


function LoadTicketsOnUser() {
    const [ticketTitlesOnUser, setTicketTitlesOnUser] = useState([])
    const [ticketsOnUser, setTicketsOnUser] = useState([])

    const currentUserEmail = sessionStorage.getItem("user")

    useEffect(() => {
        const onUser = async () => {
            try {
                const balls = await axios.post('http://localhost:3000/tickets/getTicketsOnUser', { currentUserEmail })
                setTicketTitlesOnUser(balls.data.title)
                setTicketsOnUser(balls.data.tickets)
            } catch(err){
                console.log("error occoured")
            }
        }
        onUser()
    },[])

    return<>
        <section className="main-ticketsOnUser">
            <p>On User</p>
            <p>--------------------------------</p>
            <div className="tickets">
                {ticketsOnUser.map((ticket, index) =>
                    <li key={index}>
                        <p className="tickets-onUser-titles">{ticketTitlesOnUser[index]}</p>
                        <textarea name="ticket" id="ticket"  className="ticket" value={ticket}></textarea><br />
                        <button className="ticket-actions solve"><FontAwesomeIcon icon={faCheck} /></button>
                        <button className="ticket-actions change_owner"><FontAwesomeIcon icon={faClipboard} /></button>
                        <button className="ticket-actions delete"><FontAwesomeIcon icon={faTrashCan} /></button>
                        <button className="ticket-actions comment"><FontAwesomeIcon icon={faComment} /></button>
                    </li>
                )}
            </div>
        </section>
    </>

}

export default LoadTicketsOnUser