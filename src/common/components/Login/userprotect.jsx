import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'

function Userprotect() {

    const {loggedUser} = useSelector((state)=>state.auth)

    return (loggedUser) ? <Outlet /> : <Navigate to='/login' />;
}

export default Userprotect