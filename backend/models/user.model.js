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
    // Loyalty points earned by completing exchanges
    loyaltyPoints: { type: Number, default: 0 },
    // Scam prevention: report count & ban flag
    reportCount: { type: Number, default: 0 },
    isBanned: { type: Boolean, default: false },
    // Badge tier unlocked by loyalty points
    badge: { type: String, enum: ['none', 'bronze', 'silver', 'gold', 'platinum'], default: 'none' },
    // Total completed exchanges
    exchangesCompleted: { type: Number, default: 0 },
    // Track who reported this user (for dedup)
    reportedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    // Full report log
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