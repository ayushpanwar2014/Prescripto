import AppointmentModel from "../models/appointment-model.js";
import DoctorModel from "../models/doctor-model.js";
import SessionModel from "../models/session-model.js";
import UserModel from "../models/user-model.js";
import { v2 as cloudinary } from 'cloudinary';
import razorpay from 'razorpay';
import crypto from 'crypto';



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
            secure: true,
            sameSite: 'None',
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

        const response = await UserModel.findById({ _id: userID }).select('-password')

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
                secure: true,
                sameSite: 'None',
                maxAge: accessTokenAge,
                path: '/',
            });

            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'None',
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
        secure: true,
        sameSite: 'None',
        maxAge: accessTokenAge,
        path: '/',
    });

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'None',
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
            // console.log(res);
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

        const { userID } = req.user;
        const appointments = await AppointmentModel.find({ userID: userID });

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

//cancel appointment of the user 
export const cancelAppointment = async (req, res, next) => {

    try {
        const { userID } = req.user;
        const { appointmentID } = req.body;

        const appointmentData = await AppointmentModel.findById({ _id: appointmentID });

        //verify appointment user
        if (!appointmentData.userID.equals(userID)) {
            return res.status(403).json({ success: false, msg: "Unauthorized access to this appointment." });
        }

        await AppointmentModel.findByIdAndUpdate(appointmentData, { cancelled: true });

        //releasing doctor slot
        const { docID, slotDate, slotTime } = appointmentData;

        const doctorData = await DoctorModel.findById({ _id: docID });

        let slots_booked = doctorData.slots_booked;

        //filtering for removing that time of that date which is not equal to that time rest of slots will save on that date and time but not that time which we are cancelling.
        slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime);

        //now saving the data 
        await DoctorModel.findByIdAndUpdate(docID, { slots_booked: slots_booked });

        // Respond with success message
        res.status(200).json({ success: true, msg: 'Appointment Cancelled!' });

    } catch (err) {
        const error = {
            status: 500,
            message: 'Something went wrong. Please try again.'
        };
        next(error);
    }
}


//razorpay
export const paymentRazorpay = async (req, res, next) => {
    

    const razorpayInstance = new razorpay({
        key_id: process.env.RAZORPAY_KEYID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
    
    try {

        const { appointmentID } = req.body;
        const appointmentData = await AppointmentModel.findById(appointmentID);

        if (!appointmentData || appointmentData.cancelled) {
            return res.status(403).json({ success: false, msg: "Appointment Cancelled or not found!" });
        }

        // creating option for razorpay payment
        const options = {
            amount: appointmentData.amount * 100,
            currency: process.env.CURRENCY,
            receipt: appointmentID
        }
        

        //creating of an order
        const order = await razorpayInstance.orders.create(options);
        

        res.status(200).json({ success: true, order })


    } catch (err) {
        const error = {
            status: 500,
            message: 'Something went wrong. Please try again.'
        };
        next(error);
    }
}

// ✅ Verify Razorpay payment signature and update payment status
export const verifyRazorPayment = async (req, res, next) => {

    const razorpayInstance = new razorpay({
        key_id: process.env.RAZORPAY_KEYID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
   
    try {
        // 🧾 Extract values sent by Razorpay after successful payment
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        // 🧠 Create a string to verify the signature
        // Format: order_id|payment_id (as per Razorpay docs)
        const body = razorpay_order_id + "|" + razorpay_payment_id;

        // 🔐 Generate expected signature using your Razorpay secret key
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET) // Use HMAC SHA256
            .update(body)                                           // Input string
            .digest('hex');                                         // Output signature

        // ❌ If generated signature doesn't match Razorpay's signature, reject
        if (expectedSignature !== razorpay_signature) {
            return res.status(400).json({ success: false, msg: "Invalid payment signature!" });
        }

        // ✅ Fetch the order from Razorpay server (optional, for extra validation)
        const order = await razorpayInstance.orders.fetch(razorpay_order_id);

        // 📌 Get the original appointmentID from the `receipt` field of the order
        const appointmentID = order.receipt;

        // 💾 Mark the corresponding appointment as paid in your database
        await AppointmentModel.findByIdAndUpdate(appointmentID, {
            payment: true, paymentDetails: {
                razorpay_order_id,
                razorpay_payment_id,
                razorpay_signature,
                status: order.status,
            }
        });

        // ✅ Respond with success
        return res.status(200).json({ success: true, msg: "Payment Successful!" });

    } catch (err) {
        // ⚠️ If any error occurs (network, DB, etc.)
        const error = {
            status: 500,
            message: "Payment verification failed",
        };
        next(error);
    }
};


