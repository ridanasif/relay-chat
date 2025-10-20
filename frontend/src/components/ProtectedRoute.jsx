import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

// Component to protect routes that require authentication
const ProtectedRoute = ({ children }) => {
  const username = localStorage.getItem("username");
  const token = localStorage.getItem("token");

  // Helper to clear localStorage and redirect to login
  const logoutAndRedirect = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("token");
    return <Navigate to={"/login"} replace />;
  };

  // If no username or token, redirect
  if (!username || !token) return logoutAndRedirect();

  try {
    const decoded = jwtDecode(token);

    // Validate token contents and expiration
    if (
      !decoded.username ||
      decoded.username !== username ||
      decoded.exp * 1000 < Date.now()
    ) {
      return logoutAndRedirect();
    }

    // Token is valid; render protected content
    return children;
  } catch (err) {
    // If decoding fails, logout and redirect
    return logoutAndRedirect();
  }
};

export default ProtectedRoute;
