import { Schema } from "mongoose";
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
    profile_pic: {
        type: String
    },
    exp: {
        type: String,
        required: true
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
    }
}, {
    timestamps: true
});


const User = model("User", userSchema,"user");

export default User;