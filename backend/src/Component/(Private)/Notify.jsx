"use client"
import { toggleNotify } from '@/feature/notifySlice'
import Link from 'next/link'
import React from 'react'
import { FiArrowLeft } from 'react-icons/fi'
import { useDispatch, useSelector } from 'react-redux'

export const Notify = () => {
    const isOpen = useSelector((state) => state.notify.value);
    const dispatch = useDispatch();
    
   
    const notifyData = [""]; 

    return (
        <aside className='fixed z-50'>
          

            {/* Notification  */}
            <div className={`fixed top-0 right-0 z-50 h-screen bg-white shadow-2xl transform transition-all duration-500 ease-in-out w-full sm:w-80 md:w-96
                mt-15 md:mt-19 
                ${isOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0 pointer-events-none md:rounded-l-3xl"}`}
            >
                {/* Header  */}
                <div className='sticky top-0 bg-white border-b border-gray-100 p-4 flex items-center justify-between z-10'>
                    <div
                        role='button'
                        onClick={() => dispatch(toggleNotify())}
                        className='flex select-none items-center gap-3 group cursor-pointer'
                    >
                        <div className='bg-gray-50 group-hover:bg-blue-50 rounded-full h-10 w-10 flex items-center justify-center transition-all'>
                            <FiArrowLeft className='text-xl text-gray-500 group-hover:text-blue-600' />
                        </div>
                        <div>
                            <p className='text-sm font-bold text-gray-800'>Notifications</p>
                            <p className='text-[10px] text-gray-500 uppercase tracking-wider font-semibold'>Recent Updates</p>
                        </div>
                    </div>
                    
                    {/* Clear All  */}
                    <button className='text-[10px] font-bold text-blue-600 hover:underline uppercase'>
                        Clear All
                    </button>
                </div>

                {/* Content Area */}
                <div className='overflow-y-auto h-[calc(100vh-80px)] custom-scrollbar'>
                    {notifyData.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                            <div className='w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4'>
                                <FiArrowLeft className='text-2xl text-gray-300 rotate-180' />
                            </div>
                            <p className="text-gray-400 font-medium">Your inbox is empty</p>
                            <p className="text-[11px] text-gray-400 mt-1 max-w-50">New skill requests and updates will appear here.</p>
                        </div>
                    ) : (
                        <div className='space-y-3 p-4'>
                            
                            <div className='group relative rounded-2xl text-gray-700 text-sm border border-gray-100 py-3 px-4 bg-white hover:bg-blue-50/50 hover:border-blue-100 transition-all cursor-pointer shadow-sm'>
                                <div className='flex items-start gap-3'>
                                    <div className='w-2 h-2 mt-1.5 bg-blue-600 rounded-full shrink-0'></div>
                                    <div>
                                        <p className='text-xs leading-relaxed'>
                                            New exchange request from <Link href="/request" className='text-blue-700 font-bold hover:underline'>Gokul</Link> for React patterns.
                                        </p>
                                        <p className='text-[10px] text-gray-400 mt-1 font-medium'>2 minutes ago</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </aside>
    )
}
