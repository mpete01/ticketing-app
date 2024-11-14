import React, { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan, faClipboard, faCheck, faComment } from '@fortawesome/free-solid-svg-icons';
import '../styles/Tickets.css';


function LoadTicketsOnUserDepartment() {
       //store the tickets' title, body and index that is on the current user
       const [ticketTitlesOnUserDepartment, setTicketTitlesOnUserDepartment] = useState([])
       const [ticketsOnUserDepartment, setTicketsOnUserDepartment] = useState([])
       const [ticketIndex, setTicketIndex] = useState([])
       //delete button disable state (only enabled for IT and Maintainence)
       const [isDisabled, setIsDisabled] = useState(true)
       //ticket assignment to other user popup state manager
       const [assignmentPopup, setAssignmentPopup] = useState(false)
       const [ticketToBeAssigned, setTicketToBeAssigned] = useState("")
       const [assignedToUser, setAssignedToUser] = useState("")
       //commnet popup window
       const [commentPopup, setCommentPopup] = useState(false)
       const [existingComments, setExistingComments] = useState([]) //store already existing comments
       const [existingCommentsOnUsersDepartment, setExistingCommentsOnUsersDepartment] = useState([]) //corresponding user who created the comment
       const [existingCommentDate, setExistingCommentDate] = useState([]) //corresponding date to the exisitng comment
       const [newComment, setNewComment] = useState("")
       //ticket solving popup
       const [solvePopup, setSolvePopup] = useState(false)
       const [ticketSolution ,setTicketSolution] = useState("")
       const [solvedTicketId, setSolvedTicketId] = useState()//temporarily store the ID of the ticket that is being solved
       
       const currentUserEmail = sessionStorage.getItem("user")
       const isUserAdmin = sessionStorage.getItem("is_admin")
       const currentDepartment = sessionStorage.getItem("department")
   
   
       useEffect(() => {
           const onUser = async (e) => {
               try {
                   // const onUserDepartmentTickets = await axios.post('http://localhost:3000/tickets/getDepartmentTickets', { currentUserEmail })
                   const response = await fetch('http://192.168.3.55:3000/tickets/getDepartmentTickets', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ currentUserEmail })
                   })
                   const onUserDepartmentTickets = await response.json()
                   setTicketTitlesOnUserDepartment(onUserDepartmentTickets.title)
                   setTicketsOnUserDepartment(onUserDepartmentTickets.tickets)
                   setTicketIndex(onUserDepartmentTickets.ids)
               } catch(err){
                   console.log("error occoured")
               }
               if(isUserAdmin === "true"){
                   setIsDisabled(false)
               } else {
                   setIsDisabled(true)
               }
           }
           onUser()
       },[])
   
       //delete ticket from database based on its index (only for admins)
       const deleteTicket = async (index) => {
           const delTicketIndex = ticketIndex[index]
           // const delTask = await axios.post("http://localhost:3000/tickets/deleteTicket", { delTicketIndex })
           const response = await fetch('192.168.3.55:3000/tickets/deleteTicket', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ delTicketIndex })
           })
           const delTask = await response.json()
           window.location.reload();
       }
   
       //displays the popup for the UI where a ticket can be reassigned to other users
       const assignToUserPopup = (index) => {
           setTicketToBeAssigned(ticketIndex[index])
           setAssignmentPopup(!assignmentPopup)
       }
       //reassigns the ticket to given user in
       const ticketAssignment = async () => {
           //console.log(`Inner function ticket index: ${ticketToBeAssigned}`)
           // const response = await axios.post('http://localhost:3000/tickets/reassignTickets', { ticketToBeAssigned, assignedToUser })
           const res = await fetch('192.168.3.55:3000/tickets/reassignTickets', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ ticketToBeAssigned, assignedToUser })
           })
           const response = await res.json()
           alert(response.result)
       }
       //closes the reassignment popup window
       const closeAssignmentPopup = () => {
           setTicketToBeAssigned("")
           setAssignedToUser("")
           setAssignmentPopup(!assignmentPopup)
       }
   
       //ticekt solve popup
       const solveTicketPopup = async (index) => {
           setSolvePopup(!solvePopup)
           setSolvedTicketId(ticketIndex[index])
           //const solveTicketResponse = await axios.post('http://localhost:3000/ticekts/solveTickets', { solveTicketId, currentUserEmail })
       }
       const solveTicket = async () => {
           // const solution = await axios.post('http://localhost:3000/ticekts/solveTickets', { solvedTicketId, currentUserEmail, ticketSolution })
           const response = await fetch('http://192.168.3.55:3000/ticekts/solveTickets', {
            method:'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ solvedTicketId, currentUserEmail, ticketSolution })
           })
           const solution = await response.json()
           console.log(solution)
           
       }
       const closeTicketPopup = () => {
           setSolvedTicketId()
           setSolvePopup(!solvePopup)
       }
   
       //displays the comment popup for the UI to submit new and view existing comments
       const openCommentPopup = async (index) => {
           const commentTicketId = ticketIndex[index] //id if the ticket where the new comment will be created
           setCommentPopup(!commentPopup)
           // const existingCommentsResponse = await axios.post('http://localhost:3000/tikcets/existingComments', { commentTicketId, currentUserEmail })
           const response = await fetch('http://192.168.3.55:3000/tikcets/existingComments', {
            method: 'POST',
            headers: {
                'Content-Type': 'applicaiton/json'
            },
            body: JSON.stringify({ commentTicketId, currentUserEmail })
           })
           const existingCommentsResponse = await response.json()
   
           setExistingComments(existingCommentsResponse.comments)
           setExistingCommentsOnUsersDepartment(existingCommentsResponse.created_by)
           setExistingCommentDate(existingCommentsResponse.created_at)
       }
       //close comment UI
       const closeCommentPopup = () => {
           setNewComment("")
           setCommentPopup(!commentPopup)
       }
   
   
       return<>
           <section className="main-ticketsOnUser">
               <p>On Department: {currentDepartment}</p>
               <p>--------------------------------</p>
               <div className="tickets">
                   {ticketsOnUserDepartment.map((ticket, index) =>
                       <li key={index}>
                           <p className="tickets-onUser-titles ticket-titles">{ticketTitlesOnUserDepartment[index]}</p>
                           <textarea name="ticket" id="ticket"  className="ticket-textarea" value={ticket}></textarea><br />
                           <button className="ticket-actions solve" onClick={() => solveTicketPopup(index)}><FontAwesomeIcon icon={faCheck}/></button>
                           <button className="ticket-actions change_owner" onClick={() => assignToUserPopup(index)}><FontAwesomeIcon icon={faClipboard} /></button>
                           <button className="ticket-actions delete" disabled={isDisabled} style={{ opacity: isDisabled ? 0.5 : 1 }} onClick={() => deleteTicket(index)} ><FontAwesomeIcon icon={faTrashCan} /></button>
                           <button className="ticket-actions comment" onClick={() => openCommentPopup(index)}><FontAwesomeIcon icon={faComment} /></button>
                       </li>
                   )}
               </div>
           </section>
           {assignmentPopup && <div className="popup">
               <div className="popup-open"></div>
               <p>Assign ticket to a new user</p>
               <input type="email" className="popup-open_email" placeholder="Enter the email address of the person" onChange={(e) => setAssignedToUser(e.target.value)}/> <br />
               <p>Assign Ticket To: {assignedToUser}</p>
               <button type="submit" className="assignment-assign-btn assignment-btn" onClick={ticketAssignment}>Assign Ticket</button>
               <button onClick={closeAssignmentPopup} className="assignment-close-btn assignment-btn">Close</button>
           </div>}
           {commentPopup && <div className="popup">
               <div className="popup-open"></div>
               <p>Create a new comment</p>
               <textarea className="popup-open_email" placeholder="Enter the comment" onChange={(e) => setNewComment(e.target.value)}/> <br />
               <button type="submit" className="comment-submit-btn">Add comment</button> <br />
               {existingComments.map((comment, index) =>
                       <li key={index} className="commentPopup-existing-comments">
                           <p className="existing-comment commentData">{comment}</p>
                           <p className="comment-by-user commentData">{existingCommentsOnUsersDepartment[index]}</p>
                           <p className="comment-date commentData">{existingCommentDate[index]}</p>
                       </li>
               )}
               <button onClick={closeCommentPopup} className="close-comment-popup">Close</button>
           </div>}
           {solvePopup && <div className="popup">
               <div className="popup-open"></div>
               <p>Write down the solution</p>
               <textarea className="solve-solution" onChange={(e) => setTicketSolution(e.target.value)}></textarea> <br />
               <button  type="submit" onClick={solveTicket} className="solve-ticket-submit-btn">Solve</button>
               <button onClick={closeTicketPopup} className="solve-ticket-close-btn">Close</button>
           </div>}
    </>

}

export default LoadTicketsOnUserDepartment