import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../context/exportAppContext';
import { useCallback } from 'react';

const Doctors = () => {

  const { speciality } = useParams();
  const { doctors } = useContext(AppContext);
  const [filterDoc, setFilterDoc] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const applyFilter = useCallback(() => {
    if (speciality) {
      setFilterDoc(doctors.filter((item) => item.speciality === speciality));
    } else {
      setFilterDoc(doctors);
    }
  }, [doctors, speciality]);

  useEffect(() => {
    applyFilter();
  }, [applyFilter])

  const filterSearch = filterDoc.filter(doc => {
    const searchLower = search.toLowerCase();

    return (
      doc.name.toLowerCase().includes(searchLower) ||
      String(doc.rating).includes(searchLower)
    )
  })

  return (
    <div className='mt-5'>
      <p className='text-gray-600'>Browse through the doctors specialist.</p>
      {/* Search Input */}
      <input
        type="text"
        placeholder="Search by doctor name or rating... "
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="text-sm border border-gray-300 rounded-full px-4 py-2 w-64 mt-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <div className='flex flex-col sm:flex-row items-start gap-5 mt-5'>
        <button className={`py-1 px-3 border rounded text-sm transition-all cursor-pointer sm:hidden ${showFilters ? 'bg-[#5f6FFF] text-white' : ''}`} onClick={() => setShowFilters((prev) => !prev)}>Filters</button>
        <div className={`flex-col gap-4 text-sm text-gray-600 ${showFilters ? 'flex' : 'hidden sm:flex'}`}>
          <p onClick={() => speciality === 'General physician' ? navigate('/doctors') : navigate('/doctors/General physician')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === 'General physician' ? "bg-indigo-100 text-black" : ""}`} >General physician</p>
          <p onClick={() => speciality === 'Gynecologist' ? navigate('/doctors') : navigate('/doctors/Gynecologist')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === 'Gynecologist' ? "bg-indigo-100 text-black" : ""}`} >Gynecologist</p>
          <p onClick={() => speciality === 'Dermatologist' ? navigate('/doctors') : navigate('/doctors/Dermatologist')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === 'Dermatologist' ? "bg-indigo-100 text-black" : ""}`} >Dermatologist</p>
          <p onClick={() => speciality === 'Pediatricians' ? navigate('/doctors') : navigate('/doctors/Pediatricians')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === 'Pediatricians' ? "bg-indigo-100 text-black" : ""}`} >Pediatricians</p>
          <p onClick={() => speciality === 'Neurologist' ? navigate('/doctors') : navigate('/doctors/Neurologist')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === 'Neurologist' ? "bg-indigo-100 text-black" : ""}`} >Neurologist</p>
          <p onClick={() => speciality === 'Gastroenterologist' ? navigate('/doctors') : navigate('/doctors/Gastroenterologist')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === 'Gastroenterologist' ? "bg-indigo-100 text-black" : ""}`} >Gastroenterologist</p>
        </div>

        {/* Show spinner if doctors not loaded */}
        {!doctors || doctors.length === 0 ? (
          <div className="flex justify-center items-center w-full h-64 mt-10">
            <div className="btn-spinner2">
              <p style={{ marginBottom: '40px', textAlign: 'center' }}>Please wait ! <br />While backend is Connecting from Render.</p>
              <div style={{marginLeft: '100px'}} className="spinner"></div>
            </div>
          </div>
        ) : (
          <div className='w-full grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))]  gap-4 pt-5 gap-y-6 px-3 sm:px-0'>
            {
              filterSearch.map((item, index) => (
                <div onClick={() => { navigate(`/appointment/${item._id}`); scrollTo(0, 0) }} className='border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500' key={index}>
                  <img className='bg-blue-50 hover:bg-[#5f6FFF] transition-all duration-500' src={item.image} alt="" />
                  <div className='p-4'>
                    <div className={`flex items-center gap-2 text-sm text-center ${item?.available ? 'text-green-500' : 'text-red-600'}`}>
                      <p className={`w-2 h-2 ${item?.available ? 'bg-green-500' : 'bg-red-600'} rounded-full`}></p><p>{item?.available ? 'Available' : 'Not Available'}</p>
                    </div>
                    <p className='text-gray-900 text-lg font-medium'>{item.name}</p>
                    <p className='text-gray-600 text-sm'>{item.speciality}</p>
                    <p>{item?.rating} ★</p>
                  </div>
                </div>
              ))
            }
          </div>
        )}
      </div>

    </div>
  )
}

export default Doctors
