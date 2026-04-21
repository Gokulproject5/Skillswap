import jwt from "jsonwebtoken";

export const auth = async (req, res, next) => {
    const authHeader = req.headers.Authorization || req.headers.authorization;


    const bearerToken = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

    const cookieToken = req.cookies.auth_token;
    const token = bearerToken || cookieToken;

    if (!token) {
        return res.status(401).json({ message: "Access denied. No token provided." });
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = verified;

        next();
    } catch (err) {
        return res.status(403).json({ message: "Invalid or Expired Token" });
    }
};
