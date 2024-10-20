import React, { createContext, useState, useEffect, useCallback } from 'react';
import { isAuthenticated as checkAuth, clearAuthToken } from './authCheck';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState(checkAuth());

    const checkAndUpdateAuth = useCallback(() => {
        const isAuth = checkAuth();
        setAuth(isAuth);
        return isAuth;
    }, []);

    const login = useCallback(() => {
        setAuth(true);
    }, []);

    const logout = useCallback(() => {
        clearAuthToken();
        setAuth(false);
    }, []);

    useEffect(() => {
        const initialCheck = checkAndUpdateAuth();

        if (initialCheck) {
            const token = localStorage.getItem('jwtToken');
            const expiration = localStorage.getItem('tokenExpiration');

            if (token && expiration) {
                const timeUntilExpiration = parseInt(expiration) - new Date().getTime();

                if (timeUntilExpiration > 0) {
                    // Set up automatic logout
                    const logoutTimer = setTimeout(() => {
                        logout();
                    }, timeUntilExpiration);

                    // Clean up the timer if the component unmounts
                    return () => clearTimeout(logoutTimer);
                } else {
                    // Token has already expired
                    logout();
                }
            }
        }
    }, [checkAndUpdateAuth, logout]);

    return (
        <AuthContext.Provider value={{ auth, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};