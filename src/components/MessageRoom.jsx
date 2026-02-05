import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { ArrowLeft, ChevronDown, Edit, Image, MoreHorizontal, MoreVertical, Paperclip, Search, Send, Star, Trash, User, Video } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { axiosInstance } from '../lib/axios';
import socket from "../socket";
import NewGroup from "./NewGroup";

const MessageRoom = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [activeChat, setActiveChat] = useState({});
  const [activeMessages, setActiveMessages] = useState([]);
  const [openNewGroupSelector, setOpenNewGroupSelector] = useState(false);
  const [message, setMessage] = useState('');
  const [showSidebar, setShowSidebar] = useState(true);
  const [filterType, setFilterType] = useState('Focused');
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const [connections, setConnections] = useState([]);
  const [chatGroups, setChatGroups] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [activeMessageOptions, setActiveMessageOptions] = useState(null);
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

  const msgRef = useRef();
  const [editingMessage, setEditingMessage] = useState(null);



  useEffect(() => {
    socket.connect();

    if (authUser) {
      const { _id, name, username, email, phone } = authUser;
      socket.emit('setup', { _id, name, username, email, phone });
    }

    return () => {
      socket.disconnect();
    }
  }, [authUser]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeMessages]);

  useEffect(() => {
    if (selectedUser) {
      scrollToBottom();
      // Hide sidebar on mobile when a chat is selected
      if (window.innerWidth < 768) {
        setShowSidebar(false);
      }
    }
  }, [selectedUser]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    try {
      const usersData = activeChat?.users?.map((item) => ({ _id: item._id, name: item.name }));

      if(!editingMessage){
        const res = await axios.post('https://cwt-net-backend.vercel.app/api/v1/message/add', {
          msgtext: message,
          chatId: activeChat._id,
          users: usersData
        }, { withCredentials: true });
        if (res) {
          setActiveMessages((prev) => [...prev, res.data?.message]);
        }
      }else{
        const res = await axios.post('https://cwt-net-backend.vercel.app/api/v1/message/update', {
          msgtext: message,
          msgId: editingMessage._id,
          users: usersData
        }, { withCredentials: true });
        if (res) {
          const data=activeMessages.map((msg)=>msg._id === res.data?.message?._id ? res.data?.message : msg)
          setActiveMessages(data);
          setEditingMessage(null);
        }
      }

    } catch (error) {
      console.log("handleSendMessage :", error)
    }

    setMessage('');
    setTimeout(scrollToBottom, 100);
  };

  const handleDeleteMessage=async(msgId)=>{
     try {
      const usersData = activeChat?.users?.map((item) => ({ _id: item._id, name: item.name }));
      const res = await axios.post(`https://cwt-net-backend.vercel.app/api/v1/message/delete/${msgId}`,{ chatId: activeChat._id,users: usersData}, { withCredentials: true });
      if (res) {
        const data=activeMessages.filter((msg)=>msg._id !== msgId)
        setActiveMessages(data);
      }
     } catch (error) {
       console.log("error :",error);
     }
  }

  const handleStartChat = async (connection) => {
    setSelectedUser(connection);
    try {
      const res = await axios.post('https://cwt-net-backend.vercel.app/api/v1/chat', {
        userId: connection._id
      }, { withCredentials: true });

      if (res) {
        setActiveChat(res.data?.chat);
        setActiveMessages(res.data.chat?.latestMessage);
      }
    } catch (error) {
      console.log("handleStartChat error:", error)
    }
  };

  const handleStartGroupChat = (chat) => {
    setSelectedUser(chat);
    setActiveChat(chat);
    setActiveMessages(chat?.latestMessage);
  };

  const getAllConnections = async () => {
    try {
      const res = await axiosInstance.get("/connections");
      setConnections(res?.data);
    } catch (error) {
      console.log("getAllConnections In ChatRoom :", error);
    }
  };

  const getAllGroups = async () => {
    try {
      const res = await axios.get('https://cwt-net-backend.vercel.app/api/v1/chat/allChats', { withCredentials: true });
      const groups = res.data?.chats?.filter((item) => item.isGroupChat);
      setChatGroups(groups);
    } catch (error) {
      console.log("Get All Groups error :", error);
    }
  };

  const getOnlineConnections = async () => {
    try {
      const res = await axios.get('https://cwt-net-backend.vercel.app/api/v1/connections/onlineConnection', { withCredentials: true });
      setOnlineUsers(res.data?.onlineUsers);
    } catch (error) {
      console.log("getOnlineConnections error :", error);
    }
  };

  useEffect(() => {
    getAllConnections();
    getAllGroups();
    getOnlineConnections();

    socket?.on('addedNewMessage', (data) => {
      if (data.message.chat === activeChat._id) {
        setActiveMessages((prev) => [...prev, data?.message]);
      }
    });

    socket?.on('updateMessage', (data) => {
      if (data.message.chat === activeChat._id) {
        const updatedActiveMessages=activeMessages.map((msg)=>msg._id === data?.message?._id ? data?.message : msg)
        setActiveMessages(updatedActiveMessages);
      }
    });

    socket?.on('deleteMessage', (data) => {
      if (data.message.chat === activeChat._id) {
        const updatedActiveMessages=activeMessages.filter((msg)=>msg._id !== data?.message?._id)
        setActiveMessages(updatedActiveMessages);
      }
    });

    // Listen for online users updates
    socket.on('onlineUsers', (users) => {
      setOnlineUsers(users);
    });

    return () => {
      socket.off('addedNewMessage');
      socket.off('updateMessage');
      socket.off('deleteMessage');
      socket.off('onlineUsers');
    }
  }, [activeChat]);

  // Helper function to check if a user is online
  const isUserOnline = (userId) => {
    return onlineUsers.some(user => user.userId === userId);
  };

  // Helper to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getDayLabel = (timestamp) => {
    if (!timestamp) return "Today"; // Default fallback

    const messageDate = new Date(timestamp);
    const today = new Date();

    // Reset hours to compare just the dates
    const messageDay = new Date(messageDate.getFullYear(), messageDate.getMonth(), messageDate.getDate());
    const todayDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const yesterdayDay = new Date(todayDay);
    yesterdayDay.setDate(yesterdayDay.getDate() - 1);

    // Compare dates
    if (messageDay.getTime() === todayDay.getTime()) {
      return "Today";
    } else if (messageDay.getTime() === yesterdayDay.getTime()) {
      return "Yesterday";
    } else {
      // For other dates, format as needed
      const options = { weekday: 'long', month: 'long', day: 'numeric' };
      return messageDate.toLocaleDateString('en-US', options);
    }
  };


  // Group messages by date
  const groupMessagesByDate = (messages) => {
    if (!messages || messages.length === 0) return {};

    const groups = {};
    messages.forEach(msg => {
      // const dayLabel = getDayLabel(msg.timestamp);
      const dayLabel = getDayLabel(msg.createdAt);
      if (!groups[dayLabel]) {
        groups[dayLabel] = [];
      }
      groups[dayLabel].push(msg);
    });

    return groups;
  };

  const groupedMessages = groupMessagesByDate(activeMessages || []);


    // Handle editing message
    const handleEditMessage = (message) => {
      setEditingMessage(message);
      setMessage(message.content);
      setActiveMessageOptions(null);
    };

  // Close options menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (msgRef.current && !msgRef.current.contains(event.target)) {
        setActiveMessageOptions(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="h-screen max-h-screen bg-gray-50">
      {openNewGroupSelector && (
        <NewGroup connections={connections} setOpenNewGroupSelector={setOpenNewGroupSelector} />
      )}
      <div className="h-full w-full">


        <div>
          {/* Header */}
          <div className="border-b border-gray-200 p-4 flex items-center justify-between">
            <div className='flex items-center gap-2'>
              <h2 className="text-xl font-semibold text-gray-800">Messaging</h2>
              <div className="p-2 rounded-md bg-gray-200 flex items-center gap-2">
                <Search className="h-5 w-5 text-gray-500" />
                <input type='text' placeholder='Search messages' className='border-none outline-none bg-gray-200' />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-full hover:bg-gray-100">
                <MoreHorizontal className="h-5 w-5 text-gray-500" />
              </button>
              <button
                onClick={() => setOpenNewGroupSelector(true)}
                className="p-2 rounded-full hover:bg-gray-100">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21h-9.5A2.25 2.25 0 014 18.75V8.25A2.25 2.25 0 016.25 6H11" />
                </svg>
              </button>
            </div>
          </div>

          {/* Filter tabs */}
          <div className="flex border-b border-gray-200 gap-4 p-2 sm:gap-5">
            <button
              className={`flex py-1 text-center border border-gray-300 rounded-3xl px-3 ${filterType === 'Focused' ? 'bg-green-600 font-medium border-green-600 text-white' : 'text-gray-700'}`}
              onClick={() => setFilterType('Focused')}
            >
              <span>
                Focused
              </span>
              <ChevronDown />
            </button>
            <button
              className={`py-1 text-center border border-gray-300 rounded-3xl px-3 ${filterType === 'Unread' ? 'bg-green-600 font-medium border-green-600 text-white' : 'text-gray-700'}`}
              onClick={() => setFilterType('Unread')}
            >
              Unread
            </button>
            <button
              className={`py-1 text-center border border-gray-300 rounded-3xl px-3 ${filterType === 'My Connections' ? 'bg-green-600 font-medium border-green-600 text-white' : 'text-gray-700'}`}
              onClick={() => setFilterType('My Connections')}
            >
              My Connections
            </button>

            <button
              className={`py-1 text-center border border-gray-300 rounded-3xl px-3 ${filterType === 'InMail' ? 'bg-green-600 font-medium border-green-600 text-white' : 'text-gray-700'}`}
              onClick={() => setFilterType('InMail')}
            >
              InMail
            </button>

            <button
              className={`py-1 text-center border border-gray-300 rounded-3xl px-3 ${filterType === 'Starred' ? 'bg-green-600 font-medium border-green-600 text-white' : 'text-gray-700'}`}
              onClick={() => setFilterType('Starred')}
            >
              Starred
            </button>
          </div>
        </div>


        <div className="flex h-full overflow-hidden bg-white">
          {/* Sidebar */}
          <div className={`${showSidebar ? 'flex' : 'hidden'} md:flex flex-col w-full md:w-96 flex-shrink-0 border-r border-gray-200`}>


            <div className="flex-1 overflow-y-auto">
              {/* Connections and chats list */}
              {connections?.map((connection) => (
                <div
                  key={connection._id}
                  onClick={() => handleStartChat(connection)}
                  className={`flex items-center gap-3 border-b border-gray-100 p-4 hover:bg-blue-50 cursor-pointer relative
                    ${selectedUser?._id === connection._id ? 'bg-blue-50' : ''}`}
                >
                  <div className="relative">
                    {connection.profilePicture ? (
                      <img
                        src={connection.profilePicture}
                        alt={connection.name}
                        className="h-12 w-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200">
                        <User className="h-6 w-6 text-gray-500" />
                      </div>
                    )}
                    {isUserOnline(connection._id) && (
                      <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 ring-2 ring-white" />
                    )}
                  </div>
                  <div className="flex-1 overflow-hidden pr-4">
                    <div className="flex justify-between">
                      <h3 className="font-medium text-gray-900">{connection.name}</h3>
                      <span className="text-xs text-gray-500">{formatDate(connection.lastMessageTime || new Date())}</span>
                    </div>
                    <div className="flex">
                      <p className="truncate text-sm text-gray-500 flex-1">
                        {connection.lastMessage || (isUserOnline(connection._id) ? 'Online' : 'Offline')}
                      </p>
                    </div>
                  </div>
                  <div className="absolute right-2 top-4">
                    <Star className="h-5 w-5 text-gray-300 hover:text-yellow-500" />
                  </div>
                </div>
              ))}

              {/* Groups */}
              {chatGroups?.map((group) => (
                <div
                  key={group._id}
                  onClick={() => handleStartGroupChat(group)}
                  className={`flex items-center gap-3 border-b border-gray-100 p-4 hover:bg-blue-50 cursor-pointer
                    ${selectedUser?._id === group._id ? 'bg-blue-50' : ''}`}
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-500">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                    </svg>
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <div className="flex justify-between">
                      <h3 className="font-medium text-gray-900">{group.chatName}</h3>
                      <span className="text-xs text-gray-500">{formatDate(group.updatedAt || new Date())}</span>
                    </div>
                    <p className="truncate text-sm text-gray-500">{group?.latestMessage[0]?.content?.slice(0,12) || 'No messages yet'}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chat area */}
          <div className={`${!showSidebar ? 'flex' : 'hidden'} md:flex flex-col flex-1`}>
            {/* Chat header */}
            {selectedUser ? (
              <div className="flex items-center justify-between border-b border-gray-200 p-4">
                <div className="flex items-center gap-3">
                  {/* Mobile back button */}
                  <button
                    onClick={() => setShowSidebar(true)}
                    className="md:hidden p-1 hover:bg-gray-100 rounded-full"
                  ><ArrowLeft className="h-5 w-5" />
                  </button>

                  {selectedUser.profilePicture ? (
                    <img
                      src={selectedUser.profilePicture}
                      alt={selectedUser.name}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200">
                      <User className="h-6 w-6 text-gray-500" />
                    </div>
                  )}

                  <div>
                    <h2 className="font-semibold text-gray-900">{selectedUser.name}</h2>
                    <p className="text-sm text-gray-500">{isUserOnline(selectedUser._id) ? 'Online' : 'Offline'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button className="p-2 rounded-full hover:bg-gray-100">
                    <MoreHorizontal className="h-5 w-5 text-gray-500" />
                  </button>
                  <button className="p-2 rounded-full hover:bg-gray-100">
                    <Video className="h-5 w-5 text-gray-500" />
                  </button>
                  <button className="p-2 rounded-full hover:bg-gray-100">
                    <Star className="h-5 w-5 text-gray-500" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between border-b border-gray-200 p-4">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowSidebar(true)}
                    className="md:hidden p-1 hover:bg-gray-100 rounded-full"
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </button>

                  <h2 className="font-semibold text-gray-900">Select a conversation</h2>
                </div>
              </div>
            )}


            {/* Messages - updated to group by date */}
            <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 bg-gray-50">
              {selectedUser ? (
                <>
                  {Object.keys(groupedMessages).map(dayLabel => (
                    <div key={dayLabel}>
                      {/* Day label */}
                      <div className="text-center mb-4">
                        <span className="inline-block px-2 py-1 text-xs font-medium text-gray-500 bg-gray-100 rounded">
                          {dayLabel}
                        </span>
                      </div>

                      {/* Messages for this day */}
                      {groupedMessages[dayLabel].map((msg) => (
                        <div
                          key={msg._id}
                          className={`mb-4 group flex ${msg.sender === authUser?._id ? 'justify-end' : 'justify-start'}`}
                        >
                          {msg.sender !== authUser?._id && (
                            <div className="h-8 w-8 rounded-full overflow-hidden flex-shrink-0 mr-2">
                              {selectedUser.profilePicture ? (
                                <img
                                  src={selectedUser.profilePicture}
                                  alt={selectedUser.name}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center bg-gray-200">
                                  <User className="h-4 w-4 text-gray-500" />
                                </div>
                              )}
                            </div>
                          )}

                          <div
                            className={`relative max-w-[85%] md:max-w-[70%] rounded-lg px-4 py-2 ${msg.sender === authUser?._id
                              ? 'bg-blue-500 text-white rounded-tr-none pr-6'
                              : 'bg-white text-gray-900 rounded-tl-none pr-6 border border-gray-200'
                              }`}
                          >
                            <p>{msg.content}</p>
                            <span className={`text-xs mt-1 ${msg.sender === authUser?._id ? 'text-blue-100' : 'text-gray-400'
                              }`}>
                              {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '9:46 PM'}
                            </span>
                         {msg.sender === authUser?._id && <div className='absolute top-2 right-0' onClick={() => setActiveMessageOptions(activeMessageOptions === msg._id ? null : msg._id)}>
                              <MoreVertical className='text-red-800 opacity-20 group-hover:opacity-100 cursor-pointer' />
                            </div>}

                            {
                              activeMessageOptions === msg._id && (
                                <div  ref={msgRef} className='absolute z-30 top-0 right-0 bg-white p-2 border rounded-md border-gray-200 shadow-lg'>
                                  <button
                                    onClick={() => handleEditMessage(msg)}
                                    className="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                  >
                                    <Edit className="h-4 w-4 mr-2" /> Edit
                                  </button>
                                  <button
                                    onClick={() => handleDeleteMessage(msg._id)}
                                    className="w-full flex items-center px-3 py-2 text-sm text-red-600 hover:bg-gray-100"
                                  >
                                    <Trash className="h-4 w-4 mr-2" /> Delete
                                  </button>
                                </div>
                              )
                            }
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </>
              ) : (
                <div className="flex h-full items-center justify-center text-gray-500">
                  Select a conversation to start messaging
                </div>
              )}
            </div>

            {/* Message input */}
            {selectedUser && (
              <div className="border-t border-gray-200 p-4 bg-white">
                <form onSubmit={handleSendMessage} className="flex items-end gap-2">
                  <div className="flex items-center gap-2">
                    <button type="button" className="p-2 rounded-full hover:bg-gray-100 text-gray-500">
                      <Image className="h-5 w-5" />
                    </button>
                    <button type="button" className="p-2 rounded-full hover:bg-gray-100 text-gray-500">
                      <Paperclip className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="flex-1 rounded-lg border border-gray-300 bg-white overflow-hidden">
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Write a message..."
                      className="w-full px-4 py-3 focus:outline-none resize-none"
                      rows={1}
                    />
                  </div>

                  <button
                    type="submit"
                    className="p-3 rounded-full bg-blue-600 text-white hover:bg-blue-700"
                    disabled={!message.trim()}
                  >
                    <Send className="h-5 w-5" />
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageRoom;

