import React, { useState } from "react";
import logo from "../assets/lg.png";
import { Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";

interface NavbarProps {
  className?: string;
}

const Navbar: React.FC<NavbarProps> = ({ className }) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const token = localStorage.getItem("token");
  return (
    <nav
      className={`px-5 pt-2 flex justify-between md:justify-around items-center relative shadow pb-2 bg-gray-800 text-white ${className}`}
    >
      <img
        className="w-40 h-12 object-contain cursor-pointer"
        src={logo}
        alt="Logo"
        onClick={() => navigate("/")}
      />

      <button
        onClick={() => setOpen(!open)}
        className="md:hidden focus:outline-none text-white"
      >
        {open ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            className="w-8 h-8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            className="w-8 h-8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        )}
      </button>

      {/* Desktop Links */}
      <div className="hidden md:flex space-x-6">
        <a className="hover:text-blue-400 hover:underline" href="/">
          Home
        </a>
        {/* <a className="hover:text-teal-400 hover:underline" href="/services">Services</a> */}
        {/* <a className="hover:text-teal-400 hover:underline" href="/project">Project</a> */}
        <a className="hover:text-blue-400 hover:underline" href="/about">
          About us
        </a>
      </div>

      {/* Desktop Buttons */}
      <div className="hidden md:flex space-x-4">
        {token && (
          <a
            className="rounded-xl p-3 bg-blue-400 hover:bg-white hover:text-blue-500 transition"
            href="/stalls-map"
          >
            Book Now
          </a>
        )}
        {token && (
          <a
            className="rounded-xl p-3 border-2 border-white hover:bg-white hover:text-black transition"
            href="/add-genres"
          >
            Add Generes
          </a>
        )}
        {!token && (
          <a
            className="rounded-xl p-3 border-2 border-white hover:bg-white hover:text-black transition"
            href="/signup"
          >
            Sign Up
          </a>
        )}
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="absolute top-full left-0 w-full bg-gray-800 flex flex-col items-center py-5 space-y-4 md:hidden z-10">
          <a className="hover:text-blue-400 hover:underline" href="/">
            Home
          </a>
          {/* <a className="hover:text-teal-400 hover:underline" href="/services">Services</a> */}
          {/* <a className="hover:text-teal-400 hover:underline" href="/project">Project</a> */}
          <a className="hover:text-blue-400 hover:underline" href="/about">
            About us
          </a>
          {token && (
            <a
              className="rounded-xl p-3 bg-blue-500 hover:bg-white hover:text-teal-500 transition"
              href="/started"
            >
              Book Now
            </a>
          )}
          {token && (
            <a
              className="rounded-xl p-3 border-2 border-white hover:bg-white hover:text-black transition"
              href="/add-genres"
            >
              Add Genres
            </a>
          )}
          {!token && (
            <a
              className="rounded-xl p-3 border-2 border-white hover:bg-white hover:text-black transition"
              href="/talk"
            >
              Sign Up
            </a>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
