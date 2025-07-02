import express from 'express';
import { authAdmin_VerifyToken } from '../../middlewares/auth-admin-verifyToken.js';
import { changeAvailability, getAllDoctors } from '../controllers/doctor-controllers.js';


const Doctor_Router = express.Router();


Doctor_Router.post('/change-availability', authAdmin_VerifyToken, changeAvailability);
Doctor_Router.get('/all-doctors',  getAllDoctors);



export default Doctor_Router;