import { Calendar, Link, Pencil, Trash2Icon, UserRound, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

const EventCard = ({ event,authUser,setEventData,setShowAddEvent,setEventStatus,deleteEvent,joinEvent}) =>{
  const handleEdit=()=>{
    setEventData({
      coverImage: event.coverImage,
      eventType: event.eventType,
      eventName: event.eventName,
      startDate: event.startDate,
      startTime: event.startTime,
      endDate: event.endDate,
      endTime: event.endTime,
      externalLink: event.externalLink,
      description: event.description,
      hostName: event.hostName,
      type: event.type
    });
    setShowAddEvent(true);
    setEventStatus(`update/${event._id}`)
  } 

  const navigate=useNavigate();

  const eventDetail=(id)=>{
     navigate(`/event/${id}`);
  }

  return(
  <div className="relative bg-white rounded-lg pt-2 pb-6 shadow-md overflow-hidden transition hover:shadow-xl">
    {event.coverImage && (
      <img 
        src={event.coverImage} 
        alt={event.eventName} 
        className="w-full md:w-auto md:max-h-52 object-cover mx-auto p-1 rounded-lg"
      />
    )}

    {
      authUser._id===event.user && (<div className="absolute top-2 right-2 flex flex-col gap-1 justify-center items-center">
        <Pencil onClick={handleEdit} className="size-4 text-gray-500 hover:text-red-500 cursor-pointer"/>
        <Trash2Icon onClick={()=>deleteEvent(event._id)} className="size-4 text-gray-500 hover:text-red-500 cursor-pointer"/>
      </div>)
    }

    
    <div className="p-4">
      <div className="flex justify-between mb-2">
        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
          {event.eventType}
        </span>
        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
          {event.type}
        </span>
      </div>
      
      <h3 className="text-xl font-bold text-gray-800 mb-2">
        {event.eventName.length > 40 ? (event.eventName.slice(0,40)+'...'):event.eventName}
      </h3>
      
      <div className="space-y-2 text-gray-600 mb-4">
        <div className="flex items-center">
          <Calendar className="mr-2 w-4 h-4" />
          {event.startDate} at {event.startTime}
        </div>
        
        {event.hostName && (
          <div className="flex items-center">
            <UserRound className="mr-2 w-4 h-4" />
            {event.hostName.length > 40 ? event.hostName.slice(0,40)+'...' : event.hostName}
          </div>
        )}
        {event?.participants?.length > 0 && (
          <div className="flex items-center">
            <Users className="mr-2 w-4 h-4" />
            Participants :{event?.participants?.length}
          </div>
        )}
        
        {event.externalLink && (
          <div className="flex items-center">
            <Link className="mr-2 w-4 h-4" />
            <a 
              href={event.externalLink} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-blue-600 hover:underline"
            >
              Event Link
            </a>
          </div>
        )}
      </div>
      
      <p className="text-gray-700 mb-4 line-clamp-3">
        {event.description.length > 80 ? event.description.slice(0,80)+'...':event.description }
      </p>
    </div>
    
  
      <div className="absolute bottom-2 left-2 w-[95%] gap-1 flex justify-between">
        <button onClick={()=>eventDetail(event._id)} className="bg-blue-500 text-white py-2 w-1/2 rounded-md hover:bg-blue-600">
          View Details
        </button>
        { event.participants?.includes(authUser._id) ? (
        <button
          onClick={() => joinEvent(event._id, false)}
          className="bg-green-400 hover:bg-green-500 text-white py-2 w-1/2 rounded-md"
        >
          Joined Event
        </button>
      ) : (
        <button
          onClick={() => joinEvent(event._id, true)}
          className="bg-red-500 hover:bg-red-600 text-white py-2 w-1/2 rounded-md"
        >
          Join Event
        </button>
      )
   }
   </div>

  </div>
)};

export default EventCard