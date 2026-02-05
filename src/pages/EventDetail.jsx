import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
    Calendar,
    CheckCircle2,
    Link as LinkIcon,
    Loader2,
    MapPin,
    Share2,
    Star,
    UserPlus,
    Users
} from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";

const EventDetail = () => {
  const [eventData, setEventData] = useState(null);
  const [isJoined, setIsJoined] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [flag,setFlag]=useState(false);
  const { eventId } = useParams();
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });


  const getEventDetail = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(`https://cwt-net-backend.vercel.app/api/v1/events/detail/${eventId}`, {
        withCredentials: true,
      });
      if (res) {
        setEventData(res.data?.event);
        // Assume this is how we check if user is already joined
        setIsJoined(res.data?.event.participants?.some(p => p._id === authUser._id));
      }
    } catch (error) {
      console.error("Event Detail Error:", error);
    } finally {
      setIsLoading(false);
    }
  };


  const joinEvent=async(eventId,status)=>{
    try { //if want to join =>status:true otherwise status:false
      const res=await axios.post(`https://cwt-net-backend.vercel.app/api/v1/events/join/${eventId}`,{status},{withCredentials:true});
      if(res){
        toast.success(res.data?.message);
        if(status){
            setIsJoined(true);
            setFlag(!flag)
        }else{
            setIsJoined(false);
            setFlag(!flag)
        }
      }
    } catch (error) {
      if(error.response?.data){
        toast.error(error.response?.data?.message);
      }
    }
  }

  const handleShareEvent = () => {
    if (navigator.share) {
      navigator.share({
        title: eventData.eventName,
        text: `Check out this event: ${eventData.eventName}`,
        url: window.location.href
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href);
      alert('Event link copied to clipboard!');
    }
  };

  useEffect(() => {
    getEventDetail();
  }, [flag]);

  if (isLoading)
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Loader2 className="animate-spin w-16 h-16 text-blue-600" />
      </div>
    );

  if (!eventData) return null;

  return (
    <div className="max-w-6xl mx-auto sm:px-4 py-8 bg-gray-50 min-h-screen">
      {/* Event Header with Cover and Quick Info */}
      <div className="relative">
        {eventData.coverImage && (
          <div 
            className="w-full h-80 bg-cover bg-center rounded-2xl shadow-lg"
            style={{ backgroundImage: `url(${eventData.coverImage})`, backgroundRepeat:'none'}}
          >
            <div className="absolute top-4 right-4 flex space-x-3">
              <button 
                onClick={handleShareEvent}
                className="bg-white/70 p-2 rounded-full hover:bg-white transition"
                title="Share Event"
              >
                <Share2 className="text-gray-700" />
              </button>
              <button 
                className="bg-white/70 p-2 rounded-full hover:bg-white transition"
                title="Favorite Event"
              >
                <Star className="text-gray-700" />
              </button>
            </div>
          </div>
        )}

        {/* Event Main Details */}
        <div className="bg-white rounded-t-2xl px-2 py-6 sm:p-6 shadow-md mt-4 relative">
          <h1 className="text-lg font-bold text-gray-900 mb-2">{eventData.eventName}</h1>
          <div className="flex items-center text-gray-600 mb-4">
            <span>Hosted by <span className="font-semibold">{eventData.hostName}</span></span>
          </div>

          {/* Quick Event Metrics */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-6 text-center">
            <div className="bg-blue-50 p-3 rounded-lg">
              <Calendar className="mx-auto mb-2 text-blue-600" />
              <p className="text-sm font-medium">{eventData.startDate}</p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <MapPin className="mx-auto mb-2 text-green-600" />
              <p className="text-sm font-medium">{eventData.eventType}</p>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg">
              <Users className="mx-auto mb-2 text-purple-600" />
              <p className="text-sm font-medium">{eventData.participants?.length || 0} Joined</p>
            </div>
          </div>

          {/* Join/Leave Button */}
          <div className="flex space-x-4">
            {isJoined ? (
              <button
                onClick={()=>joinEvent(eventData._id,false)}
                className="flex-1 bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition flex items-center justify-center"
              >
                <CheckCircle2 className="mr-2" /> Leave Event
              </button>
            ) : (
              <button
                onClick={()=>joinEvent(eventData._id,true)}
                className="flex-1 bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition flex items-center justify-center"
              >
                <UserPlus className="mr-2" /> Join Event
              </button>
            )}
          </div>
        </div>
      </div>

        {/* Event Description */}
    { eventData.description && <div className="bg-white px-2 py-6 sm:p-6 rounded-b-2xl shadow-md mb-2">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Event Description</h2>
          <p className="text-gray-600 leading-relaxed">{eventData.description}</p>

          {eventData.externalLink && (
            <div className="mt-4 flex items-center">
              <LinkIcon className="mr-2 text-blue-600" />
              <a 
                href={eventData.externalLink} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-500 hover:underline"
              >
                Additional Event Link
              </a>
            </div>
          )}
        </div>}
      {/* Event Participants */}
      {eventData.participants?.length > 0 && <div className="bg-white px-2 py-6 sm:p-6 rounded-2xl shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Event Participants</h2>
          <div className="space-y-4">
            {eventData.participants?.map((user) => (
              <div 
                key={user._id} 
                className="flex items-center bg-gray-100 p-3 rounded-lg hover:bg-gray-200 transition"
              >
                <img 
                  src={user.profilePicture || '/default-avatar.png'} 
                  alt={user.name} 
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <h3 className="font-medium text-gray-800">{user.name}</h3>
                  <p className="text-sm text-gray-600">{user.headline}</p>
                </div>
              </div>
            ))}
          </div>
        </div>}
    </div>
  );
};

export default EventDetail;
