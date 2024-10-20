import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, DollarSign, PieChart, Users } from 'lucide-react';
import { isNotAuthenticated } from '../context/authCheck';
import { useNavigate, Link } from 'react-router-dom';

const HomePage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        if (isNotAuthenticated()) {
            navigate("/auth/login");
        }
    }, [navigate]);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: 'spring',
                stiffness: 100
            }
        }
    };

    const textVariants = {
        hidden: { opacity: 0, y: -20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: 'spring',
                stiffness: 100,
            }
        }
    };

    const cards = [
        {
            title: "Upload Courses",
            description: "Share your knowledge by uploading courses and reach a global audience.",
            icon: <BookOpen className="w-12 h-12 text-cyan-500" />
        },
        {
            title: "Buy Course Shares",
            description: "Invest in your favorite courses and earn from their success.",
            icon: <DollarSign className="w-12 h-12 text-green-500" />
        },
        {
            title: "Profit Sharing",
            description: "Course profits are fairly divided between owners and shareholders.",
            icon: <PieChart className="w-12 h-12 text-purple-500" />
        },
        {
            title: "Flexible Ownership",
            description: "Choose how much of your course share you want to sell, up to 49%.",
            icon: <Users className="w-12 h-12 text-yellow-500" />
        }
    ];

    // Split the title into an array of characters, maintaining spaces
    const title = "Welcome to LearnLedger";
    const titleCharacters = title.split(''); // Keep spaces as they are

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <div className="container mx-auto px-4 py-16">
                <h1 className="text-4xl md:text-6xl font-bold text-center mb-8">
                    <motion.div
                        className="flex justify-center"
                        initial="hidden"
                        animate="visible"
                        variants={containerVariants}
                    >
                        {titleCharacters.map((char, index) => (
                            <motion.span
                                key={index}
                                variants={textVariants}
                                style={{ display: 'inline-block' }} // Maintain inline-block display for animation
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.1, delay: index * 0.05 }} // Add delay based on index
                            >
                                {char === ' ' ? '\u00A0' : char} {/* Use a non-breaking space for visual spacing */}
                            </motion.span>
                        ))}
                    </motion.div>
                </h1>

                <motion.p
                    className="text-xl text-center mb-16 max-w-3xl mx-auto"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    Empowering educators and learners through innovative course funding and profit-sharing.
                </motion.p>

                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {cards.map((card, index) => (
                        <motion.div
                            key={index}
                            className="bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 h-48"
                            variants={itemVariants}
                        >
                            <div className="flip-card w-full h-full">
                                <div className="flip-card-inner w-full h-full">
                                    <div className="flip-card-front w-full h-full flex flex-col items-center justify-center p-6">
                                        {card.icon}
                                        <h2 className="text-xl font-semibold mt-4 text-center">{card.title}</h2>
                                    </div>
                                    <div className="flip-card-back w-full h-full flex items-center justify-center p-6">
                                        <p className="text-gray-300 text-center">{card.description}</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                <motion.div
                    className="mt-16 bg-gray-800 rounded-lg p-8 shadow-lg"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                >
                    <h2 className="text-3xl font-bold mb-4 text-cyan-400">About LearnLedger</h2>
                    <p className="text-gray-300 mb-4">
                        LearnLedger is a revolutionary platform that bridges the gap between passionate educators and eager learners. We understand that many instructors struggle to create more content due to lack of funding. That's why we've created a unique ecosystem where:
                    </p>
                    <ul className="list-disc list-inside text-gray-300 mb-4 space-y-2">
                        <li>Instructors can upload their courses and offer shares to investors</li>
                        <li>Users can buy shares of their favorite courses, becoming stakeholders in educational content</li>
                        <li>Profits are fairly divided between course owners and shareholders</li>
                        <li>Course creators maintain majority ownership, selling up to 49% of their course shares</li>
                    </ul>
                    <p className="text-gray-300 mb-6">
                        By connecting educators with investors, we're fostering a community that values knowledge and supports continuous learning. Join us in revolutionizing online education!
                    </p>

                    {/* New Instruction Added Here */}
                    <motion.p
                        className="text-lg mb-6 text-gray-300"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                    >
                        Want to become an instructor? Click below and upload your Course.
                    </motion.p>

                    <Link to="/add-course">
                        <motion.button
                            className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-4 rounded inline-flex items-center transition-colors duration-300"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Get Started
                            <ArrowRight className="ml-2" />
                        </motion.button>
                    </Link>
                </motion.div>
            </div>
        </div>
    );
};

export default HomePage;
