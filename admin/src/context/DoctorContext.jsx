import { useCallback, useEffect, useState } from "react";
import { DoctorContext } from "./exportAllContext";
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
import { toast } from 'react-toastify';



const DoctorContextProvider = (props) => {

    const backendURL = import.meta.env.VITE_BACKEND_URL;
    const [docToken, setDocToken] = useState("");
    const [appointments, setAppointments] = useState([]);
    const [dashData, setDashData] = useState([]);
    const navigate = useNavigate();
    const [profile, setProfile] = useState(false);

    //prodile data of doc
    const getDocProfileData = useCallback(async () => {
        try {
            const response = await axios.get(backendURL + '/api/doctor/doctor-profile', { withCredentials: true });
            if (response.data.success) {
                setProfile(response.data.profileDoc);
            }

        } catch (error) {
            console.log(error);
        }
    }, [backendURL])

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
            navigate('/');
            setDocToken('');
            localStorage.removeItem('emailDoc');
            console.log(error);

        }

    }, [navigate, backendURL])

    const getDoctorAppointment = useCallback(async () => {
        try {
            const response = await axios.get(backendURL + '/api/doctor/doctor-appointment', { withCredentials: true });

            if (response.data.success) {
                setAppointments(response.data.appointment.reverse());
            }
        } catch (error) {
            toast.error(error.response.data.msg);
            if (!error.response.data.success) {
                docLogout();
            }
        }
    }, [backendURL, docLogout])

    //cancel appointment
    const cancelAppointment = async (appointmentID) => {
        try {
            const response = await axios.post(backendURL + '/api/doctor/doctor-appointment-cancel', { appointmentID }, { withCredentials: true });
            if (response.data.success) {
                toast.success(response.data.msg)
                getDoctorAppointment();
                getDashboardData();
            }

        } catch (error) {
            toast.error(error.response.data.msg);
        }
    }

    //complete appointment
    const completeAppointment = async (appointmentID) => {
        try {
            const response = await axios.post(backendURL + '/api/doctor/doctor-appointment-complete', { appointmentID }, { withCredentials: true });
            if (response.data.success) {
                toast.success(response.data.msg)
                getDoctorAppointment();
            }

        } catch (error) {
            toast.error(error.response.data.msg);
        }
    }

    //dashboard Data 
    const getDashboardData = useCallback(async () => {
        try {
            const response = await axios.get(backendURL + '/api/doctor/doctor-dashboard', { withCredentials: true });
            if (response.data.success) {
                setDashData(response.data.dashData);
            }

        } catch (error) {
            toast.error(error.response.data.msg);
            if (!error.response.data.success) {
                docLogout();
            }
        }
    }, [backendURL, docLogout])

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
        docLogout,
        getDoctorAppointment,
        appointments,
        cancelAppointment,
        completeAppointment,
        getDashboardData,
        dashData,
        profile,
        getDocProfileData,
        setProfile
    }

    return (
        <DoctorContext.Provider value={value}>
            {props.children}
        </DoctorContext.Provider>
    )

}

export default DoctorContextProvider;