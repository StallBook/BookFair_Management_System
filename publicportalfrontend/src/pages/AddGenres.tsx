import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/lg.png";
import {
  genreAddService,
  getGenreDetailService,
  getGenreListService,
} from "../services/AddGenre";
import { toast } from "react-toastify";
import Banner from "../components/banner";
import DataTable from "../components/DataTable";
import { Avatar, Dropdown, Menu } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { viewBusinessDetailsService } from "../services/BusinessDetails";

interface DataType {
  key: string;
  name: string;
  description: string;
  _id: string;
}
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

const AddGenres = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [publisherName, setPublisherName] = useState("");
  const [contact, setContact] = useState("");
  const [genreName, setGenreName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [genreTypes, setGenreTypes] = useState<string[]>([]);
  const [genreDetails, setGenreDetails] = useState<DataType[]>([]);
  const [businessDetails, setBusinessDetails] = useState<any>(null);
  const userID = localStorage.getItem("userID");
  const navigate = useNavigate();

  useEffect(() => {
    fetchGenreTypes();
    viewBusinessDetails();
  }, []);
  const fetchGenreTypes = async () => {
    try {
      const response = await getGenreListService();
      if (response.message === "success") {
        setGenreTypes(response.genreTypes || []);
      } else {
        toast.error(response.error || "Failed to fetch genre types.");
        return [];
      }
    } catch (error) {
      toast.error("Something went wrong while fetching genre types.");
      console.error(error);
      return [];
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!genreName.trim()) {
      toast.error("Genre name is required!");
      return;
    }
    try {
      setLoading(true);
      const data = {
        userID: Number(userID),
        genres: [
          {
            name: genreName,
            description: description,
          },
        ],
      };
      const response = await genreAddService(data);
      if (response.message === "success") {
        toast.success("Genre added successfully!");
        fetchGenreDetail();
        setGenreName("");
        setDescription("");
      } else {
        toast.error(response.error || "Adding genre failed. Try again!");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again later.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchGenreDetail = async () => {
    try {
      const response = await getGenreDetailService({ userID: Number(userID) });
      console.log("Genre Detail Response:", response);

      if (response.message === "success") {
        const genres = Array.isArray(response.genres) ? response.genres : [];

        if (genres.length === 0) {
          setGenreDetails([]);
          return;
        }

        const data = genres.map((item: any, index: number) => ({
          key: String(index),
          _id: item._id,
          name: item.name,
          description: item.description,
        }));

        setGenreDetails(data);
      } else {
        toast.error(response.error || "Failed to fetch genre types.");
        setGenreDetails([]);
      }
    } catch (error) {
      toast.error("Something went wrong while fetching genre types.");
      console.error(error);
      setGenreDetails([]);
    }
  };

  const viewBusinessDetails = async () => {
    try {
      const response = await viewBusinessDetailsService(Number(userID));
      if (response.message === "success") {
        setBusinessDetails(response.businessDetails);
      } else {
        toast.error(response.error || "Failed to fetch business details.");
      }
    } catch (error) {
      toast.error("Something went wrong while fetching business details.");
    }
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
            <button
              className="w-full text-left px-3 py-2 hover:bg-gray-700 rounded cursor-pointer"
              onClick={() => navigate("/add-genres")}
            >
              Add Genres
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

      {/* Main Content */}
      <main className="flex-1 flex flex-col p-6 overflow-auto">
        <Banner />
        <div className="flex flex-col md:flex-row gap-4 mt-2">
          <div className="bg-white rounded-xl shadow-lg p-6 flex-1">
            <h2 className="text-2xl font-bold mb-4">
              Publisher / Vendor Details
            </h2>

            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2 text-start">
                Publication or Bookstore Name
              </label>
              <p className="w-full border border-gray-300 rounded-lg p-2 bg-gray-100 text-left">
                {businessDetails?.businessName || "N/A"}
              </p>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2 text-start">
                Owner or Representative Name
              </label>
              <p className="w-full border border-gray-300 rounded-lg p-2 bg-gray-100 text-left">
                {businessDetails?.ownerName || "N/A"}
              </p>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2 text-start">
                Contact Number
              </label>
              <p className="w-full border border-gray-300 rounded-lg p-2 bg-gray-100 text-left">
                {businessDetails?.phoneNumber || "N/A"}
              </p>
            </div>
          </div>

          {/* Add Genre Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 flex-1">
            <h2 className="text-2xl font-bold mb-4">Add Genre</h2>

            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-gray-700 font-semibold mb-2 text-start">
                  Genre Name
                </label>
                <select
                  value={genreName}
                  onChange={(e) => setGenreName(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a Genre</option>

                  {(genreTypes || []).map((genre: string, index: number) => (
                    <option key={index} value={genre}>
                      {genre}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2 text-start">
                  Description
                </label>
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
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition"
                  disabled={loading}
                >
                  {loading ? "Adding..." : "Add Genre"}
                </button>
              </div>
            </form>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 flex-1 mt-2 ">
          <DataTable
            fetchData={fetchGenreDetail}
            genreDetails={genreDetails}
            genreTypes={genreTypes}
          />
        </div>
      </main>
    </div>
  );
};

export default AddGenres;
