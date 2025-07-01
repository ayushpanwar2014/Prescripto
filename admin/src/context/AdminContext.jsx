import { useCallback, useEffect, useState } from "react";
import { AdminContext } from "./exportAllContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const AdminContextProvider = (props) => {

    const [adminToken, setAdminToken] = useState('');
    const navigate = useNavigate();
    const [allDoctors, setAllDoctors] = useState([]);

    const backendURL = import.meta.env.VITE_BACKEND_URL;

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
    const logout = useCallback(async () => {

        try {
            const response = await axios.post(`${backendURL}/api/admin/admin-logout`, {}, { withCredentials: true });

            if (response.data.success) {
                navigate('/');
                setAdminToken('');
                localStorage.removeItem('email');
                toast.success(response.data.msg);
            }

        } catch (error) {
            toast.error(error.response.data.msg);
        }

    }, [navigate, backendURL])

    useEffect(() => {
        if (localStorage.getItem('email')) {
            setAdminToken(localStorage.getItem('email'));
        }
        else if (!localStorage.getItem('email')) {
            setAdminToken('')
            localStorage.removeItem('email');
        }
    }, [])

    const value = {
        adminToken,
        setAdminToken,
        backendURL,
        logout,
        getAllDoctors,
        allDoctors,
        onChangeAvailability
    }

    return (
        <AdminContext.Provider value={value}>
            {props.children}
        </AdminContext.Provider>
    )

}

export default AdminContextProvider;