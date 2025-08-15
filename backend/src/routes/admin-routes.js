import express from 'express';
import { addDoctors, adminDashboar, cancelAppointment, display_appointments, loginAdmin, logoutAdmin } from '../controllers/admin-controller.js';
import upload from '../../middlewares/multer.js';
import { validate } from '../../middlewares/validator-middleware.js';
import { doctor_signup_schema } from '../zod-validators/doct-auth-validator.js';
import { authAdmin_VerifyToken } from '../../middlewares/auth-admin-verifyToken.js';
import { changeAvailability, getAllDoctors } from '../controllers/doctor-controllers.js';


const Admin_Router = express.Router();

//admin
Admin_Router.post('/add-doctor', authAdmin_VerifyToken, upload.single('image'), validate(doctor_signup_schema), addDoctors);
Admin_Router.post('/admin-login', loginAdmin);
Admin_Router.post('/admin-logout', authAdmin_VerifyToken, logoutAdmin);
Admin_Router.get('/display-appointments', authAdmin_VerifyToken, display_appointments);
Admin_Router.post('/cancel-appointments', authAdmin_VerifyToken, cancelAppointment);
Admin_Router.get('/dashboard', authAdmin_VerifyToken, adminDashboar);

//doctors
Admin_Router.get('/all-doctors', authAdmin_VerifyToken, getAllDoctors);
Admin_Router.post('/change-availability', authAdmin_VerifyToken, changeAvailability);




export default Admin_Router;