import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/lg.png";

const AddGenres = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [publisherName, setPublisherName] = useState("");
    const [contact, setContact] = useState("");
    const [genreName, setGenreName] = useState("");
    const [description, setDescription] = useState("");
    const [genresList, setGenresList] = useState<{ name: string; description: string }[]>([]);

    const navigate = useNavigate();

    const handleAddGenre = () => {
        if (!genreName) {
            alert("Genre name is required!");
            return;
        }
        setGenresList([...genresList, { name: genreName, description }]);
        setGenreName("");
        setDescription("");
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
                    <button className="w-full text-left px-3 py-2 hover:bg-gray-700 rounded"
                        onClick={() => navigate("/stalls-map")}
                    >
                        Stalls
                    </button>
                    <button className="w-full text-left px-3 py-2 hover:bg-gray-700 rounded"
                        onClick={() => navigate("/add-genres")}
                    >
                        Add Genres
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
            <main className="flex-1 flex flex-col p-6 overflow-auto">
                {/* Publisher/Vendor Card */}
                <div className="bg-white rounded-xl shadow-lg p-6 mb-4 flex-1 flex flex-col text-left">
                    <h2 className="text-2xl font-bold mb-4">Publisher / Vendor Details</h2>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-semibold mb-2">Name</label>
                        <input
                            type="text"
                            value={publisherName}
                            onChange={(e) => setPublisherName(e.target.value)}
                            placeholder="Enter publisher/vendor name"
                            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-semibold mb-2">Contact Details</label>
                        <input
                            type="text"
                            value={contact}
                            onChange={(e) => setContact(e.target.value)}
                            placeholder="Enter contact details"
                            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                {/* Add Genre Card */}
                <div className="bg-white rounded-xl shadow-lg p-6 mb-4 flex-1 flex flex-col text-left">
                    <h2 className="text-2xl font-bold mb-4">Add Genre</h2>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-semibold mb-2">Genre Name</label>
                        <input
                            type="text"
                            value={genreName}
                            onChange={(e) => setGenreName(e.target.value)}
                            placeholder="Enter genre name"
                            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-semibold mb-2">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Enter genre description"
                            rows={3}
                            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        ></textarea>
                    </div>
                    <div className="flex justify-between">
                        <button
                            onClick={handleAddGenre}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition"
                        >
                            Add Genre
                        </button>
                        <button
                            onClick={() => alert(`Added Genres:\n${genresList.map(g => g.name).join(", ")}`)}
                            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition"
                        >
                            View Added Genres
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AddGenres;
