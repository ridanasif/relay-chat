import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const ProtectedRoute = ({ children }) => {
  const username = localStorage.getItem("username");
  const token = localStorage.getItem("token");

  const logoutAndRedirect = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("token");
    return <Navigate to={"/login"} replace />;
  };

  if (!username || !token) return logoutAndRedirect();

  try {
    const decoded = jwtDecode(token);

    if (
      !decoded.username ||
      decoded.username !== username ||
      decoded.exp * 1000 < Date.now()
    ) {
      return logoutAndRedirect();
    }

    return children;
  } catch (err) {
    return logoutAndRedirect();
  }
};

export default ProtectedRoute;
