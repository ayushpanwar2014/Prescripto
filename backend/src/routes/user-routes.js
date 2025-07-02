import express from 'express'
import { authUser, login, logout, register } from '../controllers/user-controllers.js';
import { validate } from '../../middlewares/validator-middleware.js';
import { user_login_schema, user_register_schema } from '../zod-validators/user-auth-validator.js';
import { verifyRefreshTokenAndLogout, verifyToken } from '../../middlewares/user-verify-Token.js';

const User_Router = express.Router();

User_Router.post('/register', validate(user_register_schema), register);
User_Router.post('/logout', verifyToken, verifyRefreshTokenAndLogout, logout);
User_Router.post('/login', validate(user_login_schema), login);
User_Router.get('/getuser', verifyToken, authUser);

export default User_Router;