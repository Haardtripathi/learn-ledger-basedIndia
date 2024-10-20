import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { auth, logout } = useContext(AuthContext); // Consume auth and logout from AuthContext
    const [account, setAccount] = useState(null); // State for the connected account address
    const navigate = useNavigate();

    // Function to connect to MetaMask and retrieve the account
    const connectWallet = async () => {
        if (window.ethereum) {
            try {
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                setAccount(accounts[0]); // Set the first account
            } catch (error) {
                console.error('Error connecting to MetaMask:', error);
            }
        } else {
            console.error('MetaMask is not installed.');
        }
    };

    // Automatically connect if MetaMask is already connected
    useEffect(() => {
        const checkConnectedWallet = async () => {
            if (window.ethereum) {
                const accounts = await window.ethereum.request({ method: 'eth_accounts' });
                if (accounts.length > 0) {
                    setAccount(accounts[0]); // Set the connected account
                }
            }
        };
        checkConnectedWallet();
    }, []);

    const handleLogout = () => {
        logout(); // Trigger logout from AuthContext
        navigate('/auth/login'); // Navigate to login page without refreshing
    };

    return (
        <nav className="bg-black text-gray-100 p-4 shadow-lg sticky top-0 z-20">
            <div className="container mx-auto relative z-20">
                <div className="flex justify-between items-center">
                    <h1 className="text-cyan-400 font-bold text-3xl font-sans">
                        <Link to="/">LearnLedger</Link>
                    </h1>
                    <div className="hidden md:flex space-x-6">
                        <NavLinks
                            auth={auth}
                            handleLogout={handleLogout}
                            account={account}
                            connectWallet={connectWallet}
                        />
                    </div>
                    <div className="md:hidden">
                        <button onClick={() => setIsOpen(!isOpen)} className="text-gray-100 focus:outline-none">
                            <svg className="h-6 w-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                <path d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}></path>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
            {isOpen && (
                <div className="md:hidden bg-gray-900">
                    <NavLinks
                        mobile={true}
                        auth={auth}
                        handleLogout={handleLogout}
                        account={account}
                        connectWallet={connectWallet}
                    />
                </div>
            )}
        </nav>
    );
};

const NavLinks = ({ mobile = false, auth, handleLogout, account, connectWallet }) => {
    const linkClass = `text-gray-300 hover:text-cyan-400 transition duration-300 ease-in-out ${mobile ? 'block py-2' : ''}`;

    return (
        <ul className={`${mobile ? 'flex flex-col space-y-2' : 'flex space-x-6'} relative z-30`}>
            {auth ? (
                <>
                    {/* Wallet Address with Icon */}
                    <li className="flex items-center transition-transform duration-500 hover:scale-105">
                        {account ? (
                            <span className="flex items-center space-x-2">
                                {/* Wallet Icon */}
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5 text-cyan-400"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M4 7h16M4 7a2 2 0 00-2 2v6a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2M4 7V5a2 2 0 012-2h12a2 2 0 012 2v2M16 11h.01"
                                    />
                                </svg>
                                <span className={linkClass}>
                                    {account.substring(0, 6)}...{account.slice(-4)}
                                </span>
                            </span>
                        ) : (
                            <button onClick={connectWallet} className={linkClass}>
                                Connect Wallet
                            </button>
                        )}
                    </li>
                    {/* Home link */}
                    <li>
                        <Link to="/" className={`${linkClass} transition-transform duration-500 hover:scale-105`}>Home</Link>
                    </li>
                    {/* Courses link */}
                    <li>
                        <Link to="/courses" className={`${linkClass} transition-transform duration-500 hover:scale-105`}>Courses</Link>
                    </li>
                    <li>
                        <Link to="/add-course" className={`${linkClass} transition-transform duration-500 hover:scale-105`}>Add Course</Link>
                    </li>
                    {/* Logout button */}
                    <li>
                        <button onClick={handleLogout} className={`${linkClass} transition-transform duration-500 hover:scale-105`}>Logout</button>
                    </li>
                </>
            ) : (
                <li>
                    <Link to="/auth/login" className={linkClass}>Log In</Link>
                </li>
            )}
        </ul>
    );
};

export default Navbar;
