import './App.css'
import Login from './pages/login'
import {Route, Routes} from 'react-router-dom'
import { useContext } from 'react';
import { AdminContext } from './context/exportAllContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Admin-Pages/Dashboard';
import AllAppointment from './pages/Admin-Pages/All-Appointment';
import AddDoctor from './pages/Admin-Pages/AddDoctor';
import DoctorList from './pages/Admin-Pages/DoctorList';

function App() {

  const { adminToken } = useContext(AdminContext);

  return adminToken ? (
    <div className='bg-[#F8F9FD]'>
      <Navbar />

      <div className='flex items-start'>
        <Sidebar/>
        <Routes>
          <Route path='/' element={<></>}/>
          <Route path='/admin-dashboard' element={<Dashboard/>}/>
          <Route path='/all-appointment' element={<AllAppointment/>}/>
          <Route path='/add-doctor' element={<AddDoctor/>}/>
          <Route path='/doctor-list' element={<DoctorList/>}/>
        </Routes>
      </div>
    </div>
  ) : (

    <Login />

  )
}

export default App
