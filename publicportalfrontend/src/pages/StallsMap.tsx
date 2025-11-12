import React, { useState } from "react";
import logo from "../assets/lg.png";

interface Stall {
    id: number;
    name: string;
    size: string;
    price: number;
    status: "Available" | "Booked";
    description: string;
}

const stallsData: Stall[] = [
    { id: 1, name: "A1", size: "Small", price: 1000, status: "Available", description: "Near entrance, perfect for small vendors." },
    { id: 2, name: "A2", size: "Medium", price: 1500, status: "Booked", description: "Centrally located, medium size stall." },
    { id: 3, name: "A3", size: "Large", price: 2000, status: "Available", description: "Spacious stall near main walkway." },
    { id: 4, name: "B1", size: "Small", price: 1200, status: "Available", description: "Small stall with corner visibility." },
    { id: 5, name: "B2", size: "Large", price: 2500, status: "Booked", description: "Prime spot, high traffic area." },
    { id: 6, name: "B3", size: "Medium", price: 1700, status: "Available", description: "Located near the food court." },
];

const StallsMap: React.FC = () => {
    const [selectedStall, setSelectedStall] = useState<Stall | null>(null);
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <div className="flex flex-col md:flex-row h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className={`bg-gray-800 text-white p-4 md:p-6 transition-all duration-300 
        ${menuOpen ? "block" : "hidden"} md:flex md:flex-col md:w-56 fixed md:relative z-50`}>
                <img src={logo} alt="Logo" className="w-32 mb-8 mx-auto md:mx-0" />
                <nav className="space-y-3 w-full">
                    <button className="w-full text-left px-3 py-2 hover:bg-gray-700 rounded">Dashboard</button>
                    <button className="w-full text-left px-3 py-2 hover:bg-gray-700 rounded">Stalls</button>
                    <button className="w-full text-left px-3 py-2 hover:bg-gray-700 rounded">Bookings</button>
                    <button className="w-full text-left px-3 py-2 hover:bg-gray-700 rounded">Settings</button>
                </nav>
            </aside>

            {/* Top Bar (for mobile) */}
            <div className="flex items-center justify-between bg-gray-800 text-white p-4 md:hidden">
                <img src={logo} alt="Logo" className="w-28" />
                <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="text-white focus:outline-none text-2xl"
                >
                    ☰
                </button>
            </div>

            {/* Main Content */}
            <main className="flex-1 flex flex-col md:flex-row overflow-auto p-4 md:p-6 mt-14 md:mt-0">
                {/* Stall Grid */}
                <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {stallsData.map((stall) => (
                        <div
                            key={stall.id}
                            onClick={() => setSelectedStall(stall)}
                            className={`cursor-pointer border rounded-xl p-4 text-center shadow-sm transition-all
                ${stall.status === "Booked" ? "bg-red-200 cursor-not-allowed" : "bg-green-100 hover:bg-green-200"}
                ${selectedStall?.id === stall.id ? "ring-4 ring-blue-400" : ""}`}
                        >
                            <h3 className="text-lg font-semibold">{stall.name}</h3>
                            <p className="text-sm text-gray-700">{stall.size}</p>
                            <p className="text-sm font-medium mt-2">Rs. {stall.price}</p>
                            <p className={`text-xs mt-1 ${stall.status === "Booked" ? "text-red-600" : "text-green-600"}`}>
                                {stall.status}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Stall Details Card */}
                <div className="w-full md:w-80 mt-6 md:mt-0 md:ml-6 bg-white shadow-xl rounded-2xl p-6">
                    {selectedStall ? (
                        <>
                            <h2 className="text-xl font-bold mb-4">{selectedStall.name}</h2>
                            <p className="text-gray-700 mb-2"><span className="font-semibold">Size:</span> {selectedStall.size}</p>
                            <p className="text-gray-700 mb-2"><span className="font-semibold">Price:</span> Rs. {selectedStall.price}</p>
                            <p className="text-gray-700 mb-2"><span className="font-semibold">Status:</span> {selectedStall.status}</p>
                            <p className="text-gray-600 mt-3 text-sm">{selectedStall.description}</p>
                            <button
                                className={`w-full mt-6 py-2 rounded-lg font-semibold transition 
                  ${selectedStall.status === "Booked"
                                        ? "bg-gray-400 cursor-not-allowed"
                                        : "bg-blue-600 hover:bg-blue-700 text-white"}`}
                                disabled={selectedStall.status === "Booked"}
                            >
                                {selectedStall.status === "Booked" ? "Already Booked" : "Book Now"}
                            </button>
                        </>
                    ) : (
                        <div className="text-gray-500 text-center mt-12 sm:mt-24">
                            Select a stall to view details
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default StallsMap;
