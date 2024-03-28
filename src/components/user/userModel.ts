import mongoose from "mongoose";
import { AppConstants } from "../../utils/appConstants";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        require: false,
        default: null
    },
    email: {
        type: String,
        lowercase: true,
        trim: true
    },
    mobile: {
        type: String,
        require: false,
        min: 10,
        max: 10,
        default: null
    },
    mobile2: {
        type: String,
        require: false,
        min: 10,
        max: 10,
        default: null

    },
    carnumber:{
        type:String,
        require:true,
    },
    billnumber:{
        type:Number,
    },
    address:{
        type:String,
    },
    model:{
        type:String
    },
    chassisno:{
        type:String
    },
    engineno:{
        type:String
    },
}, { timestamps: true });

userSchema.index({
    "location": "2dsphere"
})

module.exports = mongoose.model(AppConstants.MODEL_USER, userSchema);