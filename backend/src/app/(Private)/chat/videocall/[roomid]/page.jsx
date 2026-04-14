"use client"
import { CameraIcon, CameraOff, MicIcon, MicOff, PresentationIcon } from 'lucide-react'
import Link from 'next/link'
import React, { useState } from 'react'
import { MdCallEnd } from 'react-icons/md'
import { RiPresentationFill } from 'react-icons/ri'

const page = () => {
    const [isCameraOn, setCameraOn] = useState(true)
    const [isMicOn, setMicOn] = useState(true)
    const [isPresent, setPresent] = useState(false)
    return (
        <section id='videoCall' className='my-19 w-full   bg-gray-900 min-h-svh   '>
            <header className='min-w-100 text-white flex items-center justify-between w-full h-20 bg-gray-900 px-20 shadow-2xl shadow-gray-900  scale-105' >

                <div>
                    <span>Meeting Id : 4569785746</span>
                </div>

                <div className='relative  px-3 space-x-6 py-2 rounded-full '>
                    {
                        ["G", "S"].map((user, index) => (
                            <span key={index} className='font-semibold text-black bg-white/50 rounded-full py-2 px-3 absolute right-2  shadow-md shadow-black/30'>{user}</span>
                        ))
                    }
                </div>

            </header>

            <main>

                <div className='grid grid-cols-1 md:grid-cols-2 md:px-10  h-full px-3 py-10 gap-10'>

                    {/* video frame - 1 */}
                    <div className='md:w-full drop-shadow-2xl drop-shadow-gray-500/30  transition-all duration-500 ease-in-out absolute z-10 md:relative bottom-0 right-4 w-50 h-50  max-w-4xl overflow-hidden md:h-100 rounded-3xl   bg-black '>

                        <video loop autoPlay={true} className='w-full h-full' src="/video.mp4" ></video>

                        {/* Caller name */}
                        <div className='absolute text-white font-bold bottom-4 left-4 bg-black/30 px-4 py-2 rounded-full'>
                            <span>Saran</span>
                        </div>
                    </div>

                    {/* video frame - 2 */}
                    <div className='w-full h-full min-h-150  bg-pink md:min-h-100 overflow-hidden rounded-3xl relative  bg-black '>

                        <video  autoPlay={true} loop className='w-full h-full' src="/video2.mp4" ></video>

                        {/* Caller name */}
                        <div className='absolute text-white font-bold bottom-4 left-4 bg-black/30 px-4 py-2 rounded-full'>
                            <span>Gokul</span>
                        </div>
                    </div>

                </div>


            </main>
            <footer>
                <div className='flex justify-center bg-black/50 rounded-full max-w-xs text-gray-600 items-center py-5 space-x-3 mx-auto'>
                    <button onClick={() => setMicOn(!isMicOn)} className='bg-white px-2 py-2 text-center  rounded-full'>
                        {
                            isMicOn ? <MicIcon /> :
                                <MicOff className='text-red-500' />
                        }
                    </button>
                    <button onClick={() => setCameraOn(!isCameraOn)} className='bg-white px-2 py-2 text-center  rounded-full'>
                        {isCameraOn ? <CameraIcon /> : <CameraOff className='text-red-500' />}
                    </button>
                    <button onClick={() => setPresent(!isPresent)} className='bg-white px-2 py-2 text-center text-2xl  rounded-full'>
                        {isPresent ? <RiPresentationFill className='text-red-500' />:<PresentationIcon />  }
                    </button>
                    <Link href="/dashboard" className='bg-white text-2xl px-2 py-2 text-center hover:text-white hover:bg-red-500  rounded-full'>
                        <MdCallEnd />
                    </Link>
                </div>
            </footer>
        </section>
    )
}

export default page