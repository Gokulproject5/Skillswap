"use client"
import React, { useState, useRef, useEffect, useContext } from 'react'
import { BiPaperclip, BiSolidVideo, BiArrowBack } from 'react-icons/bi';
import { IoCallSharp, IoSend } from 'react-icons/io5';
import { MdMoreVert } from 'react-icons/md';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useSelector, useDispatch } from 'react-redux';
import { SocketContext } from '@/Context/SocketContext';
import { setUsers } from '@/feature/userSlice';
import { BanIcon } from 'lucide-react';
import { useAuth } from '@/Context/authContext';


// ChatBox
const ChatBox = ({ activeUser, messages, inputText, setInputText, onSendMessage, onBack }) => {
  const scrollRef = useRef(null);
  const { callUser, setName } = useContext(SocketContext);
  const { user } = useAuth();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        // behavior: 'smooth'
      });
    }
  }, [messages]);

  useEffect(() => {
    if (user?.name && setName) {
      setName(user.name);
    }
  }, [user, setName]);

  const handleVideoIconClick = (activeUser) => {
    const targetUserId = activeUser?._id || activeUser?.id || activeUser?.name;
    callUser(targetUserId);
  };

  return (
    <section className='relative flex flex-col w-full h-full bg-gray-50 overflow-hidden lg:rounded-2xl lg:border lg:border-gray-200 lg:shadow-xl'>
      {/* Header */}
      <div className='sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-gray-100 px-4 py-5 flex items-center justify-between shrink-0'>
        <div className='flex items-center space-x-3'>
          <button
            onClick={onBack}
            className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-full"
          >
            <BiArrowBack size={20} />
          </button>

          <div className='relative'>
            <img
              src={activeUser?.profile_pic || '/fallback.jpg'}
              alt=""
              className='w-10 h-10 rounded-full object-cover ring-2 ring-gray-100'
            />
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
          <button
            onClick={() => handleVideoIconClick(activeUser)}
            className='p-2 hover:bg-gray-100 hover:text-blue-600 rounded-full transition-colors'
          >
            <BiSolidVideo size={20} />
          </button>

          <div className='p-2 relative group flex justify-center items-center hover:bg-gray-100 transition-all hover:text-blue-600 rounded-full cursor-pointer'>
            <MdMoreVert size={20} />

            <div className='absolute hidden group-hover:block top-8 right-0 pt-5 w-60 z-10 transition-all'>
              <div className='shadow border border-gray-200 bg-white rounded-md rounded-tr-none  overflow-hidden'>
                <button className='text-sm flex items-center gap-3 w-full text-gray-600 hover:bg-gray-50 hover:text-red-500  p-3 transition-colors'>
                  <BanIcon size={18} />
                  <span>Report {activeUser?.name}</span>
                </button>

                <button className='text-sm flex items-center gap-3 w-full text-gray-600 hover:bg-gray-50 p-3 transition-colors'>
                  <BanIcon size={18} />
                  <span>Block User</span>
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>

      <div
        ref={scrollRef}
        className='flex-1 min-h-0 overflow-y-auto hide-scroll p-4 lg:p-6 bg-blue-50/10 space-y-4'
      >
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-sm text-gray-400">No messages yet. Say hello! </p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.sender === "gokul";
            return (
              <div key={msg.id} className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                <div className={`p-3 px-4 rounded-2xl max-w-[85%] lg:max-w-[70%] text-sm shadow-sm
                  ${isMe
                    ? "bg-blue-600 text-white rounded-tr-none"
                    : "bg-white text-gray-700 rounded-tl-none border border-gray-100"
                  }`}>
                  {msg.text}
                </div>
                <span className='text-[10px] text-gray-400 mt-1 mx-1'>{msg.time}</span>
              </div>
            );
          })
        )}
      </div>

      <div className='shrink-0 p-3 lg:p-4 bg-white border-t border-gray-100 flex items-center space-x-2'>
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
          <button
            onClick={onSendMessage}
            className='ml-2 text-blue-600 hover:scale-110 active:scale-95 transition-transform'
          >
            <IoSend size={20} />
          </button>
        </div>
      </div>
    </section>
  );
};


// Main Page
const Page = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [inputText, setInputText] = useState("");
  const [showChat, setShowChat] = useState(false);
  const [loading, setLoading] = useState(true);
  const [chatHistories, setChatHistories] = useState({});
  const dbUsers = useSelector((state) => state.userDatas.value) || [];
  const [chatUsers, setChatUsers] = useState([]);
  const dispatch = useDispatch();
  const api_base_url = process.env.NEXT_PUBLIC_API_BASE_URL;
  const { callUser, setName, socket } = useContext(SocketContext);
  const { user } = useAuth();

  // Fetch users
  useEffect(() => {
    if (!user) return;

    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${api_base_url}/user`, {
          method: "GET",
          credentials: "include"
        });
        const result = await response.json();
        const data = result.filter((d) => d._id !== user?.id);
        dispatch(setUsers(data));
      } catch (err) {
        console.error("Failed to fetch users:", err);
      } finally {
        setLoading(false);
      }
    };

    if (dbUsers.length === 0) {
      fetchUsers();
    } else {
      setLoading(false);
    }
  }, [dispatch, api_base_url, user]);

  // Filter connection data
  useEffect(() => {
    if (dbUsers.length > 0) {
      const connections = dbUsers.filter((d) =>
        user?.connection?.includes(d._id) || [].includes(d._id)
      );
      setChatUsers(user?.connection?.length > 0 ? connections : dbUsers);
    }
  }, [dbUsers, user]);

  // Socket — receive messages
  useEffect(() => {
    if (!socket) return;

    const handleReceiveMessage = (data) => {
      const senderUser = dbUsers.find(u => u._id === data.from);
      if (senderUser) {
        const newMessage = {
          id: Date.now(),
          text: data.text,
          sender: "them",
          time: data.time
        };
        setChatHistories(prev => ({
          ...prev,
          [senderUser.name]: [...(prev[senderUser.name] || []), newMessage]
        }));
      }
    };

    socket.on("receiveMessage", handleReceiveMessage);
    return () => socket.off("receiveMessage", handleReceiveMessage);
  }, [socket, dbUsers]);

  const activeUser = chatUsers[activeIndex];

  // Fetch chat history from DB
  useEffect(() => {
    if (activeUser && user && !chatHistories[activeUser.name]) {
      const fetchChatHistory = async () => {
        try {
          const response = await fetch(
            `${api_base_url}/message/${user._id}/${activeUser._id}`,
            { credentials: 'include' }
          );
          const messages = await response.json();

          const formattedMessages = messages.map(msg => ({
            id: msg._id,
            text: msg.text,
            sender: msg.sender === user._id ? 'gokul' : 'them',
            time: msg.time
          }));

          setChatHistories(prev => ({
            ...prev,
            [activeUser.name]: formattedMessages
          }));
        } catch (error) {
          console.error("Error fetching chat:", error);
        }
      };

      fetchChatHistory();
    }
  }, [activeUser, user, api_base_url]);

  const currentMessages = activeUser ? (chatHistories[activeUser.name] || []) : [];

  const handleSendMessage = () => {
    if (!inputText.trim() || !activeUser) return;

    const timeNow = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });

    const newMessage = {
      id: Date.now(),
      text: inputText,
      sender: "gokul",
      time: timeNow
    };

    setChatHistories(prev => ({
      ...prev,
      [activeUser.name]: [...(prev[activeUser.name] || []), newMessage]
    }));

    if (socket) {
      socket.emit('sendMessage', {
        to: activeUser._id,
        text: inputText,
        time: timeNow
      });
    }

    setInputText("");
  };

  return (

    <main className="h-screen my-22 lg:my-10 overflow-hidden lg:mx-15 bg-gray-100 flex items-center justify-center p-0 lg:p-10">
      <title>Chat | {activeUser?.name}</title>
      <div className="w-full max-w-7xl h-full lg:h-[85vh] grid grid-cols-12 bg-white lg:rounded-2xl lg:shadow-2xl overflow-hidden">
        <section className={`
          ${showChat ? 'hidden lg:flex lg:col-span-3' : 'flex col-span-12 lg:col-span-4 xl:col-span-3'}
          flex-col h-full border-r border-gray-100 bg-white
        `}>
          <div className='shrink-0 p-6 pb-2'>
            <h1 className='text-2xl font-bold text-gray-800'>Chats</h1>
            <div className="mt-4 relative">
              <input
                type="text"
                placeholder="Search chats..."
                className="w-full bg-gray-50 border-none rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-blue-100 outline-none"
              />
            </div>
          </div>

          <div className='flex-1 min-h-0 overflow-y-auto px-2 py-4 space-y-1'>
            {loading ? (
              <div className="p-4 text-center text-sm text-gray-500">Loading chats...</div>
            ) : chatUsers.length === 0 ? (
              <div className="p-4 text-center text-sm text-gray-400">No active connections found.</div>
            ) : (
              chatUsers.map((chatUser, index) => {
                const messages = chatHistories[chatUser.name] || [];
                const lastMsg = messages.length > 0
                  ? messages[messages.length - 1]
                  : { text: "", time: "" };

                return (
                  <div
                    key={chatUser._id || index}
                    onClick={() => { setActiveIndex(index); setShowChat(true); }}
                    className={`flex items-center p-3 cursor-pointer rounded-xl transition-all
                      ${activeIndex === index ? "bg-blue-50" : "hover:bg-gray-50"}`}
                  >
                    <div className='relative shrink-0 w-12 h-12'>
                      <Image
                        src={chatUser.profile_pic || '/fallback.jpg'}
                        sizes='48px'
                        fill
                        alt={chatUser.name}
                        className={`rounded-full object-cover ${activeIndex === index ? "ring-2 ring-blue-500" : "ring-1 ring-gray-200"}`}
                      />
                      {chatUser.lastSeen === "Active" && (
                        <span className='absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full'></span>
                      )}
                    </div>

                    <div className="ml-3 flex-1 min-w-0">
                      <div className="flex justify-between items-baseline">
                        <h3 className={`font-bold truncate text-sm ${activeIndex === index ? "text-blue-700" : "text-gray-800"}`}>
                          {chatUser.name}
                        </h3>
                        <span className="text-[10px] text-gray-400 shrink-0 ml-1">
                          {lastMsg.time || ''}
                        </span>
                      </div>
                      <p className={`text-xs truncate ${activeIndex === index ? "text-blue-600/70" : "text-gray-500"}`}>
                        {lastMsg.text || 'No messages yet'}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>

        {/* Chat Area */}
        <div className={`
          ${showChat ? 'col-span-12 lg:col-span-9 xl:col-span-9' : 'hidden lg:block lg:col-span-5 xl:col-span-9'}
          relative h-full overflow-hidden
        `}>
          <AnimatePresence mode="wait">
            {showChat ? (
              <motion.div
                key={activeUser?.name || 'chat'}
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
              <div className="hidden lg:flex h-full items-center justify-center bg-gray-50 text-gray-400 flex-col space-y-2">
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
};

export default Page;