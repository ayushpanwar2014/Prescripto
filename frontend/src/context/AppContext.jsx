
import { useCallback, useEffect, useState } from "react";
// import { doctors } from "../assets/assets_frontend/assets";
import axios from 'axios';
import { AppContext } from "./exportAppContext";
import { toast } from 'react-toastify';


const AppContextProvider = (props) => {

    const currencySymbol = '$';
    const backendURL = import.meta.env.VITE_BACKEND_URL;
    const [doctors, setDoctors] = useState([]);

    //get all doctors 
    const getAllDoctors = useCallback(async () => {
        try {

            const response = await axios.get(backendURL + '/api/admin/all-doctors', { withCredentials: true });

            if (response.data.success) {
                setDoctors(response.data.allDoctors);
                
            }

        } catch (error) {
            toast.error(error.response.data.msg || "Failed to fetch doctors");
        }
    }, [backendURL])
    

    useEffect(() => {
        getAllDoctors()
    }, [getAllDoctors]);

    const value = {
        doctors,
        currencySymbol
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}

export default AppContextProvider;