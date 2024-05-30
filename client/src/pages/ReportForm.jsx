import React, { useState } from "react";
import { FileInput, TextInput, Select, Button, Alert } from "flowbite-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { app } from "../firebase";
import { HiOutlineTrash } from "react-icons/hi";
import { useNavigate } from "react-router-dom";

export default function CreateLostFoundPost() {
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    item: "",
    dateFound: new Date(),
    location: "",
    description: "",
    category: "",
    imageUrls: [],
  });
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(false);
  const [reportSubmitError, setReportSubmitError] = useState(null);
  const [reportSuccess, setReportSuccess] = useState(null);
  const [key, setKey] = useState(0);

  const navigate = useNavigate();

  const handleImageSubmit = (e) => {
    if (files.length > 0 && files.length + formData.imageUrls.length <= 5) {
      // Update condition to include <= 5
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }

      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setImageUploadProgress(null); // Reset upload progress after success
          setImageUploadError(false);
        })
        .catch((err) => {
          setImageUploadError(
            "Image upload failed: Each image must be less than 2MB."
          );
          setImageUploadProgress(null); // Reset upload progress on error
        });
    } else {
      setImageUploadError("You can only upload up to 5 images per report.");
    }
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          console.error("Upload error:", error);
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref)
            .then((downloadURL) => {
              resolve(downloadURL);
            })
            .catch((error) => {
              console.error("Failed to get download URL:", error);
              reject(error);
            });
        }
      );
    });
  };

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateChange = (date) => {
    setFormData((prev) => ({
      ...prev,
      dateFound: date,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/items/report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        setReportSubmitError(data.message);
        return;
      }

      setReportSuccess("Item reported successfully!");
      setReportSubmitError(null);

      setTimeout(() => navigate("/dashboard?tab=found-items"), 3000); // Delay navigation for 3 seconds

      // Reset the form fields
      setFormData({
        item: "",
        dateFound: new Date(),
        location: "",
        description: "",
        category: "",
        imageUrls: [],
      });
      setFiles([]); // Also clear selected files
      setKey((prevKey) => prevKey + 1); // Increment key to force re-render of file input
    } catch (error) {
      setReportSubmitError("Something went wrong");
      setReportSuccess(null);
    }
  };

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
            className="flex-auto sm:flex-1"
            onChange={handleChange}
          />
          <Select
            name="category"
            required
            className="w-full sm:w-1/4"
            onChange={handleChange}
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </Select>
        </div>
        <div className="relative">
          <DatePicker
            selected={formData.dateFound}
            onChange={handleDateChange}
            required
            maxDate={new Date()}
            className="w-full p-2.5 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
        </div>
        <TextInput
          type="text"
          placeholder="Location Found"
          required
          name="location"
          onChange={handleChange}
        />
        <textarea
          className="block w-full p-2.5 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Describe the item..."
          required
          rows="4"
          name="description"
          onChange={handleChange}
        ></textarea>

        <div className="flex gap-4 items-center">
          <FileInput
            key={key}
            type="file"
            id="images"
            accept="image/*"
            multiple
            onChange={(e) => setFiles(e.target.files)}
            disabled={formData.imageUrls.length >= 5} // Disable the file input if the limit is reached
          />

          {formData.imageUrls.length >= 5 && (
            <Alert color="info">
              You have reached the maximum limit of 5 images.
            </Alert>
          )}
          <Button
            type="button"
            gradientDuoTone="pinkToOrange"
            onClick={handleImageSubmit}
            disabled={imageUploadProgress !== null}
          >
            {imageUploadProgress
              ? `Uploading ${imageUploadProgress}%`
              : "Upload Image"}
          </Button>
        </div>
        {imageUploadError && <Alert color="failure">{imageUploadError}</Alert>}
        {formData.imageUrls.length > 0 && (
          <div className="flex space-x-4">
            {formData.imageUrls.map((url, index) => (
              <div
                key={url}
                className="flex flex-col items-center p-4 border border-gray-300 shadow rounded-lg hover:shadow-md transition-shadow"
              >
                <img
                  src={url}
                  alt={`listing ${index}`}
                  className="w-24 h-24 md:w-32 md:h-32 object-contain rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="mt-3 text-red-600 hover:text-red-800"
                >
                  <HiOutlineTrash className="w-6 h-6" />
                </button>
              </div>
            ))}
          </div>
        )}
        <Button type="submit" gradientDuoTone="pinkToOrange">
          Submit Found Item
        </Button>
        {reportSuccess && (
          <Alert color="success">{reportSuccess}</Alert> // Display the success alert
        )}
        {reportSubmitError && (
          <Alert color="failure">{reportSubmitError}</Alert>
        )}
      </form>
    </div>
  );
}
