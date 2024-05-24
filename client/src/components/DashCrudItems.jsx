import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { HiCheckCircle, HiXCircle } from "react-icons/hi";
import { Table, Button, Modal, FileInput, Toast } from "flowbite-react";
import { Link } from "react-router-dom";
import {
  HiOutlineExclamationCircle,
  HiSearch,
  HiDotsVertical,
  HiDownload,
  HiPlus,
  HiPencilAlt,
  HiTrash,
} from "react-icons/hi";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { app } from "../firebase";

export default function DashCrudItems() {
  const { currentUser } = useSelector((state) => state.user);
  const [items, setItems] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [itemIdToDelete, setItemIdToDelete] = useState("");
  const [itemToEdit, setItemToEdit] = useState({
    item: "",
    dateFound: "",
    location: "",
    description: "",
    imageUrls: [],
    category: "Other",
    status: "available",
    claimantName: "",
    claimedDate: "",
  });
  const [files, setFiles] = useState([]);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await fetch("/api/items/getItems");
        const data = await res.json();
        setItems(data);
        if (data.length < 9) {
          setShowMore(false);
        }
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    };

    fetchItems();
  }, []);

  const handleShowMore = async () => {
    const res = await fetch(`/api/items/getItems?startIndex=${items.length}`);
    const data = await res.json();
    if (data.length < 9) {
      setShowMore(false);
    }
    setItems((prevItems) => [...prevItems, ...data]);
  };

  const handleDeleteItem = async () => {
    try {
      const res = await fetch(`/api/items/deleteItem/${itemIdToDelete}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok) {
        setItems((prev) => prev.filter((item) => item._id !== itemIdToDelete));
        setShowModal(false);
        setSuccessMessage("Item deleted successfully.");
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        setErrorMessage(data.message);
        setTimeout(() => setErrorMessage(""), 3000);
      }
    } catch (error) {
      setErrorMessage("Error deleting item.");
      setTimeout(() => setErrorMessage(""), 3000);
    }
  };

  const handleSaveItem = async (e) => {
    e.preventDefault();
    if (files.length > 0) {
      const imageUrls = await uploadImages(files);
      setItemToEdit((prev) => ({ ...prev, imageUrls }));
    }

    try {
      const res = await fetch(
        `/api/items/${
          itemToEdit._id ? `updateItem/${itemToEdit._id}` : "report"
        }`,
        {
          method: itemToEdit._id ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(itemToEdit),
        }
      );
      const data = await res.json();
      if (res.ok) {
        setItems((prev) =>
          itemToEdit._id
            ? prev.map((item) => (item._id === itemToEdit._id ? data : item))
            : [...prev, data]
        );
        setShowAddModal(false);
        setShowEditModal(false);
        setSuccessMessage(
          `Item ${itemToEdit._id ? "updated" : "added"} successfully.`
        );
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        setErrorMessage(data.message);
        setTimeout(() => setErrorMessage(""), 3000);
      }
    } catch (error) {
      setErrorMessage("Error saving item.");
      setTimeout(() => setErrorMessage(""), 3000);
    }
  };

  const handleEditItem = (item) => {
    setItemToEdit({
      ...item,
      dateFound: new Date(item.dateFound).toISOString().split("T")[0], // Format date to yyyy-MM-dd
    });
    setShowEditModal(true);
  };

  const handleAddItem = () => {
    setItemToEdit({
      item: "",
      dateFound: "",
      location: "",
      description: "",
      imageUrls: [],
      category: "Other",
      status: "available",
      claimantName: "",
      claimedDate: "",
    });
    setFiles([]);
    setShowAddModal(true);
  };

  const uploadImages = async (files) => {
    const promises = [];
    for (let i = 0; i < files.length; i++) {
      promises.push(storeImage(files[i]));
    }
    return Promise.all(promises);
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
          setImageUploadProgress(progress);
        },
        (error) => {
          console.error("Upload error:", error);
          setImageUploadError("Image upload failed.");
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref)
            .then((downloadURL) => {
              resolve(downloadURL);
            })
            .catch((error) => {
              console.error("Failed to get download URL:", error);
              setImageUploadError("Failed to get download URL.");
              reject(error);
            });
        }
      );
    });
  };

  return (
    <div className="container mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {/* Toast Messages */}
      {successMessage && (
        <Toast className="fixed top-4 right-4 z-50">
          <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200">
            <HiCheckCircle className="h-5 w-5" />
          </div>
          <div className="ml-3 text-sm font-normal">{successMessage}</div>
          <Toast.Toggle />
        </Toast>
      )}
      {errorMessage && (
        <Toast className="fixed top-4 right-4 z-50">
          <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-500 dark:bg-red-800 dark:text-red-200">
            <HiXCircle className="h-5 w-5" />
          </div>
          <div className="ml-3 text-sm font-normal">{errorMessage}</div>
          <Toast.Toggle />
        </Toast>
      )}

        <div className="p-3 w-full overflow-x-auto flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900 sm:text-2xl dark:text-white">
            All Items
          </h1>
          <div className="flex items-center space-x-2 sm:space-x-3">
            <Button onClick={handleAddItem} color="blue">
              <HiPlus className="w-5 h-5 mr-2 -ml-1" />
              Add Item
            </Button>
            <Button color="gray">
              <HiDownload className="w-5 h-5 mr-2 -ml-1" />
              Export
            </Button>
          </div>
        </div>

      <div className="overflow-x-auto">
        <Table
          hoverable
          className="min-w-full text-sm text-left text-gray-500 dark:text-gray-400"
        >
          <Table.Head className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <Table.HeadCell>Item Name</Table.HeadCell>
            <Table.HeadCell>Image</Table.HeadCell>
            <Table.HeadCell>Description</Table.HeadCell>
            <Table.HeadCell>Location</Table.HeadCell>
            <Table.HeadCell>Category</Table.HeadCell>
            <Table.HeadCell>Date Found</Table.HeadCell>
            <Table.HeadCell>Status</Table.HeadCell>
            <Table.HeadCell>Actions</Table.HeadCell>
          </Table.Head>
          <Table.Body className="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">
            {items.map((item) => (
              <Table.Row
                key={item._id}
                className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                <Table.Cell className="px-6 py-4">
                  <Link to={`/item/${item._id}`} className="font-bold">
                    {item.item}
                  </Link>
                </Table.Cell>
                <Table.Cell className="px-6 py-4">
                  {item.imageUrls && item.imageUrls[0] && (
                    <img
                      src={item.imageUrls[0]}
                      alt={item.item}
                      className="w-24 h-auto"
                      onError={(e) => {
                        e.target.onError = null; // Prevents looping
                        e.target.src = "default-image.png"; // Specify your default image URL here
                      }}
                    />
                  )}
                </Table.Cell>
                <Table.Cell className="px-6 py-4">
                  {item.description}
                </Table.Cell>
                <Table.Cell className="px-6 py-4">{item.location}</Table.Cell>
                <Table.Cell className="px-6 py-4">{item.category}</Table.Cell>
                <Table.Cell className="px-6 py-4">
                  {new Date(item.dateFound).toLocaleDateString()}
                </Table.Cell>
                <Table.Cell className="px-6 py-4">{item.status}</Table.Cell>
                <Table.Cell className="px-6 py-4">
                  <div className="flex items-center ml-auto space-x-2 sm:space-x-3">
                    <Button onClick={() => handleEditItem(item)} color="blue">
                      <HiPencilAlt className="w-4 h-4 mr-2" /> Edit
                    </Button>
                    <Button
                      color="failure"
                      onClick={() => {
                        setShowModal(true);
                        setItemIdToDelete(item._id);
                      }}
                    >
                      <HiTrash className="w-4 h-4 mr-2" /> Delete
                    </Button>
                  </div>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
        {showMore && (
          <button
            onClick={handleShowMore}
            className="w-full text-teal-500 self-center text-sm py-7"
          >
            Show more
          </button>
        )}
      </div>
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size="md"
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this item?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeleteItem}>
                Yes, I'm sure
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      {/* Add Item Modal */}
      <Modal
        show={showAddModal}
        onClose={() => setShowAddModal(false)}
        size="2xl"
      >
        <Modal.Header>Add new item</Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSaveItem}>
            <div className="grid grid-cols-6 gap-6">
              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="item"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Item Name
                </label>
                <input
                  type="text"
                  name="item"
                  value={itemToEdit.item}
                  onChange={(e) =>
                    setItemToEdit({ ...itemToEdit, item: e.target.value })
                  }
                  id="item"
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="Item Name"
                  required
                />
              </div>
              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="dateFound"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Date Found
                </label>
                <input
                  type="date"
                  name="dateFound"
                  value={itemToEdit.dateFound}
                  onChange={(e) =>
                    setItemToEdit({ ...itemToEdit, dateFound: e.target.value })
                  }
                  id="dateFound"
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  required
                />
              </div>
              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="location"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={itemToEdit.location}
                  onChange={(e) =>
                    setItemToEdit({ ...itemToEdit, location: e.target.value })
                  }
                  id="location"
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="Location"
                  required
                />
              </div>
              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="description"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Description
                </label>
                <input
                  type="text"
                  name="description"
                  value={itemToEdit.description}
                  onChange={(e) =>
                    setItemToEdit({
                      ...itemToEdit,
                      description: e.target.value,
                    })
                  }
                  id="description"
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="Description"
                  required
                />
              </div>
              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="category"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Category
                </label>
                <select
                  name="category"
                  value={itemToEdit.category}
                  onChange={(e) =>
                    setItemToEdit({ ...itemToEdit, category: e.target.value })
                  }
                  id="category"
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                >
                  <option value="Mobile Phones">Mobile Phones</option>
                  <option value="Laptops/Tablets">Laptops/Tablets</option>
                  <option value="Headphones/Earbuds">Headphones/Earbuds</option>
                  <option value="Chargers and Cables">
                    Chargers and Cables
                  </option>
                  <option value="Cameras">Cameras</option>
                  <option value="Electronic Accessories">
                    Electronic Accessories
                  </option>
                  <option value="Textbooks">Textbooks</option>
                  <option value="Notebooks">Notebooks</option>
                  <option value="Stationery Items">Stationery Items</option>
                  <option value="Art Supplies">Art Supplies</option>
                  <option value="Calculators">Calculators</option>
                  <option value="Coats and Jackets">Coats and Jackets</option>
                  <option value="Hats and Caps">Hats and Caps</option>
                  <option value="Scarves and Gloves">Scarves and Gloves</option>
                  <option value="Bags and Backpacks">Bags and Backpacks</option>
                  <option value="Sunglasses">Sunglasses</option>
                  <option value="Jewelry and Watches">
                    Jewelry and Watches
                  </option>
                  <option value="Umbrellas">Umbrellas</option>
                  <option value="Wallets and Purses">Wallets and Purses</option>
                  <option value="ID Cards and Passports">
                    ID Cards and Passports
                  </option>
                  <option value="Keys">Keys</option>
                  <option value="Personal Care Items">
                    Personal Care Items
                  </option>
                  <option value="Sports Gear">Sports Gear</option>
                  <option value="Gym Equipment">Gym Equipment</option>
                  <option value="Bicycles and Skateboards">
                    Bicycles and Skateboards
                  </option>
                  <option value="Musical Instruments">
                    Musical Instruments
                  </option>
                  <option value="Water Bottles">Water Bottles</option>
                  <option value="Lunch Boxes">Lunch Boxes</option>
                  <option value="Toys and Games">Toys and Games</option>
                  <option value="Decorative Items">Decorative Items</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="col-span-6">
                <label
                  htmlFor="imageUrls"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Image URLs
                </label>
                <FileInput
                  type="file"
                  id="images"
                  accept="image/*"
                  multiple
                  onChange={(e) => setFiles(e.target.files)}
                />
                <Button
                  type="button"
                  gradientDuoTone="pinkToOrange"
                  onClick={() => uploadImages(files)}
                  disabled={imageUploadProgress !== null}
                >
                  {imageUploadProgress
                    ? `Uploading ${imageUploadProgress}%`
                    : "Upload Images"}
                </Button>
              </div>
            </div>
            <div className="items-center p-6 border-t border-gray-200 rounded-b dark:border-gray-700">
              <Button
                type="submit"
                gradientDuoTone="pinkToOrange"
                className="w-full"
              >
                Save all
              </Button>
            </div>
          </form>
        </Modal.Body>
      </Modal>

      {/* Edit Item Modal */}
      <Modal
        show={showEditModal}
        onClose={() => setShowEditModal(false)}
        size="2xl"
      >
        <Modal.Header>Edit item</Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSaveItem}>
            <div className="grid grid-cols-6 gap-6">
              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="item"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Item Name
                </label>
                <input
                  type="text"
                  name="item"
                  value={itemToEdit.item}
                  onChange={(e) =>
                    setItemToEdit({ ...itemToEdit, item: e.target.value })
                  }
                  id="item"
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="Item Name"
                  required
                />
              </div>
              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="dateFound"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Date Found
                </label>
                <input
                  type="date"
                  name="dateFound"
                  value={itemToEdit.dateFound}
                  onChange={(e) =>
                    setItemToEdit({ ...itemToEdit, dateFound: e.target.value })
                  }
                  id="dateFound"
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  required
                />
              </div>
              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="location"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={itemToEdit.location}
                  onChange={(e) =>
                    setItemToEdit({ ...itemToEdit, location: e.target.value })
                  }
                  id="location"
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="Location"
                  required
                />
              </div>
              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="description"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Description
                </label>
                <input
                  type="text"
                  name="description"
                  value={itemToEdit.description}
                  onChange={(e) =>
                    setItemToEdit({
                      ...itemToEdit,
                      description: e.target.value,
                    })
                  }
                  id="description"
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="Description"
                  required
                />
              </div>
              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="category"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Category
                </label>
                <select
                  name="category"
                  value={itemToEdit.category}
                  onChange={(e) =>
                    setItemToEdit({ ...itemToEdit, category: e.target.value })
                  }
                  id="category"
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                >
                  <option value="Mobile Phones">Mobile Phones</option>
                  <option value="Laptops/Tablets">Laptops/Tablets</option>
                  <option value="Headphones/Earbuds">Headphones/Earbuds</option>
                  <option value="Chargers and Cables">
                    Chargers and Cables
                  </option>
                  <option value="Cameras">Cameras</option>
                  <option value="Electronic Accessories">
                    Electronic Accessories
                  </option>
                  <option value="Textbooks">Textbooks</option>
                  <option value="Notebooks">Notebooks</option>
                  <option value="Stationery Items">Stationery Items</option>
                  <option value="Art Supplies">Art Supplies</option>
                  <option value="Calculators">Calculators</option>
                  <option value="Coats and Jackets">Coats and Jackets</option>
                  <option value="Hats and Caps">Hats and Caps</option>
                  <option value="Scarves and Gloves">Scarves and Gloves</option>
                  <option value="Bags and Backpacks">Bags and Backpacks</option>
                  <option value="Sunglasses">Sunglasses</option>
                  <option value="Jewelry and Watches">
                    Jewelry and Watches
                  </option>
                  <option value="Umbrellas">Umbrellas</option>
                  <option value="Wallets and Purses">Wallets and Purses</option>
                  <option value="ID Cards and Passports">
                    ID Cards and Passports
                  </option>
                  <option value="Keys">Keys</option>
                  <option value="Personal Care Items">
                    Personal Care Items
                  </option>
                  <option value="Sports Gear">Sports Gear</option>
                  <option value="Gym Equipment">Gym Equipment</option>
                  <option value="Bicycles and Skateboards">
                    Bicycles and Skateboards
                  </option>
                  <option value="Musical Instruments">
                    Musical Instruments
                  </option>
                  <option value="Water Bottles">Water Bottles</option>
                  <option value="Lunch Boxes">Lunch Boxes</option>
                  <option value="Toys and Games">Toys and Games</option>
                  <option value="Decorative Items">Decorative Items</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="col-span-6">
                <label
                  htmlFor="imageUrls"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Image URLs
                </label>
                <FileInput
                  type="file"
                  id="images"
                  accept="image/*"
                  multiple
                  onChange={(e) => setFiles(e.target.files)}
                />
                <Button
                  type="button"
                  gradientDuoTone="pinkToOrange"
                  onClick={() => uploadImages(files)}
                  disabled={imageUploadProgress !== null}
                >
                  {imageUploadProgress
                    ? `Uploading ${imageUploadProgress}%`
                    : "Upload Images"}
                </Button>
              </div>
            </div>
            <div className="items-center p-6 border-t border-gray-200 rounded-b dark:border-gray-700">
              <Button
                type="submit"
                gradientDuoTone="pinkToOrange"
                className="w-full"
              >
                Save all
              </Button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
}
