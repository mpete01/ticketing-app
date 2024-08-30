import React, { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan, faClipboard, faCheck, faComment } from '@fortawesome/free-solid-svg-icons';


function LoadTicketsOnUserDepartment() {
    const [departmentTicketTitle, setDepartmentTicketTitle] = useState([])
    const [departmentTickets, setDepartmentTickets] = useState([])

    const currentUserEmail = sessionStorage.getItem("user")

    useEffect(() => {
        const onUserDepartment = async () => {
            try {
                const balls = await axios.post('http://localhost:3000/tickets/getDepartmentTickets', { currentUserEmail })
                setDepartmentTicketTitle(balls.data.title)
                setDepartmentTickets(balls.data.tickets)
            } catch(err){
                console.log("error occoured")
            }
        }
        onUserDepartment()
    },[])


    return <>
        <section className="main-ticketsOnUserDepartment">
            <p>On User Department</p>
            <p>--------------------------------</p>
            <div className="tickets">
                {departmentTickets.map((ticket, index) =>
                    <li key={index}>
                        <p className="tickets-onDepartment-titles">{departmentTicketTitle[index]}</p>
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

export default LoadTicketsOnUserDepartment