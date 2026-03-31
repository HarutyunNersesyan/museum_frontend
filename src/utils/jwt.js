/**
 * JWT Utility Functions
 * For client-side token decoding (not verification)
 */

/**
 * Decode JWT token without verification
 * Only for client-side display purposes
 */
export const decodeJWT = (token) => {
    try {
        if (!token) return null;

        // Split the token into parts
        const parts = token.split('.');
        if (parts.length !== 3) {
            console.error('Invalid token format');
            return null;
        }

        // Decode the payload (second part)
        const payload = parts[1];

        // Base64 decode (handle URL-safe base64)
        const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
        const decodedPayload = decodeBase64(base64);

        // Parse JSON
        return JSON.parse(decodedPayload);
    } catch (error) {
        console.error('Error decoding JWT:', error);
        return null;
    }
};

/**
 * Base64 decode helper
 */
const decodeBase64 = (base64) => {
    try {
        // Try regular atob first
        return atob(base64);
    } catch (e) {
        // Handle Unicode characters
        const binaryString = atob(base64);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        return new TextDecoder().decode(bytes);
    }
};

/**
 * Check if token is expired
 */
export const isTokenExpired = (token) => {
    const payload = decodeJWT(token);
    if (!payload || !payload.exp) return true;

    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp < currentTime;
};

/**
 * Get roles from token
 */
export const getRolesFromToken = (token) => {
    const payload = decodeJWT(token);
    return payload?.roles || [];
};

/**
 * Check if user has specific role
 */
export const hasRole = (token, role) => {
    const roles = getRolesFromToken(token);
    return roles.includes(role);
};

/**
 * Check if user is admin
 */
export const isAdmin = (token) => {
    return hasRole(token, 'ADMIN');
};

/**
 * Check if user is regular user
 */
export const isUser = (token) => {
    return hasRole(token, 'USER');
};

/**
 * Get user email from token
 */
export const getEmailFromToken = (token) => {
    const payload = decodeJWT(token);
    return payload?.sub || payload?.email || null;
};

/**
 * Get username from token
 */
export const getUsernameFromToken = (token) => {
    const payload = decodeJWT(token);
    return payload?.username || payload?.userName || null;
};

/**
 * Get token expiration time
 */
export const getTokenExpiration = (token) => {
    const payload = decodeJWT(token);
    return payload?.exp || null;
};

/**
 * Check if token is valid and not expired
 */
export const isValidToken = (token) => {
    if (!token) return false;
    return !isTokenExpired(token);
};

export default {
    decodeJWT,
    isTokenExpired,
    getRolesFromToken,
    hasRole,
    isAdmin,
    isUser,
    getEmailFromToken,
    getUsernameFromToken,
    getTokenExpiration,
    isValidToken
};