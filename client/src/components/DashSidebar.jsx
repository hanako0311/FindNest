import { Sidebar, Modal, Button, Dropdown } from "flowbite-react";
import {
  HiArrowSmRight,
  HiUser,
  HiOutlineExclamationCircle,
  HiClipboardList,
  HiViewGrid,
  HiChevronUp,
  HiChevronDown,
  HiViewBoards,
  HiDocumentReport,
  HiUsers,
  HiOutlineDocumentSearch,
} from "react-icons/hi";
import { Disclosure } from "@headlessui/react";
import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { signoutSuccess } from "../redux/user/userSlice";
import { useDispatch } from "react-redux";

export default function DashSidebar() {
  const location = useLocation();
  const dispatch = useDispatch();
  const [tab, setTab] = useState("");
  const [showSignoutModal, setShowSignoutModal] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    } else {
      setTab("profile");
    }
  }, [location.search]);

  const handleSignout = async () => {
    try {
      const res = await fetch("/api/user/signout", {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to sign out");
      }
      dispatch(signoutSuccess());
      setShowSignoutModal(false); // Close modal on successful sign out
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <Sidebar className="w-full md:w-56">
      <Sidebar.Items>
        <Sidebar.ItemGroup className="flex flex-col gap-1">
          <Link to="/dashboard?tab=analytics">
            <Sidebar.Item
              active={tab === "analytics"}
              icon={HiViewGrid} // An icon that represents analytics
              as="div"
            >
              Dashboard
            </Sidebar.Item>
          </Link>
          <Link to="/dashboard?tab=found-items">
            <Sidebar.Item
              active={tab === "found-items"}
              icon={HiOutlineDocumentSearch}
              as="div"
            >
              Found Items
            </Sidebar.Item>
          </Link>
          <Link to="/dashboard?tab=profile">
            <Sidebar.Item
              active={tab === "profile"}
              icon={HiUser}
              label={"User"}
              labelColor="dark"
              as="div"
            >
              Profile
            </Sidebar.Item>
          </Link>
          <Link to="/report-form">
            <Sidebar.Item
              active={tab === "report-form"}
              icon={HiClipboardList}
              as="div"
            >
              Report Form
            </Sidebar.Item>
          </Link>

          {/* CRUD Dropdown */}
          <div className="flex flex-col gap-2">
            <Sidebar.Item
              icon={HiViewBoards}
              active={tab.startsWith("crud")}
              onClick={() => setTab(tab.startsWith("crud") ? "" : "crud")}
            >
              <div className="flex justify-between w-full">
                CRUD
                {tab.startsWith("crud") ? (
                  <HiChevronUp className="w-5 h-5" />
                ) : (
                  <HiChevronDown className="w-5 h-5" />
                )}
              </div>
            </Sidebar.Item>
            {/* Nested Dropdown Items */}
            {tab.startsWith("crud") && (
              <div className="pl-4 ">
                <Link to="/dashboard?tab=crud-items">
                  <Sidebar.Item active={tab === "crud-items"}>
                    Items
                  </Sidebar.Item>
                </Link>
                <Link to="/dashboard/users">
                  <Sidebar.Item active={tab === "crud-users"}>
                    Users
                  </Sidebar.Item>
                </Link>
              </div>
            )}
          </div>
          <Sidebar.Item
            icon={HiArrowSmRight}
            className="cursor-pointer"
            onClick={() => setShowSignoutModal(true)} // Open modal on click
          >
            Sign Out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>

      <Modal
        show={showSignoutModal}
        onClose={() => setShowSignoutModal(false)}
        popup
        size="md"
        className="flex items-center justify-center min-h-screen"
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg font-semibold text-gray-500 dark:text-gray-400">
              Are you sure you want to sign out?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleSignout}>
                Yes, I'm sure
              </Button>
              <Button color="gray" onClick={() => setShowSignoutModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </Sidebar>
  );
}
