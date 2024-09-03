import React, { useState } from "react";
import '../styles/TicketAssignment.css';

function TicektAssignment() {
    const [assignedToUser, setAssignedToUser] = useState("")
    const [popup, setPopup] = useState(false)

    return <>
        <div className="modal">
            <input type="email" onChange={(e) => setAssignedToUser(e.target.value)} placeholder="Enter the user's email you want to give the ticket to"/>
            <button>Assign ticket to {assignedToUser}</button>
        </div>
    </>
}

export default TicektAssignment