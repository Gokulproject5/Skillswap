import express from "express";
import { CreateJobPost, JobPost } from "../controller/jobPost.controller.js";


export const  jobRoute = express.Router()

jobRoute.post("/",CreateJobPost);
jobRoute.get("/",JobPost);