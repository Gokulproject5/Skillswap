import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import jwt from "jsonwebtoken";
import express from 'express'
import User from '../models/user.model.js'
export const Oauth = express.Router();

passport.use(
    new GoogleStrategy({
        clientID: process.env.OAUTH_CLIENT_ID,
        clientSecret: process.env.OAUTH_CLIENT_SECRET,
        callbackURL: `/api/auth/google/cb`,
        proxy: true,
    },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const email = profile.emails?.[0]?.value;
                let user = await User.findOne({
                    $or: [
                        { googleId: profile.id },
                        { email: email }
                    ]
                });

                if (user) {
                    if (!user.googleId) {
                        user.googleId = profile.id;
                        await user.save();
                    }
                    user.isNewUser = false;
                    return done(null, user);
                }

                const newUser = await User.create({
                    name: profile.displayName,
                    googleId: profile.id,
                    email,
                    slug: profile.id
                });
                newUser.isNewUser = true;
                return done(null, newUser);

            } catch (e) {
                return done(e, null)
            }
        }
    )
)




export default passport