"use client"
import { CameraIcon, CameraOff, MicIcon, MicOff, PresentationIcon } from 'lucide-react'
import Link from 'next/link'
import React, { useState, useEffect, useRef } from 'react'
import { MdCallEnd } from 'react-icons/md'
import { io } from 'socket.io-client'
import Peer from 'simple-peer'
import { useParams } from 'next/navigation'

const Page = () => {
    const { roomid } = useParams();
    const [isCameraOn, setCameraOn] = useState(true)
    const [isMicOn, setMicOn] = useState(true)
    const [isPresent, setPresent] = useState(false)

    // WebRTC States
    const [stream, setStream] = useState(null)
    const socket = useRef()
    const myVideo = useRef()
    const userVideo = useRef()
    const connectionRef = useRef()

    useEffect(() => {
        socket.current = io(`${process.env.NEXT_PUBLIC_API_BASE_URL}`);

        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((currentStream) => {
            setStream(currentStream);
            if (myVideo.current) myVideo.current.srcObject = currentStream;
        });

        socket.current.emit("join session", roomid);

        socket.current.on("signal_received", (data) => {

            const peer = new Peer({ initiator: false, trickle: false, stream: stream });
            peer.on("signal", (signal) => {
                socket.current.emit("signal", { roomId: roomid, signalData: signal });
            });
            peer.on("stream", (remoteStream) => {
                userVideo.current.srcObject = remoteStream;
            });
            peer.signal(data.signal);
            connectionRef.current = peer;
        });
    }, [roomid, stream]);

    const startCall = () => {
        const peer = new Peer({ initiator: true, trickle: false, stream: stream });
        peer.on("signal", (data) => {
            socket.current.emit("signal", { roomId: roomid, signalData: data });
        });
        peer.on("stream", (remoteStream) => {
            userVideo.current.srcObject = remoteStream;
        });
        connectionRef.current = peer;
    }

    // Toggle Handlers
    const toggleCamera = () => {
        setCameraOn(!isCameraOn);
        stream.getVideoTracks()[0].enabled = !isCameraOn;
    }

    const toggleMic = () => {
        setMicOn(!isMicOn);
        stream.getAudioTracks()[0].enabled = !isMicOn;
    }

    return (
        <section id='videoCall' className='my-19 w-full bg-gray-900 min-h-svh'>
            <header className='min-w-100 text-white flex items-center justify-between w-full h-20 bg-gray-900 px-20 shadow-2xl shadow-gray-900 scale-105'>
                <div><span>Meeting Id : {roomid}</span></div>
                <button onClick={startCall} className="bg-green-500 px-4 py-1 rounded-full text-sm">Start Call</button>
            </header>

            <main>
                <div className='grid grid-cols-1 md:grid-cols-2 md:px-10 h-full px-3 py-10 gap-10'>
                    {/* me */}
                    <div className='md:w-full drop-shadow-2xl absolute z-10 md:relative bottom-0 right-4 w-50 h-50 max-w-4xl overflow-hidden md:h-100 rounded-3xl bg-black'>
                        <video playsInline muted ref={myVideo} autoPlay className='w-full h-full object-cover' />
                        <div className='absolute text-white font-bold bottom-4 left-4 bg-black/30 px-4 py-2 rounded-full'>
                            <span>You</span>
                        </div>
                    </div>

                    {/* user */}
                    <div className='w-full h-full min-h-150 md:min-h-100 overflow-hidden rounded-3xl relative bg-black'>
                        <video playsInline ref={userVideo} autoPlay className='w-full h-full object-cover' />
                        <div className='absolute text-white font-bold bottom-4 left-4 bg-black/30 px-4 py-2 rounded-full'>
                            <span>Partner</span>
                        </div>
                    </div>
                </div>
            </main>

            <footer>
                <div className='flex justify-center bg-black/50 rounded-full max-w-xs text-gray-600 items-center py-5 space-x-3 mx-auto'>
                    <button onClick={toggleMic} className='bg-white px-2 py-2 rounded-full'>
                        {isMicOn ? <MicIcon /> : <MicOff className='text-red-500' />}
                    </button>
                    <button onClick={toggleCamera} className='bg-white px-2 py-2 rounded-full'>
                        {isCameraOn ? <CameraIcon /> : <CameraOff className='text-red-500' />}
                    </button>

                    <Link href="/dashboard" className='bg-white text-2xl px-2 py-2 hover:bg-red-500 hover:text-white rounded-full'>
                        <MdCallEnd />
                    </Link>
                </div>
            </footer>
        </section>
    )
}

export default Page
