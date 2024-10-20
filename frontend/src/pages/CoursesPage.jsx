import React, { useState, useEffect } from 'react';
import axiosInstance from '../axiosConfig';
import { motion } from 'framer-motion';

const CoursesPage = () => {
    const [courses, setCourses] = useState([]); // Initialize courses as an empty array
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [buyShares, setBuyShares] = useState(false); // Toggle between full purchase and shares
    const [shareCount, setShareCount] = useState(1); // Default shares to 1
    const [error, setError] = useState(null); // To handle API errors
    const [loading, setLoading] = useState(true); // Add a loading state

    // Fetch courses from your backend
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                setLoading(true); // Set loading to true before fetching
                const response = await axiosInstance.get('/courses');
                if (Array.isArray(response.data)) {
                    setCourses(response.data); // Only set if it's an array
                } else {
                    setError("Failed to fetch courses");
                }
            } catch (error) {
                console.error("Error fetching courses:", error);
                setError('Error fetching courses.');
            } finally {
                setLoading(false); // Set loading to false once fetching is done
            }
        };
        fetchCourses();
    }, []);

    // Handle purchase popup
    const handlePurchase = (course) => {
        setSelectedCourse(course);
        setBuyShares(false); // Reset to full purchase by default
        setShareCount(1); // Reset share count
    };

    const closePopup = () => {
        setSelectedCourse(null);
    };

    // Handle share count change
    const handleShareChange = (event) => {
        const value = Math.max(1, Math.min(selectedCourse.remainingShares, parseInt(event.target.value, 10))); // Ensure valid share count
        setShareCount(value);
    };

    // Logic to handle purchase
    const handleConfirmPurchase = async () => {
        try {
            if (buyShares) {
                console.log(`Purchasing ${shareCount} shares of ${selectedCourse.name}`);
                // Call your backend to buy shares, passing courseId and shareCount
                await axiosInstance.post(`/courses/${selectedCourse.id}/buy-shares`, { shares: shareCount });
                alert('Shares purchased successfully');
            } else {
                console.log(`Purchasing full course: ${selectedCourse.name}`);
                // Call your backend to purchase the full course
                await axiosInstance.post(`/courses/${selectedCourse.id}/purchase`);
                alert('Course purchased successfully');
            }
        } catch (err) {
            console.error(err);
            alert('Error purchasing course');
        } finally {
            closePopup();
        }
    };

    // Render a loading state
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
                <div className="flex flex-col items-center">
                    <div className="spinner-border animate-spin inline-block w-10 h-10 border-4 rounded-full border-t-blue-600 mb-4" role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                    <p className="text-lg">Loading courses...</p>
                </div>
            </div>
        );
    }

    // Render an error message if there's a problem
    if (error) {
        return <div className="text-center text-red-500">{error}</div>;
    }

    return (
        <div className="bg-gray-900 min-h-screen text-white p-6">
            {/* Animated Page Title */}
            <motion.h1
                className="text-4xl font-bold text-center mb-8"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                Available Courses
            </motion.h1>

            {/* Check if courses is an array and not empty */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.isArray(courses) && courses.length > 0 ? (
                    courses.map((course) => (
                        <motion.div
                            key={course.id}
                            className="bg-gray-800 rounded-lg shadow-md p-6 transition-transform duration-300"
                            whileHover={{ scale: 1.05 }} // Framer Motion hover animation
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 * course.id, duration: 0.5 }}
                        >
                            <h2 className="text-2xl font-semibold mb-2">{course.name}</h2>
                            <p className="mb-1">Author: {course.author}</p>
                            <p className="mb-1">Duration: {course.duration}</p>
                            <p className="mb-2">Topics: {course.topics.join(', ')}</p>
                            <p className="mb-4">Price: {course.price} Rs</p>
                            <p className="mb-4">Remaining Shares: {course.remainingShares}</p>

                            {/* Conditional rendering for purchase buttons */}
                            {course.hasPurchased ? (
                                <>
                                    <button
                                        onClick={() => handlePurchase(course)}
                                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors duration-300"
                                    >
                                        Buy Shares
                                    </button>
                                    <button
                                        onClick={() => {
                                            alert(`Starting to learn ${course.name}`);
                                        }}
                                        className="mt-2 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition-colors duration-300"
                                    >
                                        Start Learning
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={() => handlePurchase(course)}
                                    className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded transition-colors duration-300"
                                >
                                    Purchase
                                </button>
                            )}
                        </motion.div>
                    ))
                ) : (
                    <div className="text-center text-white">No courses available</div>
                )}
            </div>

            {/* Popup for purchase */}
            {selectedCourse && (
                <motion.div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                >
                    <motion.div
                        className="bg-gray-800 p-6 rounded-lg text-center"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.3 }}
                    >
                        <h2 className="text-2xl font-bold mb-4">Purchase {selectedCourse.name}</h2>
                        <p className="mb-4">Price: {selectedCourse.price} ETH</p>
                        <p className="mb-4">Remaining Shares: {selectedCourse.remainingShares}</p>

                        {/* Toggle between full course purchase and buying shares */}
                        <div className="mb-4">
                            <label className="mr-4">
                                <input
                                    type="radio"
                                    name="purchaseType"
                                    checked={!buyShares}
                                    onChange={() => setBuyShares(false)}
                                />
                                Purchase Full Course
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    name="purchaseType"
                                    checked={buyShares}
                                    onChange={() => setBuyShares(true)}
                                />
                                Buy Shares
                            </label>
                        </div>

                        {/* Display share input only when buying shares */}
                        {buyShares && (
                            <div className="mb-4">
                                <input
                                    type="number"
                                    min="1"
                                    max={selectedCourse.remainingShares}
                                    value={shareCount}
                                    onChange={handleShareChange}
                                    className="text-black px-2 py-1 rounded"
                                />
                                <span className="ml-2">Shares</span>
                            </div>
                        )}

                        <button
                            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded mr-4 transition-colors duration-300"
                            onClick={handleConfirmPurchase}
                        >
                            Confirm Purchase
                        </button>
                        <button
                            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition-colors duration-300"
                            onClick={closePopup}
                        >
                            Cancel
                        </button>
                    </motion.div>
                </motion.div>
            )}
        </div>
    );
};

export default CoursesPage;
