import { useContext } from "react"
import { AdminContext, AppContext } from "../../context/exportAllContext"
import { useEffect } from "react";
import { assets } from "../../assets/assets_admin/assets";

export default function Dashboard() {

  const { getDashData, dashData, onClickCancelAppointment, adminToken } = useContext(AdminContext);
  const { slotDateFormat } = useContext(AppContext);

  useEffect(() => {
    if (adminToken) {
      getDashData()
    }
  }, [adminToken, getDashData])


  return dashData && (
    <div className="m-5">
      <div className="flex flex-wrap gap-3">

        <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:bg-indigo-50 hover:scale-105 transition-all duration-300">
          <img className="w-14" src={assets.doctor_icon} alt="" />
          <div>
            <p className="text-xl font-semibold text-gray-600">{dashData.doctors}</p>
            <p className="text-gray-400">Doctors</p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:bg-indigo-50 hover:scale-105 transition-all duration-300">
          <img className="w-14" src={assets.appointments_icon} alt="" />
          <div>
            <p className="text-xl font-semibold text-gray-600">{dashData.appointments}</p>
            <p className="text-gray-400">Appointments</p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:bg-indigo-50 hover:scale-105 transition-all duration-300">
          <img className="w-14" src={assets.patients_icon} alt="" />
          <div>
            <p className="text-xl font-semibold text-gray-600">{dashData.patients}</p>
            <p className="text-gray-400">Patients</p>
          </div>
        </div>
      </div>

      <div className="bg-white">

        <div className="flex items-center gap-2.5 px-4 py-4 mt-10 rounded-t border border-zinc-300">
          <img src={assets.list_icon} alt="" />
          <p className="font-semibold">Latest Bookings</p>
        </div>

        <div className="pt-4 border border-t-0 border-zinc-300">
          {
            dashData?.latestAppointments?.map((item, index) => (
              <div className="flex items-center px-6 py-3 gap-3 hover:bg-gray-100" key={index}>
                <img className="rounded-full w-10" src={item?.docData?.image} alt="" />
                <div className="flex-1 text-sm">
                  <p className="text-gray-800 font-medium">{item.docData.name}</p>
                  <p className="text-gray-600">{slotDateFormat(item?.slotDate)} | {item?.slotTime}</p>
                </div>
{item?.cancelled && !item?.isCompleted && <p className="text-red-600 text-xs font-medium">Cancelled</p>}
              {!item?.cancelled && !item?.isCompleted && <img onClick={() => onClickCancelAppointment(item?._id)} className="w-10 cursor-pointer" src={assets.cancel_icon} alt="" />}
              {!item?.cancelled && item?.isCompleted && <p className="text-green-600 text-xs font-medium">Completed</p>}
              </div>
            ))
          }
        </div>
      </div>

    </div>
  )
}
