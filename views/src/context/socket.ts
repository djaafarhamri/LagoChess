import socketio from "socket.io-client";
import React from "react";
const ENDPOINT = '/'
export const socket = socketio(ENDPOINT, {
    withCredentials: true,
    transports: ["websocket"],  // Add both transports
    autoConnect: true
});
export const SocketContext = React.createContext(socket);