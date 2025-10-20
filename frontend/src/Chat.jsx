import { io } from "socket.io-client";
import { Loader, Rocket, Search } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import MessageCard from "./components/MessageCard";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import UserItem from "./components/UserItem";

const Chat = () => {
  const API_URL = import.meta.env.VITE_API_URL;

  const socket = useRef(null);
  const bottomDivRef = useRef(null);

  const myUsername = localStorage.getItem("username");

  const navigate = useNavigate();
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [activeUsers, setActiveUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [search, setSearch] = useState("");

  const setMessageText = (e) => {
    setMessage(e.target.value);
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API_URL}/users`);
      setUsers(response.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  const filterUsers = (e) => {
    setSearch(e.target.value);
  };

  useEffect(() => {
    axios.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${localStorage.getItem("token")}`;
    socket.current = io(API_URL, {
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
    });

    const handleConnect = () => {
      socket.current?.emit("register", localStorage.getItem("username"));
    };
    const handleMessage = (msg) => {
      setMessages((prev) => [...prev, msg]);
    };
    const handleActiveUsersUpdate = (allActiveUsers) => {
      setActiveUsers(allActiveUsers);
    };

    socket.current?.on("connect", handleConnect);
    socket.current?.on("activeUsersUpdate", handleActiveUsersUpdate);
    socket.current?.on("message", handleMessage);

    // Fetch all users except the logged in user
    fetchUsers();

    // Cleanup function
    return () => {
      socket.current?.off("connect", handleConnect);
      socket.current?.off("activeUsersUpdate", handleActiveUsersUpdate);
      socket.current?.off("message", handleMessage);
      socket.current?.disconnect();
    };
  }, []);

  // Scroll to bottom
  useEffect(() => {
    bottomDivRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    setMessages([]);
    async function getMessages() {
      try {
        const response = await axios.get(`${API_URL}/messages`, {
          params: { userTwo: selectedUser?.username },
        });
        setMessages(response.data.data);
        setMessagesLoading(false);
      } catch (err) {}
    }
    if (!selectedUser) return;
    setMessagesLoading(true);
    getMessages();
  }, [selectedUser]);

  const sendMessage = () => {
    if (!message.trim() || !socket.current?.connected || !selectedUser) return;
    socket.current?.emit("message", {
      from: myUsername,
      to: selectedUser?.username,
      message,
    });
    setMessage("");
  };

  const filteredUsers = users.filter((u) =>
    u.username.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full h-screen bg-gray-100 grid grid-cols-4 overflow-hidden">
      <div className="flex flex-col h-screen bg-white col-span-1 border-r-1 border-gray-200">
        <header className="w-full py-4 px-5 flex flex-col gap-5">
          <h1 className="text-3xl font-semibold">Messages</h1>
          <div className="flex bg-gray-100 px-5 rounded-md justify-between items-center">
            <input
              type="text"
              placeholder="Search..."
              className="py-3 outline-0 placeholder-gray-500"
              onChange={filterUsers}
            />
            <Search className="text-gray-500" />
          </div>
        </header>
        <main
          className={`flex-1 overflow-y-auto space-y-5 ${
            filteredUsers.length < 1 && "flex justify-center"
          }`}
        >
          {filteredUsers.length > 0 ? (
            filteredUsers.map(function (user) {
              const username = user.username;
              return (
                <UserItem
                  key={username}
                  user={user}
                  isSelectedUser={selectedUser?.username === username}
                  isUserOnline={activeUsers.includes(username)}
                  onClick={() => {
                    setSelectedUser(user);
                  }}
                />
              );
            })
          ) : (
            <>
              <p>No users found.</p>
            </>
          )}
        </main>
        <footer className="py-5 px-5 flex justify-center items-center">
          <button
            className="bg-gradient-to-br from-pink-700 to-pink-500 text-center py-2 outline-0 w-full rounded-md text-white cursor-pointer hover:from-pink-800 hover:to-pink-900 transition-colors"
            onClick={() => {
              localStorage.removeItem("username");
              localStorage.removeItem("token");
              if (socket.current?.connected) {
                socket.current?.disconnect();
              }
              navigate("/login", { replace: true });
            }}
          >
            Log Out
          </button>
        </footer>
      </div>
      <div className="flex flex-col h-screen col-span-3">
        {selectedUser && (
          <header className="w-full px-10 py-2 bg-white border-b-1 border-b-gray-200">
            <h3 className="text-3xl font-semibold">{selectedUser?.fullname}</h3>
            <span className="text-gray-500">@{selectedUser?.username}</span>
          </header>
        )}
        <main
          className={`flex-1 flex transition-all ${
            selectedUser && !messagesLoading
              ? "flex-col p-5 gap-y-5 overflow-y-scroll"
              : "flex-col justify-center items-center"
          }`}
        >
          {selectedUser && !messagesLoading ? (
            <>
              {messages
                .filter(
                  (m) =>
                    (m.from === myUsername &&
                      m.to === selectedUser?.username) ||
                    (m.from === selectedUser?.username && m.to === myUsername)
                )
                .map(function (m, index) {
                  return (
                    <MessageCard
                      key={index}
                      messageItem={m}
                      isReceiver={m.from !== myUsername}
                    />
                  );
                })}
              <div ref={bottomDivRef}></div>
            </>
          ) : messagesLoading ? (
            <>
              <Loader size={48} className="text-neutral-700 animate-spin" />
            </>
          ) : (
            <>
              <Rocket size={48} className="text-neutral-700" />
              <h1 className="self-center text-center text-3xl text-neutral-700 font-medium">
                Welcome to Relay!
              </h1>
              <p className="font-thin text-neutral-700 text-sm">
                Select a chat to start messaging.
              </p>
            </>
          )}
        </main>
        <footer className="w-full py-4 px-10 bg-white flex gap-x-3 border-t-1 border-gray-200">
          <input
            type="text"
            placeholder="Write a message"
            value={message}
            onChange={setMessageText}
            onKeyDown={(e) => {
              if (e.key === "Enter" && selectedUser) {
                sendMessage();
              }
            }}
            className="w-full outline-0 py-2 px-5"
            disabled={!selectedUser}
          />
          <button
            onClick={sendMessage}
            disabled={!selectedUser}
            className="bg-violet-500 disabled:opacity-30 self-center px-5 py-2 rounded-full text-white font-bold enabled:cursor-pointer enabled:hover:bg-violet-600 transition-colors"
          >
            <Rocket />
          </button>
        </footer>
      </div>
    </div>
  );
};

export default Chat;
