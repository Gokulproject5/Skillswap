"use client";

import React, { useContext, useEffect, useRef, useState } from 'react';
import { SocketContext } from '@/Context/SocketContext';
import { motion, AnimatePresence } from 'framer-motion';
import { IoCall, IoClose } from 'react-icons/io5';
import { MdVideoCall, MdCallEnd, MdMic, MdMicOff, MdVideocam, MdVideocamOff } from 'react-icons/md';
import { PresentationIcon } from 'lucide-react';

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
    toggleScreenShare
  } = useContext(SocketContext);

  const [isMicOn, setIsMicOn] = useState(true);
  const [isCamOn, setIsCamOn] = useState(true);
const videoRef = useRef(null)

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
    if (myVideo.current && stream) {
      myVideo.current.srcObject = stream;
    }
  }, [stream, showVideoCallUI]);


  return (
    <>
      {/* incominig call */}
      <AnimatePresence>
        {showIncomingCall && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-10 left-1/2 -translate-x-1/2 z-100 bg-white p-4 rounded-xl shadow-2xl flex items-center gap-6 min-w-75 border border-gray-100"
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

      {/* video */}
      <AnimatePresence>
        {showVideoCallUI && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-110 bg-gray-950 flex justify-center items-center p-4"
          >
            <div className="relative w-full max-w-6xl aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl border border-gray-800">


              <video
                playsInline
                ref={userVideo}
                autoPlay
                className="w-full h-full object-cover"
              />


              <div className="absolute inset-0 -z-10 flex items-center justify-center bg-gray-900 pointer-events-none">
                {isCalling && !callAccepted ? (
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
                dragConstraints={{ left: -400, right: 0, top: 0, bottom: 300 }}
                className="absolute  top-6 right-6 w-32 md:w-48 aspect-video bg-gray-800 rounded-2xl overflow-hidden shadow-2xl border-2 border-white/10 cursor-move z-30"
              >
                {isCamOn ? (
                  <video
                    playsInline
                    muted
                    ref={myVideo}
                    autoPlay
                    className="w-full h-full object-cover scale-x-[-1]"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-700">
                    <MdVideocamOff className="text-white/30" size={32} />
                  </div>
                )}
              </motion.div>

            
              <div className="fixed md:absolute my-2 max-w-85 w-full md:bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-4 px-6 py-4 bg-black/40 flex-1 backdrop-blur-xl rounded-3xl border border-white/10 z-40">
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

                <button
                  onClick={toggleScreenShare}
                  className={`w-12 h-12 rounded-2xl flex justify-center items-center text-white transition-all ${isScreenSharing ? 'bg-blue-500 hover:bg-blue-600' : 'bg-white/10 hover:bg-white/20'}`}
                >
                  <PresentationIcon size={20} />
                </button>

                <div className="w-1 h-8 bg-white/20 mx-2" />

                <button
                  onClick={leaveCall}
                  className="w-14 h-14 bg-red-500 hover:bg-red-600 rounded-2xl flex justify-center items-center text-white shadow-xl shadow-red-500/20 transition-all active:scale-95"
                >
                  <MdCallEnd size={28} />
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
