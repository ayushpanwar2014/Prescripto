import DoctorModel from "../models/doctor-model.js";

 //availablity of the doctors
export const changeAvailability = async (req, res, next) => {

    try {

        const {_id} = req.body;

        const findUser = await DoctorModel.findById({_id: _id}).select('-password');

        await DoctorModel.findByIdAndUpdate(_id, {available: !findUser.available});

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