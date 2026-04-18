import express from 'express'
import { handleRequest, myRequest, Request } from '../controller/connection.controller.js';
import { auth } from '../middleware/auth.js';

const route = express.Router();
route.post('/send-request', auth, Request);
route.get('/my-request/:userId', auth, myRequest);
route.post('/handle-request', auth, handleRequest);

export default route;