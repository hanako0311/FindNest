import { Modal, Table, Button } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  HiOutlineExclamationCircle,
  HiSearch,
  HiTrash,
  HiDotsVertical,
  HiDownload,
  HiPlus,
  HiPencilAlt,
} from "react-icons/hi";

export default function DashUsers() {
  const { currentUser } = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [userToEdit, setUserToEdit] = useState({
    firstname: "",
    middlename: "",
    lastname: "",
    username: "",
    email: "",
    department: "",
    role: "staff",
    profilePicture: "",
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`/api/user/getusers`);
        const data = await res.json();
        if (res.ok) {
          setUsers(data.users);
          if (data.users.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    if (["admin", "superAdmin"].includes(currentUser.role)) {
      fetchUsers();
    }
  }, [currentUser._id]);

  const handleShowMore = async () => {
    const startIndex = users.length;
    try {
      const res = await fetch(`/api/user/getusers?startIndex=${startIndex}`);
      const data = await res.json();
      if (res.ok) {
        setUsers((prev) => [...prev, ...data.users]);
        if (data.users.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDeleteUser = async () => {
    try {
      const res = await fetch(`/api/user/delete/${userIdToDelete}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok) {
        setUsers((prev) => prev.filter((user) => user._id !== userIdToDelete));
        setShowModal(false);
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleEditUser = (user) => {
    setUserToEdit(user);
    setShowEditModal(true);
  };

  const handleSaveEditUser = async () => {
    try {
      const res = await fetch(`/api/user/update/${userToEdit._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userToEdit),
      });
      const data = await res.json();
      if (res.ok) {
        setUsers((prev) =>
          prev.map((user) => (user._id === userToEdit._id ? data.user : user))
        );
        setShowEditModal(false);
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleAddUser = async () => {
    try {
      const res = await fetch(`/api/user/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userToEdit),
      });
      const data = await res.json();
      if (res.ok) {
        setUsers((prev) => [...prev, data.user]);
        setShowAddModal(false);
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="container mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      <div className="p-3 w-full overflow-x-auto flex-1">
        <h1 className="text-xl font-bold text-gray-900 sm:text-2xl dark:text-white">
          All Users
        </h1>
      </div>
      <div className="sm:flex mb-4">
        <div className="items-center hidden mb-3 sm:flex sm:divide-x sm:divide-gray-100 sm:mb-0 dark:divide-gray-700">
          <form className="lg:pr-3" action="#" method="GET">
            <label htmlFor="users-search" className="sr-only">
              Search
            </label>
            <div className="relative mt-1 lg:w-64 xl:w-96">
              <HiSearch className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                name="email"
                id="users-search"
                className="pl-10 bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="Search for users"
              />
            </div>
          </form>
          <div className="flex pl-0 mt-3 space-x-1 sm:pl-2 sm:mt-0">
            <button className="inline-flex justify-center p-1 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
              <HiDotsVertical className="w-6 h-6" />
            </button>
          </div>
        </div>
        <div className="flex items-center ml-auto space-x-2 sm:space-x-3">
          <Button onClick={() => setShowAddModal(true)} color="blue">
            <HiPlus className="w-5 h-5 mr-2 -ml-1" />
            Add user
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
            <Table.HeadCell>Name</Table.HeadCell>
            <Table.HeadCell>Username</Table.HeadCell>
            <Table.HeadCell>Email</Table.HeadCell>
            <Table.HeadCell>Department</Table.HeadCell>
            <Table.HeadCell>Role</Table.HeadCell>
            <Table.HeadCell>Actions</Table.HeadCell>
          </Table.Head>
          <Table.Body className="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">
            {users.map((user) => (
              <Table.Row
                key={user._id}
                className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                <Table.Cell className="px-6 py-4">
                  <div className="flex items-center">
                    <img
                      className="w-10 h-10 rounded-full"
                      src={user.profilePicture}
                      alt={user.username}
                    />
                    <div className="ml-4">
                      <div className="text-base font-semibold text-gray-900 dark:text-white">
                        {user.firstname} {user.lastname}
                      </div>
                      <div className="text-sm font-normal text-gray-500 dark:text-gray-400">
                        {user.middlename}
                      </div>
                    </div>
                  </div>
                </Table.Cell>
                <Table.Cell className="px-6 py-4">{user.username}</Table.Cell>
                <Table.Cell className="px-6 py-4">{user.email}</Table.Cell>
                <Table.Cell className="px-6 py-4">{user.department}</Table.Cell>
                <Table.Cell className="px-6 py-4">{user.role}</Table.Cell>
                <Table.Cell className="px-6 py-4">
                  <div className="flex items-center ml-auto space-x-2 sm:space-x-3">
                    <Button onClick={() => handleEditUser(user)} color="blue">
                      <HiPencilAlt className="w-4 h-4 mr-2" /> Edit
                    </Button>
                    <Button
                      onClick={() => {
                        setShowModal(true);
                        setUserIdToDelete(user._id);
                      }}
                      color="failure"
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
              Are you sure you want to delete this user?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeleteUser}>
                Yes, I'm sure
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      {/* Add User Modal */}
      <Modal
        show={showAddModal}
        onClose={() => setShowAddModal(false)}
        size="2xl"
      >
        <Modal.Header>Add new user</Modal.Header>
        <Modal.Body>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAddUser();
            }}
          >
            <div className="grid grid-cols-6 gap-6">
              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="firstname"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  First Name
                </label>
                <input
                  type="text"
                  name="firstname"
                  value={userToEdit.firstname}
                  onChange={(e) =>
                    setUserToEdit({
                      ...userToEdit,
                      firstname: e.target.value,
                    })
                  }
                  id="firstname"
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="First Name"
                  required
                />
              </div>
              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="middlename"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Middle Name
                </label>
                <input
                  type="text"
                  name="middlename"
                  value={userToEdit.middlename}
                  onChange={(e) =>
                    setUserToEdit({
                      ...userToEdit,
                      middlename: e.target.value,
                    })
                  }
                  id="middlename"
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="Middle Name"
                />
              </div>
              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="lastname"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastname"
                  value={userToEdit.lastname}
                  onChange={(e) =>
                    setUserToEdit({
                      ...userToEdit,
                      lastname: e.target.value,
                    })
                  }
                  id="lastname"
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="Last Name"
                  required
                />
              </div>
              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="username"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={userToEdit.username}
                  onChange={(e) =>
                    setUserToEdit({
                      ...userToEdit,
                      username: e.target.value,
                    })
                  }
                  id="username"
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="Username"
                  required
                />
              </div>
              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={userToEdit.email}
                  onChange={(e) =>
                    setUserToEdit({
                      ...userToEdit,
                      email: e.target.value,
                    })
                  }
                  id="email"
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="Email"
                  required
                />
              </div>
              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="department"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Department
                </label>
                <input
                  type="text"
                  name="department"
                  value={userToEdit.department}
                  onChange={(e) =>
                    setUserToEdit({
                      ...userToEdit,
                      department: e.target.value,
                    })
                  }
                  id="department"
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="Department"
                  required
                />
              </div>
              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="role"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Role
                </label>
                <select
                  name="role"
                  value={userToEdit.role}
                  onChange={(e) =>
                    setUserToEdit({ ...userToEdit, role: e.target.value })
                  }
                  id="role"
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                >
                  <option value="superAdmin">Super Admin</option>
                  <option value="admin">Admin</option>
                  <option value="staff">Staff</option>
                </select>
              </div>
              <div className="col-span-6">
                <label
                  htmlFor="profilePicture"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Profile Picture URL
                </label>
                <input
                  type="text"
                  name="profilePicture"
                  value={userToEdit.profilePicture}
                  onChange={(e) =>
                    setUserToEdit({
                      ...userToEdit,
                      profilePicture: e.target.value,
                    })
                  }
                  id="profilePicture"
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="Profile Picture URL"
                />
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

      {/* Edit User Modal */}
      <Modal
        show={showEditModal}
        onClose={() => setShowEditModal(false)}
        size="2xl"
      >
        <Modal.Header>Edit user</Modal.Header>
        <Modal.Body>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSaveEditUser();
            }}
          >
            <div className="grid grid-cols-6 gap-6">
              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="firstname"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  First Name
                </label>
                <input
                  type="text"
                  name="firstname"
                  value={userToEdit.firstname}
                  onChange={(e) =>
                    setUserToEdit({
                      ...userToEdit,
                      firstname: e.target.value,
                    })
                  }
                  id="firstname"
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="First Name"
                  required
                />
              </div>
              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="middlename"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Middle Name
                </label>
                <input
                  type="text"
                  name="middlename"
                  value={userToEdit.middlename}
                  onChange={(e) =>
                    setUserToEdit({
                      ...userToEdit,
                      middlename: e.target.value,
                    })
                  }
                  id="middlename"
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="Middle Name"
                />
              </div>
              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="lastname"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastname"
                  value={userToEdit.lastname}
                  onChange={(e) =>
                    setUserToEdit({
                      ...userToEdit,
                      lastname: e.target.value,
                    })
                  }
                  id="lastname"
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="Last Name"
                  required
                />
              </div>
              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="username"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={userToEdit.username}
                  onChange={(e) =>
                    setUserToEdit({
                      ...userToEdit,
                      username: e.target.value,
                    })
                  }
                  id="username"
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="Username"
                  required
                />
              </div>
              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={userToEdit.email}
                  onChange={(e) =>
                    setUserToEdit({
                      ...userToEdit,
                      email: e.target.value,
                    })
                  }
                  id="email"
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="Email"
                  required
                />
              </div>
              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="department"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Department
                </label>
                <input
                  type="text"
                  name="department"
                  value={userToEdit.department}
                  onChange={(e) =>
                    setUserToEdit({
                      ...userToEdit,
                      department: e.target.value,
                    })
                  }
                  id="department"
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="Department"
                  required
                />
              </div>
              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="role"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Role
                </label>
                <select
                  name="role"
                  value={userToEdit.role}
                  onChange={(e) =>
                    setUserToEdit({ ...userToEdit, role: e.target.value })
                  }
                  id="role"
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                >
                  <option value="superAdmin">Super Admin</option>
                  <option value="admin">Admin</option>
                  <option value="staff">Staff</option>
                </select>
              </div>
              <div className="col-span-6">
                <label
                  htmlFor="profilePicture"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Profile Picture URL
                </label>
                <input
                  type="text"
                  name="profilePicture"
                  value={userToEdit.profilePicture}
                  onChange={(e) =>
                    setUserToEdit({
                      ...userToEdit,
                      profilePicture: e.target.value,
                    })
                  }
                  id="profilePicture"
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="Profile Picture URL"
                />
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
