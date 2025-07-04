import React from 'react'
import { assets } from '../assets/assets_frontend/assets'

export default function Footer() {
  return (
    <div className='md:mx-10'>
      <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>

        {/* left  */}
        <div>
            <img className='mb-5 w-40 ' src={assets.logo} alt="" />
            <p className='w-full md:w-2/3 text-gray-600 leading-6'>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Delectus voluptatibus veritatis voluptatem libero nemo natus ex quia magni enim quas! Doloremque, omnis delectus. Vitae, maxime amet? A inventore quaerat nam!</p>
        </div>

        {/* middle  */}
        <div>
            <p className='text-xl font-medium mb-5'>COMPANY</p>
            <ul className='flex flex-col gap-2 text-gray-600'>
                <li>Home</li>
                <li>About us</li>
                <li>Contact us</li>
                <li>Privacy Policy</li>
            </ul>
        </div>

        {/* right  */}
        <div>
             <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>
            <ul className='flex flex-col gap-2 text-gray-600'>
                <li>+91 111-223-3245</li>
                <li>prescripto@gmail.com</li>
            </ul>
        </div>

      </div>

        {/* copy right  */}
      <div className=''>
            <hr />
            <p className='py-5 text-sm text-center'>Copyright 2025© Prescripto - All Right Reserved.</p>
      </div>
    </div>
  )
}
