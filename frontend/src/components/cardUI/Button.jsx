import React from 'react';
import { motion } from 'framer-motion';

const Button = ({ children, type = 'button', className = '', onClick }) => {
    return (
        <motion.button
            type={type}
            className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${className}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
        >
            {children}
        </motion.button>
    );
};

export default Button;

