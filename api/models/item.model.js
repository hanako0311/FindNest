import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  item: {
    type: String,
    required: true,
  },
  dateFound: {
    type: Date,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
});

const Item = mongoose.model("Item", itemSchema);

export { Item };
