import React from 'react'
import NotFound from '../Pages/NotFound'
import { Route, Routes } from 'react-router-dom'
import Userprotect from '../common/components/Login/userprotect'
import AdminSidebar from '../Pages/Admin/AdminSidebar'
import UserManagement from '../Pages/Admin/UserManagement/userManagement'
import ReportManagement from '../Pages/Admin/ReportManagement/reportManagement'
import DashboardManagement from '../Pages/Admin/dashboard/dashboardManagement'
import UserPostDetails from '../Pages/Admin/ReportManagement/userPostDetails'
import Chat from '../Pages/Admin/Chat/chat'
import ChattingPage from '../Pages/Admin/Chat/chattingPage'

function AdminRouter() {
  return (
    <Routes>
        <Route element={<Userprotect/>}>
          <Route element={<AdminSidebar />}>
            <Route path="/users" element={<UserManagement/>} />
            <Route path='/reports' element={<ReportManagement/>} />
            <Route path='/dashboard' element={<DashboardManagement/>} />
            <Route path='/user-post/:postId/:reportId' element={<UserPostDetails />} />
            <Route path='/chat' element={<Chat/>} />
            <Route path='/chat/:chatId' element={<ChattingPage />} />
          </Route>
        </Route>
        <Route path="/*" element={<NotFound />} />
    </Routes>
  )
}

export default AdminRouter