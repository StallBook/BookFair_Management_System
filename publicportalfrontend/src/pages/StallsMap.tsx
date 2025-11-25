import React, { useState, useMemo, useEffect } from "react";
import logo from "../assets/lg.png";
import { useNavigate } from "react-router-dom";
import { createReservationService } from "../services/ReservationService";
import { getAllStalls } from "../services/StallService";
import { toast } from "react-toastify";
import { Avatar, Dropdown, Menu } from "antd";
import { UserOutlined } from "@ant-design/icons";

const menu = (
  <Menu>
    <Menu.Item key="logout">
      <a
        onClick={() => {
          localStorage.clear();
          window.location.href = "/";
        }}
      >
        Logout
      </a>
    </Menu.Item>
  </Menu>
);

interface Stall {
  _id: string;
  name: string;
  size: "small" | "medium" | "large";
  dimensions: {
    width: number;
    length: number;
  };
  map: {
    x: number;
    y: number;
    w: number;
    h: number;
  };
  status: "available" | "cancelled" | "reserved";
  reservedByReservationId?: string | null;
  reservedAt?: string | null;
}

const StallsMap: React.FC = () => {
  const [selectedStall, setSelectedStall] = useState<Stall | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [stalls, setStalls] = useState<Stall[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStalls();
  }, []);

  const fetchStalls = async () => {
    const res = await getAllStalls();
    if (res.message === "success") {
      setStalls(res.data);
    } else {
      console.error(res.error);
    }
  };

  const mapBoundaries = useMemo(() => {
    if (stalls.length === 0) return { maxX: 50, maxY: 50 };
    const maxX = Math.max(...stalls.map((s) => s.map.x + s.map.w)) + 2;
    const maxY = Math.max(...stalls.map((s) => s.map.y + s.map.h)) + 2;
    return { maxX, maxY };
  }, [stalls]);

  const handleBookClick = () => {
    setShowModal(true);
  };

  const handleConfirm = async () => {
    if (!selectedStall) return;
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login first");
        return;
      }
      const res = await createReservationService([selectedStall._id], token);
      if (res.message === "success") {
        toast.success(
          ` Reservation confirmed for stall ${selectedStall.name}!`
        );
        toast.success(`QR code generated and Email sent to you!`);
        setShowModal(false);
        navigate("/");
        await fetchStalls();
        setSelectedStall(null);
      } else {
        toast.error(`${res.error}`);
        setShowModal(false);
        setSelectedStall(null);
      }
    } catch (err: any) {
      console.error("Booking failed:", err);
      toast.error("Something went wrong while booking. Please try again.");
    }
  };

  const handleCancel = () => {
    setShowModal(false);
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`bg-gray-800 text-white p-4 md:p-6 transition-all duration-300
    ${menuOpen ? "block" : "hidden"} 
    md:flex md:flex-col md:w-56 fixed md:relative z-50 h-full`}
      >
        <img
          src={logo}
          alt="Logo"
          className="w-32 mb-8 mx-auto md:mx-0 cursor-pointer"
          onClick={() => navigate("/")}
        />

        <nav className="space-y-3 w-full h-full flex flex-col justify-between">
          <div>
            <button
              className="w-full text-left px-3 py-2 hover:bg-gray-700 rounded"
              onClick={() => navigate("/add-genres")}
            >
              Home
            </button>
            <button
              className="w-full text-left px-3 py-2 hover:bg-gray-700 rounded cursor-pointer"
              onClick={() => navigate("/")}
            >
              Dashboard
            </button>
            <button
              className="w-full text-left px-3 py-2 hover:bg-gray-700 rounded cursor-pointer"
              onClick={() => navigate("/stalls-map")}
            >
              Stalls
            </button>
          </div>

          <Dropdown overlay={menu} trigger={["click"]} placement="bottomLeft">
            <div
              onClick={(e) => e.preventDefault()}
              className="flex items-center justify-start mt-4 cursor-pointer"
            >
              <Avatar size="large" icon={<UserOutlined />} />
            </div>
          </Dropdown>
        </nav>
      </aside>

      {/* Top Bar (mobile) */}
      <div className="flex items-center justify-between bg-gray-800 text-white p-4 md:hidden">
        <img src={logo} alt="Logo" className="w-28" />
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-white focus:outline-none text-2xl"
        >
          ☰
        </button>
      </div>

      <main className="flex-1 flex flex-col md:flex-row overflow-auto p-4 md:p-6 mt-14 md:mt-0 gap-6 bg-blue-50">
        <div className="flex-1 flex flex-col gap-2">
          <div className="text-2xl font-bold mb-2 text-center">
            Book Fair Stalls Map
          </div>
          <div className="flex flex-row justify-around items-center">
            <div className="flex flex-wrap justify-around gap-4 mb-4">
              <div className="w-36 h-12 bg-slate-200 rounded-lg flex flex-row gap-4 items-center justify-center shadow-md">
                <h3 className="font-semibold">Total Stalls</h3>
                <span className="text-xl font-bold">{stalls.length}</span>
              </div>
              <div className="w-36 h-12 bg-green-200 rounded-lg flex flex-row gap-4 items-center justify-center shadow-md">
                <h3 className="font-semibold">Available</h3>
                <span className="text-xl font-bold">
                  {stalls.filter((s) => s.status === "available").length}
                </span>
              </div>
              <div className="w-36 h-12 bg-red-200 rounded-lg flex flex-row gap-4 items-center justify-center shadow-md">
                <h3 className="font-semibold">Reserved</h3>
                <span className="text-xl font-bold">
                  {stalls.filter((s) => s.status === "reserved").length}
                </span>
              </div>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap flex-row  justify-center gap-4 mb-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-blue-100 border-2 border-blue-300 rounded"></div>
                <span>available Stalls</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-gray-200 border-2 border-gray-400 rounded"></div>
                <span>Reserved</span>
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="flex justify-center items-start overflow-auto">
            <div
              className="relative bg-gradient-to-br from-gray-50 to-gray-100 shadow-lg rounded-lg p-4 border-2 border-gray-300"
              style={{
                width: `${mapBoundaries.maxX * 12}px`,
                height: `${mapBoundaries.maxY * 12}px`,
                minWidth: "600px",
                minHeight: "600px",
              }}
            >
              {/* Grid lines for reference */}
              <div className="absolute inset-0 opacity-10 pointer-events-none">
                {Array.from({ length: Math.ceil(mapBoundaries.maxX / 5) }).map(
                  (_, i) => (
                    <div
                      key={`v-${i}`}
                      className="absolute h-full w-px bg-gray-400"
                      style={{ left: `${i * 5 * 12}px` }}
                    />
                  )
                )}
                {Array.from({ length: Math.ceil(mapBoundaries.maxY / 5) }).map(
                  (_, i) => (
                    <div
                      key={`h-${i}`}
                      className="absolute w-full h-px bg-gray-400"
                      style={{ top: `${i * 5 * 12}px` }}
                    />
                  )
                )}
              </div>

              {stalls.map((stall) => (
                <div
                  key={stall._id}
                  onClick={() =>
                    stall.status !== "reserved" && setSelectedStall(stall)
                  }
                  className={`absolute border-2 rounded-lg text-center font-semibold flex items-center justify-center transition-all duration-200 shadow-md
                   
                    ${
                      stall.status === "reserved"
                        ? "bg-gray-400 border-gray-300 cursor-not-allowed opacity-70"
                        : stall.size === "small"
                        ? "bg-blue-100 border-blue-300 hover:bg-blue-400 cursor-pointer"
                        : stall.size === "medium"
                        ? "bg-blue-100 border-blue-300 hover:bg-blue-400 cursor-pointer"
                        : "bg-blue-100 border-blue-300 hover:bg-blue-400 cursor-pointer"
                    }
                    ${
                      selectedStall?._id === stall._id
                        ? "ring-4 ring-blue-600 scale-105 z-10"
                        : ""
                    }
                  `}
                  style={{
                    left: `${stall.map.x * 12}px`,
                    top: `${stall.map.y * 12}px`,
                    width: `${stall.map.w * 12}px`,
                    height: `${stall.map.h * 12}px`,
                  }}
                  title={`${stall.name} - ${stall.size} (${stall.status})`}
                >
                  <div className="flex flex-col items-center">
                    <span className="text-xs sm:text-sm font-bold">
                      {stall.name}
                    </span>
                    {stall.status === "reserved" && (
                      <span className="text-[8px] sm:text-xs text-red-700 font-semibold">
                        Reserved
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="w-full md:w-80 flex-shrink-0 bg-white shadow-xl rounded-2xl p-6 overflow-auto">
          {selectedStall ? (
            <>
              <div className="m-1 rounded-md shadow-md p-2 bg-blue-100 border border-blue-300">
                <h2 className="text-xl font-bold mb-4 p-2 rounded">
                  <span>Stall Name: {selectedStall.name}</span>
                </h2>
                <p className="text-gray-700 mb-2">
                  <span className="font-semibold">Size:</span>{" "}
                  <label
                    className={`p-2 rounded ${
                      selectedStall.size === "small"
                        ? "bg-green-200"
                        : selectedStall.size === "medium"
                        ? "bg-yellow-200"
                        : "bg-red-200"
                    }`}
                  >
                    {selectedStall.size.toUpperCase()}
                  </label>
                </p>

                <p className="text-gray-700 mb-2">
                  <span className="font-semibold">Dimensions:</span>{" "}
                  {selectedStall.dimensions.width} ×{" "}
                  {selectedStall.dimensions.length} m
                </p>
                <p className="text-gray-700 mb-2">
                  <span className="font-semibold">Status:</span>{" "}
                  {selectedStall.status}
                </p>
                <p className="text-gray-600 mt-3 text-sm">
                  Location: ({selectedStall.map.x}, {selectedStall.map.y})
                </p>
              </div>

              <button
                onClick={handleBookClick}
                className={`w-full mt-6 py-2 rounded-lg font-semibold transition 
                  ${
                    selectedStall.status === "available"
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
                disabled={selectedStall.status !== "available"}
              >
                {selectedStall.status === "available"
                  ? "Book Now"
                  : "Not Available"}
              </button>
            </>
          ) : (
            <div className="text-gray-500 text-center mt-12 sm:mt-24">
              Select a stall to view details
            </div>
          )}
        </div>

        {/* Booking Modal */}
        {showModal && (
          <div
            className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50 p-4"
            aria-hidden="true"
          >
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-5 overflow-auto">
              <div className="flex justify-between items-center border-b pb-3">
                <h3 className="text-xl font-semibold text-gray-900">
                  Confirm Booking
                </h3>
                <button
                  onClick={handleCancel}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              <div className="py-5 text-gray-700">
                Are you sure you want to book{" "}
                <strong>{selectedStall?.name}</strong>?
              </div>
              <div className="flex justify-end gap-3 border-t pt-3">
                <button
                  onClick={handleConfirm}
                  className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Confirm
                </button>
                <button
                  onClick={handleCancel}
                  className="px-5 py-2 border rounded-lg hover:bg-gray-100"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default StallsMap;
