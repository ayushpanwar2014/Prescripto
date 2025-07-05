import mongoose from "mongoose";

const SessionSchema = mongoose.Schema({

    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Optional, but good for populate()
        required: true
    },
    valid: {
        type: Boolean,
        default: true,
        required: true
    },
    userAgent: {
        type: String,
        required: true
    },
    ip: {
        type: String,
        required: true
    }
},
    { timestamps: true }
);


const SessionModel = mongoose.models.Session || mongoose.model('Session', SessionSchema);

export default SessionModel;