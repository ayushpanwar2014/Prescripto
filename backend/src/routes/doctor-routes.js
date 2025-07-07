import express from 'express';
import { authAdmin_VerifyToken } from '../../middlewares/auth-admin-verifyToken.js';
import { appointmentComplete, cancelDocotorAppointment, changeAvailability, docProfile, doctorAppointment, doctorDashboard, getAllDoctors, loginDoc, logoutDoc, updateDocProfile } from '../controllers/doctor-controllers.js';
import { authDoctor_VerifyToken } from '../../middlewares/auth-doctor-verifyToken.js';

const Doctor_Router = express.Router();

Doctor_Router.post('/change-availability', authAdmin_VerifyToken, changeAvailability);
Doctor_Router.post('/doctor-login', loginDoc);
Doctor_Router.get('/all-doctors', getAllDoctors);
Doctor_Router.post('/doctor-logout', authDoctor_VerifyToken, logoutDoc);
Doctor_Router.get('/doctor-appointment', authDoctor_VerifyToken, doctorAppointment);
Doctor_Router.post('/doctor-appointment-cancel', authDoctor_VerifyToken, cancelDocotorAppointment);
Doctor_Router.post('/doctor-appointment-complete', authDoctor_VerifyToken, appointmentComplete);
Doctor_Router.get('/doctor-dashboard', authDoctor_VerifyToken, doctorDashboard);
Doctor_Router.get('/doctor-profile', authDoctor_VerifyToken, docProfile);
Doctor_Router.post('/doctor-update-profile', authDoctor_VerifyToken, updateDocProfile);

export default Doctor_Router;