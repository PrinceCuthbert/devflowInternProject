import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();



export const verifyToken = (req, res, next) => {
    // 1. Check if the frontend sent an Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: "Access Denied. No token provided." });
    }

    // 2. Extract the token from the "Bearer <token>" string
    const token = authHeader.split(' ')[1];

    try {
        // 3. Verify the token. If valid, decode it and attach the user ID to the request
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified; // Contains { id, username }
        next(); // Pass control to the controller
    } catch (error) {
        res.status(403).json({ error: "Invalid or expired token." });
    }
};

// / NEW: The VIP Guard
export const isAdmin = (req, res, next) => {
    // verifyToken runs first and attaches req.user.
    // Now we check the role!
    if (req.user && req.user.role === 'admin') {
        next(); // Pass! Let them see the users.
    } else {
        res.status(403).json({ error: "Access Denied. Admins only." });
    }
};