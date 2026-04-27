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
import passport from "passport";
import User from "./models/user.model.js";
import { Oauth } from "./middleware/oAuth.js"
import session from "express-session";



// intialize the app using express
const app = express();
app.set('trust proxy', 1);
app.use(cookieParser());
app.use(express.json());


const port = process.env.PORT || 8608;

const isProduction = process.env.NODE_ENV === 'production';

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



// Middleware


passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user)
    } catch (e) {
        console.error("Passport Deserialization Error:", e);
        done(e, false)
    }
})


//  Secure Session Configuration
app.use(session({
    secret: process.env.SESSION_SECRET || 'fallback-secret-for-dev-only',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: isProduction,
        httpOnly: true,
        sameSite: isProduction ? 'none' : 'lax',
        maxAge: 24 * 60 * 60 * 1000
    }
}));


app.use(passport.initialize());
app.use(passport.session())




// using routes
app.use('/user', userRoute);
app.use('/', Auth);
app.use("/", Oauth)
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
    console.log(`Server running on port ${port} (Production: ${isProduction})`);
});
