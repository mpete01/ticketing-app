import React, { useState } from "react";
import '../styles/TicketAssignment.css';

function TicektAssignment() {
    const [assignedToUser, setAssignedToUser] = useState("")
    const [popup, setPopup] = useState(false)

    const closePopup = () => {
        setPopup(!popup)
    }

    return <>
        <div className="popup">
            <div className="popup-open"></div>
            <h2>Popup Content</h2>
            <p>This is the content of the popup window.</p>
            <button onClick={closePopup}>Close</button>
        </div>
    </>
}

export default TicektAssignment