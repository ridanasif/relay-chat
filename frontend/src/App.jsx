import { Rocket } from "lucide-react";
import { Link } from "react-router-dom";

const App = () => {
  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-500">
      <header className="w-full flex px-10 py-5 items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-white tracking-tight flex gap-x-3 items-center">
            Relay <Rocket size={32} strokeWidth={2.5} />
          </h1>
        </div>
        <div>
          <Link
            to={"/login"}
            className="text-white py-2 px-5 cursor-pointer hover:text-white/80 transition-colors"
          >
            Log In
          </Link>
          <Link
            to={"/register"}
            className="px-5 py-2 bg-white rounded-md text-violet-600 font-semibold shadow-sm cursor-pointer hover:scale-105 transition-transform"
          >
            Sign Up
          </Link>
        </div>
      </header>

      <div className="w-full text-center  items-center flex flex-col absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 space-y-8">
        <h1 className="flex gap-x-3 items-center text-7xl text-white font-semibold">
          Chatting made simple.
        </h1>
        <p className="text-white text-center text-lg">
          Connect with anyone, anywhere. Relay makes messaging <br />
          effortless and beautiful.
        </p>
        <Link
          to="/chat"
          className="px-10 py-3 text-xl self-center bg-white rounded-md text-violet-600 font-semibold shadow-sm cursor-pointer hover:scale-105 transition-transform"
        >
          Start Chatting
        </Link>
      </div>
    </div>
  );
};
export default App;
