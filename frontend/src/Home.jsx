import React, { useState, useEffect } from "react";
import './styles/home.css';
import axios from "axios";
import { redirect } from "react-router-dom";

function Homepage() {
    const [newTask, setNewTask] = useState("")
    const [tasks, setTasks] = useState(["task1", "task2"])
    const [time, setTime] = useState(new Date())

    useEffect(() => {
        const intervalId = setInterval(() => {
            setTime(new Date())
        }, 1000)

        return () => clearInterval(intervalId);
    },[])
    const formattedTime = time.toLocaleTimeString()

    const addTask = () => {
        if(newTask !== "") {
            setTasks(t => [...tasks, newTask])
            setNewTask("")
            sendData(data, url)
        } else {
            alert("Empty task. Try again!")
        }
    }

    const deleteTask = (index) =>{
        const updatedTasks = tasks.filter((_, i) => i !== index)
        setTasks(updatedTasks)
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
    
    const sendData = async (data, url) => {
        data = setNewTask(t => newTask)
        url = 'loaclhost:3000'
        try {
            const response = await axios.post(url, data)
            console.log(`${data} \t sent successfully`)
        } catch (error) {
            console.error(error)
        }
    }

    const logOut = () => {
        sessionStorage.removeItem("token")
        redirect("/login")
    }

    return(<>
        <header className="header">
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