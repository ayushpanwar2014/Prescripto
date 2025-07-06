import { useState } from 'react'
import { assets } from '../assets/assets_frontend/assets'
import { NavLink, useNavigate } from 'react-router-dom'
import { useContext } from 'react';
import { AppContext } from '../context/exportAppContext';

const Navbar = () => {

  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const { user, fetchLogout } = useContext(AppContext);
  const [openDropdown, setOpenDropodown] = useState(false);

  return (
    <div className='flex items-center justify-between text-sm py-4 border-b border-b-gray-400' >
      <NavLink to={'/'}>
        <img className='w-44 cursor-pointer' src={assets.logo} alt="" />
      </NavLink>
      <ul className='hidden md:flex items-start gap-5 font-medium'>
        <NavLink className='hover:translate-y-[-5px] transition-all duration-5w00' to={'/'}>
          <li className='py-1' >HOME</li>
          <hr className=' w-full border-t-2 border-[#5f6FFF] m-auto hidden' />
        </NavLink>
        <NavLink className='hover:translate-y-[-5px] transition-all duration-5w00' to={'/doctors'}>
          <li className='py-1' >ALL DOCTORS</li>
          <hr className=' w-full border-t-2 border-[#5f6FFF] m-auto hidden' />
        </NavLink>
        <NavLink className='hover:translate-y-[-5px] transition-all duration-5w00' to={'/about'}>
          <li className='py-1' >ABOUT</li>
          <hr className='w-full border-t-2 border-[#5f6FFF] m-auto hidden' />
        </NavLink>
        <NavLink className='hover:translate-y-[-5px] transition-all duration-5w00' to={'/contact'}>
          <li className='py-1' >CONTACTS</li>
          <hr className=' w-full border-t-2 border-[#5f6FFF] m-auto hidden' />
        </NavLink>
      </ul>

      <div className='flex items-center gap-4'>
        {
          user ?
            <div onClick={() => setOpenDropodown((prev) => !prev)} className='flex items-center gap-2 cursor-pointer group relative'>
              <img className='w-8 rounded-full' src={user ? user?.image : assets.profile_pic} alt='profile-pic' />
              <img className='w-2.5' src={assets.dropdown_icon} alt='dropdown-icon' />
              <div className={`absolute top-0 right-0 pt-14 w-35 text-base font-medium text-gray-600 z-20  ${openDropdown ? '' : 'hidden'}`}>
                <div className='min-w-48 bg-stone-100 rounded flex flex-col gap-4 p-4'>
                  <p onClick={() => navigate('my-profile')} className='hover:text-black cursor-pointer'>My Profile</p>
                  <p onClick={() => navigate('my-appointments')} className='hover:text-black cursor-pointer'>My Appointments</p>
                  <p onClick={() => fetchLogout()} className='hover:text-black cursor-pointer'>Logout</p>
                </div>
              </div>
            </div>
            : <button onClick={() => navigate('/login')} className='py-2 px-3 bg-[#5f6FFF] text-xs text-white rounded-full font-light cursor-pointer block  sm:text-xs md:block md:px-8 md:py-3'>Create Account</button>
        }
        <img onClick={() => setShowMenu(true)} src={assets.menu_icon} className='w-6 cursor-pointer md:hidden transition-all duration-300' alt="" />

        {/* Mobile Menu  */}
        <div className={` ${showMenu ? 'fixed w-full' : 'h-0 w-0'} md:hidden right-0 top-0 bottom-0 z-20 overflow-hidden bg-white transition-all duration-300`} >
          <div className='flex items-center justify-between px-5 py-6'>
            <img className='w-36 ' src={assets.logo} alt="" />
            <img className='w-7' onClick={() => setShowMenu(false)} src={assets.cross_icon} alt="" />
          </div>
          <ul className='flex flex-col items-center gap-2 mt-5 px-5 text-lg font-medium'>
            <NavLink onClick={() => setShowMenu(false)} to='/'> <p className='px-4 py-2 rounded inline-block cursor-pointer'>HOME</p> </NavLink>
            <NavLink onClick={() => setShowMenu(false)} to='/doctors'> <p className='px-4 py-2 rounded inline-block cursor-pointer'>ALL DOCTORS</p> </NavLink>
            <NavLink onClick={() => setShowMenu(false)} to='/about'> <p className='px-4 py-2 rounded inline-block cursor-pointer'>ABOUT</p> </NavLink>
            <NavLink onClick={() => setShowMenu(false)} to='/contact'> <p className='px-4 py-2 rounded inline-block cursor-pointer'>CONTACT</p> </NavLink>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Navbar
