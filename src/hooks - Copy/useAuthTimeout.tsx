// import { useState, useEffect } from "react";
// import { useIdleTimer } from "react-idle-timer";
// import { useNavigate } from "react-router-dom";
// import { useAppDispatch, useAppSelector } from "../store/hook";
// import { signOut } from "../store/slices/authSlice";
// import { toast } from "react-toastify";
// import jwt_decode from "jwt-decode";

// interface TokenData {
//   exp: number;
//   [key: string]: any;
// }

// interface UseAuthTimeoutProps {
//   onIdle?: () => void;
//   idleTime?: number; // in minutes
//   refreshToken?: () => Promise<string>; // function to get new token
// }

// const useAuthTimeout = ({ 
//   onIdle, 
//   idleTime = 30, // default 30 minutes
//   refreshToken 
// }: UseAuthTimeoutProps) => {
//     const navigate = useNavigate();
//     const dispatch = useAppDispatch();
//     const { token } = useAppSelector(state => state.auth);
//     const [isIdle, setIdle] = useState(false);
//     const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

//     // Function to handle token refresh
//     const handleTokenRefresh = async () => {
//         try {
//             if (refreshToken) {
//                 const newToken = await refreshToken();
//                 // Update token in your state management (Redux, etc.)
//                 return true;
//             }
//             return false;
//         } catch (error) {
//             console.error('Token refresh failed:', error);
//             return false;
//         }
//     };

//     // Function to check token expiration
//     const checkTokenExpiration = async () => {
//         if (!token) {
//             handleLogout();
//             return;
//         }

//         try {
//             const decodedToken = jwt_decode<TokenData>(token);
//             const currentTime = Date.now() / 1000;
//             const timeUntilExpiry = decodedToken.exp - currentTime;

//             // If token is expired, try to refresh or logout
//             if (timeUntilExpiry <= 0) {
//                 const refreshSuccess = await handleTokenRefresh();
//                 if (!refreshSuccess) {
//                     handleLogout();
//                 }
//                 return;
//             }

//             // If token will expire in next 5 minutes, try to refresh
//             if (timeUntilExpiry < 300) { // 5 minutes in seconds
//                 await handleTokenRefresh();
//             }

//             // Set timeout to check again before token expires
//             if (timeoutId) clearTimeout(timeoutId);
//             const newTimeoutId = setTimeout(
//                 checkTokenExpiration, 
//                 (timeUntilExpiry - 60) * 1000 // Check 1 minute before expiry
//             );
//             setTimeoutId(newTimeoutId);

//         } catch (error) {
//             console.error('Token validation failed:', error);
//             handleLogout();
//         }
//     };

//     // Handle user idle state
//     const handleIdle = () => {
//         setIdle(true);
//         handleLogout();
//     };

//     // Handle user activity
//     const handleActivity = async () => {
//         if (isIdle) {
//             const refreshSuccess = await handleTokenRefresh();
//             if (refreshSuccess) {
//                 setIdle(false);
//             } else {
//                 handleLogout();
//             }
//         }
//     };

//     // Logout function
//     const handleLogout = () => {
//         dispatch(signOut());
//         toast.info('Session expired. Please login again.');
//         navigate('/login');
//     };

//     // Initialize idle timer
//     const idleTimer = useIdleTimer({
//         timeout: 1000 * 60 * idleTime,
//         onIdle: handleIdle,
//         onActive: handleActivity,
//         debounce: 500
//     });

//     // Effect to start token expiration check
//     useEffect(() => {
//         checkTokenExpiration();
//         return () => {
//             if (timeoutId) clearTimeout(timeoutId);
//         };
//     }, [token]);

//     return {
//         isIdle,
//         setIdle,
//         idleTimer,
//         refreshToken: handleTokenRefresh
//     };
// };

// export default useAuthTimeout;