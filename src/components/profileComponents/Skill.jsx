import axios from 'axios';
import { Pencil, PlusIcon, ThumbsUp, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import AddEditSkill from './AddEditSkill';

const Skill = ({user,isOwnProfile}) => {
  const [skills, setSkills] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [action, setAction] = useState('add');
  const [selectedSkill, setSelectedSkill] = useState(null);

  const getSkills = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(`https://cwt-net-backend.vercel.app/api/v1/skill/${user._id}`, { 
        withCredentials: true 
      });
      if (res.data?.skills) {
        setSkills(res.data.skills);
      }
    } catch (error) {
      console.log(error.response?.data?.message || 'Failed to fetch skills');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getSkills();
  }, []);

  const handleAddSkill = () => {
    setAction('add');
    setSelectedSkill(null);
    setIsOpen(true);
  };

  const handleEditSkill = (skill) => {
    setAction('update');
    setSelectedSkill(skill);
    setIsOpen(true);
  };

  const handleDeleteSkill = async (skill) => {
    const result=await Swal.fire({
        title: 'Are you sure?',
        text: `Do you want to delete the skill "${skill.skill_name}"?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'Cancel'
      })

    if(!result.isConfirmed) return;

    try {
      setIsLoading(true);
      const res = await axios.delete(`https://cwt-net-backend.vercel.app/api/v1/skill/${skill._id}`, {
        withCredentials: true
      });
      if (res.data) {
        toast.success(res.data.message || 'Skill deleted successfully');
        getSkills();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete skill');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-2 px-4 bg-white my-2 rounded-lg shadow-sm">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold">Skills</h1>
        {isOwnProfile &&(
                  <button
                  onClick={handleAddSkill}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                  title="Add Skill"
                >
                  <PlusIcon size={20} className="text-blue-600" />
                </button>)
        }
      </div>
      <div className="w-full border border-gray-500 mt-2 mb-4"></div>
      
      {isLoading && skills.length === 0 ? (
        <div className="py-8 text-center text-gray-500">Loading skills...</div>
      ) : skills.length === 0 ? (
        <div className="py-8 text-center text-gray-500">
          <p>No skills added yet</p>
         {isOwnProfile && <button 
            onClick={handleAddSkill} 
            className="mt-2 text-blue-600 hover:text-blue-800 transition-colors font-medium"
          >
            Add your first skill
          </button>}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {skills.map((skill) => (
            <div key={skill._id} className="border rounded-lg p-3 group relative">
              <div className="flex justify-between items-start">
                <h3 className="font-medium text-gray-900">{skill.skill_name}</h3>
                {
                  isOwnProfile && (<div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => handleEditSkill(skill)}
                    className="text-gray-500 hover:text-blue-600 transition-colors"
                    title="Edit"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteSkill(skill)}
                    className="text-gray-500 hover:text-red-600 transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>)
                }
              </div>
              
              {skill.endorsements && skill.endorsements.length > 0 && (
                <div className="mt-2 flex items-center text-sm text-gray-600">
                  <ThumbsUp size={14} className="mr-1 text-blue-500" />
                  {skill.endorsements.length} endorsement{skill.endorsements.length !== 1 ? 's' : ''}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <AddEditSkill
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        action={action}
        initialData={selectedSkill}
        onSave={getSkills}
      />
    </div>
  );
};

export default Skill;