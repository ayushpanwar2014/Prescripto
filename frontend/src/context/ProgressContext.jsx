import { createContext, useContext, useRef } from "react";
import LoadingBar from "react-top-loading-bar";

const ProgressContext = createContext();

export const ProgressProvider = ({ children }) => {
    const ref = useRef(null);

    const startProgress = () => {
        ref.current.continuousStart(); // starts loading
    };

    const completeProgress = () => {
        ref.current.complete(); // completes & hides bar
    };

    return (
        <ProgressContext.Provider value={{ startProgress, completeProgress }}>
            {/* Top loading bar */}
            <LoadingBar
                id="top-loading-bar"
                color="#5f6FFF"   //
                ref={ref}
                shadow={true}     // adds subtle shadow
                height={3}
            />
            {children}
        </ProgressContext.Provider>
    );
};

export const useProgress = () => useContext(ProgressContext);
