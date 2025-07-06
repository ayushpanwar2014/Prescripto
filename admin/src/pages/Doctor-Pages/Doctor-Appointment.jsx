import { useContext } from 'react'
import { AppContext, DoctorContext } from '../../context/exportAllContext'
import { useEffect } from 'react';
import { assets } from '../../assets/assets_admin/assets'

export default function DoctorAppointment() {

  const { docToken, getDoctorAppointment, appointments, cancelAppointment, completeAppointment } = useContext(DoctorContext);
  const { calculateAge, slotDateFormat, currencySymbol } = useContext(AppContext);

  useEffect(() => {
    if (docToken) {
      getDoctorAppointment();
    }
  }, [docToken, getDoctorAppointment])

  return (
    <div className='w-full m-5 max-w-6xl'>
      <p className='mb-3 text-lg font-medium'>All Appointments</p>
      <div className='bg-white border border-zinc-300 min-h-[50vh] rounded text-sm max-h-[80vh] overflow-y-scroll'>
        <div className='max-sm:hidden grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-1 py-3 px-6 border-b border-zinc-300'>
          <p>#</p>
          <p>Patient</p>
          <p>Payment</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Fees</p>
          <p>Action</p>
        </div>

        {
          appointments.map((item, index) => (
            <div className='flex flex-wrap justify-between max-sm:gap-5 max-sm:text-base sm:grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-1 items-center text-gray-500 py-3 px-6 border-b border-zinc-300 hover:bg-gray-50' key={index}>
              <p className='max-sm:hidden'>{index + 1}</p>
              <div className='flex items-center gap-2'>
                <img className='w-8 rounded-full' src={item?.userData?.image} alt="" /> <p>{item?.userData?.name}</p>
              </div>
              <div>
                <p className='text-xs inline border border-[#5f6FFF] px-2 rounded-full'>
                  {item?.payment ? 'Online' : 'CASH'}
                </p>
              </div>
              <p className='max-sm:hidden'>{calculateAge(item?.userData?.dob)}</p>
              <p>{slotDateFormat(item?.slotDate)}, {item?.slotTime}</p>
              <p>{currencySymbol}{item?.amount}</p>

              <div className='flex'>
                {!item?.cancelled && !item?.isCompleted &&  <img onClick={() => cancelAppointment(item?._id)} className='w-10 cursor-pointer' src={assets.cancel_icon} alt="" />}
                {!item?.cancelled && !item?.isCompleted && <img onClick={() => completeAppointment(item?._id)} className='w-10 cursor-pointer' src={assets.tick_icon} alt="" />}
                {item?.cancelled && !item?.isCompleted && <p className="text-red-600 text-xs font-medium">Cancelled</p>}
                {!item?.cancelled && item?.isCompleted && <p className="text-green-500 text-xs font-medium">Completed</p>}
              </div>
            </div>
          ))
        }
      </div>
    </div>
  )
}
