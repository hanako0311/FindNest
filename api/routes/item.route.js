import express from "express";
import multer from "multer";
import { Item } from "../models/item.model.js";

const router = express.Router();

// Multer config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname +
        "-" +
        Date.now() +
        "." +
        file.originalname.split(".").pop()
    );
  },
});

const upload = multer({ storage: storage });

// POST endpoint to handle the image upload and data submission
router.post("/", upload.single("image"), async (req, res) => {
  console.log(req.body); // Log the body to see what is received
  console.log(req.file); // Log the file object to check if the image is received correctly
  try {
    const newItem = new Item({
      item: req.body.item,
      dateFound: req.body.dateFound,
      location: req.body.location,
      description: req.body.description,
      image: req.file.path,
    });
    await newItem.save();
    res.status(201).send(newItem);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

export default router;
