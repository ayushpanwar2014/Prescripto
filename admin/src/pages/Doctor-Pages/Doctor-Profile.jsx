import { useContext } from "react";
import { AppContext, DoctorContext } from "../../context/exportAllContext";
import { useEffect } from "react";
import { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";


export default function DoctorProfile() {

  const { profile, getDocProfileData, docToken, backendURL } = useContext(DoctorContext);
  const { currencySymbol } = useContext(AppContext);
  const [profileData, setProfileData] = useState({
    fees: '',
    rating: '',
    address: {
      line1: '',
      line2: ''
    },
    available: true
  })

  const [isEdit, setIsEdit] = useState(false);

  const handleAddressChange = (e) => {
    setProfileData((prev) => ({
      ...prev, address: {
        ...prev.address,
        [e.target.name]: e.target.value
      }
    }))
  }

  const handleOnChange = (e) => {
    setProfileData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  const updateProfile = async () => {
    try {

      const response = await axios.post(backendURL + '/api/doctor/doctor-update-profile', profileData, { withCredentials: true });

      if (response.data.success) {
        toast.success(response.data.msg);
        getDocProfileData();
        setIsEdit(false);
      }

    } catch (error) {
      toast.error(error.response.data.msg)
    }
  }

  useEffect(() => {
    if (docToken) {
      getDocProfileData();
    }
  }, [docToken, getDocProfileData])
  

  return profile && (
    <div>

      <div className="flex flex-col gap-4 m-5">

        <div>
          <img className="bg-[#5f6FFF]/80 w-full sm:max-w-64 rounded-lg" src={profile?.image} alt="" />
        </div>

        <div className="flex-1 border border-stone-200 rounded-lg p-8 py-7 bg-white">

          <p className="flex items-center gap-2 text-3xl font-medium text-gray-700">{profile?.name}</p>
          <div className="flex items-center gap-2 mt-1 text-gray-600">
            <p>{profile?.degree} - {profile?.speciality}</p>
            <button className="py-0.5 px-2 border text-xs rounded-full">{profile?.experience}</button>
          </div>

          <div>
            <p className="flex items-center gap-1 text-sm font-medium text-neutral-800 mt-3">About:</p>
            <p className="text-sm text-gray-600 max-w-[700px] mt-1">
              {profile?.about}
            </p>
          </div>

          <p className="text-gray-600 font-medium mt-4">
            Appointment fee: <span className="text-gray-800">{currencySymbol}{isEdit ? <input className="bg-gray-200 rounded max-w-20 mt-4 text-center focus:outline-[#5E5E5E] focus:ring-0" type="number" placeholder="" value={profileData.fees} onChange={handleOnChange} name="fees" /> : profile?.fees}</span>
          </p>
          <p className="text-gray-600 font-medium mt-4">
            Rating: <span className="text-gray-800">{isEdit ? <input className="bg-gray-200 rounded max-w-20 mt-4 text-center focus:outline-[#5E5E5E] focus:ring-0" type="number" placeholder="" value={profileData.rating} onChange={handleOnChange} name="rating" /> : profile?.rating} ★</span>
          </p>

          <div className="flex gap-2 py-2">
            <p>Address:</p>

            <p className="text-sm">
              {isEdit ? <input className="bg-gray-200 rounded max-w-60 mt-4 text-center focus:outline-[#5E5E5E] focus:ring-0" type="text" placeholder="" value={profileData.address.line1} onChange={handleAddressChange} name="line1" /> : profile?.address?.line1}
              <br />
              {isEdit ? <input className="bg-gray-200 rounded max-w-60 mt-1 text-center focus:outline-[#5E5E5E] focus:ring-0" type="text" value={profileData.address.line2} onChange={handleAddressChange} name="line2" /> : profile?.address?.line2}
            </p>
          </div>

          <div className="flex gap-1 pt-2">
            <input onChange={() => isEdit && setProfileData(prev => ({ ...prev, available: !prev.available }))} checked={isEdit ? profileData.available : profile?.available} type="checkbox" name="" id="" />
            <label htmlFor="">Available</label>
          </div>

          {!isEdit && <button onClick={() => setIsEdit(true)} className="px-4 py-1 border border-[#5f6FFF] text-sm rounded-full mt-5 hover:bg-[#5f6FFF] hover:text-white transition-all duration-300 cursor-pointer">Edit</button>}
          {isEdit && <button onClick={updateProfile} className="px-4 py-1 border border-[#5f6FFF] text-sm rounded-full mt-5 hover:bg-[#5f6FFF] hover:text-white transition-all duration-300 cursor-pointer">Update Profile</button>}

        </div>
      </div>

    </div>
  )
}
