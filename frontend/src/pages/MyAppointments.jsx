import { useCallback, useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/exportAppContext'
import { toast } from 'react-toastify';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useProgress } from '../context/ProgressContext';

const MyAppointments = () => {

  const { backendURL, user, getAllDoctors } = useContext(AppContext);
  const [appointment, setAppointment] = useState([]);
  const { startProgress, completeProgress } = useProgress();
  const navigate = useNavigate();
  // Array for converting month number to name
  const months = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  // 🧠 Format slot date from `DD_MM_YYYY` to readable format like `04 Jul 2025`
  const slotDateFormat = (slotDate) => {
    const dateArray = slotDate.split('_');
    return dateArray[0] + " " + months[Number(dateArray[1])] + " " + dateArray[2];
  }

  // 📡 Fetch user-specific appointments from backend (protected route)
  const getUserAppointment = useCallback(async () => {
    try {

      startProgress();
      const response = await axios.get(backendURL + '/api/user/display-appointments', { withCredentials: true });

      if (response.data.success) {
        // ⬇️ Reverse to show latest appointments first
        setAppointment(response.data.appointments.reverse());
        completeProgress();
      }

    } catch (error) {
      completeProgress()
      toast.error(error.response.data.msg);
    }
  }, [backendURL,startProgress, completeProgress]);

  // ❌ Cancel an appointment by ID
  const onClickCancelAppointment = async (appointmentID) => {
    try {

      startProgress();
      const response = await axios.post(backendURL + '/api/user/cancel-appointment', { appointmentID }, { withCredentials: true });

      if (response.data.success) {
        getUserAppointment();    // 🔁 Refresh list after cancel
        getAllDoctors();         // 🔄 Refresh available slots of doctors
        completeProgress()
        toast.success(response.data.msg);
      }

    } catch (error) {
      completeProgress();
      toast.error(error.response.data.msg);
    }
  }


  const initPay = (order) => {

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEYID,
      amount: order.amount,
      currency: order.currency,
      name: 'Appointment Payment',
      description: 'Appointment Payment',
      order_id: order.id,
      receipt: order.receipt,
      handler: async (response) => {
        try {
          const verifyResponse = await axios.post(
            backendURL + '/api/user/verifyRazorpay',
            {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            },
            { withCredentials: true }
          );

          if (verifyResponse.data.success) {
            getUserAppointment();
            navigate('/my-appointments');
            toast.success(verifyResponse.data.msg);
          }
        } catch (error) {
          toast.error(error.response?.data?.msg || "Payment verification failed");
        }
      }
    }

    const rzp = new window.Razorpay(options);
    rzp.open();
  }

  //razor pay
  const razorpayment = async (appointmentID) => {
    try {
      startProgress();
      const response = await axios.post(backendURL + '/api/user/payment-razorpay', { appointmentID }, { withCredentials: true });

      if (response.data.success) {
        initPay(response.data.order);
        completeProgress();
      }

    } catch (error) {
      toast.error(error.response.data.msg);
      completeProgress()
    }
  }

  // 📦 Fetch appointments only when user is available (after login)
  useEffect(() => {
    if (user) {
      getUserAppointment();
    }
  }, [getUserAppointment, user]);

  return (
    <div>
      <p className='pb-3 mt-12 font-medium text-gray-700 border-gray-300 border-b'>My Appointments</p>
      <div>
        {/* 🧾 Show message if no appointments */}
        {appointment.length === 0 ? (
          <p className="text-gray-500 mt-4">You have no appointments yet.</p>
        ) : (
          appointment.map((item, index) => (
            <div className='grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-gray-300 border-b ' key={item?._id || item?.id || index}>

              {/* 👨‍⚕️ Doctor Image */}
              <div>
                <img className='w-32 bg-indigo-50 rounded' src={item?.docData?.image} alt="" />
              </div>

              {/* 📄 Appointment Details */}
              <div className='flex-1 text-sm text-zinc-600'>
                <p className='text-neutral-800 font-semibold'>{item?.docData?.name}</p>
                <p>{item?.docData?.speciality}</p>
                <p className='text-zinc-700 font-semibold mt-1'>Address:</p>
                <p className='text-xs'>{item?.docData?.address?.line1}</p>
                <p className='text-xs'>{item?.docData?.address?.line2}</p>
                <p className='text-xs mt-1'>
                  <span className='text-sm text-neutral-700 font-semibold'>Date & Time: </span>
                  {slotDateFormat(item?.slotDate)} | {item?.slotTime}
                </p>
              </div>

              {/* 🎯 Action Buttons */}
              <div className='flex flex-col gap-2 justify-end'>
                {
                  !item?.cancelled && item?.payment && (
                    <button className='text-sm  text-center sm:min-w-48 py-2 border rounded bg-[#5f6FFF] cursor-pointer text-white hover:bg-white hover:text-black transition-all duration-300'>
                      Amount Paid
                    </button>
                  )
                }

                {!item?.cancelled && !item?.payment && (
                  <button onClick={() => razorpayment(item?._id)} className='text-sm text-stone-500 cursor-pointer text-center sm:min-w-48 py-2 border rounded hover:bg-[#5f6FFF] hover:text-white transition-all duration-300'>
                    Pay Online
                  </button>
                )}
                {!item?.cancelled && !item?.isCompleted && (
                  <button
                    onClick={() => onClickCancelAppointment(item?._id)}
                    className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border cursor-pointer rounded hover:bg-red-600 hover:text-white transition-all duration-300'
                  >
                    Cancel Appointment
                  </button>
                )}
                {item.cancelled && !item?.isCompleted && (
                  <button className='text-sm text-white text-center sm:min-w-48 py-2 border cursor-pointer rounded bg-red-600 hover:bg-white hover:text-black transition-all duration-300'>
                    Appointment is Cancelled
                  </button>
                )}
                {!item.cancelled && item?.isCompleted && (
                  <button className='text-sm text-white text-center sm:min-w-48 py-2 border cursor-pointer rounded bg-green-500 hover:bg-white hover:text-black transition-all duration-300'>
                    Appointment is Completed
                  </button>
                )}
              </div>

            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default MyAppointments
