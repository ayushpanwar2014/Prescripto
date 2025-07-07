import './App.css'
import Login from './pages/Login'
import { Route, Routes } from 'react-router-dom'
import { useContext } from 'react';
import { AdminContext, DoctorContext } from './context/exportAllContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Admin-Pages/Dashboard';
import AllAppointment from './pages/Admin-Pages/All-Appointment';
import AddDoctor from './pages/Admin-Pages/AddDoctor';
import DoctorList from './pages/Admin-Pages/DoctorList';
import DoctorDashboard from './pages/Doctor-Pages/Doctor-Dashboard';
import DoctorProfile from './pages/Doctor-Pages/Doctor-Profile';
import DoctorAppointment from './pages/Doctor-Pages/Doctor-Appointment';

function App() {

  const { adminToken } = useContext(AdminContext);
  const { docToken } = useContext(DoctorContext);

  return adminToken || docToken ? (
    <div className='bg-[#F8F9FD]'>
      <Navbar />

      <div className='flex items-start'>
        <Sidebar />
        <Routes>
          {/* Admin Routes */}

          <Route path='/' element={<></>} />
          <Route path='/admin-dashboard' element={<Dashboard />} />
          <Route path='/all-appointment' element={<AllAppointment />} />
          <Route path='/add-doctor' element={<AddDoctor />} />
          <Route path='/doctor-list' element={<DoctorList />} />


          {/* Doctor Routes */}

          <Route path='/doctor-dashboard' element={<DoctorDashboard />} />
          <Route path='/doctor-profile' element={<DoctorProfile />} />
          <Route path='/doctor-appointment' element={<DoctorAppointment />} />


        </Routes>
      </div>
    </div>
  ) : (

    <Login />

  )
}

export default App
