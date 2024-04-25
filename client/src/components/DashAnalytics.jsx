import React, { useState, useEffect } from "react";

export default function DashAnalytics() {
  const [analyticsData, setAnalyticsData] = useState({
    totalItemsReported: 0,
    itemsClaimed: 0,
    itemsPending: 0,
    highestReportCategory: "",
  });

  useEffect(() => {
    // Simulate fetching data
    const fetchData = async () => {
      // Example URL, replace with your actual data source
      const response = await fetch("https://api.example.com/analytics");
      const data = await response.json();
      setAnalyticsData(data);
    };

    fetchData();
  }, []);

  return (
    <div className="p-4 bg-white shadow-lg rounded-lg">
      <h1 className="text-lg font-bold text-gray-700 mb-4">
        Dashboard Analytics
      </h1>
      <ul className="list-disc pl-5 space-y-2">
        <li>
          Total Items Reported:{" "}
          <span className="font-semibold">
            {analyticsData.totalItemsReported}
          </span>
        </li>
        <li>
          Items Successfully Claimed:{" "}
          <span className="font-semibold">{analyticsData.itemsClaimed}</span>
        </li>
        <li>
          Items Pending Claim:{" "}
          <span className="font-semibold">{analyticsData.itemsPending}</span>
        </li>
        <li>
          Most Reported Category:{" "}
          <span className="font-semibold">
            {analyticsData.highestReportCategory}
          </span>
        </li>
      </ul>
    </div>
  );
}
