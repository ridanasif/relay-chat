import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";
import Chat from "./Chat.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import PublicRoute from "./components/PublicRoute.jsx";
import AuthForm from "./AuthForm.jsx";

createRoot(document.getElementById("root")).render(
  <Router>
    <Routes>
      <Route path="/" element={<App />} />
      <Route
        path="/login"
        element={
          <PublicRoute>
            <AuthForm mode="login" />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <AuthForm mode="register" />
          </PublicRoute>
        }
      />
      <Route
        path="/chat"
        element={
          <ProtectedRoute>
            <Chat />
          </ProtectedRoute>
        }
      />
    </Routes>
  </Router>
);
