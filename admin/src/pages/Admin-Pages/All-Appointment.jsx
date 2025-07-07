import { useContext } from "react"
import { AdminContext, AppContext } from "../../context/exportAllContext"
import { useEffect } from "react";
import { assets } from "../../assets/assets_admin/assets";

export default function AllAppointment() {

  const { getAllAppointment, appointments, adminToken, onClickCancelAppointment } = useContext(AdminContext);
  const { calculateAge, slotDateFormat, currencySymbol } = useContext(AppContext);

  useEffect(() => {
    if (adminToken) {
      getAllAppointment();
    }
  }, [adminToken, getAllAppointment])

  return (
    <div className="w-full max-w-6xl m-5">
      <p className="md-3 text-lg font-medium">All Appointments</p>

      <div className="bg-white border border-zinc-300 rounded text-sm max-h-[80vh] min-h-[60vh] overflow-y-scroll">
        <div className="hidden sm:grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] grid-flow-col py-3 px-6 border-zinc-300 border-b">
          <p>#</p>
          <p>Patient</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Doctor</p>
          <p>Fees</p>
          <p>Actions</p>
        </div>
        {
          appointments.map((item, index) => (
            <div className="flex flex-wrap justify-between max-sm:gap-2 sm:grid sm:grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] items-center text-gray-500 py-3 border-zinc-300 px-6 border-b hover:bg-gray-50" key={index}>
              <p className="max-sm:hidden">{index + 1}</p>
              <div className="flex items-center gap-2 ">
                <img className="w-8 rounded-full" src={item?.userData?.image} alt="" /> <p>{item?.userData?.name}</p>
              </div>
              <p className="max-sm:hidden">{calculateAge(item?.userData?.dob)}</p>
              <p>{slotDateFormat(item?.slotDate)}, {item?.slotTime}</p>
              <div className="flex items-center gap-2">
                <img className="w-8 rounded-full bg-gray-200" src={item?.docData?.image} alt="" /> <p>{item?.docData?.name}</p>
              </div>
              <p>{currencySymbol}{item?.amount}</p>
              {item?.cancelled && !item?.isCompleted && <p className="text-red-600 text-xs font-medium">Cancelled</p>}
              {!item?.cancelled && !item?.isCompleted && <img onClick={() => onClickCancelAppointment(item?._id)} className="w-10 cursor-pointer" src={assets.cancel_icon} alt="" />}
              {!item?.cancelled && item?.isCompleted && <p className="text-green-600 text-xs font-medium">Completed</p>}

            </div>
          ))
        }
      </div>
    </div>
  )
}
