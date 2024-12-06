import socketio from "socket.io-client";
import React from "react";
const ENDPOINT = `http://localhost:4001`;
export const socket = socketio(ENDPOINT, {
    withCredentials: true,
    transports: ["websocket"],  // Add both transports
    autoConnect: true
});
export const SocketContext = React.createContext(socket);