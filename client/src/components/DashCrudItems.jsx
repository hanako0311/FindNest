import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Table } from "flowbite-react";
import { Link } from "react-router-dom";

export default function DashCrudItems() {
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
      {" "}
      {/* This ensures that the component takes at least the height of the screen */}
      <div className="mx-auto p-3 w-full overflow-x-auto">
        {" "}
        {/* Handles horizontal overflow and ensures width is managed */}
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
            <Table.HeadCell>Delete</Table.HeadCell>
            <Table.HeadCell>Edit</Table.HeadCell>
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
                <Table.Cell className="px-6 py-4">
                  <span className="text-red-500 hover:text-red-700 cursor-pointer hover:underline">
                    Delete
                  </span>
                </Table.Cell>
                <Table.Cell className="px-6 py-4">
                  <span className="text-green-500 hover:text-green-700 cursor-pointer hover:underline">
                    Edit
                  </span>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
    </div>
  );
}
