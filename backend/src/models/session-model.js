import mongoose from "mongoose";

const SessionSchema = mongoose.Schema({

    userID: {
        type: String,
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