import express from 'express';
import { getCurrentUser, loginAuth, logoutUser } from '../controller/auth.controller.js';
import { auth, optionalAuth } from '../middleware/auth.js';
import { createUser, getUser } from '../controller/user.controller.js';
import validateBody from '../middleware/zod-validate.js';
import { loginSchema, registerSchema } from '../schemas/auth.schema.js';

const route = express.Router();

route.post("/login", validateBody(loginSchema), loginAuth);
route.get("/me", optionalAuth, getCurrentUser);
route.post("/logout", logoutUser);
route.post("/register",  createUser);
export default route;
