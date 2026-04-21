export const adminAuth = async (req, res, next) => {
 
    if (!req.user) {
        return res.status(401).json({ error: "UNAUTHORIZED" });
    }

    
    if (req.user.role !== "admin") {
        return res.status(403).json({ error: "Access denied: Admin only" });
    }

  
    next();
}
