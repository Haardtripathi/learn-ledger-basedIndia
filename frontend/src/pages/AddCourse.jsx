import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { motion } from 'framer-motion';
import { Upload } from 'lucide-react';
import Button from '../components/cardUI/Button';
import Card from '../components/cardUI/Card';
import CardContent from '../components/cardUI/CardContent';
import CardHeader from '../components/cardUI/CardHeader';
import Input from '../components/cardUI/Input';
import Textarea from '../components/cardUI/Textarea';
import axiosInstance from '../axiosConfig';
import { useNavigate } from 'react-router-dom';

const AddCourse = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        author: '',  // Added Author field
        title: '',
        description: '',
        contentPoints: '',
        topics: '',
        duration: '',
        priceInRupees: '',
        ownerShares: ''
    });
    const [video, setVideo] = useState(null);
    const [ethPrice, setEthPrice] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        fetchEthPrice();
    }, []);

    const fetchEthPrice = async () => {
        try {
            const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=inr');
            const data = await response.json();
            setEthPrice(data.ethereum.inr);
        } catch (error) {
            console.error("Error fetching ETH price:", error);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleVideoChange = (e) => {
        setVideo(e.target.files[0]);
    };

    const convertRupeesToEth = (rupees) => {
        if (!ethPrice) return 0;
        return ethers.parseEther((parseFloat(rupees) / ethPrice).toFixed(18));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true); // Start loading state

        const formDataToSend = new FormData();

        // Manually append each form field to formDataToSend
        formDataToSend.append('author', formData.author); // Append Author
        formDataToSend.append('title', formData.title);
        formDataToSend.append('description', formData.description);
        formDataToSend.append('contentPoints', formData.contentPoints);
        formDataToSend.append('topics', formData.topics);
        formDataToSend.append('duration', formData.duration);
        formDataToSend.append('priceInRupees', formData.priceInRupees);
        formDataToSend.append('ownerShares', formData.ownerShares);

        // Append the video file if it exists
        if (video) {
            formDataToSend.append('video', video);
        }

        // Log the FormData entries
        for (let [key, value] of formDataToSend.entries()) {
            console.log(`${key}: ${value}`);
        }

        try {
            const response = await axiosInstance.post("/add-course", formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.status !== 201) {
                throw new Error('Failed to create course');
            }

            alert("Course created successfully! Transaction Hash: " + response.data.transactionHash);
            navigate("/"); // Navigate after success
        } catch (error) {
            console.error("Error creating course:", error);
            alert("Error creating course. See console for details.");
        } finally {
            setIsLoading(false); // Stop loading state
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
        >
            <Card className="w-full max-w-4xl bg-gray-800 shadow-2xl rounded-2xl overflow-hidden border border-gray-700">
                <CardHeader className="bg-gradient-to-r from-cyan-700 to-blue-700 p-8">
                    <motion.h2
                        className="text-4xl font-bold text-center text-white"
                        initial={{ y: -30 }}
                        animate={{ y: 0 }}
                        transition={{ delay: 0.2, type: 'spring', stiffness: 120 }}
                    >
                        Create a New Course
                    </motion.h2>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <motion.div
                                initial={{ x: -30, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.3 }}
                            >
                                <label className="block text-sm font-medium text-gray-300 mb-1">Author</label>
                                <Input
                                    name="author"
                                    placeholder="Enter author name"
                                    value={formData.author}
                                    onChange={handleChange}
                                    required
                                    className="bg-gray-700 text-white border-gray-600 focus:border-cyan-500 focus:ring-cyan-500"
                                />
                            </motion.div>
                            <motion.div
                                initial={{ x: 30, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.4 }}
                            >
                                <label className="block text-sm font-medium text-gray-300 mb-1">Course Title</label>
                                <Input
                                    name="title"
                                    placeholder="Enter course title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    required
                                    className="bg-gray-700 text-white border-gray-600 focus:border-cyan-500 focus:ring-cyan-500"
                                />
                            </motion.div>
                        </div>
                        <motion.div
                            initial={{ y: 30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.5 }}
                        >
                            <label className="block text-sm font-medium text-gray-300 mb-1">Course Description</label>
                            <Textarea
                                name="description"
                                placeholder="Provide a detailed description of your course"
                                value={formData.description}
                                onChange={handleChange}
                                required
                                className="bg-gray-700 text-white border-gray-600 focus:border-cyan-500 focus:ring-cyan-500"
                            />
                        </motion.div>
                        <motion.div
                            initial={{ y: 30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.6 }}
                        >
                            <label className="block text-sm font-medium text-gray-300 mb-1">Content Points</label>
                            <Textarea
                                name="contentPoints"
                                placeholder="List main content points (comma-separated)"
                                value={formData.contentPoints}
                                onChange={handleChange}
                                required
                                className="bg-gray-700 text-white border-gray-600 focus:border-cyan-500 focus:ring-cyan-500"
                            />
                        </motion.div>
                        <motion.div
                            initial={{ y: 30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.7 }}
                        >
                            <label className="block text-sm font-medium text-gray-300 mb-1">Topics</label>
                            <Input
                                name="topics"
                                placeholder="Enter topics (comma-separated)"
                                value={formData.topics}
                                onChange={handleChange}
                                required
                                className="bg-gray-700 text-white border-gray-600 focus:border-cyan-500 focus:ring-cyan-500"
                            />
                        </motion.div>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <motion.div
                                initial={{ x: -30, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.8 }}
                            >
                                <label className="block text-sm font-medium text-gray-300 mb-1">Price (in Rupees)</label>
                                <Input
                                    name="priceInRupees"
                                    type="number"
                                    step="0.01"
                                    placeholder="Enter price in Rupees"
                                    value={formData.priceInRupees}
                                    onChange={handleChange}
                                    required
                                    className="bg-gray-700 text-white border-gray-600 focus:border-cyan-500 focus:ring-cyan-500"
                                />
                                {formData.priceInRupees && ethPrice && (
                                    <p className="text-sm text-cyan-400 mt-2">
                                        ≈ {(parseFloat(formData.priceInRupees) / ethPrice).toFixed(8)} ETH
                                    </p>
                                )}
                            </motion.div>
                            <motion.div
                                initial={{ x: 30, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.9 }}
                            >
                                <label className="block text-sm font-medium text-gray-300 mb-1">Owner Shares</label>
                                <Input
                                    name="ownerShares"
                                    type="number"
                                    min="51"
                                    max="100"
                                    placeholder="Enter owner shares (51-100)"
                                    value={formData.ownerShares}
                                    onChange={handleChange}
                                    required
                                    className="bg-gray-700 text-white border-gray-600 focus:border-cyan-500 focus:ring-cyan-500"
                                />
                            </motion.div>
                        </div>
                        <motion.div
                            initial={{ y: 30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 1 }}
                            className="bg-gray-700 p-6 rounded-xl border border-gray-600"
                        >
                            <label className="block text-lg font-medium text-gray-300 mb-3 flex items-center">
                                <Upload className="mr-2" size={24} />
                                Upload Course Video
                            </label>
                            <Input
                                type="file"
                                accept="video/*"
                                onChange={handleVideoChange}
                                required
                                className="bg-gray-600 text-white border-gray-500 focus:border-cyan-500 focus:ring-cyan-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cyan-50 file:text-cyan-700 hover:file:bg-cyan-100"
                            />
                        </motion.div>
                        <motion.div
                            initial={{ y: 30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 1.1 }}
                        >
                            <Button
                                type="submit"
                                className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold py-4 rounded-xl transition duration-300 text-lg shadow-lg"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Creating Course...' : 'Create Course'}
                            </Button>
                        </motion.div>
                    </form>
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default AddCourse;
