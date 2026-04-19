import express from 'express';
import { loginAuth } from '../controller/login.controller.js';
import { auth } from '../middleware/auth.js';

const login = express.Router();

login.post("/",loginAuth);

export default login ;
