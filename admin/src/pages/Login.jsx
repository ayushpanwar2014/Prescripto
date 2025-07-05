import { useContext, useState } from 'react'
import axios from 'axios'
import { AdminContext, DoctorContext } from '../context/exportAllContext';
import { toast } from 'react-toastify';

export default function Login() {

  const [state, setState] = useState('Admin');
  const { setAdminToken, backendURL } = useContext(AdminContext);
  const {setDocToken} = useContext(DoctorContext);

  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  const onSubmitLogin = async (e) => {
    e.preventDefault();

    try {

      if (state === 'Admin') {
        const response = await axios.post(backendURL + '/api/admin/admin-login', loginData, { withCredentials: true });

        if (response.data.success) {
          setAdminToken(response.data.email)
          localStorage.setItem('emailAdmin', response.data.email);
          toast.success(response.data.msg)
        }
      }
      else if (state === 'Doctor') {
        const response = await axios.post(backendURL + '/api/doctor/doctor-login', loginData, { withCredentials: true });

        if (response.data.success) {
          setDocToken(response.data.email);
          localStorage.setItem('emailDoc', response.data.email);
          toast.success(response.data.msg);
        }
      }

    } catch (error) {
      setDocToken("");
      localStorage.removeItem('email');
      toast.error(error.response.data.msg)
    }
  }


  return (
    <form onSubmit={onSubmitLogin} className='min-h-[80vh] flex items-center'>
      <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg border-zinc-100'>
        <p className='text-2xl font-semibold m-auto'><span className='text-[#5f6FFF]'> {state} </span>Login</p>
        <div className='w-full'>
          <p>Email</p>
          <input value={loginData.email} name='email' onChange={(e) => setLoginData({ ...loginData, [e.target.name]: e.target.value })} className='border border-[#DADADA] rounded w-full p-2 mt-1 focus:outline-[#5E5E5E] focus:ring-0' type="email" autoComplete="email" required />
        </div>
        <div className='w-full'>
          <p>Password</p>
          <input value={loginData.password} name='password' onChange={(e) => setLoginData({ ...loginData, [e.target.name]: e.target.value })} className='border border-[#DADADA] rounded w-full p-2 mt-1 focus:outline-[#5E5E5E] focus:ring-0' type="password" autoComplete="password" required />
        </div>
        <button type='submit' className='bg-[#5f6FFF] cursor-pointer text-white w-full py-2 rounded-md text-base'>Login</button>
        {
          state === 'Admin'
            ? <p>Doctor Login <span className='cursor-pointer text-[#5f6FFF] font-bold underline' onClick={() => setState('Doctor')}>Click here</span></p>
            : <p>Admin Login <span className='cursor-pointer text-[#5f6FFF] font-bold underline' onClick={() => setState('Admin')}>Click here</span></p>
        }
      </div>
    </form>
  )
}
