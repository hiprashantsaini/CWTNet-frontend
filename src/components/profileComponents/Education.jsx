import axios from "axios";
import { Calendar, Edit2Icon, LoaderCircleIcon, MapPin, PlusIcon, Trash2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import AddEditEducation from "./AddEditEducation";

const Education = ({user,isOwnProfile}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [education, setEducation] = useState(null);
    const [selectedEducation, setSelectedEducation] = useState(null);
    const [action, setAction] = useState('add');
    const [loading, setLoading] = useState(false);

    const getEducations = async () => {
        try {
            const res = await axios.get(`https://cwt-net-backend.vercel.app/api/v1/education/${user._id}`, { withCredentials: true });
            if (res) {
                setEducation(res.data.educations);
            }
        } catch (error) {
            console.log("error :", error);
        }
    }

    const handleEdit = (edu) => {
        setSelectedEducation(edu);
        setAction('update');
        setIsOpen(true);
    };

    function handleAdd() {
        setAction('add');
        setIsOpen(true);
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            year: 'numeric'
        });
    };

    const deleteEducation = async (edu) => {
        // Show confirmation dialog
        const result = await Swal.fire({
            title: 'Are you sure?',
            html: `You are about to delete your education record from <b>${edu.institutionName}</b>.<br/>This action cannot be undone.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel',
            reverseButtons: true,
            focusCancel: true // Focus on cancel button by default for safety
        });
        if (!result.isConfirmed) return;

        try {
            setLoading(true);
            let res = await axios.delete(`https://cwt-net-backend.vercel.app/api/v1/education/${edu._id}`, { withCredentials: true });
            if (res) {
                toast.success(res.data?.message);
                setLoading(false);
                getEducations();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong. Try again");
            setLoading(false);
        }
    }

    useEffect(() => {
        getEducations();
    }, []);
    return (
        <div className="mt-2 bg-white p-2 px-4">
            <div className="flex justify-between items-center">
                <h1 className="text-xl font-semibold">Education</h1>
                  {isOwnProfile && <div className="flex items-center gap-4" title="Add Education"><PlusIcon onClick={handleAdd} className="cursor-pointer" /></div>}
            </div>
            <p className="w-full border-2 border-b-gray-500 mt-2"></p>
            <div className="mt-4 space-y-6">
                {education && education.map((edu) => (
                    <div key={edu._id} className="relative border-b pb-4 last:border-b-0">
                        <div className="flex justify-between items-start group">
                            <div className="flex gap-3">
                                {/* Institution Logo/Initial */}
                                <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
                                    <span className="text-xl font-semibold text-gray-600">
                                        {edu.institutionName?.charAt(0)}
                                    </span>
                                </div>

                                {/* Education Details */}
                                <div>
                                    <h3 className="font-semibold text-gray-900">
                                        {edu.institutionName}
                                    </h3>
                                    <p className="text-gray-700">{edu.degree} • {edu.fieldOfStudy}</p>

                                    <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                                        <Calendar size={14} />
                                        <span>
                                            {formatDate(edu.startDate)} - {edu.isCurrentlyStudying ? 'Present' : formatDate(edu.endDate)}
                                        </span>
                                    </div>

                                    {edu.location && (
                                        <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                                            <MapPin size={14} />
                                            <span>{edu.location}</span>
                                        </div>
                                    )}

                                    {edu.grade && (
                                        <p className="text-gray-700 mt-2">
                                            Grade: {edu.grade}
                                        </p>
                                    )}

                                    {edu.activities && edu.activities.length > 0 && (
                                        <div className="mt-2">
                                            <p className="text-gray-700 font-medium">Activities:</p>
                                            <ul className="list-disc list-inside text-gray-600 text-sm">
                                                {edu.activities.map((activity, index) => (
                                                    <li key={index}>{activity}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {edu.description && (
                                        <p className="mt-2 text-gray-600 whitespace-pre-line">
                                            {edu.description}
                                        </p>
                                    )}
                                </div>
                            </div>
                          {isOwnProfile && <div>
                                {/* Edit Button */}
                                <button
                                    onClick={() => handleEdit(edu)}
                                    title="Edit this"
                                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded"
                                >
                                    <Edit2Icon size={16} className="text-gray-600" />
                                </button>

                                {/* Delete Button */}
                                <button
                                    onClick={() => deleteEducation(edu)}
                                    title="Delete this"
                                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded"
                                >
                                    <Trash2Icon size={16} className="text-gray-600" />
                                </button>
                            </div>}

                        </div>
                    </div>
                ))}
            </div>
            <AddEditEducation isOpen={isOpen} setIsOpen={setIsOpen} action={action}
                initialData={selectedEducation}
                onSave={getEducations}  // Refresh the list after save
            />

            {
                loading && <div className="w-[100vw] h-[100vh] fixed inset-0 flex justify-center items-center bg-gray-200 bg-opacity-10"><LoaderCircleIcon className="animate-spin"/></div>
            }
        </div>
    )
}

export default Education;