import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { ObjectId } from "mongodb";
const secretKey = process.env.JWT_SECRET_KEY;

export const loginAuth = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and Password are required" });
    }

    if (!secretKey) {
        return res.status(500).json({ message: "JWT secret is missed" });
    }

    try {
        const normalizedEmail = email.trim().toLowerCase();
        const userData = await User.findOne({ email: normalizedEmail }).lean();

        if (!userData) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, userData.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { id: userData._id, role: userData.role },
            secretKey,
            { expiresIn: '1h' }
        );


        res.cookie('auth_token', token, {
            httpOnly: true,
            sameSite: 'none',
            secure: process.env.NODE_ENV === 'production',
            maxAge: 3600000,
        });



        return res.status(200).json({
            message: "Login successful",

        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
    }
};


export const getCurrentUser = async (req, res) => {
    const loginUser = req.user;


    try {
        const user = await User.findOne(
            { _id: loginUser.id },"-password")

        if (!user) {
            return res.status(404).json({
                error: "User not found"
            });

        }
        res.json({ user });

    } catch (e) {
        res.status(500).json({ error: "Failed to fetch user" })
    }
}


export const logoutUser = async (req, res) => {
    res.clearCookie("auth_token", {
        httpOnly: true,
        sameSite: "none",
         secure: true,   
        path: "/",
    });
    res.json({
        message: "Logged out successfull"
    })
}