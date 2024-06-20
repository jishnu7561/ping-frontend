import React from 'react'
import NotFound from '../Pages/NotFound'
import { Route, Routes } from 'react-router-dom'
import Userprotect from '../common/components/Login/userprotect'
import AdminSidebar from '../Pages/Admin/AdminSidebar'
import UserManagement from '../Pages/Admin/UserManagement/userManagement'

function AdminRouter() {
  return (
    <Routes>
        <Route element={<Userprotect/>}>
          <Route element={<AdminSidebar />}>
            <Route path="/users" element={<UserManagement/>} />
          </Route>
        </Route>
        <Route path="/*" element={<NotFound />} />
    </Routes>
  )
}

export default AdminRouter