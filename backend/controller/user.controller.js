import bcrypt from "bcrypt";
import '../utils/loadEnv.js';
import { ObjectId } from "mongodb";
import jwt from "jsonwebtoken"
import User from "../models/user.model.js";


// get user from db 
export const getUser = async (req, res) => {
    
    try {
        const user = await User.find().lean();
        const result = user.map(({ password, ...userWithoutPassword }) => userWithoutPassword);
        return res.json(result)
    } catch (err) {
        console.log(`error ${err}`);

    }

}

export const createUser = async (req, res) => {
    // get data from user using request body 
    const { fullname, email, password, slug, profile_pic, exp, loc, skills, about, seeking, verify } = req.body;


    try {

        // check db for existing user
        const user = await User.findOne({ email }).lean();
        if (user) return res.status(400).json({ message: "User already exists" });

        // arrange data for structure DB format
        const newUserData = {

            name: fullname,
            slug: slug,
            email: email,
            password: bcrypt.hashSync(password, 10),
            about: about,
            profile_pic: profile_pic,
            exp: exp,
            loc: loc,
            skills: skills,
            seeking: seeking,
            verify: verify,
            created_at: new Date()

        };



        // push data in DB 
        const response = await User.create(newUserData);
        const { insertedId } = response;
        const token = jwt.sign({
            id: insertedId
        }, process.env.JWT_SECRET_KEY, { expiresIn: "1h" });

        res.cookie('auth_token', token, {
            httpOnly: true,
            sameSite: 'lax',
            maxAge: 3600000
        });
        res.status(201).json({
            message: "User Created successfull", insertedId
        });

    } catch (err) {
        res.status(500).json({
            message: "error in server", err
        })
    }
};

// put for update the existing data using id 

export const updateUser = async (req, res) => {
    const { id } = req.params;

    try {

        const result = await User.updateOne(
            { _id: new ObjectId(id || req.body._id) },
            { $set: req.body }
        );


        if (result.matchedCount === 0) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json({
            message: "Update success"
        });

    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
};

// delete user 
export const deleteUser = (req, res) => {
    const { id } = req.params;
    const index = userData.findIndex((ind) => ind.id == id);

    if (index == -1) {
        return res.status(401).json({
            message: "User not Found"
        })
    }

    userData.splice(index, 1);
    res.json({
        message: "userdata deleted sucessfully"
    })
}

