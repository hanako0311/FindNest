import axios from "axios";
import React, { useState } from "react";
import { Alert, Button, FileInput, TextInput, Select } from "flowbite-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // This imports the default stylesheet for the editor
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

export default function CreateLostFoundPost() {
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({
    item: "",
    dateFound: "",
    location: "",
    description: "",
    image: "",
    category: "",
  });

  const categories = [
    "Mobile Phones",
    "Laptops/Tablets",
    "Headphones/Earbuds",
    "Chargers and Cables",
    "Cameras",
    "Electronic Accessories",
    "Textbooks",
    "Notebooks",
    "Stationery Items",
    "Art Supplies",
    "Calculators",
    "Coats and Jackets",
    "Hats and Caps",
    "Scarves and Gloves",
    "Bags and Backpacks",
    "Sunglasses",
    "Jewelry and Watches",
    "Umbrellas",
    "Wallets and Purses",
    "ID Cards and Passports",
    "Keys",
    "Personal Care Items",
    "Sports Gear",
    "Gym Equipment",
    "Bicycles and Skateboards",
    "Musical Instruments",
    "Water Bottles",
    "Lunch Boxes",
    "Toys and Games",
    "Decorative Items",
    "Other",
  ];

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submit action
    const uploadData = new FormData();
    uploadData.append("image", file);
    uploadData.append("item", formData.item);
    uploadData.append("dateFound", formData.dateFound);
    uploadData.append("location", formData.location);
    uploadData.append("description", formData.description);

    try {
      const response = await axios.post(
        "http://localhost:3000/api/upload",
        uploadData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percentCompleted);
          },
        }
      );
      console.log("Upload successful", response.data);
      setUploadProgress(0); // Reset progress on success
    } catch (error) {
      console.error("Upload failed:", error);
      setImageUploadError("Failed to upload item. Please try again.");
      setUploadProgress(0); // Reset progress on failure
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">
        Report Found Item
      </h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <TextInput
            type="text"
            placeholder="Item Found"
            required
            name="item"
            onChange={handleChange}
            className="flex-auto sm:flex-1"
          />
          <Select
            onChange={handleChange}
            name="category"
            required
            className="w-full sm:w-1/4"
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </Select>
        </div>
        <TextInput
          type="date"
          placeholder="Date Found"
          required
          name="dateFound"
          onChange={handleChange}
        />
        <TextInput
          type="text"
          placeholder="Location Found"
          required
          name="location"
          onChange={handleChange}
        />
        <ReactQuill
          theme="snow"
          placeholder="Describe the item..."
          required
          onChange={(value) => {
            setFormData((prev) => ({ ...prev, description: value }));
          }}
        />
        <div className="flex gap-4 items-center">
          <FileInput
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
          />
          {uploadProgress > 0 && uploadProgress < 100 && (
            <div style={{ width: 50, height: 50 }}>
              <CircularProgressbar
                value={uploadProgress}
                text={`${uploadProgress}%`}
              />
            </div>
          )}
          <Button type="submit" color="failure">
            Upload Image
          </Button>
        </div>
        {imageUploadError && <Alert color="failure">{imageUploadError}</Alert>}
        {formData.image && (
          <img
            src={formData.image}
            alt="Uploaded"
            className="w-full h-72 object-cover"
          />
        )}
        <Button type="submit" gradientDuoTone="pinkToOrange">
          Submit Found Item
        </Button>
      </form>
    </div>
  );
}
