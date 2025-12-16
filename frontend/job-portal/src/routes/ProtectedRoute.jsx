import React from 'react'
import { Navigate,Outlet,useLocation } from 'react-router-dom'

const ProtectedRoute = ({requiredRole}) => {
  return (
    <div>
      <Outlet/>
    </div>
  )
}

export default ProtectedRoute
