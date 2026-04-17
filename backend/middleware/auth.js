import jwt from "jsonwebtoken";

const secretKey = process.env.JWT_SECRET_KEY;


export const auth = async (req, res, next) => {
    
    const token = req.cookies.auth_token; 

    if (!token) {
        return res.status(401).json({ message: "Access denied. No token provided." });
    }

    try {
        const verified = jwt.verify(token, secretKey);
        req.user = verified;
        next();
    } catch (err) {
        return res.status(403).json({ message: "Invalid or Expired Token" });
    }
};
