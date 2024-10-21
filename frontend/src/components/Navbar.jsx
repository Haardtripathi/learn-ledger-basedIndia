import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { auth, logout } = useContext(AuthContext);
    const [account, setAccount] = useState(null);
    const navigate = useNavigate();

    const connectWallet = async () => {
        if (window.ethereum) {
            try {
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                setAccount(accounts[0]);
            } catch (error) {
                console.error('Error connecting to MetaMask:', error);
            }
        } else {
            console.error('MetaMask is not installed.');
        }
    };

    useEffect(() => {
        const checkConnectedWallet = async () => {
            if (window.ethereum) {
                const accounts = await window.ethereum.request({ method: 'eth_accounts' });
                if (accounts.length > 0) {
                    setAccount(accounts[0]);
                }
            }
        };
        checkConnectedWallet();
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/auth/login');
    };

    return (
        <nav className="bg-black text-gray-100 p-4 shadow-lg sticky top-0 z-20">
            <div className="container mx-auto">
                <div className="flex justify-between items-center">
                    <div className="flex items-center">
                        <div className="w-12 h-12 mr-2">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 200 100"
                                className="w-full h-full"
                            >
                                <defs>
                                    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" style={{ stopColor: "#22d3ee", stopOpacity: 1 }} />
                                        <stop offset="100%" style={{ stopColor: "#0ea5e9", stopOpacity: 1 }} />
                                    </linearGradient>
                                </defs>
                                <path
                                    d="M30 70 L50 30 L70 70 L90 50 L110 70"
                                    fill="none"
                                    stroke="url(#grad)"
                                    strokeWidth="8"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </div>
                        <h1 className="text-cyan-400 font-bold text-2xl font-sans">
                            <Link to="/">LearnLedger</Link>
                        </h1>
                    </div>
                    <div className="hidden md:flex items-center space-x-6">
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
                <div className="md:hidden bg-gray-900 mt-2">
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
        <ul className={`${mobile ? 'flex flex-col space-y-2' : 'flex items-center space-x-6'} relative z-30`}>
            {auth ? (
                <>
                    <li className="flex items-center transition-transform duration-500 hover:scale-105">
                        {account ? (
                            <span className="flex items-center space-x-2">
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
                    <li>
                        <Link to="/" className={`${linkClass} transition-transform duration-500 hover:scale-105`}>Home</Link>
                    </li>
                    <li>
                        <Link to="/courses" className={`${linkClass} transition-transform duration-500 hover:scale-105`}>Courses</Link>
                    </li>
                    <li>
                        <Link to="/add-course" className={`${linkClass} transition-transform duration-500 hover:scale-105`}>Add Course</Link>
                    </li>
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