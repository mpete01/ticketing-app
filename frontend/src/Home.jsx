import React, { useState } from "react";
import './styles/home.css';

function Homepage() {
    const [newTask, setNewTask] = useState("")
    const [tasks, setTasks] = useState(["balls", "cum xd", "beer", "women:("])

    function handleInputChange(event) {
        setNewTask(event.target.value)
    }

    function addTask(){
        if(newTask !== "") {
            setTasks(t => [...tasks, newTask])
            setNewTask("")
        } else {
            alert("Empty task. Try again!")
        }
    }

    function deleteTask(index){
        const updatedTasks = tasks.filter((_, i) => i !== index)

        setTasks(updatedTasks)
    }

    function moveTaskUp(index){
        const updatedTasks = [...tasks]
        if(index > 0){
            [updatedTasks[index], updatedTasks[index - 1]] = [updatedTasks[index - 1], updatedTasks[index]]
            setTasks(updatedTasks)
        } else {
            alert("kurva anyád")
        }
    }

    function moveTaskDown(index){
        const updatedTasks = [...tasks]
        if(index < tasks.length - 1){
            [updatedTasks[index], updatedTasks[index + 1]] = [updatedTasks[index + 1], updatedTasks[index]]
            setTasks(updatedTasks)
        } else{
            alert("kurva anyád")
        }
    }
    
    return <div>
        <h1>Tasks</h1>
        <div className="add-new-task">
            <input type="text" className="new-task" placeholder="Enter new task..." value={newTask} onChange={handleInputChange}/>
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
    </div>
}

export default Homepage