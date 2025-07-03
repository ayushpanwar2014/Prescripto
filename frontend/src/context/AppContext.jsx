
import { useCallback, useEffect, useState } from "react";
// import { doctors } from "../assets/assets_frontend/assets";
import axios from 'axios';
import { AppContext } from "./exportAppContext";
import { toast } from 'react-toastify';


const AppContextProvider = (props) => {

    const currencySymbol = '$';
    const backendURL = import.meta.env.VITE_BACKEND_URL;
    const [doctors, setDoctors] = useState([]);

    const [user, setUser] = useState("");

    //logout clear cookies
    const fetchLogout = useCallback(async () => {

        try {

            const resp = await axios.post(backendURL + '/api/user/logout', {}, { withCredentials: true });

            if (resp.data.success) {
                toast.success(resp.data.msg);
                localStorage.removeItem('userData');
                setUser("");
            }

        } catch (error) {
            console.log(error.response.data.msg);
        }
    }, [backendURL]);

    //get user
    const fetchUser = useCallback(async () => {
        try {

            const response = await fetch(backendURL + '/api/user/getuser', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            }).then((data) => data.json());

    
            if (response.success) {
                setUser(response.data);
                localStorage.setItem('userData', JSON.stringify(response.data));
            }
            else if(!response.success){
                localStorage.removeItem('userData');
                setUser("");
            }

        } catch (err) {
            console.log(err)
            // toast.error(error.response.data.msg);
        }
    }, [backendURL]);




    //get all doctors 
    const getAllDoctors = useCallback(async () => {
        try {

            const response = await axios.get(backendURL + '/api/doctor/all-doctors', { withCredentials: true });

            if (response.data.success) {
                setDoctors(response.data.allDoctors);
            }

        } catch (error) {
            toast.error(error.response.data.msg || "Failed to fetch doctors");
        }
    }, [backendURL])


    useEffect(() => {
        fetchUser();
        getAllDoctors();
    }, [getAllDoctors, fetchUser]);


    const value = {
        doctors,
        currencySymbol,
        fetchUser,
        fetchLogout,
        user,
        backendURL,
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}

export default AppContextProvider;