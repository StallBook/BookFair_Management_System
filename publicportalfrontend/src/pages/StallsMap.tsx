import React, { useState } from "react";
import logo from "../assets/lg.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect } from "react";

const API_URL = process.env.REACT_APP_API_URL;

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

const stallsData: Stall[] = [
    {
        _id: "1",
        name: "A1",
        size: "small",
        dimensions: { width: 2, length: 2 },
        map: { x: 20, y: 40, w: 80, h: 80 },
        status: "available",
    },
    {
        _id: "2",
        name: "A2",
        size: "medium",
        dimensions: { width: 3, length: 2 },
        map: { x: 120, y: 40, w: 100, h: 100 },
        status: "reserved",
    },
    {
        _id: "3",
        name: "A3",
        size: "large",
        dimensions: { width: 4, length: 3 },
        map: { x: 240, y: 40, w: 120, h: 120 },
        status: "cancelled",
    },
    {
        _id: "4",
        name: "B1",
        size: "small",
        dimensions: { width: 2, length: 2 },
        map: { x: 20, y: 180, w: 80, h: 80 },
        status: "available",
    },
];

const getStatusColor = (status: Stall["status"]) => {
    switch (status) {
        case "available":
            return "bg-green-400 hover:bg-green-500";
        case "reserved":
            return "bg-gray-400 cursor-not-allowed";
        case "cancelled":
            return "bg-red-400";
        default:
            return "bg-gray-300";
    }
};

const StallsMap: React.FC = () => {
    const [selectedStall, setSelectedStall] = useState<Stall | null>(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [stalls, setStalls] = useState<Stall[]>([]);

    useEffect(() => {
        const fetchStalls = async () => {
            try {
                const res = await axios.get(`${API_URL}/stalls/stalls/all-stalls`); // 👈 update port/path if needed
                setStalls(res.data.data); // because your API returns { message, data: [...] }
                console.log("Fetched stalls:", res.data.data);
            } catch (error) {
                console.error("Error fetching stalls:", error);
            }
        };

        fetchStalls();
    }, []);
    const navigate = useNavigate();

    const handleBookClick = () => {
        setShowModal(true);
    };

    const handleConfirm = () => {
        console.log("✅ Stall booked:", selectedStall?.name);
        setShowModal(false);
    };

    const handleCancel = () => {
        setShowModal(false);
    };

    return (
        <div className="flex flex-col md:flex-row h-screen bg-gray-100">
            {/* Sidebar */}
            <aside
                className={`bg-gray-800 text-white p-4 md:p-6 transition-all duration-300 
        ${menuOpen ? "block" : "hidden"} md:flex md:flex-col md:w-56 fixed md:relative z-50`}
            >
                <img src={logo} alt="Logo" className="w-32 mb-8 mx-auto md:mx-0 cursor-pointer" onClick={() => navigate("/")}
                />
                <nav className="space-y-3 w-full">
                    <button className="w-full text-left px-3 py-2 hover:bg-gray-700 rounded cursor-pointer"
                        onClick={() => navigate("/")}
                    >
                        Dashboard
                    </button>
                    <button className="w-full text-left px-3 py-2 hover:bg-gray-700 rounded">
                        Stalls
                    </button>
                    <button className="w-full text-left px-3 py-2 hover:bg-gray-700 rounded">
                        Bookings
                    </button>
                    <button className="w-full text-left px-3 py-2 hover:bg-gray-700 rounded">
                        Settings
                    </button>
                </nav>
            </aside>

            {/* Top Bar (mobile only) */}
            <div className="flex items-center justify-between bg-gray-800 text-white p-4 md:hidden">
                <img src={logo} alt="Logo" className="w-28" />
                <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="text-white focus:outline-none text-2xl"
                >
                    ☰
                </button>
            </div>

            {/* Main Area */}
            <main className="flex-1 flex flex-col md:flex-row overflow-auto p-4 md:p-6 mt-14 md:mt-0">
                {/* Stall Map */}
                <div className="flex-1 relative bg-gray-100 shadow-inner rounded-lg min-h-[700px] overflow-hidden p-4">
                    {stalls.map((stall) => (
                        <div
                            key={stall._id || stall.name}
                            onClick={() =>
                                stall.status === "available" && setSelectedStall(stall)
                            }
                            className={`absolute border-2 border-gray-400 rounded-lg text-center font-semibold flex items-center justify-center transition-all duration-200
        ${stall.status === "reserved"
                                    ? "bg-gray-400 text-white cursor-not-allowed"
                                    : stall.status === "available"
                                        ? "bg-white hover:bg-blue-100 cursor-pointer text-gray-800"
                                        : "bg-red-200"
                                }
        ${selectedStall?._id === stall._id ? "ring-4 ring-blue-500" : ""}
      `}
                            style={{
                                left: `${stall.map.x * 35}px`,
                                top: `${stall.map.y * 35}px`,
                                width: `${stall.map.w * 25}px`,
                                height: `${stall.map.h * 25}px`,
                            }}
                        >
                            {stall.name}
                        </div>
                    ))}
                </div>

                {/* Stall Details */}
                <div className="w-full md:w-80 mt-6 md:mt-0 md:ml-6 bg-white shadow-xl rounded-2xl p-6">
                    {selectedStall ? (
                        <>
                            <h2 className="text-xl font-bold mb-4">{selectedStall.name}</h2>
                            <p className="text-gray-700 mb-2">
                                <span className="font-semibold">Size:</span>{" "}
                                {selectedStall.size.toUpperCase()}
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
                                This stall is located at position ({selectedStall.map.x},{" "}
                                {selectedStall.map.y}) on the map.
                            </p>
                            <button
                                onClick={handleBookClick}
                                className={`w-full mt-6 py-2 rounded-lg font-semibold transition 
                    ${selectedStall.status === "available"
                                        ? "bg-blue-600 hover:bg-blue-700 text-white"
                                        : "bg-gray-400 cursor-not-allowed"}
                  `}
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
                {showModal && (
                    <div
                        className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50"
                        aria-hidden="true"
                    >
                        <div className="bg-white rounded-lg shadow-lg w-11/12 max-w-lg p-5">
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
                                <p>
                                    Are you sure you want to book <strong>{selectedStall?.name}</strong>?
                                </p>
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
