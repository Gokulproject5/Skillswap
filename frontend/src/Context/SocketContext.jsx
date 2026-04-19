"use client";

import React, { createContext, useState, useRef, useEffect } from 'react';
import { io } from 'socket.io-client';
import Peer from 'simple-peer';
import { useSelector } from 'react-redux';

const SocketContext = createContext();

const socket = io(process.env.NEXT_PUBLIC_API_BASE_URL); 

const ContextProvider = ({ children }) => {
  const currentUser = useSelector((state) => state.loginData?.currentUser);

  const [stream, setStream] = useState(null);
  const [me, setMe] = useState('');
  const [call, setCall] = useState({});
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [name, setName] = useState('');
  const [isScreenSharing, setIsScreenSharing] = useState(false);

  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();

  useEffect(() => {
    
    socket.on('me', (id) => {
    });

    if (currentUser?._id || currentUser?.id) {
        const userId = currentUser._id || currentUser.id;
        socket.emit("register", userId);
        setMe(userId);
    }

    socket.on('callUser', ({ from, name: callerName, signal }) => {
      setCall({ isReceivingCall: true, from, name: callerName, signal });
    });
    
    return () => {
        socket.off('me');
        socket.off('callUser');
    }
  }, []);

  const answerCall = () => {
    setCallAccepted(true);

    const peer = new Peer({ initiator: false, trickle: false, stream });

    peer.on('signal', (data) => {
      socket.emit('answerCall', { signal: data, to: call.from });
    });

    peer.on('stream', (currentStream) => {
      if(userVideo.current) {
        userVideo.current.srcObject = currentStream;
      }
    });

    peer.signal(call.signal);

    connectionRef.current = peer;
  };

  const callUser = (id) => {
    const peer = new Peer({ initiator: true, trickle: false, stream });

    peer.on('signal', (data) => {
      socket.emit('callUser', { userToCall: id, signalData: data, from: me || currentUser?._id || currentUser?.id, name: name || currentUser?.name || 'Someone' });
    });

    peer.on('stream', (currentStream) => {
      if(userVideo.current) {
        userVideo.current.srcObject = currentStream;
      }
    });

    socket.on('callAccepted', (signal) => {
      setCallAccepted(true);
      peer.signal(signal);
    });

    connectionRef.current = peer;
  };

  const leaveCall = () => {
    setCallEnded(true);

    connectionRef.current.destroy();

    window.location.reload();
  };
  
  const setupMedia = async () => {
      try {
          const currentStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
          setStream(currentStream);
          if (myVideo.current) {
            myVideo.current.srcObject = currentStream;
          }
      } catch (err) {
          console.error("Failed to get local stream", err);
      }
  }

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
            console.log("Failed to start screen share", error);
        }
    } else {
        const videoTrack = stream.getVideoTracks()[0];
        const currentScreenTrack = myVideo.current.srcObject.getVideoTracks()[0];
        
        if (connectionRef.current) {
            connectionRef.current.replaceTrack(currentScreenTrack, videoTrack, stream);
        }
        
        currentScreenTrack.stop(); 
        myVideo.current.srcObject = stream;
        setIsScreenSharing(false);
    }
  };

  return (
    <SocketContext.Provider value={{
      call,
      callAccepted,
      myVideo,
      userVideo,
      stream,
      name,
      setName,
      callEnded,
      me,
      callUser,
      leaveCall,
      answerCall,
      setupMedia,
      socket,
      isScreenSharing,
      toggleScreenShare
    }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export { ContextProvider, SocketContext };
