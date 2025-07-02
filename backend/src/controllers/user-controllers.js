import SessionModel from "../models/session-model.js";
import UserModel from "../models/user-model.js";

export const isProduction = process.env.NODE_ENV === 'production';

//setting age for cookies to be expire
export const accessTokenAge = 1000 * 60 * 15; // 15 mins
export const refreshTokenAge = 1000 * 60 * 60 * 24 * 7; // 7 days

//register
export const register = async (req, res, next) => {
    try {

        const { name, email, password } = req.body;

        //Checking User Exist
        const userExist = await UserModel.findOne({ email: email });

        if (userExist) {
            return res.status(404).json({ success: false, msg: "User already exists!" });
        }

        //Creating User
        const createUser = await UserModel.create({
            name: name,
            email: email,
            password: password
        });

        // creating access token and refresh token and sending to client
        await authenticateUser(req, res, createUser);

    } catch (error) {
        next(error)
    }
};

//login
export const login = async (req, res, next) => {
    try {

        const { email, password } = req.body;
        console.log(email, password);


        //checking if user exist in database

        const userExist = await UserModel.findOne({ email: email });

        if (!userExist) return res.status(404).json({ success: false, msg: "Invalid Credentials!" });

        //Comaparing User Password

        const validPassword = await userExist.comparePassword(password);

        if (!validPassword) return res.status(401).json({ success: false, msg: "Invalid Credentials!" })

        // creating access token and refresh token and sending to client
        await authenticateUser(req, res, userExist);

    } catch (error) {

        next(error);
    }
};


//logout
export const logout = async (req, res, next) => {
    try {

        res.clearCookie('accessToken')
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: isProduction,
            sameSite: 'strict',
            path: '/',
        }).status(200).json({ success: true, msg: "Logout SuccessFully!" });

    } catch (err) {

        const error = {
            status: 401,
            message: "Not Authorized"
        }
        next(error);
    }
};

//authenticated user
export const authUser = async (req, res, next) => {
    try {

        //userId and current sessionID
        const { userID, _id } = req.user;

        const response = await UserModel.findById({ _id: userID }).select('-password');

        //creating new accessToken if there is refreshtoken
        if (!req.cookies.accessToken && req.cookies.refreshToken) {

            //deleting old session for generating new session in database
            await SessionModel.findByIdAndDelete(_id);

            //creating new session in database
            const newSession = await response.createSession({ ip: req.ip, userAgent: req.headers["user-agent"] });

            const accessToken = await response.createAccessToken(newSession._id);
            const refreshToken = await response.createRefreshToken(newSession._id);

            res.cookie('accessToken', accessToken, {
                httpOnly: true,
                secure: isProduction,
                sameSite: 'strict',
                maxAge: accessTokenAge,
                path: '/',
            });

            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: isProduction,
                sameSite: 'strict',
                maxAge: refreshTokenAge,
                path: '/',
            })
        }

        res.status(200).json({ success: true, data: response });

    } catch (err) {

        const error = {
            status: 401,
            message: 'UnAuthorized User'
        };

        next(error);
    }
};


//creating access Token and refresh Token
const authenticateUser = async (req, res, user) => {

    //generating session in user Model method
    const session = await user.createSession({ ip: req.ip, userAgent: req.headers["user-agent"] });

    //create accesstoken with jwt in user Model method
    const accessToken = await user.createAccessToken(session._id);

    //create refreshtoken with jwt in user Model method
    const refreshToken = await user.createRefreshToken(session._id);

    //setting cookie becuse more security rather then saving in localstorage

    res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'strict',
        maxAge: accessTokenAge,
        path: '/',
    });

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'strict',
        maxAge: refreshTokenAge,
        path: '/',
    }).status(200).json({
        success: true,
        msg: "Logged In",
    });

};

