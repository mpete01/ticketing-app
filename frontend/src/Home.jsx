import React, { useState, useEffect } from "react";
import './styles/home.css';
import axios from "axios";

function Homepage() {
    const [newTask, setNewTask] = useState("")
    const [tasks, setTasks] = useState([])
    const [time, setTime] = useState(new Date())

    //get current time eupon reloading and displaying it
    useEffect(() => {
        const intervalId = setInterval(() => {
            setTime(new Date())
        }, 1000)

        return () => clearInterval(intervalId);
    },[])
    const formattedTime = time.toLocaleTimeString()

    //get all the currently stored tasks and store them in the tasks variable
    useEffect(() => {
        const storedTasks = async () => {
            try{
                let tasksFromDb = await axios.get('http://localhost:3000/tasks/getTasks')
                setTasks(tasksFromDb.data)
                //console.log(...tasks)
                //console.log(typeof(tasks))
            } catch(err){
                console.log(err)
            }
        }
        storedTasks()
    },[])

    const gettasks = () => {
        for(let i = 0; i < tasks.length; i++){
            setTasks(tasks[i].title)
        }
        console.log(tasks)
    }

    const loggedInUser = localStorage.getItem("user")

    const addTask = () => {
        if(newTask !== "") {
            setTasks(t => [...tasks, newTask])
            setNewTask("")
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
    
    const sendData = async (req, res) => {
        let uploadNewTask = await axios.post('http://localhost:3000/tasks/uploadNew', { newTask, loggedInUser, time })
        console.log(uploadNewTask)
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
            <button className="add-new-task-btn" onClick={sendData}>Add Task</button>
        </div>
        <ol className="tasks">
            <button onClick={gettasks}>organize object</button>
        </ol>    
    </>)
    

}

export default Homepage