import axios from 'axios';
import { Briefcase, Clock, DollarSign, Image, Loader, MapPin, Plus, Trash2, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const AddEditInternship = ({ isOpen, onClose, initialData }) => {
    const [formData, setFormData] = useState(
        initialData || {
            title: "",
            company: "",
            logo: "",
            logoColor: "",
            location: "",
            isRemote: false,
            isFullTime: false,
            logoShape: "square",
            description: "",
            requirements: [""],
            salary: "",
            duration: "",
        }
    );

    const [errors, setErrors] = useState({});
    const [loading,setLoading]=useState(false);

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));

        // Clear error for this field when it changes
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const handleRequirementChange = (index, value) => {
        const updatedRequirements = [...formData.requirements];
        updatedRequirements[index] = value;
        setFormData(prev => ({
            ...prev,
            requirements: updatedRequirements
        }));
    };

    const addRequirement = () => {
        setFormData(prev => ({
            ...prev,
            requirements: [...prev.requirements, ""]
        }));
    };

    const removeRequirement = (index) => {
        const updatedRequirements = [...formData.requirements];
        updatedRequirements.splice(index, 1);
        setFormData(prev => ({
            ...prev,
            requirements: updatedRequirements
        }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.title.trim()) newErrors.title = "Title is required";
        if (!formData.company.trim()) newErrors.company = "Company is required";
        if (!formData.location.trim()) newErrors.location = "Location is required";
        if (!formData.description.trim()) newErrors.description = "Description is required";

        // Check if any requirements are empty
        const emptyRequirements = formData.requirements.some(req => !req.trim());
        if (emptyRequirements || formData.requirements.length === 0) {
            newErrors.requirements = "At least one requirement is needed";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                setLoading(true);
                let res;
                if(initialData){
                 res = await axios.put(`http://localhost:5000/api/v1/internship/${initialData._id}`, formData, { withCredentials: true });
                }else{
                 res = await axios.post("http://localhost:5000/api/v1/internship", formData, { withCredentials: true });
                }
                if (res.data) {
                    toast.success(res.data.message);
                    onClose();
                }
                if (!initialData) {
                    // Reset form if this is a new internship
                    setFormData({
                        title: "",
                        company: "",
                        logo: "",
                        logoColor: "",
                        location: "",
                        isRemote: false,
                        isFullTime: false,
                        logoShape: "square",
                        description: "",
                        requirements: [""],
                        salary: "",
                        duration: "",
                    });
                }
            } catch (error) {
                toast.error(error.response?.data?.message || "Try again.")
            }finally{
                setLoading(false);
            }
        }
    };

    const handleLogoChange=(e)=>{
         e.preventDefault();
         const file=e.target.files[0];
         if(file){
            const reader=new FileReader();

            reader.onloadend=()=>{
                setFormData(prev=>({
                    ...prev,logo:reader.result
                }))
            }
            reader.readAsDataURL(file);
         }
    }

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-xl font-bold">
                        {initialData ? "Edit Internship" : "Add New Internship"}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Title and Company */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Title <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                className={`w-full p-2 border rounded-md ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
                                placeholder="e.g. Frontend Developer Intern"
                            />
                            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Company <span className="text-red-500">*</span>
                            </label>
                            <div className="flex">
                                <span className="inline-flex items-center px-3 bg-gray-100 border border-r-0 border-gray-300 rounded-l-md">
                                    <Briefcase size={16} className="text-gray-500" />
                                </span>
                                <input
                                    type="text"
                                    name="company"
                                    value={formData.company}
                                    onChange={handleChange}
                                    className={`w-full p-2 border rounded-r-md ${errors.company ? 'border-red-500' : 'border-gray-300'}`}
                                    placeholder="e.g. Acme Inc."
                                />
                            </div>
                            {errors.company && <p className="text-red-500 text-xs mt-1">{errors.company}</p>}
                        </div>
                    </div>

                    {/* Logo, Logo Color and Logo Shape */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Logo Image
                            </label>
                            <div className="flex flex-col space-y-2">
                                <div className="flex items-center">
                                    <input
                                        type="file"
                                        id="logoFile"
                                        accept="image/*"
                                        onChange={handleLogoChange}
                                        className="hidden"
                                    />
                                    <label
                                        htmlFor="logoFile"
                                        className="flex items-center justify-center px-4 py-2 bg-white border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50"
                                    >
                                        <Image size={16} className="text-gray-500 mr-2" />
                                        <span className="text-sm text-gray-700">Choose File</span>
                                    </label>
                                    {formData.logo && (
                                        <button
                                            type="button"
                                            onClick={() => setFormData(prev => ({ ...prev, logo: "" }))}
                                            className="ml-2 text-red-600 hover:text-red-800"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    )}
                                </div>

                                {formData.logo && (
                                    <div className="mt-2">
                                        <div className={`overflow-hidden border border-gray-300 bg-gray-100 ${formData.logoShape === 'rounded' ? 'rounded-md' :
                                                formData.logoShape === 'rounded-full' ? 'rounded-full' : ''
                                            }`} style={{ width: '80px', height: '80px' }}>
                                            <img
                                                src={formData.logo}
                                                alt="Logo preview"
                                                className="object-cover w-full h-full"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Logo Color
                            </label>
                            <input
                                type="color"
                                name="logoColor"
                                value={formData.logoColor}
                                onChange={handleChange}
                                className="h-10 w-full p-1 border border-gray-300 rounded-md"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Logo Shape
                            </label>
                            <select
                                name="logoShape"
                                value={formData.logoShape}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded-md"
                            >
                                <option value="square">Square</option>
                                <option value="rounded">Rounded</option>
                                <option value="rounded-full">Circle</option>
                            </select>
                        </div>
                    </div>

                    {/* Location and Options */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Location <span className="text-red-500">*</span>
                            </label>
                            <div className="flex">
                                <span className="inline-flex items-center px-3 bg-gray-100 border border-r-0 border-gray-300 rounded-l-md">
                                    <MapPin size={16} className="text-gray-500" />
                                </span>
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    className={`w-full p-2 border rounded-r-md ${errors.location ? 'border-red-500' : 'border-gray-300'}`}
                                    placeholder="e.g. New York, NY"
                                />
                            </div>
                            {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location}</p>}
                        </div>
                        <div className="flex items-center space-x-4 mt-6">
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="isRemote"
                                    name="isRemote"
                                    checked={formData.isRemote}
                                    onChange={handleChange}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label htmlFor="isRemote" className="ml-2 text-sm text-gray-700">
                                    Remote
                                </label>
                            </div>
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="isFullTime"
                                    name="isFullTime"
                                    checked={formData.isFullTime}
                                    onChange={handleChange}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label htmlFor="isFullTime" className="ml-2 text-sm text-gray-700">
                                    Full Time
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Salary and Duration */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Salary
                            </label>
                            <div className="flex">
                                <span className="inline-flex items-center px-3 bg-gray-100 border border-r-0 border-gray-300 rounded-l-md">
                                    <DollarSign size={16} className="text-gray-500" />
                                </span>
                                <input
                                    type="text"
                                    name="salary"
                                    value={formData.salary}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded-r-md"
                                    placeholder="e.g. $15-20/hr or $1000/month"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Duration
                            </label>
                            <div className="flex">
                                <span className="inline-flex items-center px-3 bg-gray-100 border border-r-0 border-gray-300 rounded-l-md">
                                    <Clock size={16} className="text-gray-500" />
                                </span>
                                <input
                                    type="text"
                                    name="duration"
                                    value={formData.duration}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded-r-md"
                                    placeholder="e.g. 3 months, Summer 2025"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={4}
                            className={`w-full p-2 border rounded-md ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
                            placeholder="Enter a detailed description of the internship..."
                        />
                        {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                    </div>

                    {/* Requirements */}
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Requirements <span className="text-red-500">*</span>
                            </label>
                            <button
                                type="button"
                                onClick={addRequirement}
                                className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                            >
                                <Plus size={16} className="mr-1" />
                                Add Requirement
                            </button>
                        </div>
                        {errors.requirements && <p className="text-red-500 text-xs mb-2">{errors.requirements}</p>}
                        <div className="space-y-2">
                            {formData.requirements.map((req, index) => (
                                <div key={index} className="flex items-center">
                                    <input
                                        type="text"
                                        value={req}
                                        onChange={(e) => handleRequirementChange(index, e.target.value)}
                                        className="w-full p-2 border border-gray-300 rounded-md"
                                        placeholder="e.g. Proficiency in JavaScript"
                                    />
                                    {formData.requirements.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeRequirement(index)}
                                            className="ml-2 text-red-600 hover:text-red-800"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Submit and Cancel Buttons */}
                    <div className="flex justify-end space-x-3 mt-8">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                        >
                            Cancel
                        </button>
                       {loading ? <button  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700" ><Loader className='animate-spin'/></button> : 
                       <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                            {initialData ? "Update Internship" : "Add Internship"}
                        </button>}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddEditInternship;
