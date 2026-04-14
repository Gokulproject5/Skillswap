import express from 'express';
import { createUser,  deleteUser,  getUser, updateUser } from '../controller/user.controller.js';

// route extract from express
const router = express.Router();

// crud operation for user data 

// get existing data
router.get("/", getUser );

// Post for create a new  data
router.post("/",createUser);

// put for update the existing data using id 
router.put("/:id",updateUser);

// delete the single user data using id 
router.delete("/:id",deleteUser );

export default router