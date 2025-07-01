import { useEffect, useState } from "react";
import { AdminContext } from "./exportAllContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const AdminContextProvider = (props) => {

    const [adminToken, setAdminToken] = useState('');
    const navigate = useNavigate();

    const backendURL = import.meta.env.VITE_BACKEND_URL;

    //logout
    const logout = async () => {

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

    }

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
        logout
    }

    return (
        <AdminContext.Provider value={value}>
            {props.children}
        </AdminContext.Provider>
    )

}

export default AdminContextProvider;