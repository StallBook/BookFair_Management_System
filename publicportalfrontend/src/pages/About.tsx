import React from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import bg from "../assets/b2.png";

const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: (delay = 0) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.8, delay },
    }),
};

const cardVariant = {
    hidden: { opacity: 0, x: 60 },
    visible: (delay = 0) => ({
        opacity: 1,
        x: 0,
        transition: { duration: 0.7, delay },
    }),
};

const About = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col bg-cover bg-center text-gray-800" style={{ backgroundImage: `url(${bg})` }}
        >
            <Navbar />

            <div className="px-6 md:px-20 lg:px-40 mt-24 mb-20 grid grid-cols-1 md:grid-cols-2 gap-16 items-start">

                <motion.div initial="hidden" animate="visible">
                    <motion.h1
                        className="text-3xl md:text-4xl font-bold text-gray-900 mb-6"
                        variants={fadeUp}
                        custom={0.1}
                    >
                        About StallBook
                    </motion.h1>

                    <motion.p
                        className="text-base md:text-xl  text-blue-700 leading-relaxed mb-4"
                        variants={fadeUp}
                        custom={0.3}
                    >
                        StallBook is a modern reservation management system built to support
                        the Colombo International Bookfair: the largest book exhibition in
                        Sri Lanka.
                    </motion.p>

                    <motion.p
                        className="text-base md:text-lg text-gray-700 leading-relaxed mb-4"
                        variants={fadeUp}
                        custom={0.5}
                    >
                        With demand for stalls increasing every year, our system helps
                        organizers streamline the reservation process, reduce manual effort,
                        and avoid scheduling conflicts.
                    </motion.p>

                    <motion.p
                        className="text-base md:text-lg text-gray-700 leading-relaxed"
                        variants={fadeUp}
                        custom={0.7}
                    >
                        StallBook provides real-time updates, seamless booking workflows, and
                        easy accessibility so exhibitors and organizers can focus on creating
                        a successful bookfair experience.
                    </motion.p>
                </motion.div>

                {/* RIGHT SIDE: 3 MOTION CARDS */}
                <div className="flex flex-col gap-6">
                    <motion.div
                        className="p-6 rounded-xl shadow-lg bg-blue-100 border"
                        variants={cardVariant}
                        initial="hidden"
                        animate="visible"
                        custom={0.2}
                    >
                        <h3 className="text-lg font-semibold mb-2">📌 Easy Stall Reservation</h3>
                        <p className="text-gray-600">
                            Browse, select, and reserve stalls with a user-friendly interface designed for simplicity.
                        </p>
                    </motion.div>

                    <motion.div
                        className="p-6 rounded-xl shadow-lg bg-blue-100 border"
                        variants={cardVariant}
                        initial="hidden"
                        animate="visible"
                        custom={0.4}
                    >
                        <h3 className="text-lg font-semibold mb-2">📊 Real-Time Updates</h3>
                        <p className="text-gray-600">
                            Stay informed with instant booking status, availability changes, and organizer notifications.
                        </p>
                    </motion.div>

                    <motion.div
                        className="p-6 rounded-xl shadow-lg bg-blue-100 border"
                        variants={cardVariant}
                        initial="hidden"
                        animate="visible"
                        custom={0.6}
                    >
                        <h3 className="text-lg font-semibold mb-2">📁 Organized Management</h3>
                        <p className="text-gray-600">
                            Manage reservations, exhibitors, and reports efficiently through a centralized platform.
                        </p>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default About;
