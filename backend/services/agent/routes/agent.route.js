import express from "express"
import { agent } from "../controllers/Agent.controller.js"

const router = express.Router()

router.post("/chat", agent)

export default router