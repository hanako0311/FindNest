import Item from "../models/items.model.js";
import { errorHandler } from "../utils/error.js";
import validator from "validator"; // npm install validator

export const createItem = async (req, res, next) => {
  console.log("Received headers:", req.headers);
  console.log("Received request body:", req.body);

  // Destructure required fields from req.body
  const { item, dateFound, location, description, imageUrls, category } =
    req.body;

  // Validate required fields are present and imageUrls is not empty
  if (
    !item ||
    !dateFound ||
    !location ||
    !description ||
    !category ||
    !imageUrls ||
    imageUrls.length === 0
  ) {
    console.log("Validation failed: Required fields are missing or incomplete");
    return next(
      errorHandler(
        400,
        "Please fill in all required fields, including image URLs"
      )
    );
  }

  // Validate URL format for each image URL
  if (!imageUrls.every((url) => validator.isURL(url))) {
    console.log("Validation failed: One or more image URLs are invalid");
    return next(errorHandler(400, "Please provide valid URLs for all images"));
  }

  // Create new item object with imageUrls and userRef from authenticated user
  const newItem = new Item({
    item,
    dateFound,
    location,
    description,
    imageUrls,
    category,
    userRef: req.user.id, // Assuming req.user is set by authentication middleware
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

export const getItems = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 12;
    const sortDirection = req.query.order === "asc" ? 1 : -1;

    // Constructing the query object
    let query = {};
    if (req.query.item) query.item = req.query.item;
    if (req.query.category) query.category = req.query.category;
    if (req.query.searchTerm) {
      query.$or = [
        { item: { $regex: req.query.searchTerm, $options: "i" } },
        { description: { $regex: req.query.searchTerm, $options: "i" } },
      ];
    }

    const items = await Item.find(query)
      .skip(startIndex)
      .limit(limit)
      .sort({ createdAt: sortDirection });

    res.json(items);
  } catch (error) {
    console.error("Error fetching items:", error);
    next(error);
  }
};
