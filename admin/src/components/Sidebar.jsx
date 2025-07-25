import React, { useContext } from 'react'
import { AdminContext, DoctorContext } from '../context/exportAllContext'
import { NavLink } from 'react-router-dom';
import { assets } from '../assets/assets_admin/assets';

export default function Sidebar() {

  const { adminToken } = useContext(AdminContext);
  const { docToken } = useContext(DoctorContext);

  return (
    <div className='min-h-screen bg-white border-r border-zinc-300'>
      {
        adminToken &&
        <ul className='text-[#515151] mt-5 ]'>
          <NavLink className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-[#5f6FFF]' : ''}`} to={'/admin-dashboard'}>
            <img src={assets.home_icon} alt="" />
            <p className='hidden md:block'>Dashboard</p>
          </NavLink>
          <NavLink className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-[#5f6FFF]' : ''}`} to={'/all-appointment'}>
            <img  src={assets.appointment_icon} alt="" />
            <p className='hidden md:block'>Appointments</p>
          </NavLink>
          <NavLink className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-[#5f6FFF]' : ''}`} to={'/add-doctor'}>
            <img src={assets.add_icon} alt="" />
            <p className='hidden md:block'>Add Doctors</p>
          </NavLink>
          <NavLink className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-[#5f6FFF]' : ''}`} to={'/doctor-list'}>
            <img src={assets.people_icon} alt="" />
            <p className='hidden md:block'>Doctor List</p>
          </NavLink>
        </ul>
      }
      {
        docToken &&
        <ul className='text-[#515151] mt-5 ]'>
          <NavLink className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-[#5f6FFF]' : ''}`} to={'/doctor-dashboard'}>
            <img src={assets.home_icon} alt="" />
            <p className='hidden md:block'>Dashboard</p>
          </NavLink>
          <NavLink className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-[#5f6FFF]' : ''}`} to={'/doctor-appointment'}>
            <img src={assets.appointment_icon} alt="" />
            <p className='hidden md:block'>Appointments</p>
          </NavLink>
          <NavLink className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-[#5f6FFF]' : ''}`} to={'/doctor-profile'}>
            <img src={assets.people_icon} alt="" />
            <p className='hidden md:block'>Profile</p>
          </NavLink>
        </ul>
      }
    </div>
  )
}
