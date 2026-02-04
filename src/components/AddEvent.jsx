
import axios from 'axios';
import {
  Calendar,
  Clock,
  FileText,
  Globe,
  ImagePlus,
  Link,
  Loader2Icon,
  User,
  X
} from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

const AddEvent = ({onClose,addNewEvent,eventData, setEventData,eventStatus}) => {
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(eventData.coverImage);
  const [working,setWorking]=useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEventData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear specific field error when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = {...prev};
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader=new FileReader();
      reader.onloadend=()=>{
        setEventData(prev =>({
             ...prev,coverImage:reader.result
        }));
        // Set image preview
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      
  };
}

  const validateForm = () => {
    const newErrors = {};
    
    if (!eventData.eventName.trim()) {
      newErrors.eventName = 'Event name is required';
    }

    if (!eventData.startDate) {
      newErrors.startDate = 'Start date is required';
    }

    if (!eventData.startTime) {
      newErrors.startTime = 'Start time is required';
    }

    if (eventData.endDate && eventData.startDate) {
      const start = new Date(`${eventData.startDate} ${eventData.startTime}`);
      const end = new Date(`${eventData.endDate} ${eventData.endTime}`);
      
      if (end <= start) {
        newErrors.endDate = 'End date must be after start date';
        newErrors.endTime = 'End time must be after start time';
      }
    }

    if (!eventData.hostName.trim()) {
      newErrors.hostName = 'Host name is required';
    }

    return newErrors;
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    try {
      setWorking(true);
      const res=await axios.post(`http://localhost:5000/api/v1/events/${eventStatus}`,eventData,{withCredentials:true});
      if(res){    
        addNewEvent(res.data.event);
        toast.success(res.data.message);
        onClose();
      }
    } catch (error) {
      console.log("create event :",error);
      if(error.response?.data){
        toast.error(error.response?.data?.message);
      }
    }finally{
      setWorking(false);
    }

  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <form onSubmit={handleSubmit} className="relative w-[650px] mx-auto bg-white shadow-md rounded-lg p-6 space-y-6 max-h-[95vh] overflow-y-auto" style={{scrollbarWidth:'thin'}}>
      <button onClick={onClose} className='absolute top-4 right-4'><X className='hover:text-red-500'/></button>
        <h2 className="text-2xl font-bold text-center mb-6">Create Event</h2>
        
        {/* Cover Image Upload */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cover Image
          </label>
          <div className="flex items-center space-x-4">
            <label className="cursor-pointer">
              <input 
                type="file" 
                accept="image/*" 
                className="hidden"
                onChange={handleImageUpload}
              />
              <div className="w-full border-2 border-dashed border-gray-300 flex items-center justify-center">
                {imagePreview ? (
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="w-full h-full object-cover object-center"
                  />
                ) : (
                  <ImagePlus className="text-gray-400" />
                )}
              </div>
            </label>
            <p className="text-sm text-gray-500">Upload event cover image</p>
          </div>
        </div>

        {/* Event Type */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Event Platform
            </label>
            <select
              name="eventType"
              value={eventData.eventType}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ONLINE">Online</option>
              <option value="IN_PERSON">In Person</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Event Type
            </label>
            <select
              name="type"
              value={eventData.type}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="CLASS">Class</option>
              <option value="Q&A_SESSION">Q&A Session</option>
              <option value="SEMINAR">Seminar</option>
              <option value="WORKSHOP">Workshop</option>
              <option value="BOOTCAMP">Bootcamp</option>
              <option value="WEBINAR">Webinar</option>

            </select>
          </div>
        </div>

        {/* Event Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Event Name
          </label>
          <div className="relative">
            <input
              type="text"
              name="eventName"
              value={eventData.eventName}
              onChange={handleInputChange}
              placeholder="Enter event name"
              className={`w-full px-3 py-2 pl-10 border rounded-md focus:outline-none focus:ring-2 ${
                errors.eventName 
                  ? 'border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 focus:ring-blue-500'
              }`}
            />
            <Globe className="absolute left-3 top-3 text-gray-400" />
          </div>
          {errors.eventName && (
            <p className="text-red-500 text-xs mt-1">{errors.eventName}</p>
          )}
        </div>

        {/* Host Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Host Name
          </label>
          <div className="relative">
            <input
              type="text"
              name="hostName"
              value={eventData.hostName}
              onChange={handleInputChange}
              placeholder="Enter host name"
              className={`w-full px-3 py-2 pl-10 border rounded-md focus:outline-none focus:ring-2 ${
                errors.hostName 
                  ? 'border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 focus:ring-blue-500'
              }`}
            />
            <User className="absolute left-3 top-3 text-gray-400" />
          </div>
          {errors.hostName && (
            <p className="text-red-500 text-xs mt-1">{errors.hostName}</p>
          )}
        </div>

        {/* Date and Time */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Date
            </label>
            <div className="relative">
              <input
                type="date"
                name="startDate"
                value={eventData.startDate}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 pl-10 border rounded-md focus:outline-none focus:ring-2 ${
                  errors.startDate 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
              />
              <Calendar className="absolute left-3 top-3 text-gray-400" />
            </div>
            {errors.startDate && (
              <p className="text-red-500 text-xs mt-1">{errors.startDate}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Time
            </label>
            <div className="relative">
              <input
                type="time"
                name="startTime"
                value={eventData.startTime}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 pl-10 border rounded-md focus:outline-none focus:ring-2 ${
                  errors.startTime 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
              />
              <Clock className="absolute left-3 top-3 text-gray-400" />
            </div>
            {errors.startTime && (
              <p className="text-red-500 text-xs mt-1">{errors.startTime}</p>
            )}
          </div>
        </div>

        {/* End Date and Time */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              End Date
            </label>
            <div className="relative">
              <input
                type="date"
                name="endDate"
                value={eventData.endDate}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 pl-10 border rounded-md focus:outline-none focus:ring-2 ${
                  errors.endDate 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
              />
              <Calendar className="absolute left-3 top-3 text-gray-400" />
            </div>
            {errors.endDate && (
              <p className="text-red-500 text-xs mt-1">{errors.endDate}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              End Time
            </label>
            <div className="relative">
              <input
                type="time"
                name="endTime"
                value={eventData.endTime}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 pl-10 border rounded-md focus:outline-none focus:ring-2 ${
                  errors.endTime 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
              />
              <Clock className="absolute left-3 top-3 text-gray-400" />
            </div>
            {errors.endTime && (
              <p className="text-red-500 text-xs mt-1">{errors.endTime}</p>
            )}
          </div>
        </div>

        {/* External Link */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            External Event Link (Optional)
          </label>
          <div className="relative">
            <input
              type="url"
              name="externalLink"
              value={eventData.externalLink}
              onChange={handleInputChange}
              placeholder="https://example.com/event"
              className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Link className="absolute left-3 top-3 text-gray-400" />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <div className="relative">
            <textarea
              name="description"
              value={eventData.description}
              onChange={handleInputChange}
              rows="4"
              placeholder="Enter event description"
              className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <FileText className="absolute left-3 top-3 text-gray-400" />
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          {!working ?           <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition-colors"
          >
            {
              eventStatus!=='create' ? 'Update Event':'Create Event'
            }
          </button>:
                <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition-colors"
              >
                <Loader2Icon className='animate-spin'/>
              </button>
          }

        </div>
      </form>
    </div>
  );
};

export default AddEvent;