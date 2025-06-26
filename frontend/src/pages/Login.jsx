import React, { useState } from 'react'

const Login = () => {

  const [state, setState] = useState('Sign Up');

  const [signUp, setSignUp] = useState({
    email: '',
    name: '',
    password: ''
  })

  return (
    <div>
      login
    </div>
  )
}

export default Login
