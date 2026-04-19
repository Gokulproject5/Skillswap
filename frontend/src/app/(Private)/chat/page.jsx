"use client"
import React, { useState, useRef, useEffect } from 'react'
import { BiPaperclip, BiSolidVideo, BiArrowBack } from 'react-icons/bi';
import { IoCallSharp, IoSend } from 'react-icons/io5';
import { MdMoreVert } from 'react-icons/md';
import { userChat } from '@/Data/chatData';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import { SocketContext } from '@/Context/SocketContext';


// ChatBox 
const ChatBox = ({ activeUser, messages, inputText, setInputText, onSendMessage, onBack }) => {
  const scrollRef = useRef(null);

  const user = useSelector((state) => state.loginData.currentUser);
  console.log(user);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages]);


  const { callUser, setName } = React.useContext(SocketContext);

  useEffect(() => {
    if (user?.name) {
      setName(user.name);
    }
  }, [user]);

  const handleVideoIconClick = (activeUser) => {
    callUser();
  };


  return (
    <section className='relative  flex flex-col w-full h-full bg-gray-50 overflow-hidden lg:rounded-2xl lg:border lg:border-gray-200 lg:shadow-xl'>
      {/* Header */}
      <div className='sticky top-0  z-20 bg-white/90 backdrop-blur-md border-b border-gray-100 px-4 py-3 flex items-center justify-between'>
        <div className='flex items-center space-x-3'>
          <button onClick={onBack} className=" p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-full">
            <BiArrowBack size={20} />
          </button>

          <div className='relative'>
            <img src={activeUser?.img} alt="" className='w-10 h-10 rounded-full object-cover ring-2 ring-gray-100' />
            {activeUser?.lastSeen === "Active" && (
              <span className='absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full'></span>
            )}
          </div>
          <div>
            <h2 className='font-bold text-gray-800 text-sm lg:text-base'>{activeUser?.name}</h2>
            <p className={`text-[10px] lg:text-xs font-medium ${activeUser?.lastSeen === "Active" ? "text-green-600" : "text-gray-400"}`}>
              {activeUser?.lastSeen === "Active" ? "Online" : activeUser?.lastSeen}
            </p>
          </div>
        </div>
        <div className='flex items-center space-x-1 lg:space-x-2 text-gray-500'>
          <button onClick={() => handleVideoIconClick(activeUser)} href={`/chat/videocall/${user?.id}`} className='p-2 hover:bg-gray-100 hover:text-blue-600 rounded-full transition-colors'><BiSolidVideo size={20} /></button>
          <button className='p-2 hover:bg-gray-100 hover:text-blue-600 rounded-full transition-colors'><IoCallSharp size={18} /></button>
          <button className='p-2 hover:bg-gray-100 hover:text-blue-600 rounded-full transition-colors'><MdMoreVert size={20} /></button>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className='flex-1 overflow-y-auto p-4 lg:p-6 bg-blue-50/10 space-y-4 custom-scrollbar'>
        {messages.map((msg) => {
          const isMe = msg.sender === "gokul";
          return (
            <div key={msg.id} className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
              <div className={`p-3 px-4 rounded-2xl max-w-[85%] lg:max-w-[70%] text-sm shadow-sm
                ${isMe ? "bg-blue-600 text-white rounded-tr-none" : "bg-white text-gray-700 rounded-tl-none border border-gray-100"}`}>
                {msg.text}
              </div>
              <span className='text-[10px] text-gray-400 mt-1 mx-1'>{msg.time}</span>
            </div>
          );
        })}
      </div>

      {/* Input */}
      <div className='p-3 lg:p-4 bg-white border-t border-gray-100 flex items-center space-x-2'>
        <label className='p-2 hover:bg-gray-100 rounded-full text-gray-500 cursor-pointer transition-colors'>
          <BiPaperclip size={22} />
          <input type='file' className='hidden' />
        </label>
        <div className='flex items-center bg-gray-100 rounded-full px-4 py-2 flex-1'>
          <input
            autoFocus
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSendMessage()}
            placeholder="Type a message..."
            className='bg-transparent border-none focus:ring-0 w-full text-sm outline-none'
          />
          <button onClick={onSendMessage} className='ml-2 text-blue-600 hover:scale-110 active:scale-95 transition-transform'>
            <IoSend size={20} />
          </button>
        </div>
      </div>
    </section>
  );
};

//Main Page 
const Page = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [inputText, setInputText] = useState("");
  const [showChat, setShowChat] = useState(false);

  const [chatHistories, setChatHistories] = useState({
    [userChat[0].name]: [
      { id: 1, text: "Hey bro! How are you?", sender: "them", time: "9:00 AM" },
      { id: 2, text: "I'm good da 😄", sender: "gokul", time: "9:02 AM" },
      { id: 3, text: "Working on MERN project", sender: "gokul", time: "9:05 AM" },
    ],

    [userChat[1].name]: [
      { id: 1, text: "Hello!", sender: "them", time: "10:00 AM" },
      { id: 2, text: "Started learning Photoshop 🎨", sender: "gokul", time: "10:01 AM" },
      { id: 3, text: "Nice! Show me your work", sender: "them", time: "10:03 AM" },
    ],

    [userChat[2].name]: [
      { id: 1, text: "Hey Gokul!", sender: "them", time: "11:00 AM" },
      { id: 2, text: "Yes tell me?", sender: "gokul", time: "11:02 AM" },
      { id: 3, text: "Need help with React state", sender: "them", time: "11:05 AM" },
    ],
    [userChat[3].name]: [
      { id: 1, text: "Hey Gokul!", sender: "them", time: "11:00 AM" },
      { id: 2, text: "Yes tell me?", sender: "gokul", time: "11:02 AM" },
      { id: 3, text: "Need help with React state", sender: "them", time: "11:05 AM" },
    ],
  });

  const activeUser = userChat[activeIndex];
  const currentMessages = chatHistories[activeUser.name] || [];

  const handleSendMessage = () => {
    if (!inputText.trim()) return;
    const newMessage = {
      id: Date.now(),
      text: inputText,
      sender: "gokul",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setChatHistories(prev => ({
      ...prev,
      [activeUser.name]: [...(prev[activeUser.name] || []), newMessage]
    }));
    setInputText("");
  };

  return (
    <main className="h-screen lg:mx-15 my-18 bg-gray-100 flex items-center justify-center p-0 lg:p-10 ">
      <title>Chat | {activeUser?.name}</title>

      <div className="w-full max-w-7xl h-full lg:h-[85vh] grid grid-cols-12 bg-white lg:rounded-2xl lg:shadow-2xl overflow-hidden">

        {/* Sidebar */}
        <section className={`${showChat ? 'hidden lg:flex col-span-3 ' : 'flex col-span-12 lg:col-span-4 xl:col-span-3'} flex-col border-r border-gray-100 bg-white`}>
          <div className='p-6 pb-2'>
            <h1 className='text-2xl font-bold text-gray-800'>Chats</h1>
            <div className="mt-4 relative">
              <input type="text" placeholder="Search chats..." className="w-full bg-gray-50 border-none rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-blue-100" />
            </div>
          </div>

          <div className='flex-1 overflow-y-auto px-2 py-4 space-y-1 '>
            {userChat.map((user, index) => {
              const messages = chatHistories[user.name] || [];
              const lastMsg = messages.length > 0 ? messages[messages.length - 1] : { text: user.lastMessage, time: "" };

              return (
                <div
                  key={index}
                  onClick={() => { setActiveIndex(index); setShowChat(true); }}
                  className={`flex items-center p-3 cursor-pointer rounded-xl transition-all
                    ${activeIndex === index ? "bg-blue-50" : "hover:bg-gray-50"}`}
                >
                  <div className='relative  shrink-0 w-10 h-10'>
                    <Image src={user.img} sizes='true' fill alt="" className={`w-12 h-12 rounded-full object-cover ${activeIndex === index ? "ring-2 ring-blue-500" : "ring-1 ring-gray-200"}`} />
                    {user.lastSeen === "Active" && <span className='absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full'></span>}
                  </div>
                  <div className="ml-3 flex-1 min-w-0">
                    <div className="flex justify-between items-baseline">
                      <h3 className={`font-bold truncate text-sm ${activeIndex === index ? "text-blue-700" : "text-gray-800"}`}>{user.name}</h3>
                      <span className="text-[10px] text-gray-400 shrink-0">{lastMsg.time || 'now'}</span>
                    </div>
                    <p className={`text-xs truncate ${activeIndex === index ? "text-blue-600/70" : "text-gray-500"}`}>
                      {lastMsg.text}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Chat Area*/}
        <div className={`${showChat ? 'col-span-12 lg:col-span-9 xl:col-span-9' : 'hidden lg:block lg:col-span-5 xl:col-span-9'} relative h-full`}>
          <AnimatePresence mode="wait">
            {showChat ? (
              <motion.div
                key={activeUser.name}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                className="h-full"
              >
                <ChatBox
                  activeUser={activeUser}
                  messages={currentMessages}
                  inputText={inputText}
                  setInputText={setInputText}
                  onSendMessage={handleSendMessage}
                  onBack={() => setShowChat(false)}
                />
              </motion.div>
            ) : (
              <div className=" hidden lg:flex h-full items-center justify-center bg-gray-50 text-gray-400 flex-col space-y-2 min-w-2xl">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                  <IoSend size={24} className="-rotate-45 translate-x-1" />
                </div>
                <p className="text-sm font-medium">Select a conversation to start messaging</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}

export default Page;
