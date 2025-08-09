import mongoose from "mongoose";
import argon2  from "argon2";

const DoctorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    speciality: {
        type: String,
        required: true
    },
    degree: {
        type: String,
        required: true
    },
    experience: {
        type: String,
        required: true
    },
    about: {
        type: String,
        required: true
    },
    available: {
        type: Boolean,
        default:true,
        required: true
    },
    fees: {
        type: Number,
        required: true
    },
    address: {
        type: Object,
        required: true
    },
    date: {
        type: Number,
        required: true
    },
    slots_booked: {
        type: Object,
        default: {}
    },
    rating: {
        type: Number,
        default: 0
    }

}, { minimize: false });

// Strong hashing options for argon2
const options = {
    type: argon2.argon2id,         // Best all-around (resists GPU & side-channel attacks)
    memoryCost: 2 ** 16,          // 64 MB
    timeCost: 5,                 // Iterations (increase for more security)
    parallelism: 2              // Number of threads (adjust per CPU core)
}

// Hashing Password pre method before saving in database
DoctorSchema.pre('save', async function (next) {
    
    const user = this;
    if(!user.isModified('password')){
        return next();
    }

    try {

        const hashedPassword = await argon2.hash(user.password,options);
        user.password = hashedPassword;
        next();
        
    } catch (error) {
        next(error)
    }
})

//Comparing Password when login
DoctorSchema.methods.comparePassword = async function (password) {
    
    return await argon2.verify(this.password, password);
}



const DoctorModel = mongoose.models.Doctor || mongoose.model('Doctor', DoctorSchema);

export default DoctorModel;