import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../services/api';
import { isAdmin as checkIsAdmin, decodeJWT } from '../utils/jwtUtils';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAdminUser, setIsAdminUser] = useState(false);

    useEffect(() => {
        // Check if user is logged in on mount
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (token && storedUser) {
            try {
                const userData = JSON.parse(storedUser);
                setUser(userData);
                // Check if user has admin role
                setIsAdminUser(checkIsAdmin(token));
            } catch (error) {
                console.error('Error parsing user data:', error);
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            }
        }
        setLoading(false);
    }, []);

    // Login using authAPI
    const login = async (email, password) => {
        try {
            console.log('Logging in user:', email);

            const response = await authAPI.login({ email, password });

            if (response.data && response.data.token) {
                const userData = {
                    email,
                    userName: response.data.userName || email.split('@')[0],
                    token: response.data.token
                };

                setUser(userData);

                // Check if user is admin
                const isAdmin = checkIsAdmin(response.data.token);
                setIsAdminUser(isAdmin);

                return {
                    success: true,
                    message: 'Login successful!',
                    user: userData,
                    isAdmin: isAdmin
                };
            } else {
                throw new Error('No token received from server');
            }
        } catch (error) {
            console.error('Login error:', error);

            let errorMessage = error.response?.data?.message || error.message;

            if (errorMessage.includes('401') || errorMessage.includes('Unauthorized')) {
                errorMessage = 'Invalid email or password';
            } else if (errorMessage.includes('NotVerifiedMailException') || errorMessage.includes('not verified')) {
                errorMessage = 'Email not verified. Please check your email for verification code.';
            }

            return {
                success: false,
                message: errorMessage
            };
        }
    };

    // Signup using authAPI
    const signup = async (userData) => {
        try {
            console.log('Signing up user:', userData);

            const response = await authAPI.signUp(userData);

            localStorage.setItem('verificationEmail', userData.email);

            return {
                success: true,
                message: response.data?.message || 'Account created successfully! Please verify your email.',
                email: userData.email
            };
        } catch (error) {
            console.error('Signup error:', error);

            let errorMessage = error.response?.data?.message || error.message;

            if (errorMessage.includes('EmailAlreadyExists') || errorMessage.includes('already exists')) {
                errorMessage = 'Email already exists. Please use a different email or login.';
            } else if (errorMessage.includes('UsernameAlreadyExists') || errorMessage.includes('username')) {
                errorMessage = 'Username already taken. Please choose another username.';
            } else if (errorMessage.includes('Repeat password') || errorMessage.includes('not match')) {
                errorMessage = 'Passwords do not match. Please make sure both passwords are identical.';
            }

            return {
                success: false,
                message: errorMessage || 'Signup failed. Please try again.'
            };
        }
    };

    // Verify email using authAPI
    const verifyEmail = async (email, pin) => {
        try {
            console.log('Verifying email:', email);

            const response = await authAPI.verifyEmail(email, pin);

            localStorage.removeItem('verificationEmail');

            return {
                success: true,
                message: response.data?.message || 'Email verified successfully!'
            };
        } catch (error) {
            console.error('Verify email error:', error);

            let errorMessage = error.response?.data?.message || error.message;

            if (errorMessage.includes('Invalid PIN') || errorMessage.includes('invalid')) {
                errorMessage = 'Invalid verification code. Please check and try again.';
            } else if (errorMessage.includes('AlreadyVerifiedEmail')) {
                errorMessage = 'Email already verified. Please login.';
            }

            return {
                success: false,
                message: errorMessage || 'Verification failed. Please try again.'
            };
        }
    };

    // Forgot password using authAPI
    const forgotPassword = async (email) => {
        try {
            const response = await authAPI.forgotPassword(email);

            return {
                success: true,
                message: response.data?.message || 'Password reset instructions sent to your email.'
            };
        } catch (error) {
            console.error('Forgot password error:', error);

            let errorMessage = error.response?.data?.message || error.message;

            return {
                success: false,
                message: errorMessage || 'Failed to send reset instructions.'
            };
        }
    };

    // Logout using authAPI
    const logout = async () => {
        try {
            await authAPI.logout();
        } catch (error) {
            console.warn('Logout error:', error);
        } finally {
            setUser(null);
            setIsAdminUser(false);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('verificationEmail');
        }
    };

    // Get user profile
    const getProfile = async () => {
        try {
            const response = await authAPI.getProfile();
            return { success: true, data: response.data };
        } catch (error) {
            console.error('Get profile error:', error);
            return {
                success: false,
                message: error.response?.data?.message || error.message
            };
        }
    };

    // Check if token is valid
    const checkAuth = async () => {
        if (!user || !user.token) {
            return false;
        }

        try {
            await getProfile();
            return true;
        } catch (error) {
            logout();
            return false;
        }
    };

    // Resend verification code
    const resendVerificationCode = async (email) => {
        try {
            const response = await authAPI.resendVerification(email);
            return {
                success: true,
                message: response.data?.message || 'Verification code resent successfully.'
            };
        } catch (error) {
            console.error('Resend verification error:', error);
            return {
                success: false,
                message: error.response?.data?.message || error.message
            };
        }
    };

    const value = {
        user,
        login,
        logout,
        signup,
        verifyEmail,
        forgotPassword,
        resendVerificationCode,
        getProfile,
        checkAuth,
        loading,
        isAuthenticated: !!user,
        isAdmin: isAdminUser
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};