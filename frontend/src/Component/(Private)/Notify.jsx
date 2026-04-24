"use client"
import { clearNotifications, removeNotification, toggleNotify } from '@/feature/notifySlice'
import Link from 'next/link'
import React from 'react'
import { FiArrowLeft, FiBell, FiMessageCircle, FiUserCheck, FiUserX, FiX } from 'react-icons/fi'
import { useDispatch, useSelector } from 'react-redux'

const typeConfig = {
  request: { icon: <FiBell className="text-blue-600" />, bg: "bg-blue-50", border: "border-blue-100", dot: "bg-blue-500" },
  accept:  { icon: <FiUserCheck className="text-green-600" />, bg: "bg-green-50", border: "border-green-100", dot: "bg-green-500" },
  reject:  { icon: <FiUserX className="text-red-500" />, bg: "bg-red-50", border: "border-red-100", dot: "bg-red-400" },
  message: { icon: <FiMessageCircle className="text-purple-600" />, bg: "bg-purple-50", border: "border-purple-100", dot: "bg-purple-500" },
};

export const Notify = () => {
  const isOpen = useSelector((state) => state.notify.value);
  const notifications = useSelector((state) => state.notify.notifications);
  const dispatch = useDispatch();

  return (
    <aside className='fixed z-50'>
      {/* Notification Panel */}
      <div className={`fixed top-0 right-0 z-50 h-screen bg-white shadow-2xl transform transition-all duration-500 ease-in-out w-full sm:w-80 md:w-96
          mt-15 md:mt-19 
          ${isOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0 pointer-events-none md:rounded-l-3xl"}`} 
      >
        {/* Header */}
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
              <p className='text-[10px] text-gray-500 uppercase tracking-wider font-semibold'>
                {notifications.length > 0 ? `${notifications.length} unread` : 'All caught up'}
              </p>
            </div>
          </div>

          {/* Clear All */}
          {notifications.length > 0 && (
            <button
              onClick={() => dispatch(clearNotifications())}
              className='text-[10px] font-bold text-blue-600 hover:underline uppercase'
            >
              Clear All
            </button>
          )}
        </div>

        {/* Content Area */}
        <div className='overflow-y-auto h-[calc(100vh-80px)] no-scroll'>
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-6 text-center">
              <div className='w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4'>
                <FiBell className='text-2xl text-gray-300' />
              </div>
              <p className="text-gray-400 font-medium">Your inbox is empty</p>
              <p className="text-[11px] text-gray-400 mt-1 max-w-50">New skill requests and updates will appear here.</p>
            </div>
          ) : (
            <div className='space-y-2 p-3'>
              {notifications.map((n) => {
                const config = typeConfig[n.type] || typeConfig.request;
                return (
                  <div
                    key={n.id}
                    className={`group relative rounded text-gray-700 text-sm border py-3 px-4 transition-all cursor-pointer shadow  ${config.border}`}
                  >
                    <div className='flex items-start gap-3'>
                      {/* Icon
                      <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-white shadow-sm text-base`}>
                        {config.icon}
                      </div> */}

                      {/* Text */}
                      <div className='flex-1 min-w-0'>
                        <p className='text-xs font-bold text-gray-800'>{n.title}</p>
                        <p className='text-xs text-gray-500 leading-relaxed mt-0.5'>
                          {n.type === 'request'
                            ? <><Link href="/request" className='text-blue-600 font-semibold hover:underline' onClick={() => dispatch(toggleNotify())}>View request</Link> — {n.message}</>
                            : n.message}
                        </p>
                        <p className='text-[10px] text-gray-400 mt-1 font-medium'>{n.time}</p>
                      </div>

                      {/* Dismiss */}
                      <button
                        onClick={(e) => { e.stopPropagation(); dispatch(removeNotification(n.id)); }}
                        className='shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-500'
                      >
                        <FiX size={14} />
                      </button>
                    </div>

                    {/* Unread dot */}
                    {/* <span className={`absolute top-3 left-3 w-1.5 h-1.5 rounded-full ${config.dot}`} /> */}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}
