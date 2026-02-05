import axios from 'axios';
import { Calendar, Globe, Image, Link, Lock, Trash2, Users, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';

const AddEditCertificate = ({ isOpen, onClose, initialData = null , onSave}) => {
    const isEdit = !!initialData;
    const fileInputRef = useRef(null);

    // Form state
    const [formData, setFormData] = useState({
        title: '',
        issuer: '',
        issue_date: '',
        expiration_date: '',
        credential_id: '',
        credential_url: '',
        description: '',
        visibility: 'public',
        has_expiration: false,
        image: null
    });

    const [imagePreview, setImagePreview] = useState(null);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Initialize form with certificate data if editing
    useEffect(() => {
        if (initialData) {
            const has_expiration = !!initialData.expiration_date;
            setFormData({
                ...initialData,
                issue_date: formatDateForInput(initialData.issue_date),
                expiration_date: formatDateForInput(initialData.expiration_date) || '',
                has_expiration
            });

            // Set image preview if certificate has an image
            if (initialData.image) {
                setImagePreview(initialData.image);
            } else {
                setImagePreview(null);
            }
        } else {
            // Reset form for new certificate
            resetForm();
        }
    }, [initialData, isOpen]);

    const resetForm = () => {
        setFormData({
            title: '',
            issuer: '',
            issue_date: '',
            expiration_date: '',
            credential_id: '',
            credential_url: '',
            description: '',
            visibility: 'public',
            has_expiration: false,
            image: null
        });
        setImagePreview(null);
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

    const handleExpirationToggle = (e) => {
        const hasExpiration = e.target.checked;
        setFormData(prev => ({
            ...prev,
            has_expiration: hasExpiration,
            expiration_date: hasExpiration ? prev.expiration_date : ''
        }));
    };

    const handleVisibilityChange = (visibility) => {
        setFormData(prev => ({
            ...prev,
            visibility
        }));
    };

    const handleImageClick = () => {
        fileInputRef.current.click();
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Check file type
        if (!file.type.match('image.*')) {
            setErrors(prev => ({
                ...prev,
                image: 'Please select an image file (PNG, JPG, JPEG)'
            }));
            return;
        }

        // Check file size (limit to 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setErrors(prev => ({
                ...prev,
                image: 'Image size should be less than 5MB'
            }));
            return;
        }

        // Clear any previous errors
        if (errors.image) {
            setErrors(prev => ({
                ...prev,
                image: null
            }));
        }

        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result);
            setFormData(prev => ({
                ...prev,
                image: reader.result
            }));
        };
        reader.readAsDataURL(file);
    };

    const handleRemoveImage = () => {
        setFormData(prev => ({
            ...prev,
            image: null
        }));
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.title.trim()) newErrors.title = 'Title is required';
        if (!formData.issuer.trim()) newErrors.issuer = 'Issuer is required';
        if (!formData.issue_date) newErrors.issue_date = 'Issue date is required';

        if (formData.has_expiration && !formData.expiration_date) {
            newErrors.expiration_date = 'Expiration date is required if certificate expires';
        }

        if (formData.credential_url && !isValidUrl(formData.credential_url)) {
            newErrors.credential_url = 'Please enter a valid URL';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const isValidUrl = (url) => {
        try {
            new URL(url);
            return true;
        } catch (e) {
            console.log(e);
            return false;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsSubmitting(true);

        try {

            let res;
            if(isEdit){
                res = await axios.post(`https://cwt-net-backend.vercel.app/api/v1/certificate/update/${initialData._id}`, formData, {withCredentials: true});
            }else{
               res = await axios.post("https://cwt-net-backend.vercel.app/api/v1/certificate/add", formData, {withCredentials: true});
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
                submit: 'Failed to save certificate. Please try again.'
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
                        {isEdit ? 'Edit Certificate' : 'Add Certificate'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-4 space-y-4">
                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Title <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Ex: AWS Certified Solutions Architect"
                            className={`w-full px-3 py-2 border rounded-md ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {errors.title && (
                            <p className="text-red-500 text-xs mt-1">{errors.title}</p>
                        )}
                    </div>

                    {/* Issuer */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Issuer <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="issuer"
                            value={formData.issuer}
                            onChange={handleChange}
                            placeholder="Ex: Amazon Web Services"
                            className={`w-full px-3 py-2 border rounded-md ${errors.issuer ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {errors.issuer && (
                            <p className="text-red-500 text-xs mt-1">{errors.issuer}</p>
                        )}
                    </div>

                    {/* Issue Date */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Issue Date <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Calendar size={16} className="text-gray-400" />
                            </div>
                            <input
                                type="date"
                                name="issue_date"
                                value={formData.issue_date}
                                onChange={handleChange}
                                className={`w-full pl-10 px-3 py-2 border rounded-md ${errors.issue_date ? 'border-red-500' : 'border-gray-300'}`}
                            />
                        </div>
                        {errors.issue_date && (
                            <p className="text-red-500 text-xs mt-1">{errors.issue_date}</p>
                        )}
                    </div>

                    {/* Expiration Date */}
                    <div>
                        <div className="flex items-center mb-2">
                            <input
                                type="checkbox"
                                id="has_expiration"
                                checked={formData.has_expiration}
                                onChange={handleExpirationToggle}
                                className="mr-2 h-4 w-4"
                            />
                            <label htmlFor="has_expiration" className="text-sm font-medium text-gray-700">
                                This certificate has an expiration date
                            </label>
                        </div>

                        {formData.has_expiration && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Expiration Date
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Calendar size={16} className="text-gray-400" />
                                    </div>
                                    <input
                                        type="date"
                                        name="expiration_date"
                                        value={formData.expiration_date}
                                        onChange={handleChange}
                                        className={`w-full pl-10 px-3 py-2 border rounded-md ${errors.expiration_date ? 'border-red-500' : 'border-gray-300'}`}
                                    />
                                </div>
                                {errors.expiration_date && (
                                    <p className="text-red-500 text-xs mt-1">{errors.expiration_date}</p>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Credential ID */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Credential ID
                        </label>
                        <input
                            type="text"
                            name="credential_id"
                            value={formData.credential_id}
                            onChange={handleChange}
                            placeholder="Ex: ABC123456789"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        />
                    </div>

                    {/* Credential URL */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Credential URL
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Link size={16} className="text-gray-400" />
                            </div>
                            <input
                                type="text"
                                name="credential_url"
                                value={formData.credential_url}
                                onChange={handleChange}
                                placeholder="https://example.com/verify/ABC123456789"
                                className={`w-full pl-10 px-3 py-2 border rounded-md ${errors.credential_url ? 'border-red-500' : 'border-gray-300'}`}
                            />
                        </div>
                        {errors.credential_url && (
                            <p className="text-red-500 text-xs mt-1">{errors.credential_url}</p>
                        )}
                    </div>

                    {/* Certificate Image */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Certificate Image
                        </label>

                        <div
                            onClick={handleImageClick}
                            className={`border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors ${imagePreview ? 'border-blue-300' : 'border-gray-300'
                                }`}
                        >
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleImageChange}
                                accept="image/*"
                                className="hidden"
                            />

                            {imagePreview ? (
                                <div className="relative w-full">
                                    <img
                                        src={imagePreview}
                                        alt="Certificate preview"
                                        className="mx-auto max-h-48 rounded-md object-contain"
                                    />
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleRemoveImage();
                                        }}
                                        className="absolute top-2 right-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-full p-1"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <Image size={40} className="text-gray-400 mb-2" />
                                    <div className="text-center">
                                        <p className="text-sm text-gray-600">
                                            Click to upload certificate image
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            PNG, JPG, JPEG (max. 5MB)
                                        </p>
                                    </div>
                                </>
                            )}
                        </div>

                        {errors.image && (
                            <p className="text-red-500 text-xs mt-1">{errors.image}</p>
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
                            placeholder="Add details about the certificate..."
                            rows="3"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        />
                    </div>

                    {/* Visibility */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Visibility
                        </label>
                        <div className="flex flex-col space-y-2">
                            <button
                                type="button"
                                onClick={() => handleVisibilityChange('public')}
                                className={`flex items-center p-2 rounded-md text-left ${formData.visibility === 'public'
                                        ? 'bg-blue-50 border border-blue-500'
                                        : 'border border-gray-300'
                                    }`}
                            >
                                <Globe size={18} className={`mr-2 ${formData.visibility === 'public' ? 'text-blue-500' : 'text-gray-500'}`} />
                                <div>
                                    <div className={`font-medium ${formData.visibility === 'public' ? 'text-blue-500' : 'text-gray-700'}`}>Public</div>
                                    <div className="text-xs text-gray-500">All LinkedIn members</div>
                                </div>
                            </button>

                            <button
                                type="button"
                                onClick={() => handleVisibilityChange('connections')}
                                className={`flex items-center p-2 rounded-md text-left ${formData.visibility === 'connections'
                                        ? 'bg-blue-50 border border-blue-500'
                                        : 'border border-gray-300'
                                    }`}
                            >
                                <Users size={18} className={`mr-2 ${formData.visibility === 'connections' ? 'text-blue-500' : 'text-gray-500'}`} />
                                <div>
                                    <div className={`font-medium ${formData.visibility === 'connections' ? 'text-blue-500' : 'text-gray-700'}`}>Connections</div>
                                    <div className="text-xs text-gray-500">Only your connections</div>
                                </div>
                            </button>

                            <button
                                type="button"
                                onClick={() => handleVisibilityChange('private')}
                                className={`flex items-center p-2 rounded-md text-left ${formData.visibility === 'private'
                                        ? 'bg-blue-50 border border-blue-500'
                                        : 'border border-gray-300'
                                    }`}
                            >
                                <Lock size={18} className={`mr-2 ${formData.visibility === 'private' ? 'text-blue-500' : 'text-gray-500'}`} />
                                <div>
                                    <div className={`font-medium ${formData.visibility === 'private' ? 'text-blue-500' : 'text-gray-700'}`}>Private</div>
                                    <div className="text-xs text-gray-500">Only you</div>
                                </div>
                            </button>
                        </div>
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
                                    : 'Add Certificate'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddEditCertificate;