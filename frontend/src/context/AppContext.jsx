
import { useCallback, useEffect, useState } from "react";
// import { doctors } from "../assets/assets_frontend/assets";
import axios from 'axios';
import { AppContext } from "./exportAppContext";
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import { useProgress } from "./ProgressContext";


const AppContextProvider = (props) => {

    const currencySymbol = '₹';
    const { startProgress, completeProgress } = useProgress();
    const backendURL = import.meta.env.VITE_BACKEND_URL;
    const [doctors, setDoctors] = useState([]);
    const navigate = useNavigate()

    const [user, setUser] = useState("");

    //logout clear cookies
    const fetchLogout = useCallback(async () => {

        try {
            startProgress();
            const resp = await axios.post(backendURL + '/api/user/logout', {}, { withCredentials: true });

            if (resp.data.success) {
                toast.success(resp.data.msg);
                localStorage.removeItem('userData');
                setUser("");
                navigate('/')
                completeProgress();
            }

        } catch (error) {
            console.log(error.response.data.msg);
            completeProgress();
        }
    }, [backendURL, navigate, startProgress, completeProgress]);

    //get user
    const fetchUser = useCallback(async () => {
        try {

            const response = await axios.get(backendURL + '/api/user/getuser', { withCredentials: true })


            if (response.data.success) {
                setUser(response.data.data);
                localStorage.setItem('userData', JSON.stringify(response.data.data));
            }
            else if (!response.success) {
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
            startProgress();
            const response = await axios.get(backendURL + '/api/doctor/all-doctors', { withCredentials: true });

            if (response.data.success) {
                setDoctors(response.data.allDoctors);
                completeProgress()
            }

        } catch (error) {
            toast.error(error.response.data.msg || "Failed to fetch doctors");
        }
    }, [backendURL,startProgress,completeProgress])


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
        getAllDoctors
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}

export default AppContextProvider;