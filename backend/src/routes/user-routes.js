import express from 'express'
import { authUser, book_appointment, cancelAppointment, displayAllAppointment, login, logout, paymentRazorpay, register, updateUserProfile, verifyRazorPayment } from '../controllers/user-controllers.js';
import { validate } from '../../middlewares/validator-middleware.js';
import { user_login_schema, user_register_schema, user_update_schema } from '../zod-validators/user-auth-validator.js';
import { verifyRefreshTokenAndLogout, verifyToken } from '../../middlewares/user-verify-token.js';
import upload from '../../middlewares/multer.js';

const User_Router = express.Router();

User_Router.post('/register', validate(user_register_schema), register);
User_Router.post('/logout', verifyToken, verifyRefreshTokenAndLogout, logout);
User_Router.post('/login', validate(user_login_schema), login);
User_Router.get('/getuser', verifyToken, authUser);

User_Router.post('/update-profile', verifyToken, upload.single('image'), validate(user_update_schema), updateUserProfile);
User_Router.post('/book-appointment', verifyToken, book_appointment);
User_Router.get('/display-appointments', verifyToken, displayAllAppointment);
User_Router.post('/cancel-appointment', verifyToken, cancelAppointment);
User_Router.post('/payment-razorpay', verifyToken, paymentRazorpay);
User_Router.post('/verifyRazorpay', verifyToken, verifyRazorPayment);

export default User_Router;