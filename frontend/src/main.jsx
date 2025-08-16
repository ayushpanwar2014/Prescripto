import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import AppContextProvider from './context/AppContext.jsx'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, cssTransition } from 'react-toastify';
import { ProgressProvider } from './context/ProgressContext.jsx'

// ✅ Custom fade transition
const Fade = cssTransition({
  enter: "fadeIn",
  exit: "fadeOut",
  duration: [400, 300], // enter, exit
});

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <ProgressProvider>
      <AppContextProvider>
        <ToastContainer
          position="top-right"
          autoClose={2500}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          transition={Fade}   // ✅ custom fade transition
          toastClassName="custom-toast"
          bodyClassName="custom-toast-body"
        />
        <App />
      </AppContextProvider>
    </ProgressProvider>
  </BrowserRouter>
);
