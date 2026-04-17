import express from 'express';
import { createUser,  deleteUser,  getUser, updateUser } from '../controller/user.controller.js';
import { auth } from '../middleware/auth.js';

// route extract from express
const router = express.Router();

// crud operation for user data 

// get existing data
router.get("/", auth,getUser );

// Post for create a new  data
router.post("/",createUser);

// put for update the existing data using id 
router.put("/:id",auth, updateUser );

// delete the single user data using id 
router.delete("/:id",auth,deleteUser );

export default router