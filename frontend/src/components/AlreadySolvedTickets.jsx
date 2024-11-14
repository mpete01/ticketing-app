import React, { useEffect, useState } from "react";
import axios from "axios";

function LoadSolvedTickets(){
    const [solvedTicektTitles, setSolvedTicketTitles] = useState([])
    const [solvedTicketDescription, setSolvedTicketDescription] = useState([])
    const [solvedTicketSolution, setSolvedTicketSolution] = useState([])

    const currentUserEmail = sessionStorage.getItem("user")

    useEffect(async () => {
        // const response = await axios.post('http://localhost:3000/tickets/solvedTickets', { currentUserEmail })
        const res = await fetch("http://192.168.3.55:3000/solvedTickets", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ currentUserEmail })
        })
        const response = await res.json()
        setSolvedTicketTitles(response.title)
        setSolvedTicketDescription(response.description)
        setSolvedTicketSolution(response.solution)
    }, [])
    
    /*const getStuff = async () => {
        const response = await axios.post('http://localhost:3000/tickets/solvedTickets', { currentUserEmail })
        setTicketTitles(response.data.title)
        setTicketDescription(response.data.description)
        setTicketSolution(response.data.solution)
    }*/
   const close = () => {
        console.log("close")
   }

    return <>
        <div className="popup">
            <div className="popup-open"></div>
            <div className="solved-tickets-header">
                <p>Solved tickets</p>
                <button className="assignment-close-btn assignment-btn" onClick={close}>Close</button>
            </div>
            <div>
                {solvedTicektTitles.map((_, index) =>
                    <li key={index}>
                        <p className="tickets-onUser-titles">{solvedTicektTitles[index]}</p>
                        <p className="tickets-onUser-titles">{solvedTicketDescription[index]}</p>
                        <p>{solvedTicketSolution[index]}</p>
                    </li>
                )}
            </div>
        </div>
    </>
}

export default LoadSolvedTickets