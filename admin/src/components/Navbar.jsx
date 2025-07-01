import React, { useContext } from 'react'
import {assets} from '../assets/assets_admin/assets'
import { AdminContext } from '../context/exportAllContext'

export default function Navbar() {

    const {adminToken,logout} = useContext(AdminContext);

  return (
    <div className='flex justify-between items-center px-4 sm:px-10 py-3 border-b border-zinc-300 bg-white'>
      <div className='flex items-center gap-2 text-xs'>
        <img className='w-36 sm:w-40 cursor-pointer' src={assets.admin_logo} alt="" />
        <p className='border px-2.5 py-0.5 rounded-full border-gray-500 text-gray-600'>{adminToken ? 'Admin' : 'Doctor'}</p>
      </div>
      <button className='cursor-pointer text-white bg-[#5f6FFF] rounded-full text-sm py-2 px-10' onClick={() => logout()}>Logout</button>
    </div>
  )
}
