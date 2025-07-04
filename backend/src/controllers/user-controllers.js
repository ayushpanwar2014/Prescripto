import AppointmentModel from "../models/appointment-model.js";
import DoctorModel from "../models/doctor-model.js";
import SessionModel from "../models/session-model.js";
import UserModel from "../models/user-model.js";
import { v2 as cloudinary } from 'cloudinary';

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
        next(error);
    }
};

//login
export const login = async (req, res, next) => {
    try {

        const { email, password } = req.body;

        //checking if user exist in database
        const userExist = await UserModel.findOne({ email: email });

        if (!userExist) return res.status(404).json({ success: false, msg: "Invalid Credentials!" });

        //Comaparing User Password

        const validPassword = await userExist.comparePassword(password);

        if (!validPassword) return res.status(401).json({ success: false, msg: "Invalid Credentials!" })

        // creating access token and refresh token and sending to client
        await authenticateUser(req, res, userExist);

    } catch (err) {
        const error = {
            status: 401,
            message: "Not Authenticated"
        }
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

        const response = await UserModel.findById({ _id: userID }).select('-password').select('-_id');

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

//update user profile
export const updateUserProfile = async (req, res, next) => {

    try {
        const { userID } = req.user;
        const { name, phone, address, dob, gender } = req.body;

        const imageFile = req.file;

        if (imageFile) {
            //image upload in cloudinary
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: 'image' });
            const imageURL = imageUpload.secure_url;

            await UserModel.findByIdAndUpdate(userID, {
                name: name,
                phone: phone,
                address: address,
                dob: dob,
                gender: gender,
                image: imageURL
            });
        }
        else {
            await UserModel.findByIdAndUpdate(userID, {
                name: name,
                phone: phone,
                address: address,
                dob: dob,
                gender: gender,
            });
        }

        res.status(200).json({ success: true, msg: "User Updated Successfully!" });

    } catch (err) {
        const error = {
            status: 401,
            message: 'UnAuthorized User'
        };
        next(error);
    }
}


// Book appointment controller
export const book_appointment = async (req, res, next) => {
    try {
        // Destructure authenticated user ID from request
        const { userID } = req.user;

        // Destructure appointment details from request body
        const { docID, slotDate, slotTime } = req.body;

        // Fetch doctor data by ID and exclude password
        const docData = await DoctorModel.findById({ _id: docID }).select('-password');

        // Check if doctor is currently available
        if (!docData.available) {
            return res.status(400).json({ success: false, msg: 'Doctor not available at the moment!' });
        }

        // Get current slots_booked object from doctor document
        let slots_booked = docData.slots_booked;

        // Check if slots already exist for the selected date
        if (slots_booked[slotDate]) {
            // Check if the selected time slot is already booked
            if (slots_booked[slotDate].includes(slotTime)) {
                return res.status(400).json({ success: false, msg: 'Slot not available at the Time!' });
            } else {
                // If the time is free, add it to the booked slots
                slots_booked[slotDate].push(slotTime);
            }
        } else {
            // If the date has no existing slots, initialize and add the time
            slots_booked[slotDate] = [];
            slots_booked[slotDate].push(slotTime);
        }

        // Fetch the user data (excluding password)
        const userData = await UserModel.findById({ _id: userID }).select('-password ');

        // Remove internal doctor's booking data to prevent saving it in appointment
        delete docData.slots_booked;

        // Prepare appointment object to be saved
        const appointmentData = {
            userID,              // ID of the patient booking
            docID,               // ID of the doctor
            userData,            // Snapshot of the user's data at booking time
            docData,             // Snapshot of the doctor's public data
            amount: docData.fees, // Doctor's consultation fee
            slotDate,            // Date of the appointment
            slotTime,            // Time of the appointment
            date: Date.now(),    // Timestamp of when the appointment was created
        }

        // Create and save the appointment
        const newAppointment = new AppointmentModel(appointmentData);
        await newAppointment.save();

        // Update doctor's slot booking in the database
        try {
            await DoctorModel.findByIdAndUpdate(docID, { slots_booked });
        } catch (updateErr) {
            // If slot update fails, delete the saved appointment for consistency
            console.error("Failed to update doctor's booked slots:", updateErr);
            await AppointmentModel.findByIdAndDelete(newAppointment._id);

            return res.status(500).json({
                success: false,
                msg: "Appointment booking failed during slot update. Please try again.",
            });
        }

        // Respond with success message
        res.status(200).json({ success: true, msg: 'Appointment Booked SuccessFully!' });

    } catch (err) {
        // Handle any unexpected errors
        const error = {
            status: 500,
            message: 'Something went wrong. Please try again.'
        };
        next(error);
    }
}

//display all appointment of the user 
export const displayAllAppointment = async (req, res, next) => {

    try {

        const {userID} = req.user;
        const appointments = await AppointmentModel.find({userID: userID});

        // Respond with success message
        res.status(200).json({ success: true, appointments: appointments });

    } catch (err) {
        const error = {
            status: 500,
            message: 'Something went wrong. Please try again.'
        };
        next(error);
    }
}
