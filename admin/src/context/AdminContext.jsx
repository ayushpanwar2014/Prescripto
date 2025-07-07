import { useCallback, useEffect, useState } from "react";
import { AdminContext } from "./exportAllContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const AdminContextProvider = (props) => {

    const [adminToken, setAdminToken] = useState('');
    const navigate = useNavigate();
    const [allDoctors, setAllDoctors] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [dashData, setDashData] = useState([]);

    const backendURL = import.meta.env.VITE_BACKEND_URL;

    //get Dashboard data
    const getDashData = useCallback( async () => {
        try {
            const response = await axios.get(backendURL+ '/api/admin/dashboard',{withCredentials: true});
            if(response.data.success){
                setDashData(response.data.dashData);
            }
        } catch (error) {
             toast.error(error.response.data.msg);
        }
    }, [backendURL])

    //get all doctors 
    const getAllDoctors = useCallback(async () => {
        try {

            const response = await axios.get(backendURL + '/api/admin/all-doctors', { withCredentials: true });

            if (response.data.success) {
                setAllDoctors(response.data.allDoctors);
            }

        } catch (error) {
            toast.error(error.response.data.msg);
        }
    }, [backendURL])

    //change availability
    const onChangeAvailability = async (_id) => {
        try {
            const response = await axios.post(backendURL + '/api/admin/change-availability', { _id }, { withCredentials: true });

            if (response.data.success) {
                toast.success(response.data.msg);
                getAllDoctors();
            }

        } catch (error) {
            toast.error(error.response.data.msg);
        }
    }

    //logout
    const adminLogout = useCallback(async () => {

        try {
            const response = await axios.post(`${backendURL}/api/admin/admin-logout`, {}, { withCredentials: true });

            if (response.data.success) {
                navigate('/');
                setAdminToken('');
                localStorage.removeItem('emailAdmin');
                toast.success(response.data.msg);
            }

        } catch (error) {
            toast.error(error.response.data.msg);
        }

    }, [navigate, backendURL])

    //all appointments
    const getAllAppointment = useCallback(async () => {

        try {
            const response = await axios.get(backendURL + '/api/admin/display-appointments', { withCredentials: true });

            if (response.data.success) {

                setAppointments(response.data.appointments);
            }

        } catch (error) {
            toast.error(error.response.data.msg);
        }
    }, [backendURL])

    const onClickCancelAppointment = async (appointmentID) => {
    try {
      const response = await axios.post(backendURL + '/api/admin/cancel-appointments', { appointmentID }, { withCredentials: true });
      if (response.data.success) {
        getDashData();
        getAllAppointment();
        toast.success(response.data.msg);
      }

    } catch (error) {
      toast.error(error.response.data.msg);
    }
  }

    useEffect(() => {
        if (localStorage.getItem('emailAdmin')) {
            setAdminToken(localStorage.getItem('emailAdmin'));
        }
        else if (!localStorage.getItem('emailAdmin')) {
            setAdminToken('')
            localStorage.removeItem('emailAdmin');
        }
    }, [])

    const value = {
        adminToken,
        setAdminToken,
        backendURL,
        adminLogout,
        getAllDoctors,
        allDoctors,
        onChangeAvailability,
        getAllAppointment,
        appointments,
        getDashData,
        dashData,
        onClickCancelAppointment
    }

    return (
        <AdminContext.Provider value={value}>
            {props.children}
        </AdminContext.Provider>
    )

}

export default AdminContextProvider;