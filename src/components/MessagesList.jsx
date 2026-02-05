import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { ChevronDown, ChevronUp, Circle, MoreHorizontal, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { FaRegEdit, FaSlidersH } from "react-icons/fa";

const formatDate = (dateString) => {
    const date = new Date(dateString);
    
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    });
  };

const MessagesList= () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState('Focused');
  const [messages,setMessages]=useState([]);
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

  const getLatestMessages=async()=>{
    try {
        const res=await axios.get("https://cwt-net-backend.vercel.app/api/v1/message/latestMessages",{withCredentials:true});
        const msgData=res.data?.chats?.map((chat)=>chat.latestMessage)
        setMessages(msgData);
    } catch (error) {
        console.log(error);
    }
  }
  

  useEffect(()=>{
    getLatestMessages();
  },[]);

  return (
    <div className="fixed bottom-0 right-4 z-50">
      <div className="w-96 bg-white shadow-lg rounded-t-lg">
        {/* Collapsed Header - Always visible */}
        <div 
          className="flex items-center justify-between p-4 cursor-pointer border border-gray-200 rounded-t-lg"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center gap-2">
            <img src={authUser.profilePicture || "/api/placeholder/32/32"} alt="Profile" className="w-8 h-8 rounded-full" />
            <span className="font-semibold">Messaging</span>
          </div>
          <div className="flex items-center gap-2">
          <FaRegEdit/>
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <MoreHorizontal className="w-5 h-5 text-gray-600" />
            </button>
            {isExpanded ? (
              <ChevronDown className="w-5 h-5 text-gray-600" />
            ) : (
              <ChevronUp className="w-5 h-5 text-gray-600" />
            )}
          </div>
        </div>

        {/* Expandable Content */}
        {isExpanded && (
          <div className="border-x border-b border-gray-200">
            {/* Search */}
            <div className="p-2 border-b border-gray-200">
              <div className="flex items-center gap-2 bg-gray-100 rounded-md p-2">
                <Search className="w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search messages"
                  className="bg-transparent border-none outline-none flex-1 text-sm"
                />
                <FaSlidersH className="w-5 h-5 text-gray-500" />
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200">
              <button
                className={`flex-1 py-3 text-sm font-medium border-b-2 ${
                  activeTab === 'Focused'
                    ? 'border-green-600 text-green-600'
                    : 'border-transparent text-gray-500'
                }`}
                onClick={() => setActiveTab('Focused')}
              >
                Focused
              </button>
              <button
                className={`flex-1 py-3 text-sm font-medium border-b-2 ${
                  activeTab === 'Other'
                    ? 'border-green-600 text-green-600'
                    : 'border-transparent text-gray-500'
                }`}
                onClick={() => setActiveTab('Other')}
              >
                Other
              </button>
            </div>

            {/* Messages List */}
            <div className="max-h-[400px] overflow-y-auto">
              {messages?.map((message) => (
                <div key={message.msg_id} className="flex gap-3 p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100">
                  <div className="relative">
                    <img src={message.profilePicture} alt={message.senderName} className="w-12 h-12 rounded-full" />
                    {message.online && (
                      <Circle className="w-3 h-3 text-green-500 absolute bottom-0 right-0 fill-current" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium text-sm truncate">{message.senderName}</h4>
                      <span className="text-xs text-gray-500 whitespace-nowrap ml-2">{formatDate(message.date)}</span>
                    </div>
                    <p className="text-sm text-gray-600 truncate">{message.message}</p>
                    <p className={`text-sm truncate ${message.hasBlueText ? 'text-blue-600' : 'text-gray-500'}`}>
                      {message.preview}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesList;