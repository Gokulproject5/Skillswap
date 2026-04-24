import express from 'express'
import { handleRequest, myRequest, mySentRequests, Request } from '../controller/connection.controller.js';
import { auth } from '../middleware/auth.js';

const route = express.Router();
route.post('/send-request', auth, Request);
route.get('/my-request/:userId', auth, myRequest);
route.get('/my-sent-request/:userId', auth, mySentRequests);
route.post('/handle-request', auth, handleRequest);

export default route;