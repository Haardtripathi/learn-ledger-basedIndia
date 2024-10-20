// src/utils/authCheck.js

export const isAuthenticated = () => {
    const token = localStorage.getItem('jwtToken');
    const expiration = localStorage.getItem('tokenExpiration');

    if (token && expiration) {
        const currentTime = new Date().getTime();
        if (currentTime < parseInt(expiration)) {
            return true; // User is authenticated and token is not expired
        } else {
            // Token has expired, clean up
            localStorage.removeItem('jwtToken');
            localStorage.removeItem('tokenExpiration');
            return false;
        }
    }
    return false; // No token or expiration found
};

export const isNotAuthenticated = () => {
    return !isAuthenticated(); // If the user is not authenticated
};

export const setAuthToken = (token, expiresIn) => {
    const expirationTime = new Date().getTime() + expiresIn * 1000;
    localStorage.setItem('jwtToken', token);
    localStorage.setItem('tokenExpiration', expirationTime.toString());
};

export const clearAuthToken = () => {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('tokenExpiration');
};