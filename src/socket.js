import { io } from "socket.io-client";

const URL = process.env.NODE_ENV === "production" ? "https://drawpad-server.onrender.com" : "http://localhost:3030";

export const socket = io(URL);
