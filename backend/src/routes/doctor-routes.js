import express from 'express';
import { authAdmin_VerifyToken } from '../../middlewares/auth-admin-verifyToken.js';
import { changeAvailability } from '../controllers/doctor-controllers.js';


const Doctor_Router = express.Router();


Doctor_Router.post('/change-availability', authAdmin_VerifyToken, changeAvailability);



export default Doctor_Router;