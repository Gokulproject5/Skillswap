import express from 'express';
import { createUser, deleteUser, getUser, updateUser, reportUser } from '../controller/user.controller.js';
import { auth } from '../middleware/auth.js';

// route extract from express
const router = express.Router();

// crud operation for user data 

// get existing data
router.get("/", auth,getUser );

// put for update the existing data using id 
router.put("/:id", updateUser );

// delete the single user data using id 
router.delete("/:id", auth, deleteUser);

// report a user
router.post("/report", auth, reportUser);

export default router