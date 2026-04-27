import express from "express";
import { deleteJob, getJob, getStats, updateJob } from "../controller/admin.controller.js";
import { auth } from "../middleware/auth.js";
import { adminAuth } from "../middleware/admin.js";

const adminRouter = express.Router();

adminRouter.get("/", auth, adminAuth, getJob);
adminRouter.get("/stats", auth, adminAuth, getStats);
adminRouter.put("/:id", auth, adminAuth, updateJob);
adminRouter.delete("/:id", auth, adminAuth, deleteJob);

export default adminRouter;