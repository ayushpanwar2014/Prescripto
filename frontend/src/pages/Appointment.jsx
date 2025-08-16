import { useCallback, useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../context/exportAppContext'
import { assets } from '../assets/assets_frontend/assets';
import RelatedDoctors from '../components/AppointmentPageComponents/RelatedDoctors';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useProgress } from '../context/ProgressContext';

const Appointment = () => {

  // Get docID from URL and context values
  const { docID } = useParams();
  const { doctors, currencySymbol, backendURL, user, getAllDoctors } = useContext(AppContext);
  const { startProgress, completeProgress } = useProgress();

  // Days label for slot selection UI
  const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

  // States for slots, selected day index, and selected time
  const [docSlots, setDocSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState('');

  const navigate = useNavigate();

  // Find doctor info based on docID
  const docInfo = doctors.find((doc) => doc._id === docID);


  // Function to generate available 30-min time slots for 7 days
  const getAvailableSlots = useCallback(async () => {
    if (!docInfo || !docInfo.slots_booked) return;

    setDocSlots([]);
    let today = new Date();

    for (let i = 0; i < 7; i++) {
      let currentDate = new Date();
      currentDate.setDate(today.getDate() + i);

      // Set end time of slots (9 PM)
      let endTime = new Date();
      endTime.setDate(today.getDate() + i);
      endTime.setHours(21, 0, 0, 0);

      // For current day, set time at least 1 hour ahead of now or start at 10:00
      if (today.getDate() === currentDate.getDate()) {
        currentDate.setHours(currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10);
        currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0);
      } else {
        currentDate.setHours(10);
        currentDate.setMinutes(0);
      }

      let timeSlots = [];

      // Create 30-min slots until 9 PM
      while (currentDate < endTime) {
        const formattedTime = currentDate.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        });

        // Format date to match with slots_booked format
        const day = currentDate.getDate();
        const month = currentDate.getMonth() + 1;
        const year = currentDate.getFullYear();
        const slotDate = `${day}_${month}_${year}`;

        // Check if the current slot is already booked
        const isSlotAvailable =
          !docInfo.slots_booked[slotDate]?.includes(formattedTime);

        // If not booked, add to available slots
        if (isSlotAvailable) {
          timeSlots.push({
            datetime: new Date(currentDate),
            time: formattedTime,
          });
        }

        currentDate.setMinutes(currentDate.getMinutes() + 30);
      }

      // Add day-wise available slots to state
      setDocSlots((prev) => [...prev, timeSlots]);
    }
  }, [docInfo]);


  // Book appointment with selected doctor, date, and time
  const booked_Appointment = async () => {
    if (!user) {
      toast.warn('Please Login to book appointment!');
      return navigate('/login');
    }

    if (!slotTime) {
      return toast.warn('Please select a slot time before booking!');
    }

    try {
      startProgress();
      const date = docSlots[slotIndex][0].datetime;

      let day = date.getDate();
      let month = date.getMonth() + 1;
      let year = date.getFullYear();
      const slotDate = day + '_' + month + '_' + year;

      // Send appointment data to backend
      const response = await axios.post(backendURL + '/api/user/book-appointment', { docID, slotDate, slotTime }, { withCredentials: true });

      // On success, refresh doctors data and redirect
      if (response.data.success) {
        toast.success(response.data.msg)
        getAllDoctors();
        completeProgress();
        navigate('/my-appointments')
      }
    } catch (error) {
      completeProgress()
      toast.error(error.response.data.msg);
    }
  }

  // When doctor info is loaded, fetch slots
  useEffect(() => {
    if (docInfo) {
      getAvailableSlots();
    }
  }, [getAvailableSlots, docInfo]);


  // UI rendering only if doctor info is available
  return docInfo && (
    <div className='mt-5'>
      {/* Doctor details card */}
      <div className='flex flex-col sm:flex-row gap-4'>
        <div>
          <img className='bg-[#5f6FFF] w-full sm:max-w-72 rounded-lg' src={docInfo.image} alt="" />
        </div>

        <div className='flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0'>
          {/* Name, degree, and experience */}
          <p className='flex items-ceter gap-2 text-2xl font-medium text-gray-900'>
            {docInfo.name}
            <img className='w-5' src={assets.verified_icon} alt="" />
          </p>
          <div className='flex items-center gap-2 text-sm mt-1 text-gray-600'>
            <p>{docInfo.degree} - {docInfo.speciality}</p>
            <button className='py-0.5 px-2 border text-xs rounded-full'>{docInfo.experience}</button>
          </div>

          {/* About doctor section */}
          <div>
            <p className='flex items-center gap-1 text-sm font-medium text-gray-900 mt-3'>
              About <img src={assets.info_icon} alt="" />
            </p>
            <p className='text-sm text-gray-500 max-w-[700px] mt-1'>{docInfo.about}</p>
          </div>

          {/* Fees info */}
          <p className='text-gray-500 font-medium mt-4'>
            Appointment fee: <span className='text-gray-600'>{currencySymbol}{docInfo.fees}</span>
          </p>

          {/* Rating info */}
          <p className='text-gray-500 font-medium mt-4'>
            Rating: <span className='text-gray-600'>{docInfo.rating} ★</span>
          </p>

        </div>
      </div>

      {/* Slot selection */}
      <div className=' sm:ml-72  sm:pl-4 mt-4 font-medium text-gray-700'>
        <p className='text-center sm:text-left'>Booking slots</p>

        {/* Day selection tabs */}
        <div className='flex gap-3 items-center w-full overflow-x-scroll mt-4'>
          {
            docSlots.length && docSlots.map((item, index) => (
              <div onClick={() => setSlotIndex(index)} className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${slotIndex === index ? 'bg-[#5f6FFF] text-white' : 'border border-gray-200'}`} key={index}>
                <p>{item[0] && daysOfWeek[item[0].datetime.getDay()]}</p>
                <p>{item[0] && item[0].datetime.getDate()}</p>
              </div>
            ))
          }
        </div>

        {/* Time slots for selected day */}
        <div className='flex items-center gap-3 w-full overflow-x-scroll mt-4'>
          {
            docSlots.length && docSlots[slotIndex].map((item, index) => (
              <p onClick={() => setSlotTime(item.time)} className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${item.time === slotTime ? 'bg-[#5f6FFF] text-white' : 'text-gray-400 border border-gray-300'}`} key={index}>
                {item.time.toLowerCase()}
              </p>
            ))
          }
        </div>

        {/* Booking button */}
        <button onClick={booked_Appointment} className='bg-[#5f6FFF] text-white text-sm font-light cursor-pointer px-14 py-3 rounded-full my-6 mx-auto sm:mx-0 block'>Book an appointment</button>
      </div>

      {/* Suggested doctors */}
      <RelatedDoctors docId={docID} speciality={docInfo.speciality} />
    </div>
  )
}

export default Appointment
