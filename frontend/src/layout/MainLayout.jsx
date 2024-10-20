// src/layouts/MainLayout.jsx

import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';

const MainLayout = () => {
    return (
        <div>
            {/* Navbar will be persistent across all routes */}
            <Navbar />

            {/* This is where child routes will be rendered */}
            <main>
                <Outlet />
            </main>
        </div>
    );
};

export default MainLayout;
