import express from "express";
import { test, updateUser } from "../controller/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.get("/test", test);
router.put("/update-user/:userId", verifyToken, updateUser); // Changed from "/update/:userId" to "/update-user/:userId"

export default router;
