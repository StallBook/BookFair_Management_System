import React from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import bg from "../assets/b1.png";
import { getAllStalls } from "../services/StallService";
import { useState, useEffect } from "react";

const fadeUp = {
    hidden: { opacity: 0, y: 50 },
    visible: (delay = 0) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.8, delay },
    }),
};

const Home = () => {
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
    const [stalls, setStalls] = useState<Stall[]>([]);

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

    return (
        <div
            className="min-h-screen bg-cover bg-center flex flex-col text-gray-800"
            style={{ backgroundImage: `url(${bg})` }}
        >
            <Navbar className="w-full" />

            <motion.div
                className="text-center mt-12 px-6 md:px-20 lg:px-40"
                initial="hidden"
                animate="visible"
            >
                <motion.h1
                    className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
                    variants={fadeUp}
                    custom={0.1}
                >
                    Welcome to the StallBook 📚
                </motion.h1>
                <motion.p
                    className="text-base md:text-lg text-gray-700 leading-relaxed"
                    variants={fadeUp}
                    custom={0.3}
                >
                    Manage your book fair stalls with ease and efficiency. Whether you're
                    organizing, reserving, or tracking stall activities, StallBook helps
                    you handle everything from one place!
                </motion.p>
            </motion.div>

            {/* Feature Blocks */}
            {/* <div className="grid grid-cols-1 md:grid-cols-3 justify-items-center gap-1 mt-12 px-6 md:px-20 lg:px-40">
                <motion.div
                    className="rounded-xl shadow-lg p-4 w-64 text-center hover:shadow-xl transition-all bg-white/80"
                    variants={fadeUp}
                    custom={0.4}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    style={{ backgroundColor: "oklch(88.2% 0.059 254.128)" }}
                >
                    <h3>Total Stalls</h3>
                    <span>{stalls.length}</span>

                </motion.div>

                <motion.div
                    className="rounded-xl shadow-lg p-4 w-64 text-center hover:shadow-xl transition-all bg-white/80"
                    variants={fadeUp}
                    custom={0.6}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    style={{ backgroundColor: "oklch(96.2% 0.059 95.617)" }}
                >
                    <h3>Available</h3>
                    <span>
                        {stalls.filter((s) => s.status === "available").length}
                    </span>
                </motion.div>

                <motion.div
                    className="rounded-xl shadow-lg p-4 w-64 text-center hover:shadow-xl transition-all bg-white/80"
                    variants={fadeUp}
                    custom={0.8}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                style={{ backgroundColor: "oklch(94.8% 0.028 342.258)" }}
                >
                    <h3>Reserved</h3>
                    <span>
                        {stalls.filter((s) => s.status === "reserved").length}
                    </span>
                </motion.div>
            </div> */}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-48 px-6 md:px-20 lg:px-40 mb-20">
                <motion.div
                    className="bg-white/80 rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition-all"
                    variants={fadeUp}
                    custom={0.4}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    style={{ backgroundColor: "oklch(88.2% 0.059 254.128)" }}

                >
                    <h2 className="text-xl font-semibold mb-2">
                        1️⃣ Reserve and Manage Stalls Effortlessly
                    </h2>
                    <p className="text-gray-600 mb-1">
                        📚 Quickly browse available stalls and book the ones that best fit
                        your needs.
                    </p>
                    <p className="text-gray-600">
                        Easily manage, modify, or cancel your reservations anytime.
                    </p>
                </motion.div>

                <motion.div
                    className="bg-white/80 rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition-all"
                    variants={fadeUp}
                    custom={0.6}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    style={{ backgroundColor: "oklch(96.2% 0.059 95.617)" }}

                >
                    <h2 className="text-xl font-semibold mb-2">
                        2️⃣ Track Active Reservations in Real-Time
                    </h2>
                    <p className="text-gray-600 mb-1">
                        📊 Stay up-to-date with your current stall bookings and their
                        payment or approval status.
                    </p>
                    <p className="text-gray-600">
                        Get instant updates whenever there are changes.
                    </p>
                </motion.div>

                <motion.div
                    className="bg-white/80 rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition-all"
                    variants={fadeUp}
                    custom={0.8}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    style={{ backgroundColor: "oklch(94.8% 0.028 342.258)" }}

                >
                    <h2 className="text-xl font-semibold mb-2">
                        3️⃣ Stay Updated on Availability and Reports
                    </h2>
                    <p className="text-gray-600 mb-1">
                        📅 View detailed reports and availability insights for better
                        planning.
                    </p>
                    <p className="text-gray-600">
                        Know what’s happening at the exhibition - all in one glance.
                    </p>
                </motion.div>
                {/* <motion.div
                    className="bg-white/80 rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition-all"
                    variants={fadeUp}
                    custom={0.8}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    style={{ backgroundColor: "oklch(95.3% 0.051 180.801)" }}

                >
                    <h2 className="text-xl font-semibold mb-2">
                        3️⃣ Stay Updated on Availability and Reports
                    </h2>
                    <p className="text-gray-600 mb-1">
                        📅 View detailed reports and availability insights for better
                        planning.
                    </p>
                    <p className="text-gray-600">
                        Know what’s happening at the exhibition - all in one glance.
                    </p>
                </motion.div> */}

            </div>
        </div>
    );
};

export default Home;
