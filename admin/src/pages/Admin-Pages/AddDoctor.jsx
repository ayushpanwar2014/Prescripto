import React from 'react'
import { assets } from '../../assets/assets_admin/assets'

export default function AddDoctor() {
  return (
    <form className='m-5 w-full'>

      <p className='mb-3 text-lg font-medium'>Add Doctor</p>

      <div className='bg-white px-8 py-8 border border-zinc-300 rounded w-full max-w-4xl max-h-[80vh] overflow-y-scroll'>
        <div className='flex items-center gap-4 mb-8 text-gray-500'>
          <label htmlFor="doc-img">
            <img className='cursor-pointer w-16 bg-gray-100 rounded-full' src={assets.upload_area} alt="" />
          </label>
          <input type="file" id='doc-img' hidden />
          <p>Upload doctor <br /> picture</p>
        </div>

        <div className='flex flex-col lg:flex-row items-start gap-10 text-gray-600'>
          <div className='w-full lg:flex-1 flex flex-col gap-4'>

            <div className='flex-1 flex flex-col gap-1'>
              <p>Doctor Name</p>
              <input type="text" placeholder='Name' required name='name' autoComplete='name' className='rounded px-3 py-2 border border-zinc-300 focus:outline-[#5E5E5E] focus:ring-0' />
            </div>

            <div className='flex-1 flex flex-col gap-1'>
              <p>Doctor Email</p>
              <input type="email" placeholder='Email' required name='email' autoComplete='email' className='rounded px-3 py-2 border border-zinc-300 focus:outline-[#5E5E5E] focus:ring-0' />
            </div>

            <div className='flex-1 flex flex-col gap-1'>
              <p>Doctor Password</p>
              <input type="password" placeholder='Password' required name='password' autoComplete='password' className='rounded px-3 py-2 border border-zinc-300 focus:outline-[#5E5E5E] focus:ring-0' />
            </div>

            <div className='flex-1 flex flex-col gap-1'>
              <p>Experience</p>
              <select className='rounded px-3 py-2 border border-zinc-300 focus:outline-[#5E5E5E] focus:ring-0' name="" id="">
                <option value="1 year">1 year</option>
                <option value="2 year">2 year</option>
                <option value="3 year">3 year</option>
                <option value="4 year">4 year</option>
                <option value="5 year">5 year</option>
                <option value="6 year">6 year</option>
                <option value="7 year">7 year</option>
                <option value="8 year">8 year</option>
                <option value="9 year">9 year</option>
                <option value="10 year">10 year</option>
              </select>
            </div>

            <div className='flex-1 flex flex-col gap-1'>
              <p>Fees</p>
              <input type="number" placeholder='Fees' required name='fees' autoComplete='fees' className='rounded px-3 py-2 border border-zinc-300 focus:outline-[#5E5E5E] focus:ring-0' />
            </div>

          </div>

          <div className='w-full lg:flex-1 flex flex-col gap-4'>

            <div className='flex-1 flex flex-col gap-1'>
              <p>Speciality</p>
              <select className='rounded px-3 py-2 border border-zinc-300 focus:outline-[#5E5E5E] focus:ring-0' name="" id="">
                <option value="General physician">General physician</option>
                <option value="Gynecologist">Gynecologist</option>
                <option value="Dermatologist">Dermatologist</option>
                <option value="Pediatricians">Pediatricians</option>
                <option value="Neurologist">Neurologist</option>
                <option value="Gastroenterologist">Gastroenterologist</option>
              </select>
            </div>

            <div className='flex-1 flex flex-col gap-1'>
              <p>Education</p>
              <input type="text" placeholder='Education' required name='education' autoComplete='education' className='rounded px-3 py-2 border border-zinc-300 focus:outline-[#5E5E5E] focus:ring-0' />
            </div>

            <div className='flex-1 flex flex-col gap-1'>
              <p>Address</p>
              <input type="text" className='rounded px-3 py-2 border border-zinc-300 focus:outline-[#5E5E5E] focus:ring-0' name='line1' autoComplete='line1' placeholder='address 1' required />
              <input type="text" className='rounded px-3 py-2 border border-zinc-300 focus:outline-[#5E5E5E] focus:ring-0' name='line2' autoComplete='line2' placeholder='address 2' required />
            </div>

          </div>
        </div>

        <div>
          <p className='mt-4 mb-2'>About Doctor</p>
          <textarea placeholder='write about doctor' rows={5} required name='education' autoComplete='education' className='w-full px-4 pt-2 rounded focus:outline-[#5E5E5E] focus:ring-0' />
        </div>

      <button className='bg-[#5f6FFF] text-white px-10 py-2 rounded-full'>Add Doctor</button>
      </div>
    </form>
  )
}
