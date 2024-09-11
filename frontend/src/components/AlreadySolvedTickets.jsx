import React, { useState } from "react";
import axios from "axios";

function LoadSolvedTickets(){
    const [ticektTitles, setTicketTitles] = useState([])
    const [ticketDescription, setTicketDescription] = useState([])
    const [ticketSolution, setTicketSolution] = useState([])

    const currentUserEmail = sessionStorage.getItem("user")

    const getStuff = async () => {
        const response = await axios.post('http://localhost:3000/tickets/solvedTickets', { currentUserEmail })
        setTicketTitles(response.data.title)
        setTicketDescription(response.data.description)
        setTicketSolution(response.data.solution)
    }

    return <>
        <div className="popup">
            <div className="popup-open"></div>
            <div className="solved-tickets-header">
                <p>Solved tickets</p>
                <button className="assignment-close-btn assignment-btn" onClick={getStuff}>Close</button>
            </div>
            <div>
                {ticektTitles.map((_, index) =>
                    <li key={index}>
                        <p className="tickets-onUser-titles">{ticektTitles[index]}</p>
                        <p className="tickets-onUser-titles">{ticketDescription[index]}</p>
                        <p>{ticketSolution[index]}</p>
                    </li>
                )}
            </div>
        </div>
    </>
}

export default LoadSolvedTickets