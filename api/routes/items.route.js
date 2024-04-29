import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import { createItem } from "../controller/items.controller.js";

const router = express.Router();

router.post("/report", verifyToken, createItem);

export default router;
