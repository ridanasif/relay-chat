import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const PublicRoute = ({ children }) => {
  const username = localStorage.getItem("username");
  const token = localStorage.getItem("token");

  const clearAndRender = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("token");
    return children;
  };

  if (!username || !token) return clearAndRender();

  try {
    const decoded = jwtDecode(token);

    if (
      !decoded.username ||
      decoded.username !== username ||
      decoded.exp * 1000 < Date.now()
    ) {
      return clearAndRender();
    }

    return <Navigate to="/chat" replace />;
  } catch {
    return clearAndRender();
  }
};

export default PublicRoute;
