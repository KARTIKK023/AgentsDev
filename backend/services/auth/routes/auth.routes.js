import express from 'express';
import {login, logOut, getMe} from "../controllers/auth.controller.js";
import { authenticate } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post("/login", login);
router.get("/logout", logOut);
router.get("/me",authenticate, getMe )

export default router;

