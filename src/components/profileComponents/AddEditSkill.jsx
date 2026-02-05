import axios from 'axios';
import { LoaderCircle, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const AddEditSkill = ({ isOpen, setIsOpen, initialData, onSave, action }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    skill_name: '',
  });

  function onClose() {
    setIsOpen(false);
    setFormData({
      skill_name: '',
    });
  }

  useEffect(() => {
    if (initialData) {
      setFormData({
        skill_name: initialData.skill_name || '',
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.skill_name.trim()) {
      toast.error("Skill name is required");
      return;
    }

    try {
      setLoading(true);
      let res;
      
      if (action === 'add') {
        res = await axios.post(
          "https://cwt-net-backend.vercel.app/api/v1/skill/add",
          formData,
          { withCredentials: true }
        );
      } else if (action === 'update') {
        res = await axios.put(
          `https://cwt-net-backend.vercel.app/api/v1/skill/update/${initialData._id}`,
          formData,
          { withCredentials: true }
        );
      }
      
      if (res) {
        toast.success(res.data?.message || "Skill saved successfully");
        setLoading(false);
        onSave();
        onClose();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong. Try again");
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-lg">
        <div className="flex justify-between items-center border-b p-4">
          <h2 className="text-xl font-semibold text-gray-800">
            {action === 'add' ? 'Add New Skill' : 'Edit Skill'}
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4">
          <div className="mb-4">
            <label htmlFor="skill_name" className="block text-sm font-medium text-gray-700 mb-1">
              Skill Name*
            </label>
            <input
              type="text"
              id="skill_name"
              name="skill_name"
              value={formData.skill_name}
              onChange={handleChange}
              placeholder="Enter skill (e.g., JavaScript, Project Management)"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              required
            />
          </div>

          {initialData && initialData.endorsements && initialData.endorsements.length > 0 && (
            <div className="mb-4">
              <div className="text-sm font-medium text-gray-700 mb-1">
                Endorsements
              </div>
              <div className="bg-gray-50 p-3 rounded-md">
                <p className="text-gray-600">
                  This skill has {initialData.endorsements.length} endorsement{initialData.endorsements.length !== 1 ? 's' : ''}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Endorsements cannot be edited here. They are earned when other users recognize your expertise.
                </p>
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 flex items-center"
            >
              {loading ? (
                <>
                  <LoaderCircle size={16} className="animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                'Save'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEditSkill;