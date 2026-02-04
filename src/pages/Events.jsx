import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import AddEvent from '../components/AddEvent';
import EventCard from '../components/EventCard';

let initialData={
  coverImage: null,
  eventType: 'ONLINE',
  eventName: '',
  startDate: '',
  startTime: '',
  endDate: '',
  endTime: '',
  externalLink: '',
  description: '',
  hostName: '',
  type: 'CLASS'
}

const Events = () => {
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [eventStatus,setEventStatus]=useState('create');//create or update/eventId
  const [eventData, setEventData] = useState(initialData);

  const [allEvents,setAllEvents]=useState([]);
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

  const getAllEvents=async()=>{
    try {
      const res=await axios.get('http://localhost:5000/api/v1/events/all',{withCredentials:true});
      if(res){
        setAllEvents(res.data?.events);
      }
    } catch (error) {
      console.log("getAllEvents :",error);
    }
  }

  const addNewEvent=(event)=>{
       if(eventStatus==='create'){
        setAllEvents([event,...allEvents])
       }else{
        const data=allEvents.filter((item)=>item._id !==event._id);
        setAllEvents([event,...data]);
       }
  }

  useEffect(()=>{
     getAllEvents();
  },[]);

  const deleteEvent=async(eventId)=>{
    try {
      const res=await axios.delete(`http://localhost:5000/api/v1/events/delete/${eventId}`,{withCredentials:true});
      if(res){
        toast.success(res.data?.message);
        const data=allEvents.filter((event)=>event._id !==eventId);
        setAllEvents([...data]);
      }
    } catch (error) {
      console.log("deleteEvent :",error);
      if(error.response?.data){
        toast.error(error.response?.data?.message);
      }
    }
  }

  const joinEvent=async(eventId,status)=>{
    try { //if want to join =>status:true otherwise status:false
      const res=await axios.post(`http://localhost:5000/api/v1/events/join/${eventId}`,{status},{withCredentials:true});
      if(res){
        toast.success(res.data?.message);
        const index=allEvents.findIndex((event)=>event._id ===eventId);
        if(index===-1){
         return toast.error('Event not found');
        }
      
        const updatedEvents=[...allEvents];
        updatedEvents[index]=res.data?.event;
        setAllEvents([...updatedEvents]);
      }
    } catch (error) {
      console.log("joinEvent :",error);
      if(error.response?.data){
        toast.error(error.response?.data?.message);
      }
    }
  }

  const yourEvents=allEvents.filter((event)=>event.user===authUser._id);
  const othersEvents=allEvents.filter((event)=>event.user!==authUser._id);

  return (
    <div className="container mx-auto sm:px-4 py-8">
      <div className="flex justify-between items-center bg-white p-4 rounded-lg mb-6">
        <h2 className="text-2xl font-bold">Upcoming Events</h2>
        <button 
          onClick={() => {setShowAddEvent(true); setEventStatus('create')}}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Create Event
        </button>
      </div>
       {showAddEvent && (
        <AddEvent
          onClose={() => {setShowAddEvent(false),setEventData(initialData)}}
          addNewEvent={addNewEvent}
          eventData={eventData}
          setEventData={setEventData}
          eventStatus={eventStatus}
        />)}
      
      {yourEvents.length > 0 && <div className='bg-white text-blue-600 text-lg sm:text-2xl p-4 text-center font-bold mb-4'>Your Events</div>}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {yourEvents?.map(event => (
          <EventCard key={event.id} event={event} authUser={authUser} setEventData={setEventData} setShowAddEvent={setShowAddEvent} setEventStatus={setEventStatus} deleteEvent={deleteEvent}/>
        ))}
      </div>
      {othersEvents.length > 0 && <div className='bg-white text-blue-600 text-lg sm:text-2xl p-4 text-center font-bold my-4'>All Other Upcoming Events</div>}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {othersEvents?.map(event => (
          <EventCard key={event.id} event={event} authUser={authUser} joinEvent={joinEvent}/>
        ))}
      </div>
    </div>
  );
};

export default Events;