import {getAuth} from "firebase-admin/auth"
import User from "../models/User.js";
import app from "../config/firebase.js"
import crypto from "crypto";
import redis from "../../../shared/redis/redis.js";

export const login = async (req, res) => {
    try {
        const {idToken} = req.body;
        const decoded = await getAuth(app).verifyIdToken(idToken)
        let user = await User.findOne({
            firebaseUid:decoded.uid
        })

        if(!user){
            user = await User.create({
                firebaseUid: decoded.uid,
                name: decoded.name,
                email: decoded.email,
                avatar: decoded.picture
            })
        }

        const sessionId = crypto.randomUUID()

        await redis.set(`session-${sessionId}`, JSON.stringify({
            userId:user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar
        }),"EX",7*24*60*60)

        res.cookie("session", sessionId,{
            httpOnly: true,
            secure: false,
            sameSite: "lax", // or "none" depending on setup
            maxAge: 7*24*60*60*1000
        })

        return res.status(200).json(user)
        
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: error.message || "login error"
        })
    }
}

export const logOut = async (req, res) => {
    try {
        const sessionId = req.cookies?.session
        await redis.del(`session-${sessionId}`)
        res.clearCookie("session")
        return res.status(200).json({message: "logout succesfully !"});
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: error.message || "logout error"
        })
    }
}

export const getMe = async (req, res) => {
    try {
       return res.status(200).json(req.user)
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: error.message || "getMe error"
        })
    }
}