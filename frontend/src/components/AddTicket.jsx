import React, { useEffect, useState } from "react";
import '../styles/AddTicket.css'

function AddNewTicket({ popup }){
    const [newTicketForUser, setNewTicketForUser] = useState("")
    const [newTicket, setNewTicket] = useState("")
    const [newTicketTitle, setNewTicketTitle] = useState("")
    const [time, setTime] = useState(new Date())

    const loggedInUser = sessionStorage.getItem('user')


    const addTicket = async () => {
        if(newTicketTitle.trim() !== "" && newTicket.trim() !== "" && newTicketForUser.trim() !== ""){
            const response =  await fetch("http://192.168.3.55:3000/ticekts/uploadNewTicket", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ newTicketTitle, newTicket, loggedInUser, newTicketForUser, time }),
            })
            const sentTicket = await response.json()
            if(sentTicket.result === "Ticket successfully created"){
                toast.success("Ticket successfully created")
                setTimeout(() => {
                    setNewTicketForUser("")
                    setNewTicketTitle("")
                    setNewTicket("")
                    setTicketPopup(!ticketPopup)
                    window.location.reload()
                }, 3000);
            }
            else {
                console.log(sentTicket.error)
                toast.error(sentTicket.errorMsg)
            }
        }
        else {
            toast.error("Please fill out every field")
        }
    }
        

    return <>
        <div className="modal">
            <div className="overlay"></div>
            <div className="modal-content">
                <header className="modal-content_header">
                    <p className="modal-content_header-user">balls: {loggedInUser}</p>
                    <button onClick={popup} className="modal-content_header-close">X</button>
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
    </>
}

export default AddNewTicket