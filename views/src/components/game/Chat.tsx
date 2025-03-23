import { useContext, useEffect, useRef, useState } from "react";
import { useUser } from "../../context/UserContext";
import { SocketContext } from "../../context/socket";
import { SendIcon } from "lucide-react"

type Message = {
  content: string;
  sender: string | undefined;
  sentAt: Date;
};

const Chat = ({gameId}: {gameId: string | undefined}) => {
  const { user } = useUser();
  const socket = useContext(SocketContext);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    const getChat = async () => {
      const response = await fetch(`${!import.meta.env.VITE_API_URL || import.meta.env.VITE_API_URL === "undefined" ? "":import.meta.env.VITE_API_URL}/api/chat/${gameId}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      const data = await response.json();
      setMessages(data?.chat?.messages ?? []);
    };
    getChat();
  }, [gameId]);

  const sendMessage = () => {
    socket.emit("send-message", {
      content: message,
      sender: user?.username,
      gameId,
      sentAt: new Date(Date.now())
    });
    setMessages((prev) => [...prev, { content: message, sender: user?.username, sentAt: new Date(Date.now()) }]);
    setMessage("")
  };

  useEffect(() => {
    const handleMessageReceived = ({ content, sender, sentAt }: Message) => {
      setMessages((prev) => [...prev, { content, sender, sentAt }]);
    };
    socket.on("message-received", handleMessageReceived);

    return () => {
      socket.off("message-received", handleMessageReceived);
    };
  }, [socket]);

  const formatTime = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto space-y-2 p-3">
        {messages.map((msg, index) => (
          <div key={index} className={`flex items-end ${msg.sender === user?.username ? "justify-end" : "justify-start"}`}>
            <div className={
              `max-w-xs px-3 py-2 rounded-lg text-sm ${msg.sender === user?.username ? "bg-amber-700 text-amber-100" : "bg-amber-900 text-amber-300"}`
            }>
              <p>{msg.content}</p>
              <p className="text-xs text-amber-100/60 mt-1 text-right">{formatTime(msg.sentAt)}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form
        className="flex items-center border-t border-amber-500/20 p-2"
        onSubmit={(e) => {
          e.preventDefault()
          sendMessage()
        }}
      >
        <input
          type="text"
          className="flex-1 px-3 py-2 bg-transparent text-amber-100 placeholder-amber-100/60 focus:outline-none"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button type="submit" className="text-amber-300 hover:text-amber-500">
          <SendIcon className="h-5 w-5" />
        </button>
      </form>
    </div>
  );
};

export default Chat;
