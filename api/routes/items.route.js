import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import { createItem, getItems } from "../controller/items.controller.js"; // Import getItems here

const router = express.Router();

router.post("/report", verifyToken, createItem);
router.get("/getItems", getItems); // Now getItems should be recognized

export default router;
