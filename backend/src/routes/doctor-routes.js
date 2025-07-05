import express from 'express';
import { authAdmin_VerifyToken } from '../../middlewares/auth-admin-verifyToken.js';
import { changeAvailability, getAllDoctors, loginDoc, logoutDoc } from '../controllers/doctor-controllers.js';
import { authDoctor_VerifyToken } from '../../middlewares/auth-doctor-verifyToken.js';

const Doctor_Router = express.Router();

Doctor_Router.post('/change-availability', authAdmin_VerifyToken, changeAvailability);
Doctor_Router.post('/doctor-login', loginDoc);
Doctor_Router.get('/all-doctors', getAllDoctors);
Doctor_Router.post('/doctor-logout', authDoctor_VerifyToken, logoutDoc);

export default Doctor_Router;