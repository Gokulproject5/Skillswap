"use client";

import React, { createContext, useState, useRef, useEffect } from 'react';
import { io } from 'socket.io-client';
import Peer from 'simple-peer';
import { useAuth } from './authContext';

const SocketContext = createContext();

const socket = io(process.env.NEXT_PUBLIC_API_BASE_URL);

const ContextProvider = ({ children }) => {
  const { user: currentUser } = useAuth();

  const [stream, setStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [me, setMe] = useState('');
  const [call, setCall] = useState({});
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [isCalling, setIsCalling] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [userName, setUserName] = useState('');

  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();
  const mediaPromiseRef = useRef(null);

  // Corrected STUN server 
  const peerConfig = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
      { urls: 'stun:stun2.l.google.com:19302' }
    ]
  };

  useEffect(() => {
    if (currentUser?._id || currentUser?.id) {
      const userId = currentUser._id || currentUser.id;
      socket.emit("register", userId);
      setMe(userId);
    }

    socket.on('callUser', ({ from, name: callerName, signal }) => {
      setCall({ isReceivingCall: true, from, name: callerName, signal });
    });

    socket.on('callEnded', () => {
      leaveCall(false);
    });

    return () => {
      socket.off('callUser');
      socket.off('callAccepted');
      socket.off('callEnded');
    };
  }, [currentUser]);

  const setupMedia = async () => {
    if (stream) return stream;
    if (mediaPromiseRef.current) return mediaPromiseRef.current;

    mediaPromiseRef.current = new Promise(async (resolve, reject) => {
      try {
        const currentStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setStream(currentStream);
        if (myVideo.current) {
          myVideo.current.srcObject = currentStream;
        }
        resolve(currentStream);
      } catch (err) {
        console.error("Failed to get local stream:", err);
        reject(err);
      }
    });

    try {
      const activeStream = await mediaPromiseRef.current;
      return activeStream;
    } finally {
      mediaPromiseRef.current = null;
    }
  };

  const answerCall = async () => {
    setCallAccepted(true);

    let activeStream = stream;
    if (!activeStream) {
      activeStream = await setupMedia();
    }

    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: activeStream,
      config: peerConfig
    });

    peer.on('signal', (data) => {
      socket.emit('answerCall', { signal: data, to: call.from });
    });

    peer.on('stream', (rStream) => {
      setRemoteStream(rStream);
      if (userVideo.current) {
        userVideo.current.srcObject = rStream;
      }
    });

    peer.on('close', () => leaveCall(false));

    peer.signal(call.signal);
    connectionRef.current = peer;
  };

  const callUser = async (id) => {
    setIsCalling(true);
    setCallEnded(false);
    setCallAccepted(false);
    setCall({ ...call, userToCall: id });

    let activeStream = stream;
    if (!activeStream) {
      activeStream = await setupMedia();
    }

    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: activeStream,
      config: peerConfig
    });

    peer.on('signal', (data) => {
      socket.emit('callUser', {
        userToCall: id,
        signalData: data,
        from: me,
        name: currentUser?.name || 'Someone'
      });
    });

    peer.on('stream', (rStream) => {
      setRemoteStream(rStream);
      if (userVideo.current) {
        userVideo.current.srcObject = rStream;
      }
    });

    peer.on('close', () => leaveCall(false));

    socket.off('callAccepted').on('callAccepted', (signal) => {
      setCallAccepted(true);
      setIsCalling(false);
      peer.signal(signal);
    });

    connectionRef.current = peer;
  };

  const leaveCall = (emitEnd = true) => {
    setCallEnded(true);
    setIsCalling(false);
    setCallAccepted(false);

    if (emitEnd && socket && (call.from || call.userToCall)) {
      socket.emit('endCall', { to: call.from || call.userToCall });
    }

    setCall({});

    if (connectionRef.current) {
      connectionRef.current.destroy();
      connectionRef.current = null;
    }

    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      if (myVideo.current) myVideo.current.srcObject = null;
    }

    if (remoteStream) {
      remoteStream.getTracks().forEach(track => track.stop());
      setRemoteStream(null);
      if (userVideo.current) userVideo.current.srcObject = null;
    }
  };

  const toggleScreenShare = async () => {
    if (!isScreenSharing) {
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ cursor: true });
        const screenTrack = screenStream.getVideoTracks()[0];
        const videoTrack = stream.getVideoTracks()[0];

        if (connectionRef.current) {

          connectionRef.current.replaceTrack(videoTrack, screenTrack, stream);
        }

        myVideo.current.srcObject = screenStream;
        setIsScreenSharing(true);

        screenTrack.onended = () => {
          if (connectionRef.current) {
            connectionRef.current.replaceTrack(screenTrack, videoTrack, stream);
          }
          myVideo.current.srcObject = stream;
          setIsScreenSharing(false);
        };
      } catch (error) {
        console.error("Screen share failed", error);
      }
    } else {
      const videoTrack = stream.getVideoTracks()[0];
      const screenTrack = myVideo.current.srcObject.getVideoTracks()[0];

      if (connectionRef.current) {
        connectionRef.current.replaceTrack(screenTrack, videoTrack, stream);
      }

      screenTrack.stop();
      myVideo.current.srcObject = stream;
      setIsScreenSharing(false);
    }
  };

  return (
    <SocketContext.Provider value={{
      call, callAccepted, myVideo, userVideo, stream, remoteStream,
      callEnded, me, callUser, leaveCall, answerCall,
      setupMedia, isScreenSharing, toggleScreenShare,
      setName: setUserName, userName, socket, isCalling, setIsCalling
    }}>
      {children}
    </SocketContext.Provider>
  );
};

export { ContextProvider, SocketContext };
