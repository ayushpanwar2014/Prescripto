import jwt from "jsonwebtoken";
import SessionModel from "../src/models/session-model.js";


//decrypt accessToken
const decodeToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
}

export const verifyToken = async (req, res, next) => {

    const accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;    
    
    req.user = null;
    
    if (!accessToken && !refreshToken) {
        return res.status(400).send({ success: false, msg: "Not Logged In" });
    }
    else if (!refreshToken && accessToken) {

        //deleting in the database if no refreshToken

        const sessionID = decodeToken(accessToken);

        await SessionModel.findByIdAndDelete(sessionID.session);

        //clearing accessToken cookie too in frontend
        return res.clearCookie('accessToken', {
            httpOnly: true,
            sameSite: 'None',
            secure: true,
            path: '/'
        }).status(200).json({ success: true, msg: "Logout SuccessFully!" });
    }
    else if (accessToken && refreshToken) {

        try {

            const sessionID = decodeToken(refreshToken);

            const session = await SessionModel.findById(sessionID.session);

            // if not in database delete cookie in frontend
            if (!session) {

                res.clearCookie('accessToken')
                return res.clearCookie('refreshToken', {
                    httpOnly: true,
                    secure: true,
                    sameSite: 'None',
                    path: '/',
                }).status(200).json({ success: true, msg: "Logout SuccessFully!" });
            }

        } catch (error) {
            return res.status(401).json({ success: false, message: 'Invalid refresh token' });
        }

    }

    try {

        if (accessToken) {

            const verifyAccessToken = decodeToken(accessToken);

            //checking if accesstoken verified
            if (verifyAccessToken) {
                
                req.user = verifyAccessToken;
                return next();
            }
        }
        else if (refreshToken) {

            try {

                const UserIdAndSessionId = await refreshTokens(refreshToken);

                // Delete old refresh token/session here
                // await SessionModel.findByIdAndDelete(UserIdAndSessionId._id);
                

                if (UserIdAndSessionId) {
                    req.user = UserIdAndSessionId;
                    next();
                }
                else {

                    // return next()
                    return res.status(400).send({ success: false, msg: "Not Logged In" });

                }

            } catch (err) {

                const error = {
                    status: 404,
                    message: "Unauthorized Person"
                }

                res.clearCookie('refreshToken', {
                    httpOnly: true,
                    secure: true,
                    sameSite: 'None',
                    path: '/',
                });
                next(error)
            }
        }
        else {
            // return next()
            return res.status(400).send({ success: false, msg: "Not Logged In" });
        }

    } catch (err) {


        const error = {
            status: 401,
            message: "Unauthorized Person"
        }
        next(error)
    }
}

//checking in refrest token have sessionID to check in datbase and get userID to generate new accesstoken
const refreshTokens = async (refreshToken) => {

    try {

        const decodedToken = decodeToken(refreshToken);

        if (decodedToken) {

            const currentSession = await SessionModel.findById(decodedToken.session);

            if (currentSession) {
                return currentSession;
            }
            else {
                throw new Error("Invalid refresh token");
            }

        }
        else {
            // return next()
            throw new Error("Invalid refresh token");
        }

    } catch (err) {

        throw new Error("Invalid refresh token");

    }

}

export const verifyRefreshTokenAndLogout = async (req, res, next) => {

    const sessionID = req.user.session;
    
    try {

        if (sessionID) {

            const checkSessionId = await SessionModel.findById(sessionID);

            if (!checkSessionId) return res.status(401).json({ success: false, msg: "Unauthorized Person" });

            await SessionModel.findByIdAndDelete(checkSessionId._id);

            console.log('Session deleted');

            next();

        }
        else {
            return res.status(401).json({ success: false, msg: "Unauthorized Person" });
        }


    } catch (err) {

        const error = {
            status: 401,
            message: "Unauthorized Person"
        }
        next(error)

    }

}

