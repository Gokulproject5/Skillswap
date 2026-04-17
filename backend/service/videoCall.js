export const VideoCallService = (io) => {
  io.on('connection', (socket) => {
    console.log("Connected:", socket.id);

    // 1. Join the Skill Swap Room
    socket.on('join session', (skillSwapId) => {
      socket.join(skillSwapId);
      console.log(`User joined: ${skillSwapId}`);
    });

    // 2. Initial Call Notification (The Alert/Toast logic)
    // This is what triggers the 'incoming_call_request' alert in your Chat UI
    socket.on("initiate_call", ({ fromName, roomId }) => {
      socket.to(roomId).emit("incoming_call_request", {
        fromName,
        roomId
      });
    });

    // 3. WebRTC Signaling (The video data handshake)
    socket.on("signal", ({ roomId, signalData }) => {
      socket.to(roomId).emit(`signal_received`, {
        signal: signalData,
        from: socket.id,
      });
    });

    // 4. Handle Disconnect (Fixed typo: 'disconnect' is the built-in event)
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
};
