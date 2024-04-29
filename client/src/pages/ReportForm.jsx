import React, { useState } from "react";
import { FileInput, TextInput, Select, Button, Alert } from "flowbite-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // This imports the default stylesheet for the editor
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { app } from "../firebase";
import { HiOutlineTrash } from "react-icons/hi";

export default function CreateLostFoundPost() {
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
  });
  const [imageUploadError, setImageUploadError] = useState(false);
  console.log(formData);

  const handleImageSubmit = (e) => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 5) {
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        if (files.length > 0 && files.length + formData.imageUrls.length < 5) {
          promises.push(storeImage(files[i]));
        } else {
          console.log("File must be an image and less than 2 MB");
        }
      }
      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setImageUploadError(false);
        })
        .catch((err) => {
          setImageUploadError(
            "Image upload failed: Each image must be less than 2MB."
          );
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
      <form className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <TextInput
            type="text"
            placeholder="Item Found"
            required
            name="item"
            className="flex-auto sm:flex-1"
          />
          <Select name="category" required className="w-full sm:w-1/4">
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
        />
        <TextInput
          type="text"
          placeholder="Location Found"
          required
          name="location"
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
            id="images"
            accept="image/*"
            multiple
            onChange={(e) => setFiles(e.target.files)}
          />
          <Button type="button" color="failure" onClick={handleImageSubmit}>
            Upload Image
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
      </form>
    </div>
  );
}
