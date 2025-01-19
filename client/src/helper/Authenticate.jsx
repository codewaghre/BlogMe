import React from 'react'
import { RouteSignIn } from './RouteName'

import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'

const Authenticate = () => {

    const user = useSelector(state => state.user)
    if (user && user.isLoggedIn) {
        return (
            <Outlet />
        )
    } else {
        return <Navigate to={RouteSignIn} />
    }

}

export default Authenticate
