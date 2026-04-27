"use client";

import React, { useContext, useEffect, useRef, useState } from 'react';
import { SocketContext } from '@/Context/SocketContext';
import { motion, AnimatePresence } from 'framer-motion';
import { IoCall, IoClose } from 'react-icons/io5';
import { MdVideoCall, MdCallEnd, MdMic, MdMicOff, MdVideocam, MdVideocamOff, MdCloseFullscreen } from 'react-icons/md';
import { PresentationIcon } from 'lucide-react';
import { useAuth } from '@/Context/authContext';

const VideoCallOverlay = () => {
  const {
    call,
    callAccepted,
    myVideo,
    userVideo,
    callEnded,
    answerCall,
    leaveCall,
    setupMedia,
    stream,
    remoteStream,
    isCalling,
    isScreenSharing,
    toggleScreenShare,
    me,
    userName
  } = useContext(SocketContext);


  const { user } = useAuth();
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCamOn, setIsCamOn] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);

  const toggleMinimize = () => setIsMinimized(!isMinimized);

  useEffect(() => {
    if (stream) {
      const audioTrack = stream.getAudioTracks()[0];
      const videoTrack = stream.getVideoTracks()[0];
      if (audioTrack) setIsMicOn(audioTrack.enabled);
      if (videoTrack) setIsCamOn(videoTrack.enabled);
    }
  }, [stream]);

  const toggleMic = () => {
    if (stream) {
      const audioTrack = stream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMicOn(audioTrack.enabled);
      }
    }
  };

  const toggleCam = () => {
    if (stream) {
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsCamOn(videoTrack.enabled);
      }
    }
  };

  const showIncomingCall = call.isReceivingCall && !callAccepted;
  const showVideoCallUI = (callAccepted || isCalling) && !callEnded;

  useEffect(() => {
    if ((showIncomingCall || showVideoCallUI) && !stream) {
      setupMedia();
    }
  }, [showIncomingCall, showVideoCallUI, stream, setupMedia]);

  useEffect(() => {
    if (userVideo.current && remoteStream) {
      userVideo.current.srcObject = remoteStream;
    }
  }, [remoteStream, showVideoCallUI]);

  useEffect(() => {
    if (myVideo.current && stream && isCamOn) {
      myVideo.current.srcObject = stream;
    }
  }, [stream, showVideoCallUI, isCamOn]);


  return (
    <>
      {/* incominig call */}
      <AnimatePresence>
        {showIncomingCall && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-10 left-1/2 -translate-x-1/2 z-1000 bg-white p-4 rounded-xl shadow-2xl flex items-center gap-6 min-w-75 border border-gray-100"
          >
            <div className="flex-1">
              <h3 className="font-bold text-gray-800 text-lg">{call.name || 'Incoming Call...'}</h3>
              <p className="text-sm text-gray-500 flex items-center gap-1">
                <MdVideoCall className="text-blue-500" /> Video calling you
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={leaveCall}
                className="w-12 h-12 bg-red-500 hover:bg-red-600 rounded-full flex justify-center items-center text-white shadow-lg transition-transform active:scale-90"
              >
                <IoClose size={24} />
              </button>
              <button
                onClick={answerCall}
                className="w-12 h-12 bg-green-500 hover:bg-green-600 rounded-full flex justify-center items-center text-white shadow-lg transition-transform active:scale-90"
              >
                <IoCall size={24} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showVideoCallUI && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isMinimized ? {
              width: "320px",
              height: "180px",
              right: "24px",
              bottom: "24px",
              top: "auto",
              left: "auto",
              opacity: 1,
              scale: 1,
            } : {
              width: "100%",
              height: "100%",
              right: "0px",
              bottom: "0px",
              top: "0px",
              left: "0px",
              opacity: 1,
              scale: 1,
            }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={`fixed inset-0 z-1001 bg-gray-950 flex justify-center items-center overflow-hidden transition-all duration-500 ease-in-out ${isMinimized ? 'rounded-2xl shadow-2xl border-2 border-white/20' : 'p-0 md:p-4'}`}
          >
            <div className={`relative w-full h-full bg-black ${!isMinimized ? 'max-w-6xl aspect-video md:rounded-3xl' : ''} overflow-hidden shadow-2xl border border-gray-800`}>


            <div className='w-full h-full overflow-hidden relative'>
                <video
                key={remoteStream?.id || 'remote-video'}
                playsInline
                ref={(el) => {
                  userVideo.current = el;
                  if (el && remoteStream) {
                    el.srcObject = remoteStream;
                  }
                }}
                autoPlay
                onCanPlay={(e) => e.target.play().catch(err => console.error("Remote video play failed:", err))}
                className="w-full h-full object-cover"
              />
                <div className={`absolute bottom-10 z-10 left-2 rounded-full px-3 py-3 text-[10px] bg-black/60 text-white backdrop-blur-sm ${isMinimized ? 'bottom-2 scale-75 origin-left' : ''}`}>
                  <span>{call.name || 'Remote User'}</span>
                </div>
            </div>

              <div className={`absolute inset-0 ${!isCalling || callAccepted ? "-z-10" : "z-10"} flex items-center justify-center bg-gray-900 pointer-events-none`}>
                {isCalling || !callAccepted ? (
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-20 h-20 border-4  border-white border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-xl text-blue-400  font-semibold animate-pulse">Calling...</p>
                  </div>
                ) : (
                  <p className="text-gray-100 -z-20">Connecting video...</p>
                )}
              </div>


              <motion.div
                drag
                dragConstraints={isMinimized ? { left: 0, right: 0, top: 0, bottom: 0 } : { left: -800, right: 0, top: 0, bottom: 450 }}
                className={`absolute top-4 right-4 md:top-6 md:right-6 aspect-video bg-gray-800 rounded-xl md:rounded-2xl overflow-hidden shadow-2xl border-2 border-white/10 cursor-move z-30 transition-all ${isMinimized ? 'w-24 top-2 right-2 border-none shadow-none' : 'w-28 md:w-70'}`}
              >
                {isCamOn ? (
                  <div className='relative w-full h-full overflow-hidden rounded-lg'>
                    <video
                      key={stream?.id || 'local-video'}
                      playsInline
                      muted
                      ref={(el) => {
                        myVideo.current = el;
                        if (el && stream) {
                          el.srcObject = stream;
                        }
                      }}
                      autoPlay
                      onCanPlay={(e) => e.target.play().catch(err => console.error("Local video play failed:", err))}
                      className="w-full h-full object-cover scale-x-[-1]"
                    />
                   
                    <div className='absolute bottom-2 truncate w-20 left-2 rounded-full px-3 py-1 text-[10px] bg-black/60 text-white backdrop-blur-sm'>
                      <span>{user.name}</span>
                    </div>
                  </div>
                ) : (
                  <div className='relative w-full h-full bg-gray-800 flex items-center justify-center aspect-video rounded-lg'>
                    <div className='w-20 h-20 bg-gray-600 rounded-full flex items-center justify-center text-xl text-white'>
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className='absolute bottom-2 left-2 rounded-full px-3 py-1 text-[10px] bg-black/60 text-white backdrop-blur-sm'>
                      <span>{user.name} (Camera Off)</span>
                    </div>
                  </div>
                )}

              </motion.div>


              <div className={`fixed md:absolute bottom-4 md:bottom-10 my-2 w-[95%] md:w-full left-1/2 -translate-x-1/2 flex items-center gap-2 md:gap-4 px-3 md:px-6 py-2 md:py-4 bg-black/40 backdrop-blur-xl rounded-2xl md:rounded-3xl border border-white/10 z-40 transition-all ${isMinimized ? 'bottom-0 max-w-60 py-1 px-2 gap-1 rounded-xl' : 'max-w-85 md:max-w-fit'}`}>
                {!isMinimized && (
                  <>
                    <button
                      onClick={toggleMic}
                      className={`w-12 h-12 rounded-2xl flex justify-center items-center text-white transition-all ${isMicOn ? 'bg-white/10 hover:bg-white/20' : 'bg-red-500 hover:bg-red-600'}`}
                    >
                      {isMicOn ? <MdMic size={24} /> : <MdMicOff size={24} />}
                    </button>

                    <button
                      onClick={toggleCam}
                      className={`w-12 h-12 rounded-2xl flex justify-center items-center text-white transition-all ${isCamOn ? 'bg-white/10 hover:bg-white/20' : 'bg-red-500 hover:bg-red-600'}`}
                    >
                      {isCamOn ? <MdVideocam size={24} /> : <MdVideocamOff size={24} />}
                    </button>
                  </>
                )}

                <button
                  onClick={toggleScreenShare}
                  className={`w-12 h-12 rounded-2xl flex justify-center items-center text-white transition-all ${isScreenSharing ? 'bg-blue-500 hover:bg-blue-600' : 'bg-white/10 hover:bg-white/20'}`}
                  title="Screen Share"
                >
                  <PresentationIcon size={20} />
                </button>

                <button
                  onClick={toggleMinimize}
                  className="w-12 h-12 rounded-2xl flex justify-center items-center text-white bg-white/10 hover:bg-white/20 transition-all"
                  title={isMinimized ? "Expand Call" : "Minimize Call"}
                >
                  {isMinimized ? <MdVideoCall size={24} /> : <MdCloseFullscreen size={24} />}
                </button>

                <div className="w-1 h-8 bg-white/20 mx-2" />

                <button
                  onClick={leaveCall}
                  className={`bg-red-500 hover:bg-red-600 rounded-2xl flex justify-center items-center text-white shadow-xl shadow-red-500/20 transition-all active:scale-95 ${isMinimized ? 'w-10 h-10' : 'w-14 h-14'}`}
                >
                  <MdCallEnd size={isMinimized ? 20 : 28} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default VideoCallOverlay;
