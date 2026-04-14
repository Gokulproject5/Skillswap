import bcrypt from "bcrypt";
import db from "../db/connection.db.js";
import jwt from "jsonwebtoken";

const secretKey = process.env.JWT_SECRET_KEY;

export const loginAuth = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and Password are required" });
    }

    if (!secretKey) {
        return res.status(500).json({ message: "JWT secret is not configured" });
    }

    try {
        const normalizedEmail = email.trim().toLowerCase();
        const user = await db.collection("user").findOne({ email: normalizedEmail });

        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { id: user._id, email: user.email },
            secretKey,
            { expiresIn: '1h' }
        );

         res.cookie('auth_token',token,{
            httpOnly:true,
            sameSite:'strict',
            maxAge:3600000
        });

        const { password: _, ...userWithoutPassword } = user;

        return res.status(200).json({
            message: "Login successful",
            token,
            user: userWithoutPassword
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
    }
};
