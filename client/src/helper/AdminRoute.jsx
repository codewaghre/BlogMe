import React from 'react'

import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'
import { RouteSignIn } from './RouteName'

const AdminRoute = () => {
    const user = useSelector(state => state.user)
    if (user && user.isLoggedIn && user.user.role === 'admin') {
        return (
            <Outlet />
        )
    } else {
        return <Navigate to={RouteSignIn} />
    }
}

export default AdminRoute

