import React from "react";
import axios from "axios";

function LoadTicket() {
    
    const currentUser = sessionStorage.getItem("user")
    console.log(currentUser)

    const loadTicket = async () => {
        try{
            const tickets = await axios.get('https://localhost:3000/')
            console.log(tickets)
        } catch(err){
            console.log(err)
        }
    }
    loadTicket()

    return<>
        <header>
            <div>created by:</div>
            <div>on department: </div>
        </header>
        <section>
            <div>title</div>
            <textarea name="ticketbody" id="ticketbody">ticket body</textarea>
        </section>
    </>

}

export default LoadTicket