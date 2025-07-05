import { useCallback, useEffect, useState } from "react";
import { DoctorContext } from "./exportAllContext";
import {useNavigate} from 'react-router-dom';
import axios from 'axios'
import {toast} from 'react-toastify';



const DoctorContextProvider = (props) => {

    const backendURL = import.meta.env.VITE_BACKEND_URL;
    const [docToken, setDocToken] = useState("");
    const navigate = useNavigate()

    //logout
    const docLogout = useCallback(async () => {
        
        try {
            const response = await axios.post(`${backendURL}/api/doctor/doctor-logout`, {}, { withCredentials: true });

            if (response.data.success) {
                navigate('/');
                setDocToken('');
                localStorage.removeItem('emailDoc');
                toast.success(response.data.msg);
            }

        } catch (error) {
            toast.error(error.response.data.msg);
        }

    }, [navigate, backendURL])


    useEffect(() => {
        if (localStorage.getItem('emailDoc')) {
            setDocToken(localStorage.getItem('emailDoc'));
        }
        else if (!localStorage.getItem('emailDoc')) {
            setDocToken('')
            localStorage.removeItem('emailDoc');
        }
    }, [])

    const value = {
        backendURL,
        docToken,
        setDocToken,
        docLogout
    }

    return (
        <DoctorContext.Provider value={value}>
            {props.children}
        </DoctorContext.Provider>
    )

}

export default DoctorContextProvider;