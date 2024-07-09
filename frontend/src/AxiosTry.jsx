import React from "react";
import axios from "axios";
import { useState } from "react";

//"https://api.quotable.io/random"


function AxiosTry() {
    const [quote, setQuote] = useState("")

    const getQuote = () => {
        axios.get("https://api.quotable.io/random")
        .then(res => {
            setQuote(res.data.content)
        }) .catch(err => {
            console.log(err)
        })
    }

    return (
        <div>
            <button type="submit" onClick={getQuote}>Get Random Quote</button><br />
            <div>{quote}</div>
        </div>

    )
}

export default AxiosTry