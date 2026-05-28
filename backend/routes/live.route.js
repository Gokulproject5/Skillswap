import express from "express"
import { liveServer } from "../controller/live.controller.js";

export const live = express.Router()

live.get("/",liveServer);