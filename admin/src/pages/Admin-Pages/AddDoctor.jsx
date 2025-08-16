import React, { useContext, useState } from 'react'
import { assets } from '../../assets/assets_admin/assets'
import { AdminContext } from '../../context/exportAllContext';
import { toast } from 'react-toastify';
import axios from 'axios';

export default function AddDoctor() {

  const { backendURL } = useContext(AdminContext);

  const [docImg, setDocImg] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    experience: '1 year',
    fees: '',
    speciality: 'General physician',
    education: '',
    about: '',
    degree: '',
    available: true,
    rating: '',
    address: {
      line1: '',
      line2: '',
    },
    slots_booked: {}
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        [name]: value,
      },
    }));
  };

  const handleImageChange = (e) => {
    setDocImg(e.target.files[0]);
  };


  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {

      if (!docImg) {
        return toast.error('Image Not Selected !');
      }

      const DocData = new FormData;

      DocData.append('name', formData.name);
      DocData.append('email', formData.email);
      DocData.append('password', formData.password);
      DocData.append('experience', formData.experience);
      DocData.append('fees', formData.fees);
      DocData.append('speciality', formData.speciality);
      DocData.append('education', formData.education);
      DocData.append('about', formData.about);
      DocData.append('degree', formData.degree);
      DocData.append('rating', formData.rating);
      DocData.append('available', String(formData.available));
      DocData.append('address', JSON.stringify(formData.address));
      DocData.append('slots_booked', JSON.stringify(formData.slots_booked));
      DocData.append('image', docImg);
      

      const response = await axios.post(backendURL + '/api/admin/add-doctor', DocData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
      console.log(response);

      if (response.data.success) {
        toast.success(response.data.msg)
        setFormData({
          name: '',
          email: '',
          password: '',
          experience: '1 year',
          fees: '',
          speciality: 'General physician',
          education: '',
          about: '',
          degree: '',
          available: true,
          rating: '',
          address: {
            line1: '',
            line2: '',
          },
          slots_booked: {}
        })
        setDocImg(false);
      }

    } catch (error) {
      toast.error(error.response.data.msg);
    }

  }
  

  return (
    <form onSubmit={onSubmitHandler} className='m-5 w-full'>

      <p className='mb-3 text-lg font-medium'>Add Doctor</p>

      <div className='bg-white px-8 py-8 border border-zinc-300 rounded w-full max-w-4xl max-h-[80vh] overflow-y-scroll'>
        <div className='flex items-center gap-4 mb-8 text-gray-500'>
          <label htmlFor="doc-img">
            <img className='cursor-pointer w-16 bg-gray-100 rounded-full' src={docImg ? URL.createObjectURL(docImg) : assets.upload_area} alt="" />
          </label>
          <input type="file" onChange={handleImageChange} id='doc-img' hidden />
          <p>Upload doctor <br /> picture</p>
        </div>

        <div className='flex flex-col lg:flex-row items-start gap-10 text-gray-600'>
          <div className='w-full lg:flex-1 flex flex-col gap-4'>

            <div className='flex-1 flex flex-col gap-1'>
              <p>Doctor Name</p>
              <input type="text" onChange={handleInputChange} value={formData.name} placeholder='Name' required name='name' autoComplete='name' className='rounded px-3 py-2 border border-zinc-300 focus:outline-[#5E5E5E] focus:ring-0' />
            </div>

            <div className='flex-1 flex flex-col gap-1'>
              <p>Doctor Email</p>
              <input type="email" onChange={handleInputChange} value={formData.email} placeholder='Email' required name='email' autoComplete='email' className='rounded px-3 py-2 border border-zinc-300 focus:outline-[#5E5E5E] focus:ring-0' />
            </div>

            <div className='flex-1 flex flex-col gap-1'>
              <p>Doctor Password</p>
              <input type="password" onChange={handleInputChange} value={formData.password} placeholder='Password' required name='password' autoComplete='password' className='rounded px-3 py-2 border border-zinc-300 focus:outline-[#5E5E5E] focus:ring-0' />
            </div>

            <div className='flex-1 flex flex-col gap-1'>
              <p>Experience</p>
              <select onChange={handleInputChange} value={formData.experience} className='rounded px-3 py-2 border border-zinc-300 focus:outline-[#5E5E5E] focus:ring-0' name="experience" id="experience">
                <option value="1 year">1 year</option>
                <option value="2 year">2 year</option>
                <option value="3 year">3 year</option>
                <option value="4 year">4 year</option>
                <option value="5 year">5 year</option>
                <option value="6 year">6 year</option>
                <option value="7 year">7 year</option>
                <option value="8 year">8 year</option>
                <option value="9 year">9 year</option>
                <option value="10 year">10 year</option>
              </select>
            </div>

            <div className='flex-1 flex flex-col gap-1'>
              <p>Fees</p>
              <input type="number" onChange={handleInputChange} value={formData.fees} placeholder='Fees' required name='fees' autoComplete='fees' className='rounded px-3 py-2 border border-zinc-300 focus:outline-[#5E5E5E] focus:ring-0' />
            </div>

            <div className='flex-1 flex flex-col gap-1'>
              <p>Rating</p>
              <input type="number" onChange={handleInputChange} value={formData.rating} placeholder='Rating' required name='rating' autoComplete='rating' className='rounded px-3 py-2 border border-zinc-300 focus:outline-[#5E5E5E] focus:ring-0' />
            </div>

          </div>

          <div className='w-full lg:flex-1 flex flex-col gap-4'>

            <div className='flex-1 flex flex-col gap-1'>
              <p>Speciality</p>
              <select onChange={handleInputChange} value={formData.speciality} className='rounded px-3 py-2 border border-zinc-300 focus:outline-[#5E5E5E] focus:ring-0' name="speciality" id="speciality">
                <option value="General physician">General physician</option>
                <option value="Gynecologist">Gynecologist</option>
                <option value="Dermatologist">Dermatologist</option>
                <option value="Pediatricians">Pediatricians</option>
                <option value="Neurologist">Neurologist</option>
                <option value="Gastroenterologist">Gastroenterologist</option>
              </select>
            </div>

            <div className='flex-1 flex flex-col gap-1'>
              <p>Education</p>
              <input type="text" onChange={handleInputChange} value={formData.education} placeholder='Education' required name='education' autoComplete='education' className='rounded px-3 py-2 border border-zinc-300 focus:outline-[#5E5E5E] focus:ring-0' />
            </div>
            <div className='flex-1 flex flex-col gap-1'>
              <p>Degree</p>
              <input type="text" onChange={handleInputChange} value={formData.degree} placeholder='Degree' required name='degree' autoComplete='degree' className='rounded px-3 py-2 border border-zinc-300 focus:outline-[#5E5E5E] focus:ring-0' />
            </div>

            <div className='flex-1 flex flex-col gap-1'>
              <p>Address</p>
              <input type="text" onChange={handleAddressChange} value={formData.address.line1} className='rounded px-3 py-2 border border-zinc-300 focus:outline-[#5E5E5E] focus:ring-0' name='line1' autoComplete='line1' placeholder='address 1' required />
              <input type="text" onChange={handleAddressChange} value={formData.address.line2} className='rounded px-3 py-2 border border-zinc-300 focus:outline-[#5E5E5E] focus:ring-0' name='line2' autoComplete='line2' placeholder='address 2' required />
            </div>

          </div>
        </div>

        <div>
          <p className='mt-4 mb-2'>About Doctor</p>
          <textarea onChange={handleInputChange} value={formData.about} placeholder='write about doctor' rows={5} required name='about' autoComplete='about' className='w-full px-4 pt-2 rounded focus:outline-[#5E5E5E] focus:ring-0' />
        </div>

        <button type='submit' className='bg-[#5f6FFF] text-white px-10 py-2 rounded-full cursor-pointer'>Add Doctor</button>
      </div>
    </form>
  )
}
