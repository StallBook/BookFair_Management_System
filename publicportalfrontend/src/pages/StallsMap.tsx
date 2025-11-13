import React, { useState, useMemo, useEffect } from "react";
import logo from "../assets/lg.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

interface Stall {
    _id: string;
    name: string;
    size: "small" | "medium" | "large";
    dimensions: { width: number; length: number };
    map: { x: number; y: number; w: number; h: number };
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
        const fetchStalls = async () => {
            try {
                const res = await axios.get(`${API_URL}/stalls/stalls/all-stalls`);
                setStalls(res.data.data);
            } catch (error) {
                console.error("Error fetching stalls:", error);
            }
        };
        fetchStalls();
    }, []);

    const randomizedStalls = useMemo(() => {
        const shuffled = [...stalls].sort(() => Math.random() - 0.5);
        const maxX = 20;
        const maxY = 20;
        return shuffled.map((stall) => ({
            ...stall,
            map: {
                x: Math.floor(Math.random() * maxX),
                y: Math.floor(Math.random() * maxY),
                w: stall.size === "small" ? 2 : stall.size === "medium" ? 3 : 4,
                h: stall.size === "small" ? 2 : stall.size === "medium" ? 3 : 4,
            },
        }));
    }, [stalls]);

    const handleBookClick = () => setShowModal(true);
    const handleConfirm = () => {
        setShowModal(false); // close the modal
        navigate("/add-genres"); // navigate to /add-genres
    };
    const handleCancel = () => setShowModal(false);

    return (
        <div className="flex flex-col md:flex-row h-screen bg-gray-100 overflow-hidden">
            {/* Sidebar */}
            <aside
                className={`bg-gray-800 text-white p-4 md:p-6 transition-all duration-300
        ${menuOpen ? "block" : "hidden"} md:flex md:flex-col md:w-56 fixed md:relative z-50 h-full`}
            >
                <img
                    src={logo}
                    alt="Logo"
                    className="w-32 mb-8 mx-auto md:mx-0 cursor-pointer"
                    onClick={() => navigate("/")}
                />
                <nav className="space-y-3 w-full">
                    <button
                        className="w-full text-left px-3 py-2 hover:bg-gray-700 rounded cursor-pointer"
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

            {/* Main Area */}
            <main className="flex-1 flex flex-col md:flex-row overflow-auto p-4 md:p-6 mt-14 md:mt-0 gap-6">
                {/* Left Column: Map and Stats */}
                <div className="flex-1 flex flex-col gap-4">
                    {/* Stats */}
                    <div className="text-2xl font-bold mb-2 text-center">Book Fair Stalls Map</div>
                    <div className="flex flex-wrap justify-around gap-4 mb-2">
                        <div className="w-36 h-20 bg-slate-400 rounded-lg flex flex-col items-center justify-center">
                            <h3>Total Stalls</h3>
                            <span>{stalls.length}</span>
                        </div>
                        <div className="w-36 h-20 bg-green-400 rounded-lg flex flex-col items-center justify-center">
                            <h3>Available</h3>
                            <span>{stalls.filter((s) => s.status === "available").length}</span>
                        </div>
                        <div className="w-36 h-20 bg-red-400 rounded-lg flex flex-col items-center justify-center">
                            <h3>Reserved</h3>
                            <span>{stalls.filter((s) => s.status === "reserved").length}</span>
                        </div>
                    </div>

                    {/* Map */}
                    <div className="flex justify-center items-start overflow-auto">
                        <div
                            className="relative bg-white shadow-lg rounded-lg p-4 min-w-[300px] max-w-full min-h-[400px] flex-shrink-0"
                            style={{ width: "90%", height: "600px" }}
                        >
                            {randomizedStalls.map((stall) => (
                                <div
                                    key={stall.name}
                                    onClick={() => stall.status !== "reserved" && setSelectedStall(stall)}
                                    className={`absolute border border-gray-400 rounded-lg text-center font-semibold flex items-center justify-center cursor-pointer transition-all duration-200
                    ${stall.size === "small"
                                            ? "bg-blue-100 hover:bg-blue-200"
                                            : stall.size === "medium"
                                                ? "bg-green-100 hover:bg-green-200"
                                                : "bg-yellow-100 hover:bg-yellow-200"
                                        }
                    ${selectedStall?.name === stall.name ? "ring-4 ring-blue-400" : ""}
                  `}
                                    style={{
                                        left: `${stall.map.x * 25}px`,
                                        top: `${stall.map.y * 20}px`,
                                        width: `${stall.map.w * 20}px`,
                                        height: `${stall.map.h * 20}px`,
                                    }}
                                >
                                    {stall.name}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column: Stall Details */}
                <div className="w-full md:w-80 flex-shrink-0 bg-white shadow-xl rounded-2xl p-6 overflow-auto">
                    {selectedStall ? (
                        <>
                            <h2 className="text-xl font-bold mb-4">{selectedStall.name}</h2>
                            <p className="text-gray-700 mb-2">
                                <span className="font-semibold">Size:</span> {selectedStall.size.toUpperCase()}
                            </p>
                            <p className="text-gray-700 mb-2">
                                <span className="font-semibold">Dimensions:</span>{" "}
                                {selectedStall.dimensions.width} × {selectedStall.dimensions.length} m
                            </p>
                            <p className="text-gray-700 mb-2">
                                <span className="font-semibold">Status:</span> {selectedStall.status}
                            </p>
                            <p className="text-gray-600 mt-3 text-sm">
                                Location: ({selectedStall.map.x}, {selectedStall.map.y})
                            </p>
                            <button
                                onClick={handleBookClick}
                                className={`w-full mt-6 py-2 rounded-lg font-semibold transition 
                  ${selectedStall.status === "available"
                                        ? "bg-blue-600 hover:bg-blue-700 text-white"
                                        : "bg-gray-400 cursor-not-allowed"
                                    }`}
                                disabled={selectedStall.status !== "available"}
                            >
                                {selectedStall.status === "available" ? "Book Now" : "Not Available"}
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
                                <h3 className="text-xl font-semibold text-gray-900">Confirm Booking</h3>
                                <button
                                    onClick={handleCancel}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    ✕
                                </button>
                            </div>
                            <div className="py-5 text-gray-700">
                                Are you sure you want to book <strong>{selectedStall?.name}</strong>?
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
