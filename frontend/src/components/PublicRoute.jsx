import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

// Component to protect public routes (like login/register) from logged-in users
const PublicRoute = ({ children }) => {
  const username = localStorage.getItem("username");
  const token = localStorage.getItem("token");

  // Helper to clear invalid/expired data and allow access to public routes
  const clearAndRender = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("token");
    return children;
  };

  // If no username or token, render public content
  if (!username || !token) return clearAndRender();

  try {
    const decoded = jwtDecode(token);

    // If token is invalid or expired, clear and render public content
    if (
      !decoded.username ||
      decoded.username !== username ||
      decoded.exp * 1000 < Date.now()
    ) {
      return clearAndRender();
    }

    // If user is already logged in, redirect to chat
    return <Navigate to="/chat" replace />;
  } catch {
    // On decode error, clear and render public content
    return clearAndRender();
  }
};

export default PublicRoute;
