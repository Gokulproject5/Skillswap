import express from 'express';
import { getCurrentUser, googleAuthHandler, loginAuth, logoutUser } from '../controller/auth.controller.js';
import { auth, optionalAuth } from '../middleware/auth.js';
import { createUser, getUser } from '../controller/user.controller.js';
import validateBody from '../middleware/zod-validate.js';
import { loginSchema, registerSchema } from '../schemas/auth.schema.js';
import passport from 'passport';

const route = express.Router();

route.post("/login", validateBody(loginSchema), loginAuth);
route.get("/me", optionalAuth, getCurrentUser);
route.post("/logout", logoutUser);
route.post("/register", createUser);
route.get("/auth/google", passport.authenticate("google", {
    scope: ["profile", "email"],session:false
}));
route.get("/auth/google/cb", passport.authenticate("google", {
    failureRedirect: `${process.env.FRONTEND_URL}/auth/login`,session:false
}), googleAuthHandler)


export default route;
