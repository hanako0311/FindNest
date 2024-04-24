import express from "express";
import { deleteUser, test, updateUser } from "../controller/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.get("/test", test);
router.put("/update-user/:userId", verifyToken, updateUser);
router.delete("/delete-user/:userId", verifyToken, deleteUser);

export default router;
