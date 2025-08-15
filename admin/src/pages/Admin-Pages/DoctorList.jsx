import React, { useContext, useEffect } from 'react'
import { AdminContext } from '../../context/exportAllContext'

export default function DoctorList() {

  const { getAllDoctors, allDoctors, adminToken, onChangeAvailability } = useContext(AdminContext);

  useEffect(() => {

    if (adminToken) {

      getAllDoctors();
    }
  }, [adminToken, getAllDoctors]);


  return (
    <div className='m-5 max-h-[90vh] overflow-y-scroll'>
      <h1 className='text-lg font-medium'>All Doctors</h1>
      <div className='w-full flex flex-wrap gap-4 pt-5 gap-y-6'>
        {
          allDoctors.map((doc, index) => (
            <div className='border border-indigo-200 rounded-xl max-w-52 overflow-hidden cursor-pointer group hover:translate-y-[-10px] transition-all duration-500' key={index}>
              <img className='bg-indigo-50 group-hover:bg-[#5f6FFF] transition-all duration-500' src={doc.image} alt="" />
              <div className='p-4'>
                <p className='text-neutral-800 text-lg font-medium'>{doc.name}</p>
                <p className='text-zinc-600 text-sm'>{doc.speciality}</p>
                <p className='text-zinc-600 text-sm'>{doc.rating} ★</p>
                <div className='mt-2 flex items-center gap-1 text-sm'>
                  <input type="checkbox" checked={doc.available} onChange={() => onChangeAvailability(doc._id)} />
                  <p>Available</p>
                </div>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  )
}
