import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/lg.png";

const AddGenres = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [genreName, setGenreName] = useState("");
    const [description, setDescription] = useState("");
    const navigate = useNavigate();

    const handleSave = () => {
        if (!genreName) {
            alert("Genre name is required!");
            return;
        }

        // Here you can call your API to save the genre
        console.log("Saving genre:", { genreName, description });

        // Reset form
        setGenreName("");
        setDescription("");
        alert("Genre saved successfully!");
    };

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

            {/* Main Content */}
            <main className="flex-1 p-6 overflow-auto">
                <div className="max-w-lg mx-auto bg-white p-6 rounded-xl shadow-lg">
                    <h2 className="text-2xl font-bold mb-6 text-center">Add New Genre</h2>

                    <div className="mb-4">
                        <label className="block text-gray-700 font-semibold mb-2">
                            Genre Name
                        </label>
                        <input
                            type="text"
                            value={genreName}
                            onChange={(e) => setGenreName(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter genre name"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 font-semibold mb-2">
                            Description
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter genre description"
                            rows={4}
                        ></textarea>
                    </div>

                    <button
                        onClick={handleSave}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition"
                    >
                        Save Genre
                    </button>
                </div>
            </main>
        </div>
    );
};

export default AddGenres;
