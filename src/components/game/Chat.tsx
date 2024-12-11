import { useContext, useEffect, useState } from "react";
import { useUser } from "../../context/UserContext";
import { SocketContext } from "../../context/socket";

type Message = {
  content: string;
  sender: string | undefined;
  sentAt: Date;
};

const Chat = ({gameId}: {gameId: string | undefined}) => {
  const { user } = useUser();
  const socket = useContext(SocketContext);

  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    const getChat = async () => {
      const response = await fetch(`http://localhost:4000/api/chat/${gameId}`, {
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
      gameId
    });
    setMessages((prev) => [...prev, { content: message, sender: user?.username, sentAt: new Date(Date.now()) }]);
    setMessage("")
  };

  useEffect(() => {
    const handleMessageReceived = ({ content, sender, sentAt }: Message) => {
      setMessages((prev) => [...prev, { content, sender, sentAt }]);
    };
    // Join the game room
    socket.on("message-received", handleMessageReceived);

    return () => {
      socket.off("message-received", handleMessageReceived);
    };
  }, [socket]);

  return (
    <div className="bg-[#454545] w-full flex flex-col">
      <h2 className="text-xl text-center font-bold text-yellow-400 p-4">
        Chat Room
      </h2>
      {messages &&
        messages.map((message: Message, index: number) => (
          <div key={index} className="flex">
            <p className="text-yellow-500 font-medium">{message.sender}</p>:
            <p className="text-white">{message.content}</p>
          </div>
        ))}
      <input
        type="text"
        className="mt-auto bg-[#313131] border-t-2 text-white"
        placeholder="chat"
        onChange={(e) => setMessage(e.target.value)}
        value={message}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            sendMessage();
          }
        }}
      />
    </div>
  );
};

export default Chat;
