import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function DashFoundItem() {
  const { currentUser } = useSelector((state) => state.user);
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await fetch(
          `/api/items/getItems?userId=${currentUser._id}`
        );
        const data = await res.json();
        setItems(data);
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    };

    fetchItems();
  }, [currentUser._id]);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="mx-auto p-3 w-full">
        <div className="grid grid-cols-3 gap-4">
          {items.map((item) => (
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
    </div>
  );
}
