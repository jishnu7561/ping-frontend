
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import UserRouter from './Routes/UserRouter';
import AdminRouter from './Routes/adminRouter';
import CommonRouter from './Routes/commonRouter';

function App() {
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
