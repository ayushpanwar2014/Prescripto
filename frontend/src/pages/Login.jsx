import { useContext, useState } from 'react'
import axios from 'axios'
import { AppContext } from '../context/exportAppContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useProgress } from "../context/ProgressContext";

const Login = () => {

  const [state, setState] = useState('Sign Up');
  const { startProgress, completeProgress } = useProgress();
  const { backendURL, fetchUser } = useContext(AppContext);
  const navigate = useNavigate();

  const [signUp, setSignUp] = useState({
    email: '',
    name: '',
    password: ''
  })

  const onChangeHandler = (e) => {
    setSignUp({ ...signUp, [e.target.name]: e.target.value });
  }

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      startProgress();
      if (state === 'Log In') {

        const response = await axios.post(backendURL + '/api/user/login', signUp, { withCredentials: true });

        if (response.data.success) {
          fetchUser();
          navigate('/');
          toast.success(response.data.msg)
          completeProgress()
        }
      }
      else if (state === 'Sign Up') {
        const response = await axios.post(backendURL + '/api/user/register', signUp, { withCredentials: true });

        if (response.data.success) {
          fetchUser();
          navigate('/');
          toast.success(response.data.msg)
          completeProgress();
        }
      }
    } catch (error) {
      toast.error(error.response.data.msg)
      completeProgress();
    }

  }

  return (
    <form className='min-h-[80vh] flex items-center' onSubmit={onSubmitHandler} >
      <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] border border-zinc-200 sm:min-w-96 rounded-xl text-zinc-600 text-sm shadow-2xl'>
        <p className='text-2xl font-semibold'>{state === 'Sign Up' ? 'Create Account' : 'Login'}</p>
        <p>Please {state === 'Sign Up' ? 'sign up' : 'log in'} to book appointments.</p>
        {
          state === 'Sign Up' &&
          <div className='w-full'>
            <p>Full Name</p>
            <input className='border border-zinc-300 rounded w-full p-2 mt-1 focus:outline-[#5E5E5E] focus:ring-0' autoComplete="name" type="text" onChange={onChangeHandler} value={signUp.name} name='name' required />
          </div>
        }
        <div className='w-full'>
          <p>Email</p>
          <input className='border border-zinc-300 rounded w-full p-2 mt-1 focus:outline-[#5E5E5E] focus:ring-0' autoComplete="email" type="email" onChange={onChangeHandler} value={signUp.email} name='email' required />
        </div>
        <div className='w-full'>
          <p>Password</p>
          <input className='border border-zinc-300 rounded w-full p-2 mt-1 focus:outline-[#5E5E5E] focus:ring-0' autoComplete="password" type="password" onChange={onChangeHandler} value={signUp.password} name='password' required />
        </div>
        <button type='submit' disabled={!signUp.email || !signUp.password} className='bg-[#5f6FFF] text-white w-full py-2 rounded-md text-base cursor-pointer'>{state === 'Sign Up' ? 'Create Account' : 'Login'}</button>

        {
          state === 'Sign Up' ?
            <p>Already have an account? <span onClick={() => setState('Log In')} className='text-[#5f6FFF] border-b cursor-pointer'>Login here</span></p>
            : <p>Create an new account? <span onClick={() => setState('Sign Up')} className='text-[#5f6FFF] border-b cursor-pointer'>Click here</span></p>
        }
      </div>
    </form>
  )
}

export default Login
