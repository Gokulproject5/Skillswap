import { Server } from 'socket.io';
import Message from "../models/message.model.js";

const userSocketMap = new Map();
let ioInstance;

export const sendNotification = (userId, eventName, payload) => {
    console.log(`[Socket] Attempting to send ${eventName} to user: ${userId}`);
    if (!ioInstance) {
        console.log(`[Socket] ioInstance not available`);
        return;
    }
    const socketId = userSocketMap.get(userId);
    console.log(`[Socket] Socket ID for user ${userId}: ${socketId}`);
    if (socketId) {
        ioInstance.to(socketId).emit(eventName, payload);
        console.log(`[Socket] Emitted ${eventName} to socket ${socketId}`);
    }
};

export const broadcast = (eventName, payload) => {
    console.log(`[Socket] Broadcasting ${eventName}`);
    if (!ioInstance) {
        console.log(`[Socket] ioInstance not available`);
        return;
    }
    ioInstance.emit(eventName, payload);
};

export const initSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: process.env.FRONTEND_URL,
            methods: ["GET", "POST"],
            credentials: true
        }
    });
    ioInstance = io;

    io.on("connection", (socket) => {
        socket.emit("me", socket.id);

        socket.on("register", (userId) => {
            userSocketMap.set(userId, socket.id);
            socket.userId = userId;
        });

        socket.on("disconnect", () => {
            if (socket.userId) {
                userSocketMap.delete(socket.userId);
            }
        });

        socket.on("callUser", ({ userToCall, signalData, from, name }) => {
            const socketId = userSocketMap.get(userToCall);
            if (socketId) {
                io.to(socketId).emit("callUser", { signal: signalData, from, name });
            }
        });

        socket.on("answerCall", (data) => {
            const callerSocketId = userSocketMap.get(data.to);
            if (callerSocketId) {
                io.to(callerSocketId).emit("callAccepted", data.signal);
            }
        });

        socket.on("endCall", (data) => {
            const peerSocketId = userSocketMap.get(data.to);
            if (peerSocketId) {
                io.to(peerSocketId).emit("callEnded");
            }
        });

        socket.on("sendMessage", async (data) => {
            try {
                const time = data.time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                
                await Message.create({
                    sender: socket.userId,
                    receiver: data.to,
                    text: data.text,
                    time: time
                });

                const receiverSocketId = userSocketMap.get(data.to);
                if (receiverSocketId) {
                    io.to(receiverSocketId).emit("receiveMessage", {
                        from: socket.userId,
                        text: data.text,
                        time: time
                    });
                }
            } catch (error) {
                console.error("Error saving message:", error);
            }
        });
    });

    return io;
};
