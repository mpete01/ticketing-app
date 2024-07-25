//import React, { useEffect, useState } from "react";
import { Outlet, Navigate } from "react-router-dom";

const ProtectedRoutes = () => {
    //const [token, setToken] = useState(false)

    let auth = {"token": true}
    //let storedToken;

    /*useEffect(() => {
        storedToken = localStorage.getItem("token")
        if(storedToken){
            setToken(true)
        } else {
            setToken(false)
        }
    },[])*/
    return  (
    <>
        {auth.token} ? <Outlet /> : <Navigate to="/login" />
    </>
    )

}

export default ProtectedRoutes