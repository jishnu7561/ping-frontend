
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import UserRouter from './Routes/UserRouter';
import AdminRouter from './Routes/adminRouter';
import CommonRouter from './Routes/commonRouter';
import { useSelector } from 'react-redux';
// import { initSocket } from './Pages/chatPage/websocket';
import { useEffect } from 'react';

function App() {
//   const {loggedUser} = useSelector((state)=>state.auth)
//   useEffect(() => {
//     initSocket(loggedUser)
//   }, [loggedUser])
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/*' element={<CommonRouter/>} />
        {/* <Route path='/user/*' element={<UserRouter/>}/> */}
        <Route path='/admin/*' element={<AdminRouter/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
