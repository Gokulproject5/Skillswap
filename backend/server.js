import "./utils/loadEnv.js";
import express, { json } from "express";
import cors from "cors";
import userRoute from "./routes/user.route.js";
import Auth from "./routes/login.route.js"
import { auth } from "./middleware/auth.js";
import { jobRoute } from "./routes/jobPost.route.js";
import request from './routes/request.route.js';
import { Server } from 'socket.io';
import http from 'http';
import './db/connection.db.js'
import adminRouter from "./routes/admin.route.js";
import cookieParser from "cookie-parser";
import messageRoute from "./routes/message.route.js";
import Message from "./models/message.model.js";


// intialize the app using express
const app = express();
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
const port = 8608;

const allowedOrigin = process.env.FRONTEND_URL || "http://localhost:3000";

app.use(cors({
    origin: allowedOrigin,
    credentials: true,
}));



// using routes
app.use('/user', userRoute)
app.use('/login', Auth)
app.use('/job_post', jobRoute);
app.use('/admin', adminRouter);
app.use('/api/request', request);
app.use('/message', messageRoute);


const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: allowedOrigin,
        methods: ["GET", "POST"],
        credentials: true
    }
});

const userSocketMap = new Map();

io.on("connection", (socket) => {
    
    socket.emit("me", socket.id);

  
    socket.on("register", (userId) => {
        userSocketMap.set(userId, socket.id);
        socket.userId = userId;
    });

    socket.on("disconnect", () => {
        if (socket.userId) {
            userSocketMap.delete(socket.userId);
        }
        socket.broadcast.emit("callEnded");
    });

    socket.on("callUser", ({ userToCall, signalData, from, name }) => {
       
        const socketId = userSocketMap.get(userToCall);
        if (socketId) {
            io.to(socketId).emit("callUser", { signal: signalData, from, name });
        }
    });

    socket.on("answerCall", (data) => {
       
        const callerSocketId = userSocketMap.get(data.to);
        if (callerSocketId) {
            io.to(callerSocketId).emit("callAccepted", data.signal);
        }
    });

    socket.on("sendMessage", async (data) => {
        try {
           
            const time = data.time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            await Message.create({
                sender: socket.userId,
                receiver: data.to,
                text: data.text,
                time: time
            });

            const receiverSocketId = userSocketMap.get(data.to);
            if (receiverSocketId) {
                io.to(receiverSocketId).emit("receiveMessage", {
                    from: socket.userId,
                    text: data.text,
                    time: time
                });
            }
        } catch (error) {
            console.error("Error saving message:", error);
        }
    });
});

app.get("/dashboard", auth, (req, res) => {
    res.json({ message: "Welcome to the dashboard" });
});

server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
