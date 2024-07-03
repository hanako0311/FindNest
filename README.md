# FindNest: Advanced Lost and Found Management System

## Overview
FindNest is an innovative digital solution designed to streamline and enhance the lost and found process at CIT-University. This system automates manual procedures, making it easier for students, faculty, and staff to report and claim lost items efficiently. With a focus on user-friendliness and security, FindNest offers a comprehensive platform that integrates the reporting, tracking, and management of lost and found items.

## Features
- **Report Found Items**: Users can report found items through an intuitive form, detailing item name, description, location found, and date found.
- **Staff Dashboard**: A dashboard for staff members to manage reported items, with capabilities to sort and filter through the lost items.
- **Search Functionality**: Enables staff members to search for specific items based on item name, location found, and date found.
- **Claim Verification**: Allows staff to verify claims through a manual process, ensuring the rightful owner retrieves their item.
- **History Tracking**: Maintains a record of reported, claimed, and unclaimed items for administrative purposes.
- **Admin Account Management**: Admins can manage staff accounts, creating and editing access as needed.
- **Privacy and Security**: Implements role-based access control and adheres to strict privacy requirements to protect user information.

## Technical Stack

- **Frontend**: React, set up with Vite - for a faster development and build process, building a dynamic and interactive user interface.
- **Backend**: Node.js with Express.js - for handling server-side logic, API endpoints, and integration with the MongoDB database.
- **Database**: MongoDB - for storing and managing application data efficiently.
- **Authentication**: Implements secure login mechanisms for staff and admin roles.

![React](https://img.shields.io/badge/-React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/-Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)
![Node.js](https://img.shields.io/badge/-Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/-Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/-MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Before you begin, ensure you have the following software installed on your system:

- [Node.js](https://nodejs.org/) (version 14.x or later)
- [MongoDB](https://www.mongodb.com/) (running locally or on a cloud service like [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))

### Installation

To set up the project on your local machine, follow these steps:

1. **Clone the repository**:
   - git clone [https://github.com/yourrepository/findnest.git](https://github.com/hanako0311/FindNest.git)

2. **Navigate into the project directory and install the dependencies (Frontend & Backend):**
   - in root folder
   - npm install
   - **Frontend:**
   - cd client
   - npm install
   
3. **Navigate to the project directory:**:
   - cd findnest   

### Running the Application

To run the application locally, you need to start both the backend server and the frontend development server.

# Start the backend server
  - should be in root folder
  - npm run dev

# Start the React frontend with Vite
  - cd client
  - npm run dev
