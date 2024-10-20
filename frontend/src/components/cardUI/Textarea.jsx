import React from 'react';
import { motion } from 'framer-motion';

const Textarea = ({ name, placeholder, value, onChange, required, className = '' }) => {
    return (
        <motion.textarea
            className={`border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:ring focus:border-blue-300 ${className}`}
            name={name}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            required={required}
            rows="4"
            whileHover={{ scale: 1.03 }}
        />
    );
};

export default Textarea;
