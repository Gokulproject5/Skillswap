import "./utils/loadEnv.js";
import express, { json } from "express";
import cors from "cors";
import userRoute from "./routes/user.route.js";
import Auth from "./routes/auth.route.js"
import { auth } from "./middleware/auth.js";
import { jobRoute } from "./routes/jobPost.route.js";
import request from './routes/request.route.js';
import messageRoute from "./routes/message.route.js";
import http from 'http';
import './db/connection.db.js'
import adminRouter from "./routes/admin.route.js";
import cookieParser from "cookie-parser";
import { initSocket } from "./service/Socket.js";
import exchangeRoute from "./routes/exchange.route.js";


// intialize the app using express
const app = express();
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
const port = 8608;

const allowedOrigins = (process.env.FRONTEND_URL || "http://localhost:3000")
    .split(",")
    .map((o) => o.trim());

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error(`CORS blocked for origin: ${origin}`));
        }
    },
    credentials: true,
}));



// using routes
app.use('/user', userRoute)
app.use('/', Auth)
app.use('/job_post', jobRoute);
app.use('/admin', adminRouter);
app.use('/request', request);
app.use('/message', messageRoute);
app.use('/exchange', exchangeRoute);



const server = http.createServer(app);
initSocket(server)

app.get("/dashboard", auth, (req, res) => {
    res.json({ message: "Welcome to the dashboard" });
});

server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
