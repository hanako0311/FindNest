import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import {
    createItem,
    getItems,
    getItemDetails,
    claimItem  // Import the claimItem controller
} from "../controller/items.controller.js";

const router = express.Router();

router.post("/report", verifyToken, createItem);
router.get("/getItems", getItems);
router.get("/:id", verifyToken, getItemDetails);
router.post("/claim/:itemId", verifyToken, claimItem);  // New route for claiming an item

export default router;
