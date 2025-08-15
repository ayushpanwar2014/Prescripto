import { delValue, getValue, setValue } from "../../config/redis.js";
import AppointmentModel from "../models/appointment-model.js";
import DoctorModel from "../models/doctor-model.js";
import jwt from 'jsonwebtoken';

export const cachedKey = 'allDoctors'; // redis unique Key 

//availablity of the doctors
export const changeAvailability = async (req, res, next) => {

    try {

        const { _id } = req.body;

        const findUser = await DoctorModel.findById({ _id: _id }).select('-password');

        await DoctorModel.findByIdAndUpdate(_id, { available: !findUser.available });

        await delValue(cachedKey); console.log('Cached Doctors Deleted from redis');

        res.status(200).json({ success: true, msg: `${findUser.name} Availablity Changed !` });

    } catch (err) {
        const error = {
            status: 401,
            message: 'Something is Wrong!'
        };
        next(error);
    }
}

//get all docotors
export const getAllDoctors = async (req, res, next) => {

    try {

        const cachedDoctors = await getValue(cachedKey);

        if (cachedDoctors) {
            console.log('Cached all Doctors from redis');
            // await delValue(cachedKey); console.log('Cached Doctors Deleted from redis');

            return res.status(200).json({ success: true, allDoctors: cachedDoctors });
        }

        // getting all doctors from the backend
        // const allDoctors = await DoctorModel.find({},{password: 0}); alternative equal
        let allDoctors = await DoctorModel.find({}).select('-password');
        if (!allDoctors) return res.status(401).json({ success: false, msg: "Service is Unavailable" });

        await setValue(cachedKey, allDoctors);
        console.log('Cached Doctors from Mongodb');

        res.status(200).json({ success: true, allDoctors: allDoctors });

    } catch (err) {

        const error = {
            status: 401,
            message: 'Something is Wrong!'
        };
        next(error);
    }
}

//login doc
export const loginDoc = async (req, res, next) => {

    try {

        const { email, password } = req.body;
        const doctor = await DoctorModel.findOne({ email: email });

        if (!doctor) return res.status(404).json({ success: false, msg: "Invalid Credentials!" });

        const verifyPassword = await doctor.comparePassword(password);

        if (!verifyPassword) return res.status(404).json({ success: false, msg: "Invalid Credentials!" });

        const token = jwt.sign({
            id: doctor._id
        }, process.env.JWT_SECRET);

        res.cookie('docToken', token, {
            httpOnly: true,
            secure: true, // only over HTTPS in prod
            sameSite: 'none', // 'Lax' is OK if frontend/backend are same-origin
            maxAge: 24 * 60 * 60 * 1000, // 1 day
        }).status(200).json({ success: true, msg: 'Logged In!', email: doctor.email });

    } catch (err) {
        const error = {
            status: 401,
            message: 'Something is Wrong!'
        };
        next(error);
    }
}

//logout doctors
export const logoutDoc = async (req, res, next) => {

    try {
        res.clearCookie('docToken', {
            httpOnly: true,
            sameSite: 'none',
            secure: true, // true in production
        }).status(200).json({ success: true, msg: 'Logged out successfully' });

    } catch (err) {

        const error = {
            status: 401,
            message: 'Something is Wrong!'
        };
        next(error);

    }
};

//get doctor appointment for doctor panel
export const doctorAppointment = async (req, res, next) => {
    try {
        const { id } = req.user; // from doc verify token

        const appointment = await AppointmentModel.find({ docID: id });

        res.status(200).json({ success: true, appointment: appointment });

    } catch (err) {

        const error = {
            status: 401,
            message: 'Something is Wrong!'
        };
        next(error);

    };
}

//cancel Doctor appointment of the user 
export const cancelDocotorAppointment = async (req, res, next) => {

    try {
        const { appointmentID } = req.body;

        const appointmentData = await AppointmentModel.findById({ _id: appointmentID });

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

//Complete appointment of the user 
export const appointmentComplete = async (req, res, next) => {

    try {
        const { id } = req.user;
        const { appointmentID } = req.body;
        const appointmentData = await AppointmentModel.findById(appointmentID);


        if (appointmentData && appointmentData.docID.equals(id)) {
            await AppointmentModel.findByIdAndUpdate(appointmentID, { isCompleted: true });
            return res.status(200).json({ success: true, msg: 'Appointment Completed!' });
        }
        else {
            return res.status(404).json({ success: false, msg: 'Not Completed!' });
        }

    } catch (err) {
        const error = {
            status: 500,
            message: 'Something went wrong. Please try again.'
        };
        next(error);
    }
}

//Dashboard
export const doctorDashboard = async (req, res, next) => {

    try {
        const { id } = req.user;

        const appointments = await AppointmentModel.find({ docID: id });
        let earnings = 0;

        appointments.map((item) => {
            if (item.isCompleted && item.payment) {
                earnings += item.amount
            }
        })

        let patients = [];

        appointments.map((item) => {
            if (!patients.includes(item.userID)) {
                patients.push(item.userID);
            }
        })

        const dashData = {
            earnings: earnings,
            appointments: appointments.length,
            patients: patients.length,
            latestAppointments: appointments.reverse().slice(0, 5)
        }

        res.status(200).json({ success: true, dashData: dashData });

    } catch (err) {
        const error = {
            status: 500,
            message: 'Something went wrong. Please try again.'
        };
        next(error);
    }
}

//profile
export const docProfile = async (req, res, next) => {
    try {

        const { id } = req.user;
        const profileDoc = await DoctorModel.findById(id).select('-password').select('-_id');

        res.status(200).json({ success: true, profileDoc: profileDoc });

    } catch (err) {
        const error = {
            status: 500,
            message: 'Something went wrong. Please try again.'
        };
        next(error);
    }
}

//update doc Profile
export const updateDocProfile = async (req, res, next) => {
    try {

        const { fees, address, available, rating } = req.body;
        const { id } = req.user;
        await DoctorModel.findByIdAndUpdate(id, { address: address, fees: fees, available: available, rating: rating });
        await delValue(cachedKey); console.log('Cached Value Deleted from redis');
        res.status(200).json({ success: true, msg: 'Updated Profile!' });


    } catch (err) {
        const error = {
            status: 500,
            message: 'Something went wrong. Please try again.'
        };
        next(error);
    }
}
