import React, { useState } from "react";

interface NavbarProps {
    className?: string; // allow optional className
}

const Navbar: React.FC<NavbarProps> = ({ className }) => {
    const [open, setOpen] = useState(false);

    return (
        <nav className={`px-5 pt-2 flex justify-between md:justify-around items-center relative shadow pb-4 bg-gray-800 text-white ${className}`}>
            {/* Logo */}
            <img
                className="w-10"
                src="https://upload.wikimedia.org/wikipedia/en/thumb/b/bd/Reddit_Logo_Icon.svg/220px-Reddit_Logo_Icon.svg.png"
                alt="Logo"
            />

            {/* Mobile Menu Button */}
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
                <a className="hover:text-teal-400 hover:underline" href="/">Home</a>
                <a className="hover:text-teal-400 hover:underline" href="/services">Services</a>
                <a className="hover:text-teal-400 hover:underline" href="/project">Project</a>
                <a className="hover:text-teal-400 hover:underline" href="/about-us">About us</a>
            </div>

            {/* Desktop Buttons */}
            <div className="hidden md:flex space-x-4">
                <a
                    className="rounded-xl p-3 bg-teal-500 hover:bg-white hover:text-teal-500 transition"
                    href="/started"
                >
                    Get Started
                </a>
                <a
                    className="rounded-xl p-3 border-2 border-white hover:bg-white hover:text-black transition"
                    href="/talk"
                >
                    Let's Talk
                </a>
            </div>

            {/* Mobile Menu */}
            {open && (
                <div className="absolute top-full left-0 w-full bg-gray-800 flex flex-col items-center py-5 space-y-4 md:hidden z-10">
                    <a className="hover:text-teal-400 hover:underline" href="/">Home</a>
                    <a className="hover:text-teal-400 hover:underline" href="/services">Services</a>
                    <a className="hover:text-teal-400 hover:underline" href="/project">Project</a>
                    <a className="hover:text-teal-400 hover:underline" href="/about-us">About us</a>
                    <a
                        className="rounded-xl p-3 bg-teal-500 hover:bg-white hover:text-teal-500 transition"
                        href="/started"
                    >
                        Get Started
                    </a>
                    <a
                        className="rounded-xl p-3 border-2 border-white hover:bg-white hover:text-black transition"
                        href="/talk"
                    >
                        Let's Talk
                    </a>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
