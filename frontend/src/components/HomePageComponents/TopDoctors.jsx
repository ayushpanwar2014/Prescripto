import { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../../context/exportAppContext'

export default function TopDoctors() {

    const navigate = useNavigate()
    const { doctors } = useContext(AppContext);

    const [search, setSearch] = useState("");

    // Filter doctors based on search text or rating
    const filteredDoctors = doctors.filter(doc => {
        const searchLower = search.toLowerCase();
        return (
            doc.name.toLowerCase().includes(searchLower) ||
            String(doc.rating).includes(searchLower)
        )
    }).slice(0, 10);

    return (
        <div className='flex flex-col items-center gap-4 my-16 text-gray-900 md:mx-10'>
            <h1 className='text-3xl font-medium'>Top Doctors to Book</h1>
            <p className='sm:w-1/3 text-center text-sm'>
                Simply browse through our extensive list of trusted doctors.
            </p>

            {/* Search Input */}
            <input
                type="text"
                placeholder="Search by doctor name or rating... "
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="text-sm border border-gray-300 rounded-full px-4 py-2 w-64 mt-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            {/* Show spinner if doctors not loaded */}
            {!doctors || doctors.length === 0 ? (
                <div className="btn-spinner mt-10">
                    <p style={{ marginBottom: '40px', textAlign: 'center', color: '#5f6FFF', fontWeight: '500' }}>Please wait ! <br />While backend is Connecting from Render.</p>
                    <div className="spinner"></div>
                </div>
            ) : (
                // Doctors Grid
                <div className='w-full grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4 pt-5 gap-y-6 px-3 sm:px-0'>
                    {filteredDoctors.slice(0,8).map((item, index) => (
                        <div
                            key={index}
                            onClick={() => { navigate(`/appointment/${item._id}`); scrollTo(0, 0) }}
                            className='border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500'
                        >
                            <img
                                className='bg-blue-50 hover:bg-[#5f6FFF] transition-all duration-500'
                                src={item.image}
                                alt={item.name}
                            />
                            <div className='p-4'>
                                <div className={`flex items-center gap-2 text-sm text-center ${item?.available ? 'text-green-500' : 'text-red-600'}`}>
                                    <p className={`w-2 h-2 ${item?.available ? 'bg-green-500' : 'bg-red-600'} rounded-full`}></p>
                                    <p>{item?.available ? 'Available' : 'Not Available'}</p>
                                </div>
                                <p className='text-gray-900 text-lg font-medium'>{item.name}</p>
                                <p className='text-gray-600 text-sm'>{item.speciality}</p>
                                <p>{item?.rating} ★</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Browse All Button */}
            <button
                onClick={() => { navigate('/doctors'); scrollTo(0, 0) }}
                className='bg-blue-50 text-gray-600 px-12 py-3 rounded-full mt-10 cursor-pointer hover:scale-110 transition-all duration-500'
            >
                Browse for all Doctors
            </button>
        </div>
    )
}
