import axios from 'axios';
import { Calendar, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const AddEditExperience = ({ isOpen, onClose, initialData = null, onSave }) => {
    const isEdit = !!initialData;

    // Form state
    const [formData, setFormData] = useState({
        job_title: '',
        company: '',
        location: '',
        start_date: '',
        end_date: '',
        description: ''
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Initialize form with experience data if editing
    useEffect(() => {
        if (initialData) {
            setFormData({
                ...initialData,
                start_date: formatDateForInput(initialData.start_date),
                end_date: initialData.end_date ? formatDateForInput(initialData.end_date) : ''
            });
        } else {
            resetForm();
        }
    }, [initialData, isOpen]);

    const resetForm = () => {
        setFormData({
            job_title: '',
            company: '',
            location: '',
            start_date: '',
            end_date: '',
            description: ''
        });
        setErrors({});
    };

    const formatDateForInput = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: null
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.job_title.trim()) newErrors.job_title = 'Job title is required';
        if (!formData.company.trim()) newErrors.company = 'Company is required';
        if (!formData.location.trim()) newErrors.location = 'Location is required';
        if (!formData.start_date) newErrors.start_date = 'Start date is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsSubmitting(true);

        try {
            let res;
            if (isEdit) {
                res = await axios.post(`https://cwt-net-backend.vercel.app/api/v1/experience/update/${initialData._id}`, formData, { withCredentials: true });
            } else {
                res = await axios.post("https://cwt-net-backend.vercel.app/api/v1/experience/add", formData, { withCredentials: true });
            }
            if (res?.data) {
                toast.success(res.data.message);
                onClose();
                onSave();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
            setErrors(prev => ({
                ...prev,
                submit: 'Failed to save experience. Please try again.'
            }));
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center border-b p-4">
                    <h2 className="text-xl font-semibold">
                        {isEdit ? 'Edit Experience' : 'Add Experience'}
                    </h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-4 space-y-4">
                    {/* Job Title */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Job Title <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="job_title"
                            value={formData.job_title}
                            onChange={handleChange}
                            placeholder="Ex: Software Engineer"
                            className={`w-full px-3 py-2 border rounded-md ${errors.job_title ? 'border-red-500' : 'border-gray-300'}`}
                            />
                            {errors.job_title && (
                                <p className="text-red-500 text-xs mt-1">{errors.job_title}</p>
                            )}
                        </div>
    
                        {/* Company */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Company <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="company"
                                value={formData.company}
                                onChange={handleChange}
                                placeholder="Ex: Google"
                                className={`w-full px-3 py-2 border rounded-md ${errors.company ? 'border-red-500' : 'border-gray-300'}`}
                            />
                            {errors.company && (
                                <p className="text-red-500 text-xs mt-1">{errors.company}</p>
                            )}
                        </div>
    
                        {/* Location */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Location <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                placeholder="Ex: San Francisco, CA"
                                className={`w-full px-3 py-2 border rounded-md ${errors.location ? 'border-red-500' : 'border-gray-300'}`}
                            />
                            {errors.location && (
                                <p className="text-red-500 text-xs mt-1">{errors.location}</p>
                            )}
                        </div>
    
                        {/* Start Date */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Start Date <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Calendar size={16} className="text-gray-400" />
                                </div>
                                <input
                                    type="date"
                                    name="start_date"
                                    value={formData.start_date}
                                    onChange={handleChange}
                                    className={`w-full pl-10 px-3 py-2 border rounded-md ${errors.start_date ? 'border-red-500' : 'border-gray-300'}`}
                                />
                            </div>
                            {errors.start_date && (
                                <p className="text-red-500 text-xs mt-1">{errors.start_date}</p>
                            )}
                        </div>
    
                        {/* End Date */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                End Date
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Calendar size={16} className="text-gray-400" />
                                </div>
                                <input
                                    type="date"
                                    name="end_date"
                                    value={formData.end_date}
                                    onChange={handleChange}
                                    className={`w-full pl-10 px-3 py-2 border rounded-md ${errors.end_date ? 'border-red-500' : 'border-gray-300'}`}
                                />
                            </div>
                            {errors.end_date && (
                                <p className="text-red-500 text-xs mt-1">{errors.end_date}</p>
                            )}
                        </div>
    
                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Description
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Add details about your experience..."
                                rows="3"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            />
                        </div>
    
                        {/* Error message */}
                        {errors.submit && (
                            <div className="p-2 bg-red-50 text-red-500 text-sm rounded-md">
                                {errors.submit}
                            </div>
                        )}
    
                        {/* Submit buttons */}
                        <div className="flex justify-end space-x-2 pt-4 border-t">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                                disabled={isSubmitting}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-400"
                                disabled={isSubmitting}
                            >
                                {isSubmitting
                                    ? 'Saving...'
                                    : isEdit
                                        ? 'Save Changes'
                                        : 'Add Experience'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    };
    
    export default AddEditExperience;