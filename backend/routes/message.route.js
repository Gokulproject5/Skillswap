import express from 'express';
import { getMessages } from '../controller/message.controller.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.get("/:user1/:user2", auth, getMessages);

export default router;
