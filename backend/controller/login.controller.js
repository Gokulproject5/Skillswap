import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import user from "../models/user.model.js";

const secretKey = process.env.JWT_SECRET_KEY;

export const loginAuth = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(404).json({ message: "Email and Password are required" });
    }

    if (!secretKey) {
        return res.status(500).json({ message: "JWT secret is missed" });
    }

    try {
        const normalizedEmail = email.trim().toLowerCase();
        const userData = await user.findOne({ email: normalizedEmail }).lean();

        if (!userData) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, userData.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { id: userData._id, email: userData.email },
            secretKey,
            { expiresIn: '1h' }
        );

        res.cookie('auth_token', token, {
            httpOnly: true,
            sameSite: 'none',
            secure: process.env.NODE_ENV === 'production',
            maxAge: 3600000,
        });



        const { password: _, __v, ...userWithoutPassword } = userData;

        return res.status(200).json({
            message: "Login successful",
            userData: userWithoutPassword
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
    }
};
