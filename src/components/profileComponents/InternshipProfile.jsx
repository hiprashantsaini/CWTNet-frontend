import axios from "axios";
import { Clock, Loader, MapPin, Plus } from "lucide-react";
import { useEffect, useState } from "react";

// AddEditInternship component is imported but not shown here
import Swal from "sweetalert2";
import AddEditInternship from "./AddEditInternship";

const InternshipProfile = ({ user, isOwnProfile }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [internship, setInternship] = useState([]);
  const [loading, setLoading] = useState(true);
  const [initialData, setInitialData] = useState(null);

  const getInternship = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:5000/api/v1/internship/user/${user._id}`, { withCredentials: true });
      if (res.data) {
        setInternship(res.data.internships);
      }
    } catch (error) {
      console.log("error:", error);
    } finally {
      setLoading(false);
    }
  };

  function onClose() {
    setIsOpen(false);
    getInternship(); // Refresh list after adding/editing
    setInitialData(null);
  }

  useEffect(() => {
    getInternship();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-4 bg-white mt-2">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Internships</h2>
        {isOwnProfile && (
          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Plus size={16} /> Add Internship
          </button>
        )}
      </div>
      <p className="w-full border-2 border-b-gray-500 mt-1 mb-4"></p>


      {loading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : internship.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-8 text-center border border-gray-200">
          <p className="text-gray-500">No internship added yet.</p>
          {isOwnProfile && (
            <p className="text-gray-500 mt-2">
              {'Click on "Add Internship" to share your experiences.'}
            </p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {internship.map((item, index) => (
            <InternshipCard key={index} internship={item} setIsOpen={setIsOpen} setInitialData={setInitialData} isOwnProfile={isOwnProfile} refreshList={getInternship} />
          ))}
        </div>
      )}

      {isOpen && <AddEditInternship isOpen={isOpen} onClose={onClose} initialData={initialData} />}
    </div>
  );
};

const InternshipCard = ({ internship, isOwnProfile, refreshList, setIsOpen, setInitialData }) => {
  const [showMore, setShowMore] = useState(false);
  const [loadingId, setLoadingId] = useState(null);

  const handleEdit = (internship) => {
    setInitialData(internship);
    setIsOpen(true)
  };

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      html: `You are about to delete the internship <b>${internship.title}</b> .<br/>This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      reverseButtons: true,
      focusCancel: true, // Focus on cancel button by default for safety
    });
    if (!result.isConfirmed) return;
    try {
      setLoadingId(internship._id)
      await axios.delete(`http://localhost:5000/api/v1/internship/${internship._id}`, { withCredentials: true });
      refreshList();
    } catch (error) {
      console.log("error:", error);
    } finally {
      setLoadingId(null)
    }
  };

  function timeAgo(timestamp) {
    const now = new Date();
    const past = new Date(timestamp);
    const seconds = Math.floor((now - past) / 1000);

    const intervals = [
      { label: "year", seconds: 31536000 },
      { label: "month", seconds: 2592000 },
      { label: "week", seconds: 604800 },
      { label: "day", seconds: 86400 },
      { label: "hour", seconds: 3600 },
      { label: "minute", seconds: 60 },
      { label: "second", seconds: 1 },
    ];

    for (const interval of intervals) {
      const count = Math.floor(seconds / interval.seconds);
      if (count >= 1) {
        return `${count} ${interval.label}${count !== 1 ? "s" : ""} ago`;
      }
    }
    return "Just now";
  }

  const getLogoBackground = (color) => {
    return color || "#f3f4f6";
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow">
        <div className="flex items-center p-4 border-b border-gray-100">
          <div
            className={`w-12 h-12 flex items-center justify-center ${internship.logoShape === 'rounded' ? 'rounded-md' :
              internship.logoShape === 'rounded-full' ? 'rounded-full' : ''
              }`}
            style={{ backgroundColor: getLogoBackground(internship.logoColor) }}
          >
            {internship.logo ? (
              <img src={internship.logo} alt={`${internship.company} logo`} className={`w-12 h-12 object-cover ${internship.logoShape === 'rounded' ? 'rounded-md' :
                internship.logoShape === 'rounded-full' ? 'rounded-full' : ''
                }`} />
            ) : (
              // <Briefcase className="text-gray-400" />
              <p>{internship.company[0]}</p>
            )}
          </div>
          <div className="ml-4 flex-grow">
            <h3 className="font-semibold text-lg text-blue-700">{internship.title || "Untitled Position"}</h3>
            <p className="text-gray-800">{internship.company}</p>
          </div>
        </div>

        <div className="p-4">
          <div className="flex flex-wrap gap-2 mb-3">
            {internship.location && (
              <span className="inline-flex items-center text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                <MapPin size={14} className="mr-1" /> {internship.location}
                {internship.isRemote && " (Remote)"}
              </span>
            )}
            {internship.duration && (
              <span className="inline-flex items-center text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                <Clock size={14} className="mr-1" /> {internship.duration}
              </span>
            )}
            {internship.salary && (
              <span className="inline-flex items-center text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                ₹ {internship.salary}
              </span>
            )}
            {internship.isFullTime && (
              <span className="inline-flex items-center text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                Full-time
              </span>
            )}
          </div>

          {internship.description && (
            <div className="mt-3">
              <p className="text-gray-700">
                {showMore || internship.description.length <= 150
                  ? internship.description
                  : `${internship.description.substring(0, 150)}...`}
              </p>
              {internship.description.length > 150 && (
                <button
                  onClick={() => setShowMore(!showMore)}
                  className="text-blue-600 hover:text-blue-800 text-sm mt-1"
                >
                  {showMore ? "Show less" : "Show more"}
                </button>
              )}
            </div>
          )}

          {internship.requirements && internship.requirements.length > 0 && internship.requirements[0] !== "" && (
            <div className="mt-3">
              <h4 className="font-medium text-gray-800 mb-1">Requirements</h4>
              <ul className="list-disc list-inside text-gray-700 text-sm">
                {internship.requirements.map((req, idx) => (
                  <li key={idx}>{req}</li>
                ))}
              </ul>
            </div>
          )}
          <div className="flex items-center justify-between mt-3">
            <p className="text-sm">{internship.timePosted && timeAgo(internship.timePosted)}</p>
            {isOwnProfile && (
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => handleEdit(internship)}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Edit
                </button>
                {(loadingId === internship._id) ? <button
                  className="text-red-600 hover:text-red-800 text-sm font-medium"
                >
                  <Loader className="animate-spin" />
                </button> : <button
                  onClick={handleDelete}
                  className="text-red-600 hover:text-red-800 text-sm font-medium"
                >
                  Delete
                </button>}
              </div>
            )}
          </div>

        </div>
      </div>
    </>
  );
};

export default InternshipProfile;
