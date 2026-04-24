import mongoose, { Schema } from "mongoose";
import { model } from "mongoose";


const userSchema = new Schema({
    name: {
        type: String,
        required: [true, "Name is Required "]
    },
    slug: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Please enter a valid email address']
    },
    password: {
        type: String,
        required: [true, "Password is Required"],

    },
    role: { type: String, enum: ["user", "admin"], default: "user" },

    profile_pic: {
        type: String
    },
    exp: {
        type: String,

    },
    loc: {
        type: String
    },
    skills: [
        {
            type: String,


        }
    ],
    seeking: [
        {
            type: String,


        }

    ],
    about: {
        type: String,

    },
    verify: [String],
    age: {
        type: Number
    },
    connection: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],

    loyaltyPoints: { type: Number, default: 0 },
   
    reportCount: { type: Number, default: 0 },
    isBanned: { type: Boolean, default: false },
   
    badge: { type: String, enum: ['none', 'bronze', 'silver', 'gold', 'platinum'], default: 'none' },
    
    exchangesCompleted: { type: Number, default: 0 },

    reportedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    
    reports: [{
        reporter: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        reason: { type: String, default: '' },
        category: { type: String, enum: ['spam', 'scam', 'fake', 'harassment', 'other'], default: 'other' },
        date: { type: Date, default: Date.now }
    }]
}, {
    timestamps: true
});


const User = model("User", userSchema, "user");

export default User;