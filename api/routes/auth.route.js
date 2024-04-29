import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { createuser, signin } from "../controller/auth.controller.js";

const router = express.Router();

router.post("/createuser", createuser);
router.post("/signin", signin);

export default router;
