import axios from 'axios';
import { Check, Search, X } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const NewGroup = ({ connections, setOpenNewGroupSelector }) => {
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [groupName, setGroupName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');

  const navigate=useNavigate();

  const handleUserSelect = (user) => {
    if (selectedUsers.find(selected => selected._id === user._id)) {
      setSelectedUsers(prev => prev.filter(selected => selected._id !== user._id));
    } else {
      setSelectedUsers(prev => [...prev, user]);
    }
  };

  const filteredConnections = connections.filter(connection =>
    connection.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateGroup = async () => {
    if (!groupName.trim()) {
      setError('Please enter a group name');
      return;
    }
    if (selectedUsers.length < 2) {
      setError('Please select at least 2 users');
      return;
    }

    try {
      const userIds = selectedUsers.map(user => user._id);
      const response = await axios.post('http://localhost:5000/api/v1/chat/createGroup', {
        name: groupName,
        users: userIds
      }, { withCredentials: true });
      
      if (response.data) {
        setOpenNewGroupSelector(false);
        navigate('/messages');
      }
    } catch (error) {
      setError('Failed to create group. Please try again.');
      console.error('Create group error:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Create New Group</h2>
          <button
            onClick={() => setOpenNewGroupSelector(false)}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Group Name Input */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Group Name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Search Input */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search connections..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Selected Users */}
        {selectedUsers.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {selectedUsers.map(user => (
              <span
                key={user._id}
                className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm flex items-center gap-1"
              >
                {user.name}
                <X
                  className="h-4 w-4 cursor-pointer"
                  onClick={() => handleUserSelect(user)}
                />
              </span>
            ))}
          </div>
        )}

        {/* Connections List */}
        <div className="flex-1 overflow-y-auto">
          {filteredConnections.map(connection => (
            <div
              key={connection._id}
              onClick={() => handleUserSelect(connection)}
              className="flex items-center p-2 hover:bg-gray-50 cursor-pointer rounded-lg"
            >
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                {connection.name?.charAt(0).toUpperCase()}
              </div>
              <span className="ml-3 flex-1">{connection.name}</span>
              {selectedUsers.find(user => user._id === connection._id) && (
                <Check className="h-5 w-5 text-green-500" />
              )}
            </div>
          ))}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-4 mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Create Button */}
        <button
          onClick={handleCreateGroup}
          className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Create Group
        </button>
      </div>
    </div>
  );
};

export default NewGroup;