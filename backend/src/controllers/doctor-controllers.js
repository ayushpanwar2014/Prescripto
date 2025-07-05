import DoctorModel from "../models/doctor-model.js";
import jwt from 'jsonwebtoken';

//availablity of the doctors
export const changeAvailability = async (req, res, next) => {

    try {

        const { _id } = req.body;

        const findUser = await DoctorModel.findById({ _id: _id }).select('-password');

        await DoctorModel.findByIdAndUpdate(_id, { available: !findUser.available });

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

        // getting all doctors from the backend
        // const allDoctors = await DoctorModel.find({},{password: 0}); alternative equal
        const allDoctors = await DoctorModel.find({}).select('-password');

        res.status(200).json({ success: true, allDoctors });

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
            secure: process.env.NODE_ENV === 'production', // only over HTTPS in prod
            sameSite: 'Strict', // 'Lax' is OK if frontend/backend are same-origin
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
            sameSite: 'Strict',
            secure: process.env.NODE_ENV === 'production', // true in production
        }).status(200).json({ success: true, msg: 'Logged out successfully' });

    } catch (err) {

        const error = {
            status: 401,
            message: 'Something is Wrong!'
        };
        next(error);

    }
};