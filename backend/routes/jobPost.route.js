import express from "express";
import { CreateJobPost, JobPost } from "../controller/jobPost.controller.js";
import { auth } from "../middleware/auth.js";


export const  jobRoute = express.Router()

jobRoute.post("/",auth,CreateJobPost);
jobRoute.get("/",auth,JobPost);