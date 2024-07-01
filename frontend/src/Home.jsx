import React, { useState } from "react";
import './styles/home.css';

function Homepage() {
    function addNewElement() {
        const userInput = document.getElementById("new-input_inputfield").value
        const tablebody = document.getElementById("tbody")

        if(userInput === "i need head") {
            alert("saem :(")
        } else {
            console.log(`Written note: ${userInput}`)
        }
        if(userInput === ""){
            console.log("null")
        } else {
            let newRow = tablebody.insertRow(-1)
            let newCell = newRow.insertCell(0);
            let newText = document.createTextNode(userInput);
            newCell.appendChild(newText);
        }
    }
    function editElement(){

    }

    function deleteElement(){

    }
    

    return <div>
        <div className="container">
            <div className="new-input">
                <input type="text" placeholder="Enter new notes..." className="new-input_inputfield" id="new-input_inputfield"/>
                <button className="new-input_submitBtn" type="submit" id="add-new-element" onClick={addNewElement}>Add</button>
            </div>
            <div className="created-notes">
                <table className="created-notes-table">
                    <thead>
                        <tr className="created-notes-table_row">
                            <td className="created-notes-table_data">id</td>
                            <td className="created-notes-table_data">first</td>
                            <td className="created-notes-table_data">last</td>
                            <td className="created-notes-table_data">email</td>
                            <td className="created-notes-table_data">actions</td>
                        </tr>
                    </thead>
                    <tbody id="tbody">
                        <tr className="created-notes-table_row">
                            <td className="created-notes-table_data">id1</td>
                            <td className="created-notes-table_data">name1</td>
                            <td className="created-notes-table_data">name2_1</td>
                            <td className="created-notes-table_data">email1</td>
                            <td className="created-notes-table_data"><button className="created-notes-table_data_edit table-button">Edit</button><button className="created-notes-table_data_del table-button">Delete</button></td>
                        </tr>
                        <tr className="created-notes-table_row">
                            <td className="created-notes-table_data">id2</td>
                            <td className="created-notes-table_data">name2</td>
                            <td className="created-notes-table_data">name2_2</td>
                            <td className="created-notes-table_data">email2</td>
                            <td className="created-notes-table_data"><button className="created-notes-table_data_edit table-button">Edit</button><button className="created-notes-table_data_del table-button">Delete</button></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
}

export default Homepage