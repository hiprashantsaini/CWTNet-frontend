import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Bell, Brain, LogOut, Menu, Search, User, X } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { axiosInstance } from '../../lib/axios';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

  const notifications = [
    {
      id: 1,
      title: 'New Course Available',
      message: 'Advanced Deep Learning course is now available',
      time: '5m ago',
    },
    {
      id: 2,
      title: 'Assessment Reminder',
      message: 'Complete your pending AI assessment',
      time: '1h ago',
    },
  ];
  const queryClient = useQueryClient();

  const { mutate: logout } = useMutation({
		mutationFn: () => axiosInstance.post("/auth/logout"),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["authUser"] });
		},
	});

  if (!authUser) return null;

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Brain className="h-8 w-8 text-indigo-600" />
              <span className="text-2xl font-bold text-gray-900">CWTNet</span>
            </Link>

            <div className="hidden md:block ml-10">
              <div className="flex items-center space-x-4">
                <Link to="/aiskill/assessment" className="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
                  Assessments
                </Link>
                <Link to="/aiskill/test" className="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
                  Test
                </Link>
                <Link to="/aiskill/results" className="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
                  Result
                </Link>
                <Link to="/aiskill/progress" className="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
                  Progress
                </Link>
                <Link to="/aiskill/recommendations" className="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
                  Recommendations
                </Link>
                <Link to="/aiskill/certificate" className="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
                  Certificates
                </Link>
              </div>
            </div>
          </div>

          <div className="hidden md:block">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-64 px-4 py-1 pl-10 pr-4 rounded-full border border-gray-300 focus:outline-none focus:border-indigo-500"
                />
                <Search className="h-4 w-4 text-gray-400 absolute left-3 top-2" />
              </div>

              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 rounded-full text-gray-600 hover:text-indigo-600 focus:outline-none"
                >
                  <Bell className="h-6 w-6" />
                  <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
                </button>

                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg py-2 border border-gray-200">
                    {notifications.map((notification) => (
                      <div key={notification.id} className="px-4 py-3 hover:bg-gray-50">
                        <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                        <p className="text-sm text-gray-500">{notification.message}</p>
                        <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 p-2 rounded-full text-gray-600 hover:text-indigo-600"
                >
                  <User className="h-6 w-6" />
                  <span className="text-sm font-medium">{authUser.name}</span>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 border border-gray-200">
                    <Link
                      to={`/profile/${authUser.username}`}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setShowUserMenu(false)}
                    >
                      Profile
                    </Link>
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <div className="flex items-center space-x-2">
                        <LogOut className="h-4 w-4" />
                        <span>Sign Out</span>
                      </div>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-gray-600 hover:text-indigo-600 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              to="/aiskill/assessment"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-indigo-600"
            >
              Assessments
            </Link>
            <Link
              to="/aiskill/progress"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-indigo-600"
            >
              Progress
            </Link>
            <Link
              to="/aiskill/recommendations"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-indigo-600"
            >
              Recommendations
            </Link>
            <Link
              to="/aiskill/certificate"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-indigo-600"
            >
              Certificates
            </Link>
            <Link
              to="/aiskill/profile"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-indigo-600"
            >
              Profile
            </Link>
            <button
              onClick={logout}
              className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-indigo-600"
            >
              Sign Out
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;