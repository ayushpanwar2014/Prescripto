import { useCallback, useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/exportAppContext'
import { toast } from 'react-toastify';
import axios from 'axios';


const MyAppointments = () => {

  const { backendURL, user } = useContext(AppContext)
  const [appointment, setAppointment] = useState([]);

  const months = ['','Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const slotDateFormat = (slotDate) => {
    const dateArray = slotDate.split('_');
    return dateArray[0] + " " + months[Number(dateArray[1])] + " " + dateArray[2];

  }

  const getUserAppointment = useCallback(async () => {

    try {

      const response = await axios.get(backendURL + '/api/user/display-appointments', { withCredentials: true });

      if (response.data.success) {
        setAppointment(response.data.appointments.reverse());
      }

    } catch (error) {
      toast.error(error.response.data.msg)
    }
  }, [backendURL])

  useEffect(() => {
    if (user) {
      getUserAppointment();
    }
  }, [getUserAppointment, user]);

  return (
    <div >
      <p className='pb-3 mt-12 font-medium text-gray-700 border-gray-300 border-b'>My Appointments</p>
      <div>
        {appointment.length === 0 ? (
          <p className="text-gray-500 mt-4">You have no appointments yet.</p>
        )
          : (
            appointment.map((doc, index) => (
              <div className='grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-gray-300 border-b ' key={doc?._id || doc?.id || index}>
                <div>
                  <img className='w-32 bg-indigo-50' src={doc?.docData?.image} alt="" />
                </div>
                <div className='flex-1 text-sm text-zinc-600'>
                  <p className='text-neutral-800 font-semibold'>{doc?.docData?.name}</p>
                  <p>{doc?.docData?.speciality}</p>
                  <p className='text-zinc-700 font-semibold mt-1'>Address:</p>
                  <p className='text-xs' >{doc?.docData?.address?.line1}</p>
                  <p className='text-xs' >{doc?.docData?.address?.line2}</p>
                  <p className='text-xs mt-1'><span className='text-sm text-neutral-700 font-semibold'>Date & Time: </span> {slotDateFormat(doc?.slotDate)} | {doc?.slotTime}</p>
                </div>
                <div className='flex flex-col gap-2 justify-end'>
                  <button className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-[#5f6FFF] hover:text-white transition-all duration-300'>Pay Online</button>
                  <button className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-red-600 hover:text-white transition-all duration-300'>Cancel Appointment</button>
                </div>
              </div>
            ))
          )
        }
      </div>
    </div>
  )
}

export default MyAppointments
