import DoctorModel from "../models/doctor-model.js";
import { v2 as cloudinary } from 'cloudinary'
import jwt from 'jsonwebtoken'


export const addDoctors = async (req, res, next) => {

    const { name, email, password, speciality, degree, experience, about, available, fees, address, slots_booked } = req.body;
    const imageFile = req.file;

    try {

        // checking if user exist
        const userExist = await DoctorModel.findOne({ email: email });
        if (userExist) return res.status(404).json({ success: false, msg: "User already exists!" });

        //image upload in cloudinary
        const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" });
        const imageURL = imageUpload.secure_url;

        //Creating User
        const createUser = await DoctorModel.create({
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
            date: Date.now()
        });

        res.status(200).json({ success: true, msg: "Doctor Added Successfully!" });

    } catch (err) {

        const error = {
            status: 401,
            message: 'Something is Wrong!'
        };
        next(error);
    }
}

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
                secure: process.env.NODE_ENV === 'production', // only over HTTPS in prod
                sameSite: 'Strict', // 'Lax' is OK if frontend/backend are same-origin
                maxAge: 24 * 60 * 60 * 1000, // 1 day
            }).status(200).json({success: true, msg: 'Login Successfull!'});

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