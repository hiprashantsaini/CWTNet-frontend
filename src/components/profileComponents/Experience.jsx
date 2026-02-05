import axios from "axios";
import { Calendar, Edit2Icon, LoaderCircleIcon, PlusIcon, Trash2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import AddEditExperience from "./AddEditExperience";

const Experience = ({user,isOwnProfile}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [experiences, setExperiences] = useState([]);
    const [selectedExperience, setSelectedExperience] = useState(null);
    const [loading, setLoading] = useState(false);

    const getExperiences = async () => {
        try {
            const res = await axios.get(`https://cwt-net-backend.vercel.app/api/v1/experience/${user._id}`, { withCredentials: true });
            setExperiences(res.data.experiences || []);
        } catch (error) {
            console.error("Error fetching experiences:", error);
        }
    };

    const handleEdit = (exp) => {
        setSelectedExperience(exp);
        setIsOpen(true);
    };

    const handleAdd = () => {
        setSelectedExperience(null);
        setIsOpen(true);
    };

    const formatDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
    };

    const deleteExperience = async (exp) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            html: `You are about to delete the experience <b>${exp.job_title}</b> at <b>${exp.company}</b>. This action cannot be undone.`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "Cancel",
            reverseButtons: true,
            focusCancel: true,
        });
        if (!result.isConfirmed) return;

        try {
            setLoading(true);
            await axios.delete(`https://cwt-net-backend.vercel.app/api/v1/experience/${exp._id}`, { withCredentials: true });
            toast.success("Experience deleted successfully");
            getExperiences();
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong. Try again");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getExperiences();
    }, []);

    return (
        <div className="mt-2 bg-white p-2 px-4 rounded-lg shadow-sm">
            <div className="flex justify-between items-center">
                <h1 className="text-xl font-semibold">Experience</h1>
               {isOwnProfile && <button
                    onClick={handleAdd}
                    className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-600 px-3 py-2 rounded-md transition-colors"
                >
                    <PlusIcon size={18} />
                    <span>Add Experience</span>
                </button>}
            </div>
            <p className="w-full border-2 border-b-gray-500 mt-2"></p>
            <div className="mt-6 space-y-6">
                {experiences.length > 0 ? (
                    experiences.map((exp) => (
                        <div key={exp._id} className="relative border-b pb-6 last:border-b-0">
                            <div className="flex justify-between items-start group">
                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-900 text-lg">{exp.job_title}</h3>
                                    <p className="text-gray-700 font-medium">{exp.company}</p>
                                    <p className="text-sm text-gray-600">{exp.location}</p>
                                    <div className="flex items-center gap-2 text-sm text-gray-600 mt-2">
                                        <Calendar size={14} />
                                        <span>{formatDate(exp.start_date)} - {exp.end_date ? formatDate(exp.end_date) : "Present"}</span>
                                    </div>
                                    {exp.description && (
                                        <p className="mt-3 text-gray-600 whitespace-pre-line text-sm">{exp.description}</p>
                                    )}
                                </div>
                               {isOwnProfile && <div className="flex gap-1">
                                    <button onClick={() => handleEdit(exp)} className="p-2 hover:bg-gray-100 rounded" title="Edit Experience">
                                        <Edit2Icon size={16} className="text-gray-600" />
                                    </button>
                                    <button onClick={() => deleteExperience(exp)} className="p-2 hover:bg-red-50 rounded" title="Delete Experience">
                                        <Trash2Icon size={16} className="text-red-500" />
                                    </button>
                                </div>}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-10 text-gray-500">
                        { isOwnProfile ? <p>No experiences found. Click <button onClick={handleAdd} className="text-blue-600">Add Experience</button> to create your first one.</p>
                        : <p>No experiences added.</p>
                        }
                    </div>
                )}
            </div>
            <AddEditExperience
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                onClose={() => setIsOpen(false)}
                initialData={selectedExperience}
                onSave={getExperiences}
            />

            {loading && (
                <div className="fixed inset-0 flex justify-center items-center bg-gray-200 bg-opacity-10 backdrop-blur-sm z-50">
                    <LoaderCircleIcon className="animate-spin text-blue-600" size={36} />
                </div>
            )}
        </div>
    );
};

export default Experience;
