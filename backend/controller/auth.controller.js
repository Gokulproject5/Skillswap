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


        const isProduction = process.env.NODE_ENV === 'production';
        res.cookie('auth_token', token, {
            httpOnly: true,
            sameSite: isProduction ? 'none' : 'lax',
            secure: isProduction,
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

    if (!loginUser) {
        return res.status(200).json({ user: null });
    }

    try {
        const user = await User.findOne(
            { _id: loginUser.id }, "-password")

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
    const isProduction = process.env.NODE_ENV === 'production';
    res.clearCookie("auth_token", {
        httpOnly: true,
        sameSite: isProduction ? 'none' : 'lax',
        secure: isProduction,
        path: "/",
    });
    res.json({
        message: "Logged out successfull"
    })
}


// Google signin

export const googleAuthHandler = (req, res) => {
    try {
        if (!req.user) {
            console.error("Google Auth Error: req.user is missing");
            return res.redirect(`${process.env.FRONTEND_URL || "http://localhost:3000"}/auth/login?error=auth_failed`);
        }

        const token = jwt.sign(
            { id: req.user._id, role: req.user.role },
            process.env.JWT_SECRET_KEY,
            { expiresIn: '1h' }
        );

        const isProduction = process.env.NODE_ENV === 'production';

        res.cookie('auth_token', token, {
            httpOnly: true,
            sameSite: isProduction ? 'none' : 'lax',
            secure: isProduction,
            maxAge: 3600000,
        });

        const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";

        if (req.user.isNewUser) {
            return res.redirect(`${frontendUrl}/auth/setupprofile/${req.user._id}`);
        } else {
            if (req.user.role === "admin") {
                return res.redirect(`${frontendUrl}/admin`);
            }
            return res.redirect(`${frontendUrl}/dashboard`);
        }
    } catch (e) {
        console.error("Google Auth Handler Error:", e);
        const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
        return res.redirect(`${frontendUrl}/auth/login?error=server_error`);
    }
}
