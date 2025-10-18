import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5050");

if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    socket.close();
  });
}

function App() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  const setMessageText = (e) => {
    setMessage(e.target.value);
  };

  useEffect(() => {
    const username = prompt("Enter your name:");
    const handleHistory = (msgs) => setMessages(msgs.reverse());
    const handleMessage = (msg) => setMessages((prev) => [msg, ...prev]);
    socket.emit("register", username);

    socket.on("history", handleHistory);
    socket.on("message", handleMessage);

    // Cleanup function
    return () => {
      socket.off("history", handleHistory);
      socket.off("message", handleMessage);
    };
  }, []);

  const sendMessage = () => {
    if (!message.trim()) return;
    socket.emit("message", message);
    setMessage("");
  };

  return (
    <>
      <input
        type="text"
        placeholder="Enter something..."
        value={message}
        onChange={setMessageText}
      />
      <button onClick={sendMessage}>Send</button>
      {messages.map(function (m, i) {
        return (
          <p key={i}>
            <b>{m.user}: </b>
            {m.message}
          </p>
        );
      })}
    </>
  );
}
export default App;
