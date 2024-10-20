import React, { useState, useEffect, useContext } from 'react';
import { ethers } from 'ethers';
import axios from '../axiosConfig';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { isAuthenticated } from '../context/authCheck';

const Login = () => {
    const [account, setAccount] = useState('');
    const [error, setError] = useState(null);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated()) {
            navigate("/");
        }
    }, [navigate]);

    const connectWallet = async () => {
        if (window.ethereum) {
            try {
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                setAccount(accounts[0]);
                handleLogin(accounts[0]);
            } catch (err) {
                setError('Failed to connect wallet.');
                console.error(err);
            }
        } else {
            setError('MetaMask is not installed.');
        }
    };

    const handleLogin = async (walletAddress) => {
        try {
            const message = `Logging in to LearnLedger with wallet: ${walletAddress}`;
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const signature = await signer.signMessage(message);

            const response = await axios.post('/auth/login', { walletAddress, signature });
            if (response.data.success) {
                const { token, expiresIn } = response.data;
                const expirationTime = new Date().getTime() + expiresIn * 1000;

                localStorage.setItem('jwtToken', token);
                localStorage.setItem('tokenExpiration', expirationTime.toString());
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

                login();  // Update the global auth state
                navigate('/');  // Redirect to home page

                // Set up automatic logout
                setTimeout(() => {
                    localStorage.removeItem('jwtToken');
                    localStorage.removeItem('tokenExpiration');
                    delete axios.defaults.headers.common['Authorization'];
                    login(false);  // Update the global auth state
                    navigate('/login');
                }, expiresIn * 1000);
            } else {
                setError('Login failed. Please try again.');
            }
        } catch (err) {
            setError('Failed to log in. Please try again.');
            console.error(err);
        }
    };


    return (
        <div className="flex justify-center items-center min-h-screen bg-black text-gray-100 relative overflow-hidden">
            {/* Shining animation background */}
            <div className="absolute inset-0 z-0">
                {[...Array(100)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute bg-white rounded-full"
                        style={{
                            width: Math.random() * 4 + 1,
                            height: Math.random() * 4 + 1,
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                        animate={{
                            opacity: [0, 1, 0],
                            scale: [0, 1, 0],
                        }}
                        transition={{
                            duration: Math.random() * 3 + 2,
                            repeat: Infinity,
                            repeatType: "reverse",
                            ease: "easeInOut",
                        }}
                    />
                ))}
            </div>

            <motion.div
                className="bg-gray-900 p-8 rounded-lg shadow-2xl w-full max-w-md z-10"
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h2 className="text-3xl font-bold mb-6 text-center text-cyan-400">Welcome to LearnLedger</h2>
                <p className="text-gray-300 mb-8 text-center">Unlock your learning potential with blockchain technology</p>
                <motion.button
                    onClick={connectWallet}
                    className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-6 py-3 rounded-full hover:from-cyan-600 hover:to-blue-600 transition duration-300 ease-in-out w-full font-semibold text-lg shadow-md"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    Connect with MetaMask
                </motion.button>
                {error && (
                    <motion.p
                        className="text-red-400 mt-4 text-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                    >
                        {error}
                    </motion.p>
                )}
            </motion.div>
        </div>
    );
};

export default Login;
