import React from "react";

const Users = () => {
  return (
    <div className="min-h-screen bg-[#202c34] flex">
      {" "}
      {/* Ensure the container is flex and full screen */}
      <div className="flex flex-col w-50 h-100 bg-[#202c34]"> </div>
      <div className="flex flex-col flex-grow pl-0 pr-1 pt-8 pb-0 bg-[#202c34]">
        {" "}
        {/* Content area */}
        {/* Header */}
        <h1 className="text-2xl font-bold text-white mb-6 pl-5">All Users</h1>
        {/* Search and Add User Section */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-4 items-center">
            <input
              type="text"
              placeholder="Search for users"
              className="bg-gray-800 shadow-md rounded border border-gray-600 placeholder-gray-400 text-white px-4 py-2 w-full max-w-xs focus:outline-none focus:border-indigo-500"
            />
          </div>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Add User
          </button>
        </div>
        {/* Users Table */}
        <div className="bg-gray-800 shadow-md rounded border border-gray-600 flex-grow">
          <table className="w-full leading-normal">
            <thead>
              <tr>
                <th className="px-5 py-3 border-b-2 border-gray-600 bg-gray-700 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-600 bg-gray-700 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Email Address
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-600 bg-gray-700 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Position
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-600 bg-gray-700 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-5 py-5 border-b border-gray-600 bg-gray-800 text-sm">
                  <div className="flex items-center">
                    <div className="ml-3">
                      <p className="text-white whitespace-no-wrap">John Doe</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-5 border-b border-gray-600 bg-gray-800 text-sm">
                  <p className="text-white whitespace-no-wrap">
                    john.doe@example.com
                  </p>
                </td>
                <td className="px-5 py-5 border-b border-gray-600 bg-gray-800 text-sm">
                  <p className="text-white whitespace-no-wrap">Developer</p>
                </td>
                <td className="px-5 py-5 border-b border-gray-600 bg-gray-800 text-sm">
                  <button className="text-indigo-600 hover:text-indigo-900 mr-4">
                    Edit
                  </button>
                  <button className="text-red-600 hover:text-red-900">
                    Delete
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Users;
