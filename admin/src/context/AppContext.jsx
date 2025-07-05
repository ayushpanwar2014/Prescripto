import { AppContext } from "./exportAllContext";



const AppContextProvider = (props) => {

    // Array for converting month number to name
    const months = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const calculateAge = (dob) => {
        const today = new Date();
        const birtDate = new Date(dob);

        let age = today.getFullYear() - birtDate.getFullYear();

        return age;
    }

    const currencySymbol = "₹";

    // 🧠 Format slot date from `DD_MM_YYYY` to readable format like `04 Jul 2025`
    const slotDateFormat = (slotDate) => {
        const dateArray = slotDate.split('_');
        return dateArray[0] + " " + months[Number(dateArray[1])] + " " + dateArray[2];
    }

    const value = {
        calculateAge,
        slotDateFormat,
        currencySymbol
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )

}

export default AppContextProvider;