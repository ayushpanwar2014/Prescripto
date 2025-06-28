import express from 'express';
import { addDoctors } from '../controllers/admin-controller.js';
import upload from '../../middlewares/multer.js';


const Admin_Router = express.Router();

Admin_Router.post('/add-doctor', upload.single('image'), addDoctors)

export default Admin_Router;