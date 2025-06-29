import express from 'express';
import { addDoctors, loginAdmin } from '../controllers/admin-controller.js';
import upload from '../../middlewares/multer.js';
import { validate } from '../../middlewares/validator-middleware.js';
import { doctor_signup_schema } from '../zod-validators/doct-auth-validator.js';


const Admin_Router = express.Router();

Admin_Router.post('/add-doctor', upload.single('image'), validate(doctor_signup_schema), addDoctors);
Admin_Router.post('/admin-login', loginAdmin);



export default Admin_Router;