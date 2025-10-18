import { Rocket } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import MessageCard from "./components/MessageCard";

const socket = io("http://localhost:5050");

if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    socket.close();
  });
}

function App() {
  const messagesEndRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  const setMessageText = (e) => {
    setMessage(e.target.value);
  };

  useEffect(() => {
    const username = prompt("Enter your name:");
    if (!username?.trim()) {
      socket.close();
      return;
    }

    socket.emit("register", username);
    const handleHistory = (msgs) => setMessages(msgs);
    const handleMessage = (msg) => setMessages((prev) => [...prev, msg]);

    socket.on("history", handleHistory);
    socket.on("message", handleMessage);

    // Cleanup function
    return () => {
      socket.off("history", handleHistory);
      socket.off("message", handleMessage);
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "auto",
    });
  }, [messages]);

  const sendMessage = () => {
    if (!message.trim() || !socket.connected) return;
    socket.emit("message", message);
    setMessage("");
  };

  return (
    <div className="w-full h-full bg-gray-100 flex flex-col">
      <main className="flex-1 flex flex-col p-5 gap-y-5 overflow-y-auto">
        {messages.map(function (m, index) {
          return (
            <MessageCard
              key={index}
              messageItem={m}
              isReceiver={m.id !== socket.id}
            />
          );
        })}
        <div ref={messagesEndRef}></div>
      </main>
      <footer className="w-full py-5 px-10 bg-white flex gap-x-10">
        <input
          type="text"
          placeholder="Type something..."
          value={message}
          onChange={setMessageText}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              sendMessage();
            }
          }}
          className="w-full outline-0 py-2 px-5 ring-1 ring-gray-200 rounded-md"
        />
        <button
          onClick={sendMessage}
          className="bg-violet-500 self-center px-5 py-2 rounded-full text-white font-bold cursor-pointer hover:bg-violet-600 transition-colors"
        >
          <Rocket />
        </button>
      </footer>
    </div>
  );
}
export default App;
