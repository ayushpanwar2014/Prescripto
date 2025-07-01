import { DoctorContext } from "./exportAllContext";



const DoctorContextProvider = (props) => {

    const value = {

    }

    return (
        <DoctorContext.Provider value={value}>
            {props.children}
        </DoctorContext.Provider>
    )

}

export default DoctorContextProvider;