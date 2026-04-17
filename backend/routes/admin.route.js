import express from "express";
import { deleteJob, getJob, updateJob } from "../controller/admin.controller.js";
import { auth } from "../middleware/auth.js";

const adminRouter = express.Router();

adminRouter.get("/",auth, getJob);
adminRouter.put("/:id", auth,updateJob);
adminRouter.delete("/:id", auth,deleteJob);

export default adminRouter;