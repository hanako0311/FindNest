import Item from "../models/items.model.js";
import { errorHandler } from "../utils/error.js";

export const createItem = async (req, res, next) => {
  console.log("Received headers:", req.headers);
  console.log("Received request body:", req.body);

  // Check if required fields are present, including imageUrls
  if (
    !req.body.item ||
    !req.body.dateFound ||
    !req.body.location ||
    !req.body.imageUrls ||
    req.body.imageUrls.length === 0
  ) {
    console.log(
      "Validation failed: Required fields are missing, including image URLs"
    );
    return next(
      errorHandler(
        400,
        "Please fill in all required fields, including image URLs"
      )
    );
  }

  // Create new item object with imageUrls
  const newItem = new Item({
    ...req.body,
    userRef: req.user.id,
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
