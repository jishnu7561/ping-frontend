import React from 'react'
import NotFound from '../Pages/NotFound'
import { Route, Routes } from 'react-router-dom'
import Userprotect from '../common/components/Login/userprotect'
import AdminSidebar from '../Pages/Admin/AdminSidebar'
import UserManagement from '../Pages/Admin/UserManagement/userManagement'
import ReportManagement from '../Pages/Admin/ReportManagement/reportManagement'
import Dashboard from '../Pages/Admin/dashboard/dashboard'

function AdminRouter() {
  return (
    <Routes>
        <Route element={<Userprotect/>}>
          <Route element={<AdminSidebar />}>
            <Route path="/users" element={<UserManagement/>} />
            <Route path='/reports' element={<ReportManagement/>} />
            <Route path='/dashboard' element={<Dashboard/>} />
          </Route>
        </Route>
        <Route path="/*" element={<NotFound />} />
    </Routes>
  )
}

export default AdminRouter