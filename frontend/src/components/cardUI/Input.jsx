import React from 'react';
import { motion } from 'framer-motion';

const Input = ({ name, type = 'text', placeholder, value, onChange, required, accept, className = '' }) => {
    return (
        <motion.input
            className={`border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:ring focus:border-blue-300 ${className}`}
            name={name}
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            required={required}
            accept={accept}
            whileHover={{ scale: 1.03 }}
        />
    );
};

export default Input;
