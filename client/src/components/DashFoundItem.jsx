import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { TextInput, Select } from "flowbite-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";

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

export default function DashFoundItem() {
  const { currentUser } = useSelector((state) => state.user);
  const [items, setItems] = useState([]);
  // const [showMore, setShowMore] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(""); // State for selected category
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await fetch(
          `/api/items/getItems?userId=${currentUser._id}`
        );
        const data = await res.json();
        setItems(data);
        setFilteredItems(data); // Initialize filteredItems with all items
        console.log("Fetched items:", data);
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    };

    fetchItems();
  }, [currentUser._id]);

  /*const handleShowMore = async () => {
    const res = await fetch(
      `/api/items/getItems?userId=${currentUser._id}&startIndex=${items.length}`
    );
    const data = await res.json();
    if (data.length < 12) {
      setShowMore(false);
    }
    setItems((prevItems) => [...prevItems, ...data]);
  }; */

  // Update filtered items based on search term and selected category
  useEffect(() => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const filtered = items.filter((item) => {
      const matchesSearchTerm =
        item.item.toLowerCase().includes(lowerCaseSearchTerm) ||
        item.category.toLowerCase().includes(lowerCaseSearchTerm) ||
        item.location.toLowerCase().includes(lowerCaseSearchTerm) ||
        item.description.toLowerCase().includes(lowerCaseSearchTerm) ||
        new Date(item.dateFound)
          .toLocaleDateString()
          .includes(lowerCaseSearchTerm);
      const matchesCategory = selectedCategory
        ? item.category.toLowerCase() === selectedCategory.toLowerCase()
        : true;
      return matchesSearchTerm && matchesCategory;
    });
    console.log("Filtered items:", filtered);
    setFilteredItems(filtered);
    // setShowMore(filtered.length >= 12);
  }, [searchTerm, selectedCategory, items]);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("searchTerm", searchTerm);
    const searchQuery = urlParams.toString();
    //  navigate(`/search?${searchQuery}`);
  };

  return (
    <div className="flex flex-col min-h-screen w-screen p-4">
      <form onSubmit={handleSubmit} className="w-full mb-4 flex space-x-4">
        <TextInput
          type="text"
          placeholder="Search..."
          rightIcon={AiOutlineSearch}
          className="w-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Select
          className="w-1/3"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </Select>
      </form>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredItems.map((item) => (
          <div
            key={item._id}
            className="bg-white border border-gray-200 rounded-lg shadow overflow-hidden dark:bg-gray-800 dark:border-gray-700"
          >
            <Link to={`/item/${item._id}`}>
              <div className="aspect-w-1 aspect-h-1 sm:aspect-w-4 sm:aspect-h-3 w-full overflow-hidden">
                {item.imageUrls && item.imageUrls[0] ? (
                  <img
                    src={item.imageUrls[0]}
                    alt={item.item}
                    className="h-full w-full object-contain object-center"
                    onError={(e) => {
                      e.target.onError = null; // Prevents looping
                      e.target.src = "default-image.png"; // Specify your default image URL here
                    }}
                  />
                ) : (
                  <img
                    src="default-image.png" // Specify your default image URL here
                    alt="Default"
                    className="h-full w-full object-cover object-center"
                  />
                )}
              </div>
            </Link>
            <div className="px-5 py-4">
              <div className="flex justify-between">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(item.dateFound).toLocaleDateString()}
                  </p>
                </div>
                <span className="bg-red-800 text-white text-xs px-2 py-1 rounded-full uppercase font-semibold">
                  {item.category}
                </span>
              </div>
              <Link to={`/item/${item._id}`} className="block mt-2">
                <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                  {item.item}
                </h5>
              </Link>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {item.description}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Found at the {item.location}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
