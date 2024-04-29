import Item from "../models/items.model.js";
import { errorHandler } from "../utils/error.js";

export const createItem = async (req, res, next) => {
  console.log("Received headers:", req.headers);
  console.log("Received request body:", req.body);

  // Check if required text fields are present
  if (!req.body.item || !req.body.dateFound || !req.body.location) {
    console.log("Validation failed: Required fields are missing");
    return next(errorHandler(400, "Please fill in all required fields"));
  }

  // Generate a slug from the item name
  const slug = req.body.item
    .toLowerCase()
    .split(" ")
    .join("-")
    .replace(/[^a-zA-Z0-9-]/g, "");

  // Create new item object (without images for now)
  const newItem = new Item({
    ...req.body,
    slug,
    userId: req.user.id,
  });

  try {
    // Save the new item to the database
    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (error) {
    console.error("Error saving item:", error);
    next(error);
  }
};
