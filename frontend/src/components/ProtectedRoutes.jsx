import React from "react";
import { Outlet, Navigate } from "react-router-dom";

function ProtectedRoutes(){

    //get the user's stored token from local storage
    const storedToken = localStorage.getItem("token")

    return (
        //check if there are any valid tokens for the user
        //if there is the user can access the protected routes
        //if there is no token the user is redirected to the login page
        storedToken ? <Outlet /> : <Navigate to="/login" />
    )
}

export default ProtectedRoutes