import React, { useState } from 'react'
import { assets } from '../assets/assets_frontend/assets'
import { NavLink, useNavigate } from 'react-router-dom'

const Navbar = () => {

  const navigate = useNavigate();
  // const [showMenu, setShowMenu] = useState(false);
  const [token, setToken] = useState(true);

  return (
    <div className='flex items-center justify-between text-sm py-4 border-b border-b-gray-400' >
      <NavLink to={'/'}>
        <img className='w-44 cursor-pointer' src={assets.logo} alt="" />
      </NavLink>
      <ul className='hidden md:flex items-start gap-5 font-medium'>
        <NavLink className='hover:translate-y-[-5px] transition-all duration-500' to={'/'}>
          <li className='py-1' >HOME</li>
          <hr className=' w-full border-t-2 border-[#5f6FFF] m-auto hidden' />
        </NavLink>
        <NavLink className='hover:translate-y-[-5px] transition-all duration-500' to={'/doctors'}>
          <li className='py-1' >ALL DOCTORS</li>
          <hr className=' w-full border-t-2 border-[#5f6FFF] m-auto hidden' />
        </NavLink>
        <NavLink className='hover:translate-y-[-5px] transition-all duration-500' to={'/about'}>
          <li className='py-1' >ABOUT</li>
          <hr className='w-full border-t-2 border-[#5f6FFF] m-auto hidden' />
        </NavLink>
        <NavLink className='hover:translate-y-[-5px] transition-all duration-500' to={'/contact'}>
          <li className='py-1' >CONTACTS</li>
          <hr className=' w-full border-t-2 border-[#5f6FFF] m-auto hidden' />
        </NavLink>
      </ul>

      <div className='flex items-center gap-4'>
        {
          token ?
            <div className='flex items-center gap-2 cursor-pointer group relative'>
              <img className='w-8 rounded-full' src={assets.profile_pic} alt='profile-pic' />
              <img className='w-2.5' src={assets.dropdown_icon} alt='dropdown-icon' />
              <div className='absolute top-0 right-0 pt-14 w-35 text-base font-medium text-gray-600 z-20 hidden group-hover:block'>
                <div className='min-w-48 bg-stone-100 rounded flex flex-col gap-4 p-4'>
                  <p onClick={() => navigate('my-profile')} className='hover:text-black cursor-pointer'>My Profile</p>
                  <p onClick={() => navigate('my-appointments')} className='hover:text-black cursor-pointer'>My Appointments</p>
                  <p onClick={() => setToken(false)} className='hover:text-black cursor-pointer'>Logout</p>
                </div>
              </div>
            </div>
            : <button onClick={() => navigate('/login')} className='bg-[#5f6FFF] text-white px-8 py-3 rounded-full font-light cursor-pointer hidden md:block'>Create Account</button>
        }
      </div>
    </div>
  )
}

export default Navbar
