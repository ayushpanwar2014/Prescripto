import React, { useState } from 'react'
import { assets } from '../assets/assets_frontend/assets'

const MyProfile = () => {

  const [userData, setUserData] = useState({
    name: 'Ayush Panwar',
    image: assets.profile_pic,
    email: 'ayush@gmail.com',
    phone: '+91 1234567890',
    address: {
      line1: 'Dehradun, Uttarakhand',
      line2: 'India, Asia'
    },
    gender: 'Male',
    dob: '2003-06-21'
  })

  const [isEdit, setIsEdit] = useState(false);

  console.log(userData);


  return (
    <div className='max-w-lg flex flex-col gap-2 text-sm'>
      <img className='w-36 rounded' src={userData.image} alt="" />

      {
        isEdit ?
          <input type="text" className='bg-gray-200 text-3xl font-medium max-w-60 mt-4 text-center focus:outline-[#5E5E5E] focus:ring-0' value={userData.name} name='name' onChange={(e) => setUserData({ ...userData, [e.target.name]: e.target.value })} />
          : <p className='font-medium text-3xl text-neutral-800 mt-4'>{userData.name}</p>
      }

      <hr className='bg-zinc-400 h-[1px] border-none' />
      <div>
        <p className='text-neutral-500 underline mt-3'>Contact INFORMATION</p>
        <div className='grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700'>
          <p className='font-medium '>Email id:</p>
          <p className='text-blue-500'>{userData.email}</p>
          <p className='font-medium'>Phone:</p>
          {
            isEdit ?
              <input className='bg-gray-200 max-w-52 focus:outline-[#5E5E5E] focus:ring-0' type="text" value={userData.phone} name='phone' onChange={(e) => setUserData({ ...userData, [e.target.name]: e.target.value })} />
              : <p className='text-blue-400'>{userData.phone}</p>
          }
          <p className='font-medium'>Address:</p>
          {
            isEdit ?
              <p>
                <input className='bg-gray-200 focus:outline-[#5E5E5E] focus:ring-0' onChange={(e) => setUserData({ ...userData, address: { ...userData.address, line1: e.target.value } })} value={userData.address.line1} type="text" />
                <br />
                <input className='bg-gray-200 focus:outline-[#5E5E5E] focus:ring-0' onChange={(e) => setUserData({ ...userData, address: { ...userData.address, line2: e.target.value } })} value={userData.address.line2} type="text" />
              </p>
              :
              <p className='text-gray-500'>
                {userData.address.line1}
                <br />
                {userData.address.line2}
              </p>

          }
        </div>
      </div>
      <div>
        <p className='text-neutral-500 underline mt-3'>BASIC INFORMATION</p>
        <div className='grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700'>
          <p className='font-medium'>Gender:</p>
          {
            isEdit ?
              <select className='max-w-20 bg-gray-200' onChange={(e) => setUserData({ ...userData, gender: e.target.value })}>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Rather Not to Say">Rather Not to Say</option>
              </select>
              : <p className='text-gray-400'>{userData.gender}</p>
          }
          <p className='font-medium'>BirthDay:</p>
          {
            isEdit ?
              <input className='max-w-28 bg-gray-200 focus:outline-[#5E5E5E] focus:ring-0' onChange={(e) => setUserData({ ...userData, dob: e.target.value })} value={userData.dob} type="date" />
              : <p className='text-gray-400'>{userData.dob}</p>

          }
        </div>
      </div>

      <div className='mt-10'>
        {
          isEdit
            ? <button className='border border-[#5f6FFF] px-8 py-2 rounded-full hover:bg-[#5f6FFF] hover:text-white transition-all duration-300' onClick={() => setIsEdit((prev) => !prev)} >Save Information</button>
            : <button className='border border-[#5f6FFF] px-8 py-2 rounded-full hover:bg-[#5f6FFF] hover:text-white transition-all duration-300' onClick={() => setIsEdit((prev) => !prev)} >Edit</button>
        }
      </div>

    </div>
  )
}

export default MyProfile
