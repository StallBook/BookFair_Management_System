import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/lg.png";

const AddGenres = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();
    return (
        <div className="flex flex-col md:flex-row h-screen bg-gray-100 overflow-hidden">
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

        </div>
    )
}

export default AddGenres
