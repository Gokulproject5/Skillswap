import "./utils/loadEnv.js";
import express, { json } from "express";
import cors from "cors";
import userRoute from "./routes/user.route.js";
import Auth from "./routes/login.route.js"
import { auth } from "./middleware/auth.js";
import { jobRoute } from "./routes/jobPost.route.js";
import { Server } from 'socket.io';
import http from 'http';
import { VideoCallService } from './service/videoCall.js'
import './db/connection.db.js'
// intialize the app using express
const app = express();
const port = 8608;

const allowedOrigin = process.env.FRONTEND_URL || "http://localhost:3000";
// socket server 
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
       origin: "http://localhost:3000", 
        methods: ["GET", "POST"]
    }
})

VideoCallService(io);

app.use(cors({
    origin: allowedOrigin,
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// using middleware
app.use('/user', userRoute)
app.use('/login', Auth)
app.use('/job_post', jobRoute)

app.get("/dashboard", auth, (req, res) => {
    res.json({ message: "Welcome to the dashboard" });
});

server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
