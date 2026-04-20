"use client";

import React, { useContext, useEffect, useState } from 'react';
import { SocketContext } from '@/Context/SocketContext';
import { motion, AnimatePresence } from 'framer-motion';
import { IoCall, IoClose } from 'react-icons/io5';
import { MdVideoCall, MdCallEnd, MdMic, MdMicOff, MdVideocam, MdVideocamOff } from 'react-icons/md';
import { PresentationIcon } from 'lucide-react';

const VideoCallOverlay = () => {
  const { call, callAccepted, myVideo, userVideo, callEnded, answerCall, leaveCall, setupMedia, stream, isScreenSharing, toggleScreenShare } = useContext(SocketContext);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCamOn, setIsCamOn] = useState(true);

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


  const showVideoCallUI = callAccepted && !callEnded;

  useEffect(() => {
    if (call.isReceivingCall || showVideoCallUI) {
      if (!stream) {
        setupMedia();
      }
    }
  }, [call.isReceivingCall, showVideoCallUI, stream, setupMedia]);

  return (
    <>

      <AnimatePresence>
        {showIncomingCall && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-10 left-1/2 transform -translate-x-1/2 z-100 bg-white p-4 rounded-3xl shadow-2xl flex items-center gap-6 min-w-75 border border-gray-100"
          >
            <div className="flex-1">
              <h3 className="font-bold text-gray-800 text-lg">{call.name || 'Someone'}</h3>
              <p className="text-sm text-gray-500 flex items-center gap-1">
                <MdVideoCall /> Incoming video call
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => { leaveCall(); }}
                className="w-12 h-12 bg-red-500 hover:bg-red-600 rounded-full flex justify-center items-center text-white shadow-lg shadow-red-500/30 transition-transform active:scale-90"
              >
                <IoClose size={24} />
              </button>
              <button
                onClick={answerCall}
                className="w-12 h-12 bg-green-500 hover:bg-green-600 rounded-full flex justify-center items-center text-white shadow-lg shadow-green-500/30 transition-transform active:scale-90"
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
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-110 bg-gray-900/95 backdrop-blur-sm flex justify-center items-center p-4 lg:p-8"
          >
            <div className="relative w-full max-w-5xl aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl border border-gray-800">
              {/* Partner Video */}
              <video
                playsInline
                ref={userVideo}
                autoPlay
                className="w-full h-full object-cover"
              />


              <motion.div
                drag
                dragConstraints={{ top: 10, left: 10, right: 300, bottom: 300 }}
                className="absolute top-4 right-4 w-32 lg:w-48 aspect-3/4 lg:aspect-video bg-gray-800 rounded-2xl overflow-hidden shadow-xl border-2 border-white/20 cursor-move z-10"
              >
                <video
                  playsInline
                  muted
                  ref={myVideo}
                  autoPlay
                  className="w-full h-full object-cover scale-x-[-1]"
                />
              </motion.div>

              {/* Controls */}
              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-4 px-6 py-3 bg-gray-900/60 backdrop-blur-md rounded-full border border-white/10 z-20">
                <button
                  onClick={toggleMic}
                  className={`w-12 h-12 rounded-full flex justify-center items-center text-white transition-all hover:scale-105 active:scale-95 ${isMicOn ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/30'}`}
                >
                  {isMicOn ? <MdMic size={24} /> : <MdMicOff size={24} />}
                </button>
                <button
                  onClick={toggleCam}
                  className={`w-12 h-12 rounded-full flex justify-center items-center text-white transition-all hover:scale-105 active:scale-95 ${isCamOn ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/30'}`}
                >
                  {isCamOn ? <MdVideocam size={24} /> : <MdVideocamOff size={24} />}
                </button>
                <button
                  onClick={toggleScreenShare}
                  title="Share Screen"
                  className={`w-12 h-12 rounded-full flex justify-center items-center text-white transition-all hover:scale-105 active:scale-95 ${isScreenSharing ? 'bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-500/30' : 'bg-gray-700 hover:bg-gray-600'}`}
                >
                  <PresentationIcon size={20} />
                </button>
                <div className="w-px h-8 bg-white/20 mx-2"></div>
                <button
                  onClick={leaveCall}
                  className="w-14 h-14 bg-red-500 hover:bg-red-600 rounded-full flex justify-center items-center text-white shadow-lg shadow-red-500/30 transition-all hover:scale-105 active:scale-95"
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
