import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Loader, Lock, Rocket, User } from "lucide-react";
import FormField from "./components/FormField";
import axios from "axios";

const AuthForm = ({ mode = "login" }) => {

  const API_URL = import.meta.env.VITE_API_URL;

  const navigate = useNavigate();

  const isLogin = mode === "login";

  const [formData, setFormData] = useState(
    isLogin
      ? { username: "", password: "" }
      : { fullname: "", username: "", password: "" }
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (
      (isLogin && (!formData.username || !formData.password)) ||
      (!isLogin &&
        (!formData.fullname || !formData.username || !formData.password))
    ) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);

    try {
      const url = `${API_URL}/auth/${isLogin ? "login" : "register"}`;
      const response = await axios.post(url, formData);

      if (response.data.success) {
        const { token, username } = response.data.data;
        localStorage.setItem("username", username);
        localStorage.setItem("token", token);
        navigate("/chat");
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      if (err.response) setError(err.response.data.message);
      else if (err.request) setError("Network error, no response received");
      else setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full p-5 min-h-screen bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-500 flex flex-col gap-y-5 justify-center items-center">
      <div className="flex justify-center flex-col items-center gap-y-2 text-white">
        <h1 className="text-white font-semibold text-5xl tracking-tight gap-x-3 flex items-center">
          Relay <Rocket size={48} strokeWidth={2.5} />
        </h1>
        <p className="font-light text-lg">Your Messages, Your Moment.</p>
      </div>

      <div className="w-96 bg-white px-5 py-10 rounded-sm shadow-xl flex flex-col gap-y-5 justify-around">
        <h2 className="text-2xl font-medium">
          {isLogin ? "Log In" : "Sign Up"}
        </h2>
        {error && (
          <div className="bg-pink-500 text-white px-3 py-3 rounded-md">
            {error}
          </div>
        )}

        <form method="POST" className="space-y-5" onSubmit={handleSubmit}>
          {!isLogin && (
            <FormField
              label="Full Name"
              value={formData.fullname}
              inputType="text"
              placeHolderText="Enter your name"
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, fullname: e.target.value }))
              }
              Icon={<User className="text-gray-500" />}
            />
          )}

          <FormField
            label="Username"
            inputType="text"
            placeHolderText={
              isLogin ? "Enter your username" : "Create a username"
            }
            value={formData.username}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, username: e.target.value }))
            }
            Icon={<span className="text-lg text-gray-500">@</span>}
          />

          <FormField
            label="Password"
            value={formData.password}
            inputType="password"
            placeHolderText={
              isLogin ? "Enter your password" : "Create a password"
            }
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, password: e.target.value }))
            }
            Icon={<Lock className="text-gray-500" />}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-violet-500 hover:bg-violet-600 transition-colors cursor-pointer py-3 rounded-md text-white flex justify-center items-center"
          >
            {loading ? (
              <Loader className="animate-spin" />
            ) : isLogin ? (
              "Log In"
            ) : (
              "Sign Up"
            )}
          </button>
        </form>

        <span className="text-center">
          {isLogin ? (
            <>
              Don't have an account?{" "}
              <Link to="/register" className="text-blue-500">
                Sign Up
              </Link>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <Link to="/login" className="text-blue-500">
                Log In
              </Link>
            </>
          )}
        </span>
      </div>
    </div>
  );
};

export default AuthForm;
