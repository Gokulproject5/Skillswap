import express from 'express';
import { loginAuth } from '../controller/login.controller.js';

const login = express.Router();

login.post("/",loginAuth);


export default login