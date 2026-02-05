import axios from 'axios';
import {
    ArrowLeft,
    Bell,
    Briefcase,
    Building,
    CheckCircle,
    ChevronDown,
    Clock,
    ExternalLink,
    Filter,
    Grid,
    Laptop,
    MapPin,
    Maximize2,
    Menu,
    MessageSquare,
    RefreshCw,
    Search,
    Star,
    X
} from 'lucide-react';
import React, { useEffect, useState } from 'react';

function Internship() {
  const [searchTerm, setSearchTerm] = useState('software engineer intern');
  const [location, setLocation] = useState('Bengaluru, Karnataka, India');
  const [selectedJob, setSelectedJob] = useState(0);
  const [alertOn, setAlertOn] = useState(true);
  const [savedJobs, setSavedJobs] = useState([]);
  const [showFilters, setShowFilters] = useState({
    datePosted: false,
    experienceLevel: false,
    company: false,
    remote: false
  });
  const [selectedFilters, setSelectedFilters] = useState({
    datePosted: 'Any time',
    experienceLevel: 'Internship',
    company: 'All companies',
    remote: 'All workplace types',
    radius: '40 km'
  });
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [showJobs, setShowJobs] = useState(false);
  const [showEasyApply, setShowEasyApply] = useState(false);
  const [showAllFilters, setShowAllFilters] = useState(false);
  const [internships, setInternships] = useState([]);

  // Job listings data
  const jobs = [
    {
      id: 1,
      title: "Full Stack Developer Internship",
      company: "Acowale",
      logo: "A",
      logoColor: "bg-gray-200 text-gray-500",
      location: "Bengaluru, Karnataka, India (Remote)",
      timePosted: "Viewed",
      isRemote: true,
      isFullTime: true,
      logoShape: "rounded-full",
      description: "We are looking for a talented Full Stack Developer Intern to join our growing team. You will be working on cutting-edge web applications using React, Node.js, and MongoDB.",
      requirements: [
        "Knowledge of JavaScript, HTML, CSS",
        "Familiarity with React or similar frameworks",
        "Basic understanding of backend technologies",
        "Good problem-solving skills"
      ],
      salary: "₹15,000 - ₹25,000 per month",
      duration: "6 months"
    },
    {
      id: 2,
      title: "Full Stack Developer Intern",
      company: "Portcast",
      logo: "P",
      logoColor: "bg-gray-800 text-white",
      location: "Bengaluru, Karnataka, India (Remote)",
      timePosted: "1 week ago",
      isRemote: true,
      isFullTime: true,
      logoShape: "rounded",
      description: "Portcast is seeking a Full Stack Developer Intern to help build our logistics prediction platform. You'll work with our engineering team to develop and maintain web applications.",
      requirements: [
        "Strong JavaScript skills",
        "Experience with React and Node.js",
        "Understanding of RESTful APIs",
        "Knowledge of database systems"
      ],
      salary: "₹20,000 - ₹30,000 per month",
      duration: "3-6 months"
    },
    {
      id: 3,
      title: "Web Development intern",
      company: "OptimSpace",
      logo: "O",
      logoColor: "bg-orange-100 text-orange-500",
      location: "Bengaluru East, Karnataka, India (Remote)",
      timePosted: "2 days ago",
      isRemote: true,
      isFullTime: false,
      logoShape: "rounded",
      description: "Join OptimSpace as a Web Development Intern and help us create beautiful, responsive websites for our clients. This is a part-time position with flexible hours.",
      requirements: [
        "HTML, CSS, and JavaScript skills",
        "Knowledge of responsive design principles",
        "Familiarity with UI/UX concepts",
        "Portfolio of previous work (preferred)"
      ],
      salary: "₹12,000 - ₹18,000 per month",
      duration: "4 months"
    },
    {
      id: 4,
      title: "TEMP Software Engineering Intern",
      company: "Advarra",
      logo: "A",
      logoColor: "bg-blue-100 text-blue-500",
      location: "Bengaluru, Karnataka, India (On-site)",
      timePosted: "Promoted",
      isRemote: false,
      isFullTime: true,
      logoShape: "rounded",
      description: "Advarra is looking for a temporary Software Engineering Intern to assist with our clinical research platform. This is an on-site position at our Bengaluru office.",
      requirements: [
        "Computer Science or related degree (in progress)",
        "Knowledge of Java or Python",
        "Understanding of software development lifecycle",
        "Strong analytical skills"
      ],
      salary: "₹25,000 - ₹35,000 per month",
      duration: "3 months"
    },
    {
      id: 5,
      title: "Engineer and Data Internships",
      company: "Digital Remedy",
      logo: "D",
      logoColor: "bg-teal-800 text-white",
      location: "Bengaluru, Karnataka, India (Remote)",
      timePosted: "2 weeks ago",
      isRemote: true,
      isFullTime: true,
      logoShape: "rounded",
      hasEasyApply: true,
      description: "Digital Remedy offers internship opportunities in engineering and data science. Work on real projects and gain valuable experience in the digital marketing industry.",
      requirements: [
        "Background in Computer Science, Engineering, or related field",
        "Programming skills in Python, R, or JavaScript",
        "Interest in data analysis and visualization",
        "Strong communication skills"
      ],
      salary: "₹18,000 - ₹28,000 per month",
      duration: "6 months"
    }
  ];

  // Notifications data
  const notifications = [
    {
      id: 1,
      type: "connection",
      text: "Rahul Sharma accepted your connection request",
      time: "2h ago"
    },
    {
      id: 2,
      type: "job",
      text: "5 new jobs matching your profile in Bengaluru",
      time: "5h ago"
    },
    {
      id: 3,
      type: "message",
      text: "New message from Priya Patel",
      time: "1d ago"
    },
    {
      id: 4,
      type: "view",
      text: "Your profile was viewed by 12 recruiters this week",
      time: "2d ago"
    }
  ];

  // Messages data
  const messages = [
    {
      id: 1,
      sender: "Amit Kumar",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      message: "Hi there! I saw your profile and wanted to discuss a potential opportunity.",
      time: "10:30 AM"
    },
    {
      id: 2,
      sender: "Neha Singh",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      message: "Thanks for connecting! Would you be interested in joining our tech meetup next week?",
      time: "Yesterday"
    },
    {
      id: 3,
      sender: "Vikram Reddy",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      message: "Hello! I'm looking for a developer with your skills for a project. Are you available for freelance work?",
      time: "2 days ago"
    }
  ];

  // Job alerts data
  const jobAlerts = [
    {
      id: 1,
      title: "Software Engineer Intern",
      location: "Bengaluru",
      newJobs: 12,
      lastUpdated: "Today"
    },
    {
      id: 2,
      title: "Web Developer",
      location: "Remote",
      newJobs: 8,
      lastUpdated: "Yesterday"
    },
    {
      id: 3,
      title: "Frontend Developer",
      location: "Hyderabad",
      newJobs: 5,
      lastUpdated: "3 days ago"
    }
  ];

  // Filter options
  const filterOptions = {
    datePosted: ["Past 24 hours", "Past week", "Past month", "Any time"],
    experienceLevel: ["Internship", "Entry level", "Associate", "Mid-Senior level", "Director", "Executive"],
    company: ["Acowale", "Portcast", "OptimSpace", "Advarra", "Digital Remedy", "All companies"],
    remote: ["Remote", "On-site", "Hybrid", "All workplace types"]
  };

  // Handle search
  const handleSearch = () => {
    alert(`Searching for: ${searchTerm} in ${location}`);
  };

  // Handle job selection
  const handleJobSelect = (index) => {
    setSelectedJob(index);
  };

  // Handle job dismissal
  const handleDismissJob = (id, e) => {
    e.stopPropagation();
    alert(`Job ${id} dismissed`);
  };

  // Handle save job
  const handleSaveJob = () => {
    if (savedJobs.includes(jobs[selectedJob].id)) {
      setSavedJobs(savedJobs.filter(id => id !== jobs[selectedJob].id));
      alert(`Removed ${jobs[selectedJob].title} from saved jobs`);
    } else {
      setSavedJobs([...savedJobs, jobs[selectedJob].id]);
      alert(`Saved ${jobs[selectedJob].title} to your saved jobs`);
    }
  };

  // Handle apply job
  const handleApplyJob = () => {
    alert(`Applying for ${jobs[selectedJob].title} at ${jobs[selectedJob].company}`);
  };

  // Handle follow
  const handleFollow = () => {
    alert('You are now following Sagnik Majumder');
  };

  // Toggle filter dropdown
  const toggleFilter = (filter) => {
    // Close all other filters
    const updatedFilters = {
      datePosted: false,
      experienceLevel: false,
      company: false,
      remote: false
    };

    // Toggle the selected filter
    updatedFilters[filter] = !showFilters[filter];

    setShowFilters(updatedFilters);
  };

  // Select filter option
  const selectFilterOption = (filter, option) => {
    setSelectedFilters({
      ...selectedFilters,
      [filter]: option
    });

    // Close the filter dropdown
    setShowFilters({
      ...showFilters,
      [filter]: false
    });
  };

  // Toggle notifications
  const toggleNotifications = (e) => {
    e.stopPropagation();
    setShowNotifications(!showNotifications);
    setShowMessages(false);
    setShowJobs(false);
  };

  // Toggle messages
  const toggleMessages = (e) => {
    e.stopPropagation();
    setShowMessages(!showMessages);
    setShowNotifications(false);
    setShowJobs(false);
  };

  // Toggle jobs
  const toggleJobs = (e) => {
    e.stopPropagation();
    setShowJobs(!showJobs);
    setShowNotifications(false);
    setShowMessages(false);
  };

  // Toggle easy apply filter
  const toggleEasyApply = () => {
    setShowEasyApply(!showEasyApply);
    alert(`Easy Apply filter ${!showEasyApply ? 'enabled' : 'disabled'}`);
  };

  // Toggle all filters
  const toggleAllFilters = () => {
    setShowAllFilters(!showAllFilters);
    alert('All filters dialog would open here');
  };

  // Handle radius change
  const handleRadiusChange = () => {
    const radiusOptions = ["10 km", "25 km", "40 km", "60 km", "100 km"];
    const currentIndex = radiusOptions.indexOf(selectedFilters.radius);
    const nextIndex = (currentIndex + 1) % radiusOptions.length;

    setSelectedFilters({
      ...selectedFilters,
      radius: radiusOptions[nextIndex]
    });
  };

  // Handle browser actions
  const handleBack = () => {
    window.history.back();
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleMaximize = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen();
    }
  };

  const handleClose = () => {
    alert('This would close the window in a real browser');
  };

  // Close dropdowns when clicking outside
  React.useEffect(() => {
    const handleClickOutside = () => {
      setShowNotifications(false);
      setShowMessages(false);
      setShowJobs(false);
      setShowFilters({
        datePosted: false,
        experienceLevel: false,
        company: false,
        remote: false
      });
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const getLogoBackground = (color) => {
    return color || "#f3f4f6";
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

  const getAllInternships = async () => {
    try {
      const res = await axios.get("https://cwt-net-backend.vercel.app/api/v1/internship", { withCredentials: true });
      if (res.data?.internships) {
        setInternships(res.data?.internships);
      }
    } catch (error) {
      console.log("error ", error);
    }
  }

  useEffect(() => {
    getAllInternships();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-300 sticky top-0 z-10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center space-x-2">
              <button
                className="p-2 hover:bg-gray-100 rounded-full"
                onClick={handleBack}
              >
                <ArrowLeft size={20} />
              </button>
              <button
                className="p-2 hover:bg-gray-100 rounded-full"
                onClick={handleRefresh}
              >
                <RefreshCw size={20} />
              </button>
              {/* <div className="flex items-center">
                <LinkedinIcon className="text-blue-600" size={28} />
                <span className="ml-1 font-semibold">LinkedIn</span>
              </div> */}
            </div>

            <div className="flex items-center space-x-2">
              <button
                className="p-2 hover:bg-gray-100 rounded-full"
                onClick={handleMaximize}
              >
                <Maximize2 size={20} />
              </button>
              <button
                className="p-2 hover:bg-gray-100 rounded-full"
                onClick={handleClose}
              >
                <X size={20} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b border-gray-300 py-2">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            {/* <div className="flex items-center">
              <LinkedinIcon className="text-blue-600" size={36} />
               */}
            <div className="relative ml-2 flex items-center bg-gray-100 rounded-md">
              <div className="px-3 py-2">
                <Search size={20} className="text-gray-500" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent py-2 pr-3 w-64 focus:outline-none"
              />
              {/* </div> */}

              <div className="relative ml-2 flex items-center bg-gray-100 rounded-md">
                <div className="px-3 py-2">
                  <MapPin size={20} className="text-gray-500" />
                </div>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="bg-transparent py-2 pr-3 w-64 focus:outline-none"
                />
              </div>

              <button
                className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                onClick={handleSearch}
              >
                Search
              </button>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative cursor-pointer" onClick={toggleNotifications}>
                <Bell size={24} />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {notifications.length}
                </span>

                {showNotifications && (
                  <div className="absolute top-full right-0 mt-2 bg-white border border-gray-300 rounded-md shadow-lg z-20 w-80">
                    <div className="p-3 border-b border-gray-200">
                      <h3 className="font-semibold">Notifications</h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.map(notification => (
                        <div key={notification.id} className="p-3 border-b border-gray-200 hover:bg-gray-50 cursor-pointer">
                          <p className="text-sm">{notification.text}</p>
                          <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                        </div>
                      ))}
                    </div>
                    <div className="p-3 text-center text-blue-600 hover:bg-gray-50 cursor-pointer">
                      <span className="text-sm font-medium">View all notifications</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="relative cursor-pointer" onClick={toggleMessages}>
                <MessageSquare size={24} />
                {showMessages && (
                  <div className="absolute top-full right-0 mt-2 bg-white border border-gray-300 rounded-md shadow-lg z-20 w-80">
                    <div className="p-3 border-b border-gray-200">
                      <h3 className="font-semibold">Messaging</h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {messages.map(message => (
                        <div key={message.id} className="p-3 border-b border-gray-200 hover:bg-gray-50 cursor-pointer">
                          <div className="flex items-start">
                            <img src={message.avatar} alt={message.sender} className="w-10 h-10 rounded-full mr-3" />
                            <div>
                              <p className="font-medium text-sm">{message.sender}</p>
                              <p className="text-sm text-gray-600 truncate">{message.message}</p>
                              <p className="text-xs text-gray-500 mt-1">{message.time}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="p-3 text-center text-blue-600 hover:bg-gray-50 cursor-pointer">
                      <span className="text-sm font-medium">View all messages</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="relative cursor-pointer" onClick={toggleJobs}>
                <Briefcase size={24} />
                {showJobs && (
                  <div className="absolute top-full right-0 mt-2 bg-white border border-gray-300 rounded-md shadow-lg z-20 w-80">
                    <div className="p-3 border-b border-gray-200">
                      <h3 className="font-semibold">Job Alerts</h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {jobAlerts.map(alert => (
                        <div key={alert.id} className="p-3 border-b border-gray-200 hover:bg-gray-50 cursor-pointer">
                          <p className="font-medium text-sm">{alert.title} in {alert.location}</p>
                          <p className="text-sm text-blue-600">{alert.newJobs} new jobs</p>
                          <p className="text-xs text-gray-500 mt-1">Last updated: {alert.lastUpdated}</p>
                        </div>
                      ))}
                    </div>
                    <div className="p-3 text-center text-blue-600 hover:bg-gray-50 cursor-pointer">
                      <span className="text-sm font-medium">View all job alerts</span>
                    </div>
                  </div>
                )}
              </div>


              <img
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                alt="Profile"
                className="h-8 w-8 rounded-full cursor-pointer"
              />
              <Grid size={24} className="cursor-pointer" />
              <Menu size={24} className="cursor-pointer" />
            </div>
          </div>
        </div>
      </nav>

      {/* Filters */}
      <div className="bg-white border-b border-gray-300 py-3">
        <div className="container mx-auto px-4">
          <div className="flex items-center space-x-3 overflow-x-auto pb-2">
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <button
                className="px-4 py-2 bg-green-700 text-white rounded-md flex items-center whitespace-nowrap"
                onClick={() => setShowJobs(!showJobs)}
              >
                Jobs <ChevronDown size={16} className="ml-1" />
              </button>
              {showJobs && (
                <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10 w-48">
                  <div className="p-2">
                    <div className="p-2 hover:bg-gray-100 cursor-pointer">My Jobs</div>
                    <div className="p-2 hover:bg-gray-100 cursor-pointer">Job Alerts</div>
                    <div className="p-2 hover:bg-gray-100 cursor-pointer">Salary</div>
                    <div className="p-2 hover:bg-gray-100 cursor-pointer">Skill Assessments</div>
                    <div className="p-2 hover:bg-gray-100 cursor-pointer">Interview Prep</div>
                    <div className="p-2 hover:bg-gray-100 cursor-pointer">Resume Builder</div>
                    <div className="p-2 hover:bg-gray-100 cursor-pointer">Job Seeker Guidance</div>
                    <div className="p-2 hover:bg-gray-100 cursor-pointer">Application Settings</div>
                  </div>
                </div>
              )}
            </div>

            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <button
                className="px-4 py-2 bg-green-700 text-white rounded-md flex items-center whitespace-nowrap"
                onClick={handleRadiusChange}
              >
                {selectedFilters.radius} <ChevronDown size={16} className="ml-1" />
              </button>
            </div>

            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <button
                className="px-4 py-2 border border-gray-300 rounded-md flex items-center whitespace-nowrap"
                onClick={() => toggleFilter('datePosted')}
              >
                <Clock size={16} className="mr-2" />
                {selectedFilters.datePosted} <ChevronDown size={16} className="ml-1" />
              </button>
              {showFilters.datePosted && (
                <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10 w-48">
                  <div className="p-2">
                    {filterOptions.datePosted.map(option => (
                      <div
                        key={option}
                        className="p-2 hover:bg-gray-100 cursor-pointer flex items-center"
                        onClick={() => selectFilterOption('datePosted', option)}
                      >
                        {selectedFilters.datePosted === option && (
                          <CheckCircle size={16} className="mr-2 text-green-600" />
                        )}
                        <span className={selectedFilters.datePosted === option ? "font-medium" : ""}>
                          {option}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <button
                className="px-4 py-2 border border-gray-300 rounded-md flex items-center whitespace-nowrap"
                onClick={() => toggleFilter('experienceLevel')}
              >
                <Briefcase size={16} className="mr-2" />
                {selectedFilters.experienceLevel} <ChevronDown size={16} className="ml-1" />
              </button>
              {showFilters.experienceLevel && (
                <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10 w-48">
                  <div className="p-2">
                    {filterOptions.experienceLevel.map(option => (
                      <div
                        key={option}
                        className="p-2 hover:bg-gray-100 cursor-pointer flex items-center"
                        onClick={() => selectFilterOption('experienceLevel', option)}
                      >
                        {selectedFilters.experienceLevel === option && (
                          <CheckCircle size={16} className="mr-2 text-green-600" />
                        )}
                        <span className={selectedFilters.experienceLevel === option ? "font-medium" : ""}>
                          {option}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <button
                className="px-4 py-2 border border-gray-300 rounded-md flex items-center whitespace-nowrap"
                onClick={() => toggleFilter('company')}
              >
                <Building size={16} className="mr-2" />
                {selectedFilters.company} <ChevronDown size={16} className="ml-1" />
              </button>
              {showFilters.company && (
                <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10 w-48">
                  <div className="p-2">
                    {filterOptions.company.map(option => (
                      <div
                        key={option}
                        className="p-2 hover:bg-gray-100 cursor-pointer flex items-center"
                        onClick={() => selectFilterOption('company', option)}
                      >
                        {selectedFilters.company === option && (
                          <CheckCircle size={16} className="mr-2 text-green-600" />
                        )}
                        <span className={selectedFilters.company === option ? "font-medium" : ""}>
                          {option}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <button
                className="px-4 py-2 border border-gray-300 rounded-md flex items-center whitespace-nowrap"
                onClick={() => toggleFilter('remote')}
              >
                <Laptop size={16} className="mr-2" />
                {selectedFilters.remote} <ChevronDown size={16} className="ml-1" />
              </button>
              {showFilters.remote && (
                <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10 w-48">
                  <div className="p-2">
                    {filterOptions.remote.map(option => (
                      <div
                        key={option}
                        className="p-2 hover:bg-gray-100 cursor-pointer flex items-center"
                        onClick={() => selectFilterOption('remote', option)}
                      >
                        {selectedFilters.remote === option && (
                          <CheckCircle size={16} className="mr-2 text-green-600" />
                        )}
                        <span className={selectedFilters.remote === option ? "font-medium" : ""}>
                          {option}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <button
                className={`px-4 py-2 border ${showEasyApply ? 'bg-blue-50 border-blue-600 text-blue-600' : 'border-gray-300'} rounded-md whitespace-nowrap`}
                onClick={toggleEasyApply}
              >
                Easy Apply
              </button>
            </div>

            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <button
                className="px-4 py-2 border border-gray-300 rounded-md flex items-center whitespace-nowrap"
                onClick={toggleAllFilters}
              >
                <Filter size={16} className="mr-2" />
                All filters
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row">
          {/* Left Column - Job Listings */}
          <div className="w-full md:w-1/2 bg-white border border-gray-300 rounded-md overflow-hidden mb-4 md:mb-0">
            <div className="p-4 border-b border-gray-300">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-medium">software engineer intern in Bengaluru, Karnataka, India</h2>
                  <p className="text-sm text-gray-500">1,168 results</p>
                </div>
                <div className="flex items-center">
                  <span className="mr-2 text-sm">Alert on</span>
                  <div
                    className={`w-12 h-6 ${alertOn ? 'bg-green-600' : 'bg-gray-300'} rounded-full p-1 flex items-center cursor-pointer`}
                    onClick={() => setAlertOn(!alertOn)}
                  >
                    <div className={`bg-white w-4 h-4 rounded-full transform ${alertOn ? 'translate-x-6' : 'translate-x-0'} transition-transform`}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Job Listings */}
            {internships.map((job, index) => (
              <div
                key={job._id}
                className={`p-4 border-b border-gray-300 hover:bg-gray-50 flex justify-between cursor-pointer ${selectedJob === index ? 'bg-blue-50' : ''}`}
                onClick={() => handleJobSelect(index)}
              >
                <div className="flex">
                  <div className="mr-3">
                    {/* <div className={`w-12 h-12 ${job.logoColor} ${job.logoShape} flex items-center justify-center`}>
                      <span>{job.logo}</span>
                    </div> */}
                    <div
                      className={`w-12 h-12 flex items-center justify-center ${job.logoShape === 'rounded' ? 'rounded-md' :
                        job.logoShape === 'rounded-full' ? 'rounded-full' : ''
                        }`}
                      style={{ backgroundColor: getLogoBackground(job.logoColor) }}
                    >
                      {job.logo ? (
                        <img src={job.logo} alt={`${job.company} logo`} className={`w-12 h-12 object-cover ${job.logoShape === 'rounded' ? 'rounded-md' :
                          job.logoShape === 'rounded-full' ? 'rounded-full' : ''
                          }`} />
                      ) : (
                        // <Briefcase className="text-gray-400" />
                        <p>{job.company[0]}</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-blue-600 font-medium">{job.title}</h3>
                    <p className="text-sm">{job.company}</p>
                    <p className="text-sm text-gray-500">{job.location}</p>
                    <div className="flex items-center mt-1">
                      <p className="text-sm text-gray-500 mr-2">{job.timePosted && timeAgo(job.timePosted)}</p>
                      {job.hasEasyApply && (
                        <div className="flex items-center text-sm text-gray-500">
                          <span className="inline-block w-4 h-4 mr-1">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z"></path>
                            </svg>
                          </span>
                          Easy Apply
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <button onClick={(e) => handleDismissJob(job.id, e)}>
                  <X size={20} />
                </button>
              </div>
            ))}
          </div>

          {/* Right Column - Job Details */}
{     internships.length > 0 && <div className="w-full md:w-1/2 md:ml-4 bg-white border border-gray-300 rounded-md overflow-hidden">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  {/* <div className={`w-10 h-10 ${internships[selectedJob].logoColor} ${internships[selectedJob].logoShape} flex items-center justify-center mr-3`}>
                    <span>{jobs[selectedJob].logo}</span>
                  </div> */}
                  <div
                    className={`w-10 h-10 mr-3 flex items-center justify-center ${internships[selectedJob].logoShape === 'rounded' ? 'rounded-md' :
                      internships[selectedJob].logoShape === 'rounded-full' ? 'rounded-full' : ''
                      }`}
                    style={{ backgroundColor: getLogoBackground(internships[selectedJob].logoColor) }}
                  >
                    {internships[selectedJob].logo ? (
                      <img src={internships[selectedJob].logo} alt={`${internships[selectedJob].company} logo`} className={`w-12 h-12 object-cover ${internships[selectedJob].logoShape === 'rounded' ? 'rounded-md' :
                        internships[selectedJob].logoShape === 'rounded-full' ? 'rounded-full' : ''
                        }`} />
                    ) : (
                      // <Briefcase className="text-gray-400" />
                      <p>{internships[selectedJob].company[0]}</p>
                    )}
                  </div>
                  <span className="font-medium">{internships[selectedJob].company}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <button>
                    <ExternalLink size={20} />
                  </button>
                  <button>
                    <Menu size={20} />
                  </button>
                </div>
              </div>

              <h2 className="text-2xl font-semibold mb-1">{internships[selectedJob].title}</h2>
              <p className="text-gray-600 mb-2">{internships[selectedJob].location.split('(')[0]} · {internships[selectedJob].timePosted && timeAgo(internships[selectedJob].timePosted)} · Over 100 people clicked apply</p>

              <div className="flex space-x-2 mb-4">
                {internships[selectedJob].isRemote && (
                  <div className="flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full">
                    <CheckCircle size={16} className="mr-1" />
                    <span>Remote</span>
                  </div>
                )}
                {internships[selectedJob].isFullTime && (
                  <div className="flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full">
                    <CheckCircle size={16} className="mr-1" />
                    <span>Full-time</span>
                  </div>
                )}
              </div>

              <div className="flex space-x-3 mb-6">
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded-md flex items-center hover:bg-blue-700"
                  onClick={handleApplyJob}
                >
                  Apply <ExternalLink size={16} className="ml-1" />
                </button>
                <button
                  className={`px-4 py-2 border ${savedJobs.includes(internships[selectedJob]._id) ? 'bg-blue-100 border-blue-600' : 'border-blue-600'} text-blue-600 rounded-md hover:bg-blue-50`}
                  onClick={handleSaveJob}
                >
                  {savedJobs.includes(internships[selectedJob]._id) ? 'Saved' : 'Save'}
                </button>
              </div>

              <div className="mb-6">
                <div className="bg-amber-50 p-3 rounded-md">
                  <h3 className="text-gray-500 uppercase text-xs font-semibold mb-2">PREMIUM</h3>
                  <h4 className="text-lg font-medium mb-3">Your AI-powered job assessment</h4>

                  <div className="flex space-x-3 overflow-x-auto pb-2">
                    <div className="flex-shrink-0 bg-white p-3 rounded-md border border-gray-200 w-48 cursor-pointer hover:border-amber-400">
                      <div className="flex items-center mb-2">
                        <Star className="text-amber-400 mr-1" size={16} />
                        <span className="font-medium">Am I a good fit?</span>
                      </div>
                    </div>

                    <div className="flex-shrink-0 bg-white p-3 rounded-md border border-gray-200 w-48 cursor-pointer hover:border-amber-400">
                      <div className="flex items-center mb-2">
                        <Star className="text-amber-400 mr-1" size={16} />
                        <span className="font-medium">Tailor my resume</span>
                      </div>
                    </div>

                    <div className="flex-shrink-0 bg-white p-3 rounded-md border border-gray-200 w-48 cursor-pointer hover:border-amber-400">
                      <div className="flex items-center mb-2">
                        <Star className="text-amber-400 mr-1" size={16} />
                        <span className="font-medium">How can I best position myself?</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">About the job</h3>
                <p className="text-gray-700 mb-4">{internships[selectedJob].description}</p>

                <h4 className="font-medium mb-2">Requirements:</h4>
                <ul className="list-disc pl-5 mb-4">
                  {internships[selectedJob].requirements.map((req, index) => (
                    <li key={index} className="text-gray-700 mb-1">{req}</li>
                  ))}
                </ul>

                <div className="flex flex-wrap gap-4 mb-4">
                  <div className="bg-gray-100 p-3 rounded-md">
                    <p className="text-sm text-gray-500">Salary</p>
                    <p className="font-medium">{internships[selectedJob].salary}</p>
                  </div>
                  <div className="bg-gray-100 p-3 rounded-md">
                    <p className="text-sm text-gray-500">Duration</p>
                    <p className="font-medium">{internships[selectedJob].duration}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-3">People you can reach out to</h3>

                <div className="flex items-start mb-4">
                  <img
                    src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    alt="Sagnik Majumder"
                    className="w-14 h-14 rounded-full mr-3"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <div>
                        <h4 className="font-medium">Sagnik Majumder · 3rd</h4>
                        <p className="text-sm">Programming Enthusiast || Full-Stack Developer || Tech Nerd</p>
                        <p className="text-sm text-gray-500">Recently hired</p>
                      </div>
                      <button
                        className="px-4 py-1 border border-gray-400 rounded-full text-gray-600 hover:bg-gray-50"
                        onClick={handleFollow}
                      >
                        Follow
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>}
        </div>
      </div>
    </div>
  );
}

export default Internship;