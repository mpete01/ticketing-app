import React, { useState, useEffect } from "react";
import './styles/home.css';
import axios from "axios";

function Homepage() {
    const [newTask, setNewTask] = useState("")
    const [tasks, setTasks] = useState([])
    const [time, setTime] = useState(new Date())

    //get current time upon reloading and displaying it
    useEffect(() => {
        const intervalId = setInterval(() => {
            setTime(new Date())
        }, 1000)

        return () => clearInterval(intervalId);
    },[])
    const formattedTime = time.toLocaleTimeString()


    //get all the currently stored tasks and store them in the tasks variable
    useEffect(() => {
        const query = async () => {
            try{
                const response = await axios.get('http://localhost:3000/tasks/getTasks')
                setTasks(response.data)
            } catch(err){
                console.log(err)
            }
        }
        query()
    }, [])


    //get current logged in user
    const loggedInUser = localStorage.getItem("user")

    //add new task to UI and to the database too
    const addTask = async () => {
        if(newTask.trim() !== "") {
            setTasks(t => [...t, newTask])
            setNewTask("")
            const uploadNewTask = await axios.post('http://localhost:3000/tasks/uploadNew', { newTask, loggedInUser, time })
        } else {
            alert("Empty task. Try again!")
        }
    }

    //delete task from UI and database
    const deleteTask = async (index) =>{
        const updatedTasks = tasks.filter((_, i) => i !== index)
        setTasks(updatedTasks)
        const deletedTask = tasks[index]
        const deleteFromDb = await axios.post('http://localhost:3000/tasks/delTask', { delete: deletedTask })
    }

    const moveTaskUp = (index) => {
        const updatedTasks = [...tasks]
        if(index > 0){
            [updatedTasks[index], updatedTasks[index - 1]] = [updatedTasks[index - 1], updatedTasks[index]]
            setTasks(updatedTasks)
        } else {
            alert("kurva anyád")
        }
    }

    const moveTaskDown = (index) => {
        const updatedTasks = [...tasks]
        if(index < tasks.length - 1){
            [updatedTasks[index], updatedTasks[index + 1]] = [updatedTasks[index + 1], updatedTasks[index]]
            setTasks(updatedTasks)
        } else{
            alert("kurva anyád")
        }
    }

    const logOut = () => {
        sessionStorage.removeItem("token")
        localStorage.removeItem("user")
        location.reload()
    }

    return(<>
        <header className="header">
            <div>Logged in as {loggedInUser}</div>
            <div>{formattedTime}</div>
            <button className="header-logout" onClick={logOut}>Log out</button>
        </header>
        <h1>Tasks</h1>
        <div className="add-new-task">
            <input type="text" className="new-task" placeholder="Enter new task..." value={newTask} onChange={(e) => setNewTask(e.target.value)}/>
            <button className="add-new-task-btn" onClick={addTask}>Add Task</button>
        </div>
        <ol className="tasks">
            {tasks.map((task, index) =>
                <li key={index} className="task">
                    <span className="text">{task}</span>
                    <button className="delete-task task-button" onClick={() => deleteTask(index)}>Delete</button>
                    <button className="move-task task-button" onClick={() => moveTaskUp(index)}>Up</button>
                    <button className="move-task task-button" onClick={() => moveTaskDown(index)}>Down</button>
                </li>
            )}
        </ol>    
    </>)
    

}

export default Homepage