import { useEffect } from 'react';
import { validateToken, clearAuthData, redirectToLogin } from '../utils/authUtils';

// Hook to periodically validate authentication
export const useAuthValidation = (userType: 'staff' | 'parent', intervalMs: number = 300000) => { // 5 minutes default
  useEffect(() => {
    const validateAuth = async () => {
      const tokenKey = userType === 'staff' ? 'staff_access_token' : 'parent_access_token';
      const token = localStorage.getItem(tokenKey);
      
      if (token) {
        const isValid = await validateToken(token, userType);
        if (!isValid) {
          console.log(`${userType} token validation failed, redirecting to login...`);
          clearAuthData(userType);
          redirectToLogin(userType);
        }
      }
    };

    // Initial validation
    validateAuth();

    // Set up periodic validation
    const interval = setInterval(validateAuth, intervalMs);

    // Cleanup
    return () => clearInterval(interval);
  }, [userType, intervalMs]);
};

// Hook to validate on page focus (when user returns to tab)
export const useAuthOnFocus = (userType: 'staff' | 'parent') => {
  useEffect(() => {
    const handleFocus = async () => {
      const tokenKey = userType === 'staff' ? 'staff_access_token' : 'parent_access_token';
      const token = localStorage.getItem(tokenKey);
      
      if (token) {
        const isValid = await validateToken(token, userType);
        if (!isValid) {
          console.log(`${userType} token validation failed on focus, redirecting to login...`);
          clearAuthData(userType);
          redirectToLogin(userType);
        }
      }
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        handleFocus();
      }
    });

    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleFocus);
    };
  }, [userType]);
};
