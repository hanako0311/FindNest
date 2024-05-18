import { Table } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Pie, Line } from "react-chartjs-2";
import {
  ArcElement,
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement
);

export default function DashAnalytics() {
  const [analyticsData, setAnalyticsData] = useState({
    totalItemsReported: 0,
    itemsClaimed: 0,
    itemsPending: 0,
  });

  const currentUser = useSelector((state) => state.user.currentUser);

  const [items, setItems] = useState([]);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch("/api/items/getTotalItems");
      if (!response.ok) {
        throw new Error("Failed to fetch analytics data");
      }
      const data = await response.json();
      setAnalyticsData(data);
    } catch (error) {
      console.error("Error fetching analytics data:", error);
    }
  };

  const [itemsFoundCount, setItemsFoundCount] = useState(Array(7).fill(0));
  const [itemsClaimedCount, setItemsClaimedCount] = useState(Array(7).fill(0));

  // Fetch items data
  const fetchItems = async () => {
    try {
      const res = await fetch(`/api/items/getItems?userId=${currentUser._id}`);
      const fetchedItems = await res.json();

      const modifiedItems = [];
      const now = new Date();
      const foundCounts = Array(7).fill(0);
      const claimedCounts = Array(7).fill(0);

      fetchedItems.forEach((item) => {
        // Always add the 'Found' entry
        const createdAt = new Date(item.createdAt);
        const daysAgoFound = Math.floor(
          (now - createdAt) / (1000 * 60 * 60 * 24)
        );
        if (daysAgoFound < 7) {
          foundCounts[daysAgoFound]++;
        }

        if (item.status === "claimed" && item.claimedDate) {
          const claimedDate = new Date(item.claimedDate);
          const daysAgoClaimed = Math.floor(
            (now - claimedDate) / (1000 * 60 * 60 * 24)
          );
          if (daysAgoClaimed < 7) {
            claimedCounts[daysAgoClaimed]++;
          }
        }
        modifiedItems.push({
          ...item,
          action: "Found",
          displayDate: new Date(item.createdAt).toLocaleDateString(),
          displayTime: new Date(item.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          sortDate: new Date(item.createdAt),
        });

        // Add 'Claimed' entry if the item has been claimed
        if (item.status === "claimed" && item.claimedDate) {
          modifiedItems.push({
            ...item,
            action: "Claimed",
            displayDate: new Date(item.claimedDate).toLocaleDateString(),
            displayTime: new Date(item.claimedDate).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            sortDate: new Date(item.claimedDate),
          });
        }
      });

      setItems(modifiedItems.sort((a, b) => b.sortDate - a.sortDate));
      setItemsFoundCount(foundCounts.reverse());
      setItemsClaimedCount(claimedCounts.reverse());
    } catch (error) {
      console.error("Failed to fetch items:", error);
    }
  };

  //Pie Graph
  const data = {
    labels: ["Items Claimed", "Unclaimed Items"], // Labels for segments
    datasets: [
      {
        label: "Item Status",
        data: [analyticsData.itemsClaimed, analyticsData.itemsPending], // Data points
        backgroundColor: [
          "rgba(14, 159, 110, 0.8)", // green
          "rgba(231, 33, 33, 0.8)", // red
        ],
        borderColor: ["rgba(14, 159, 110, 0.8)", "rgba(231, 33, 33, 0.8)"],
        borderWidth: 1,
      },
    ],
  };
  const options = {
    plugins: {
      legend: {
        display: true,
        position: "bottom",
      },
    },
  };

  //Line Graph
  const lineGraphData = {
    labels: [
      "6 days ago",
      "5 days ago",
      "4 days ago",
      "3 days ago",
      "2 days ago",
      "Yesterday",
      "Today",
    ],
    datasets: [
      {
        label: "Items Found",
        data: itemsFoundCount,
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
      {
        label: "Items Claimed",
        data: itemsClaimedCount,
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };

  const lineGraphOptions = {
    scales: {
      y: {
        beginAtZero: true,
      },
      x: {
        ticks: {
          fontSize: 16, // Make the x-axis labels larger
        },
      },
    },
    elements: {
      point: {
        radius: 5, // Makes points larger
      },
      line: {
        borderWidth: 3, // Makes line thicker
      },
    },
    plugins: {
      legend: {
        labels: {
          fontSize: 14, // Adjust legend labels font size
        },
      },
      title: {
        display: true,
        text: "Items Found vs. Items Claimed Over the Past Week",
        font: {
          size: 18, // Adjust title font size
        },
      },
    },
  };

  useEffect(() => {
    if (currentUser && currentUser._id) {
      fetchAnalytics(); // Fetch analytics data
      fetchItems(); // Fetch items for audit logs
    }
  }, [currentUser._id]);

  return (
    <div className="p-4 bg-white shadow-lg rounded-lg">
      <div className="">
        <h1 className="text-3x1 font-bold text-gray-700 mb-4">
          Dashboard Analytics
        </h1>
        {/* Statistics */}
        <div className="flex flex-row justify-around items-center flex-wrap">
          <div className="flex flex-col p-3 bg-blue-500 gap-4 md:w-72 w-full rounded-md shadow-md text-white">
            Total Items Reported:{" "}
            <span className="font-semibold">
              {analyticsData.totalItemsReported}
            </span>
          </div>
          <div className="flex flex-col p-3 bg-green-500 gap-4 md:w-72 w-full rounded-md shadow-md text-white">
            Items Successfully Claimed:{" "}
            <span className="font-semibold">{analyticsData.itemsClaimed}</span>
          </div>
          <div className="flex flex-col p-3 bg-red-800 gap-4 md:w-72 w-full rounded-md shadow-md text-white">
            Unclaimed Items:{" "}
            <span className="font-semibold">{analyticsData.itemsPending}</span>
          </div>
        </div>
        {/* Statistics End */}
      </div>
      <div className="flex flex-row justify-around items-center flex-wrap">
        {/* Pie Chart */}
        <div className=" p-3 dark:bg-slate-800 gap-4 md:w-1/3 w-full rounded-md shadow-md text-white flex justify-center items-center">
          <div className="w-full md:w-72 p-5 flex justify-center items-center">
            <div style={{ width: "100%", height: "auto", minHeight: "230px" }}>
              <Pie data={data} options={options} />
            </div>
          </div>
        </div>
        {/* Line Graph */}
        <div className="p-3 dark:bg-slate-800 gap-4 md:w-2/3 w-full rounded-md shadow-md text-white flex justify-center items-center">
          <div className="w-full p-5 flex justify-center items-center">
            <div
              className="flex justify-center items-center"
              style={{ width: "100%", height: "auto", minHeight: "230px" }}
            >
              <Line data={lineGraphData} options={lineGraphOptions} />
            </div>
          </div>
        </div>
      </div>
      {/* Audit Logs */}
      <div className="mx-auto p-3 w-full overflow-x-auto">
        <br></br>
        <h1 className="text-lg font-bold text-gray-700 mb-4">Audit Logs</h1>
        <Table
          hoverable
          className="min-w-full text-sm text-left text-gray-500 dark:text-gray-400"
        >
          <Table.Head className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <Table.HeadCell>Action</Table.HeadCell>
            <Table.HeadCell>Date</Table.HeadCell>
            <Table.HeadCell>Time</Table.HeadCell>
            <Table.HeadCell>Item Name</Table.HeadCell>
            <Table.HeadCell>Image</Table.HeadCell>
            <Table.HeadCell>Description</Table.HeadCell>
            <Table.HeadCell>Location</Table.HeadCell>
            <Table.HeadCell>Category</Table.HeadCell>
          </Table.Head>
          <Table.Body className="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">
            {items.map((item) => (
              <Table.Row
                key={item._id || index}
                {...item}
                className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                <Table.Cell className="px-6 py-4">{item.action}</Table.Cell>
                <Table.Cell className="px-6 py-4">
                  {item.displayDate}
                </Table.Cell>
                <Table.Cell className="px-6 py-4">
                  {item.displayTime}
                </Table.Cell>
                <Table.Cell className="px-6 py-4">
                  <Link to={`/item/${item._id}`}>{item.item}</Link>
                </Table.Cell>
                <Table.Cell className="px-6 py-4">
                  {item.imageUrls && item.imageUrls[0] && (
                    <img
                      src={item.imageUrls[0]}
                      alt={item.item}
                      className="w-24 h-auto"
                      onError={(e) => {
                        e.target.onError = null;
                        e.target.src = "default-image.png";
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
                  {item.dateClaimed
                    ? new Date(item.dateClaimed).toLocaleDateString()
                    : ""}
                </Table.Cell>
                <Table.Cell className="px-6 py-4">
                  {item.dateClaimed
                    ? new Date(item.dateClaimed).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : ""}
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
      {/* Audit Logs End */}
    </div>
  );
}
