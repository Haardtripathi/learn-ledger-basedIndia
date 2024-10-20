import React from 'react';

const CardHeader = ({ children }) => {
    return (
        <div className="border-b pb-2 mb-4">
            {children}
        </div>
    );
};

export default CardHeader;
