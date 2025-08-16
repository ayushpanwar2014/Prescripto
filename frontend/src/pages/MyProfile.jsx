import { useContext, useState } from 'react'
import { AppContext } from '../context/exportAppContext'
import { toast } from 'react-toastify';
import axios from 'axios';
import { assets } from '../assets/assets_frontend/assets';
import { useProgress } from '../context/ProgressContext';

const MyProfile = () => {

  const { backendURL, fetchUser } = useContext(AppContext);
  const user = JSON.parse(localStorage.getItem('userData'));
  const [image, setImage] = useState(false);
  const { startProgress, completeProgress } = useProgress();

  const [userData, setUserData] = useState({
    name: user?.name,
    phone: user?.phone,
    address: {
      line1: user?.address?.line1,
      line2: user?.address?.line2
    },
    gender: user?.gender,
    dob: user?.dob
  })

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  }

  const [isEdit, setIsEdit] = useState(false);

  //update profile
  const onUpdateHandler = async () => {

    try {

      if (!image) {
        // Image is optional unless user wants to change it
        console.warn("No image selected — updating other fields");
      }

      startProgress();
      const userFormData = new FormData;

      userFormData.append('name', userData.name);
      userFormData.append('address', JSON.stringify(userData.address));
      userFormData.append('dob', userData.dob);
      userFormData.append('phone', userData.phone);
      userFormData.append('gender', userData.gender);

      if (image) {
        userFormData.append('image', image);
      }

      const response = await axios.post(backendURL + '/api/user/update-profile', userFormData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });

      if (response.data.success) {
        toast.success(response.data.msg)
        setImage(false);
        setIsEdit((prev) => !prev)
        fetchUser()
        completeProgress();
      }

    } catch (error) {
      toast.error(error.response.data.msg || "Something went wrong!");
      completeProgress()
    }
  }


  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="max-w-lg flex flex-col gap-2 text-sm px-17 py-6 rounded-lg shadow-md bg-white">
        <div className='max-w-lg flex flex-col gap-2 text-sm '>
          {
            isEdit ?
              <label htmlFor="image-add">
                <img className='w-36 rounded cursor-pointer opacity-75' src={image ? URL.createObjectURL(image) : user?.image} alt="" />
                <input type="file" onChange={handleImageChange} id="image-add" hidden />
              </label> :

              <img className='w-36 rounded ' src={user ? user?.image : assets.profile_pic} alt="" />
          }

          {
            isEdit ?
              <input type="text" className='bg-gray-200 text-2xl font-medium rounded max-w-60 mt-4 text-center focus:outline-[#5E5E5E] focus:ring-0' value={userData.name} name='name' onChange={(e) => setUserData({ ...userData, [e.target.name]: e.target.value })} />
              : <p className='font-medium text-3xl text-neutral-800 mt-4'>{user?.name}</p>
          }

          <hr className='bg-zinc-400 h-[1px] border-none' />
          <div>
            <p className='text-neutral-500 underline mt-3'>Contact INFORMATION</p>
            <div className='grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700'>
              <p className='font-medium '>Email id:</p>
              <p className='text-blue-500'>{user?.email}</p>
              <p className='font-medium'>Phone:</p>
              {
                isEdit ?
                  <input className='bg-gray-200 max-w-52 rounded text-center focus:outline-[#5E5E5E] focus:ring-0' type="text" value={userData.phone} name='phone' onChange={(e) => setUserData({ ...userData, [e.target.name]: e.target.value })} />
                  : <p className='text-blue-400'>{user?.phone}</p>
              }
              <p className='font-medium'>Address:</p>
              {
                isEdit ?
                  <p>
                    <input className='bg-gray-200 w-70 text-center rounded focus:outline-[#5E5E5E] focus:ring-0' onChange={(e) => setUserData({ ...userData, address: { ...userData.address, line1: e.target.value } })} value={userData.address.line1} type="text" />
                    <br />
                    <input className='bg-gray-200 mt-1 w-70 text-center rounded focus:outline-[#5E5E5E] focus:ring-0' onChange={(e) => setUserData({ ...userData, address: { ...userData.address, line2: e.target.value } })} value={userData.address.line2} type="text" />
                  </p>
                  :
                  <p className='text-gray-500'>
                    {user?.address?.line1}
                    <br />
                    {user?.address?.line2}
                  </p>

              }
            </div>
          </div>
          <div>
            <p className='text-neutral-500 underline mt-3'>BASIC INFORMATION</p>
            <div className='grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700'>
              <p className='font-medium'>Gender:</p>
              {
                isEdit ?
                  <select className='max-w-20 bg-gray-200 rounded text-center' value={userData.gender} onChange={(e) => setUserData({ ...userData, gender: e.target.value })}>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Rather Not to Say">Rather Not to Say</option>
                  </select>
                  : <p className='text-gray-400'>{user?.gender}</p>
              }
              <p className='font-medium'>BirthDay:</p>
              {
                isEdit ?
                  <input className='max-w-28 rounded bg-gray-200 focus:outline-[#5E5E5E] focus:ring-0' onChange={(e) => setUserData({ ...userData, dob: e.target.value })} value={userData.dob} type="date" />
                  : <p className='text-gray-400 ml-2'>{user?.dob}</p>

              }
            </div>
          </div>

          <div className='mt-10'>
            {
              isEdit
                ? <button onClick={onUpdateHandler} className='border border-[#5f6FFF] px-8 py-2 rounded-full hover:bg-[#5f6FFF] hover:text-white transition-all duration-300' >Save Information</button>
                : <button className='border border-[#5f6FFF] px-8 py-2 rounded-full hover:bg-[#5f6FFF] hover:text-white transition-all duration-300' onClick={() => setIsEdit((prev) => !prev)} >Edit</button>
            }
          </div>

        </div>
      </div></div>
  )
}

export default MyProfile
