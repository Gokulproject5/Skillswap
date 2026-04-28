"use client";

import React, { createContext, useState, useRef, useEffect, useCallback } from 'react';
import { io } from 'socket.io-client';
import Peer from 'simple-peer';
import { useAuth } from './authContext';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { addNotification } from '@/feature/notifySlice';
import { addJob } from '@/feature/jobSlice';
import { addRequest, removeSentRequest } from '@/feature/requestSlice';
import { updateExchange } from '@/feature/exchangeSlice';
import { addUser, updateUserInList } from '@/feature/userSlice';

const SocketContext = createContext();

let socket;
if (typeof window !== 'undefined') {
  socket = io(process.env.NEXT_PUBLIC_API_BASE_URL);
}

const ContextProvider = ({ children }) => {
  const { user: currentUser, refreshSession } = useAuth();
  const dispatch = useDispatch();

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

  // STUN server 
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

    socket.on('receiveMessage', (data) => {
      if (typeof window !== 'undefined' && window.location.pathname !== '/chat') {
        toast(`New message received`, { icon: '💬' });
        dispatch(addNotification({
          title: 'New Message',
          message: 'You have a new chat message.',
          type: 'message'
        }));
      }
    });

    socket.on('notification', (data) => {
      const icon = data.type === 'accept' ? '🎉' : data.type === 'request' ? '🤝' : 'ℹ️';
      toast(`${icon} ${data.message}`);
      dispatch(addNotification(data));
    });

    socket.on('newJobPost', (data) => {
      console.log("[Socket] New job post received:", data);
      dispatch(addJob(data));
      if (typeof window !== 'undefined' && window.location.pathname !== '/jobs') {
        toast.success(`New Job Opportunity: ${data.role}`, { icon: '💼' });
      }
    });

    socket.on('newJobPostPending', (data) => {
      console.log("[Socket] New pending job post:", data);
      if (currentUser?.role === 'admin') {
        toast.success(`New job post pending approval: ${data.role}`, { icon: '📝' });
      }
    });

    socket.on('newRequest', (data) => {
      console.log("[Socket] New connection request received:", data);
      dispatch(addRequest(data));
    });

    socket.on('requestAccepted', (data) => {
      console.log("[Socket] Request accepted:", data);
      dispatch(removeSentRequest(data.requestId));
      refreshSession();
    });

    socket.on('requestRejected', (data) => {
      console.log("[Socket] Request rejected:", data);
      dispatch(removeSentRequest(data.requestId));
    });

    socket.on('exchangeUpdated', (data) => {
      console.log("[Socket] Exchange updated:", data);
      dispatch(updateExchange(data));
      refreshSession();
    });

    socket.on('newUser', (data) => {
      console.log("[Socket] New user joined:", data);
      if (data._id !== currentUser?._id) {
        dispatch(addUser(data));
      }
    });

    socket.on('userUpdated', (data) => {
      console.log("[Socket] User updated:", data);
      dispatch(updateUserInList(data));
      if (data._id === currentUser?._id) {
        refreshSession();
      }
    });

    return () => {
      socket.off('callUser');
      socket.off('callAccepted');
      socket.off('callEnded');
      socket.off('receiveMessage');
      socket.off('notification');
      socket.off('newJobPost');
      socket.off('newJobPostPending');
      socket.off('newRequest');
      socket.off('requestAccepted');
      socket.off('requestRejected');
      socket.off('exchangeUpdated');
      socket.off('newUser');
      socket.off('userUpdated');
    };
  }, [currentUser]);

  const setupMedia = useCallback(async () => {
    if (stream) return stream;
    if (mediaPromiseRef.current) return mediaPromiseRef.current;

    console.log("[Media] Requesting user media...");
    mediaPromiseRef.current = new Promise(async (resolve, reject) => {
      try {
        const currentStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        console.log("[Media] Local stream acquired");
        setStream(currentStream);
        if (myVideo.current) {
          myVideo.current.srcObject = currentStream;
        }
        resolve(currentStream);
      } catch (err) {
        console.error("[Media] Failed to get local stream:", err);
        toast.error("Camera/Mic access denied or not found");
        reject(err);
      }
    });

    try {
      const activeStream = await mediaPromiseRef.current;
      return activeStream;
    } finally {
      mediaPromiseRef.current = null;
    }
  }, [stream]);

  const answerCall = useCallback(async () => {
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
  }, [stream, call, setupMedia]);

  const callUser = useCallback(async (id) => {
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
      if (peer && !peer.destroyed) {
        setCallAccepted(true);
        setIsCalling(false);
        peer.signal(signal);
      }
    });

    connectionRef.current = peer;
  }, [stream, call, me, currentUser, setupMedia]);

  const leaveCall = useCallback((emitEnd = true) => {
    setCallEnded(true);
    setIsCalling(false);
    setCallAccepted(false);

    if (socket) {
      socket.off('callAccepted');
    }

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
  }, [call, stream, remoteStream]);

  const toggleRemotePiP = useCallback(async () => {
    try {
      if (userVideo.current) {
        if (document.pictureInPictureElement) {
          await document.exitPictureInPicture();
        } else {
          await userVideo.current.requestPictureInPicture();
        }
      }
    } catch (error) {
      console.error("Remote PiP failed", error);
    }
  }, [userVideo]);

  const toggleLocalPiP = useCallback(async () => {
    try {
      if (myVideo.current) {
        if (document.pictureInPictureElement) {
          await document.exitPictureInPicture();
        } else {
          await myVideo.current.requestPictureInPicture();
        }
      }
    } catch (error) {
      console.error("Local PiP failed", error);
    }
  }, [myVideo]);

  const toggleScreenShare = useCallback(async () => {
    if (!isScreenSharing) {
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ cursor: true });
        const screenTrack = screenStream.getVideoTracks()[0];
        const videoTrack = stream.getVideoTracks()[0];

        if (connectionRef.current) {
          connectionRef.current.replaceTrack(videoTrack, screenTrack, stream);
        }

        if (myVideo.current) {
          myVideo.current.srcObject = screenStream;
        }
        
        setIsScreenSharing(true);

        screenTrack.onended = () => {
          if (connectionRef.current) {
            const currentVideoTrack = stream.getVideoTracks()[0];
            connectionRef.current.replaceTrack(screenTrack, currentVideoTrack, stream);
          }
          if (myVideo.current) {
            myVideo.current.srcObject = stream;
          }
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
      if (myVideo.current) {
        myVideo.current.srcObject = stream;
      }
      setIsScreenSharing(false);
    }
  }, [isScreenSharing, stream]);

  return (
    <SocketContext.Provider value={{
      call, callAccepted, myVideo, userVideo, stream, remoteStream,
      callEnded, me, callUser, leaveCall, answerCall,
      setupMedia, isScreenSharing, toggleScreenShare,
      toggleRemotePiP, toggleLocalPiP,
      setName: setUserName, userName, socket, isCalling, setIsCalling
    }}>
      {children}
    </SocketContext.Provider>
  );
};

export { ContextProvider, SocketContext };
