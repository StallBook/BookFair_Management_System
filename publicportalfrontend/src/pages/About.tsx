import React from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";

const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: (delay = 0) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.8, delay },
    }),
};

const About = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col text-gray-800">
            <Navbar />

            {/* About Section */}
            <motion.div
                className="px-6 md:px-20 lg:px-40 mt-20 mb-20"
                initial="hidden"
                animate="visible"
            >
                <motion.h1
                    className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-6"
                    variants={fadeUp}
                    custom={0.1}
                >
                    About StallBook
                </motion.h1>

                <motion.p
                    className="text-base md:text-lg text-gray-700 leading-relaxed text-center max-w-3xl mx-auto"
                    variants={fadeUp}
                    custom={0.3}
                >
                    StallBook is a modern stall reservation management system built to
                    support the Colombo International Bookfair — the largest book
                    exhibition in Sri Lanka. With hundreds of publishers and vendors
                    participating every year, the demand for stall reservations continues
                    to grow.
                </motion.p>

                <motion.p
                    className="text-base md:text-lg text-gray-700 leading-relaxed text-center max-w-3xl mx-auto mt-4"
                    variants={fadeUp}
                    custom={0.5}
                >
                    Our system helps event organizers streamline stall allocation,
                    reduce manual work, minimize errors, and offer exhibitors a smooth,
                    efficient, and transparent booking experience. From browsing stalls
                    to managing reservations and tracking availability, StallBook makes
                    the entire process simple and hassle-free.
                </motion.p>

                <motion.p
                    className="text-base md:text-lg text-gray-700 leading-relaxed text-center max-w-3xl mx-auto mt-4"
                    variants={fadeUp}
                    custom={0.7}
                >
                    Built with modern technologies, StallBook ensures accuracy,
                    real-time updates, and a user-friendly interface — helping both
                    organizers and exhibitors focus on what truly matters: creating a
                    successful and memorable bookfair.
                </motion.p>
            </motion.div>
        </div>
    );
};

export default About;
