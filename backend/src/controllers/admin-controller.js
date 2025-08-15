import DoctorModel from "../models/doctor-model.js";
import { v2 as cloudinary } from 'cloudinary'
import jwt from 'jsonwebtoken'
import AppointmentModel from "../models/appointment-model.js";
import UserModel from "../models/user-model.js";
import { delValue } from "../../config/redis.js";
import { cachedKey } from "./doctor-controllers.js";

//add doctors
export const addDoctors = async (req, res, next) => {

    const { name, email, password, speciality, degree, experience, about, available, fees, address, slots_booked, rating } = req.body;

    const imageFile = req.file;

    try {

        // checking if user exist
        const userExist = await DoctorModel.findOne({ email: email });
        if (userExist) return res.status(404).json({ success: false, msg: "User already exists!" });

        //image upload in cloudinary
        const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" });
        const imageURL = imageUpload.secure_url;

        //Creating User
        await DoctorModel.create({
            name: name,
            email: email,
            password: password,
            image: imageURL,
            speciality: speciality,
            degree: degree,
            experience: experience,
            about: about,
            available: available,
            fees: fees,
            address: address,
            slots_booked: slots_booked,
            rating: rating,
            date: Date.now()
        });
        await delValue(cachedKey); console.log('Cached All Doctors Deleted from redis');
        res.status(200).json({ success: true, msg: "Doctor Added Successfully!" });

    } catch (err) {

        const error = {
            status: 401,
            message: 'Something is Wrong!'
        };
        next(error);
    }
}

//login
export const loginAdmin = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSSWORD) {

            const token = jwt.sign({
                email
            }, process.env.JWT_SECRET,
                { expiresIn: '1d' }
            )

            //Send the token in response
            return res.cookie('adminToken', token, {
                httpOnly: true,
                secure: true, // only over HTTPS in prod
                sameSite: 'none', // 'Lax' is OK if frontend/backend are same-origin
                maxAge: 24 * 60 * 60 * 1000, // 1 day
            }).status(200).json({ success: true, msg: 'Login Successfull!', email: email });

        }
        else {
            return res.clearCookie('adminToken').status(400).json({ success: false, msg: "Invalid Credentials!" });
        }

    } catch (err) {

        const error = {
            status: 401,
            message: 'Something is Wrong!'
        };
        next(error);
    }
}

//logout doctors
export const logoutAdmin = async (req, res, next) => {

    try {

        res.clearCookie('adminToken', {
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

//logout doctors
export const display_appointments = async (req, res, next) => {

    try {

        const appointments = await AppointmentModel.find({});

        res.status(200).json({ success: true, appointments });
    } catch (err) {

        const error = {
            status: 401,
            message: 'Something is Wrong!'
        };
        next(error);

    }
};

//cancel appointment of the user 
export const cancelAppointment = async (req, res, next) => {

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

        await delValue(cachedKey); console.log('Cached Doctors Deleted from redis');

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

//admin dashboard
export const adminDashboar = async (req, res, next) => {

    try {

        const doctors = await DoctorModel.find({});
        const users = await UserModel.find({});
        const appointments = await AppointmentModel.find({});

        const dashData = {
            doctors: doctors.length,
            appointments: appointments.length,
            patients: users.length,
            latestAppointments: appointments.reverse().slice(0, 5)
        }

        res.status(200).json({ success: true, dashData })

    } catch (err) {
        const error = {
            status: 500,
            message: 'Something went wrong. Please try again.'
        };
        next(error);
    }

}