import axios from 'axios';
import { Award, Book, BookOpen, Clock, DollarSign, FileText, Image, Minus, Plus, Tag, Trash2, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';

const AddEditCourse = ({ isOpen, onClose, initialData = null, onSave }) => {
  const isEdit = !!initialData;
  const fileInputRef = useRef(null);
  const [imagePreview, setImagePreview] = useState(null);
  

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    short_description: '',
    category: '',
    subcategory: '',
    tags: [],
    level: 'all-levels',
    duration: '',
    duration_hours: 0,
    price: 0,
    discounted_price: 0,
    currency: 'USD',
    language: 'English',
    prerequisites: [],
    learning_outcomes: [],
    course_content: [
      {
        section_title: '',
        lessons: [
          {
            title: '',
            type: 'video',
            duration_minutes: 0,
            is_free_preview: false
          }
        ]
      }
    ],
    thumbnail: null,
    promotional_video: '',
    certificate_available: false,
    access_period: 'lifetime',
    status: 'draft'
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentTab, setCurrentTab] = useState('basic');

  // Initialize form with course data if editing
  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        tags: initialData.tags || [],
        prerequisites: initialData.prerequisites || [],
        learning_outcomes: initialData.learning_outcomes || [],
        course_content: initialData.course_content || [
          {
            section_title: '',
            lessons: [
              {
                title: '',
                type: 'video',
                duration_minutes: 0,
                is_free_preview: false
              }
            ]
          }
        ]
      });
    } else {
      resetForm();
    }
  }, [initialData, isOpen]);

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      short_description: '',
      category: '',
      subcategory: '',
      tags: [],
      level: 'all-levels',
      duration: '',
      duration_hours: 0,
      price: 0,
      discounted_price: 0,
      currency: 'USD',
      language: 'English',
      prerequisites: [],
      learning_outcomes: [],
      course_content: [
        {
          section_title: '',
          lessons: [
            {
              title: '',
              type: 'video',
              duration_minutes: 0,
              is_free_preview: false
            }
          ]
        }
      ],
      thumbnail: null,
      promotional_video: '',
      certificate_available: false,
      access_period: 'lifetime',
      status: 'draft'
    });
    setErrors({});
    setCurrentTab('basic');
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value === '' ? '' : Number(value)
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  // Handle array fields (tags, prerequisites, learning outcomes)
  const handleArrayInput = (field, value) => {
    if (value.trim() !== '') {
      setFormData(prev => ({
        ...prev,
        [field]: [...prev[field], value.trim()]
      }));
    }
  };

  const handleRemoveArrayItem = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  // Course content management
  const handleSectionChange = (sectionIndex, field, value) => {
    const updatedContent = [...formData.course_content];
    updatedContent[sectionIndex][field] = value;
    setFormData(prev => ({
      ...prev,
      course_content: updatedContent
    }));
  };

  const handleLessonChange = (sectionIndex, lessonIndex, field, value) => {
    const updatedContent = [...formData.course_content];
    const lesson = updatedContent[sectionIndex].lessons[lessonIndex];
    
    if (field === 'is_free_preview') {
      lesson[field] = value;
    } else if (field === 'duration_minutes') {
      lesson[field] = value === '' ? '' : Number(value);
    } else {
      lesson[field] = value;
    }
    
    setFormData(prev => ({
      ...prev,
      course_content: updatedContent
    }));
  };

  const addSection = () => {
    setFormData(prev => ({
      ...prev,
      course_content: [
        ...prev.course_content,
        {
          section_title: '',
          lessons: [
            {
              title: '',
              type: 'video',
              duration_minutes: 0,
              is_free_preview: false
            }
          ]
        }
      ]
    }));
  };

  const removeSection = (index) => {
    setFormData(prev => ({
      ...prev,
      course_content: prev.course_content.filter((_, i) => i !== index)
    }));
  };

  const addLesson = (sectionIndex) => {
    const updatedContent = [...formData.course_content];
    updatedContent[sectionIndex].lessons.push({
      title: '',
      type: 'video',
      duration_minutes: 0,
      is_free_preview: false
    });
    
    setFormData(prev => ({
      ...prev,
      course_content: updatedContent
    }));
  };

  const removeLesson = (sectionIndex, lessonIndex) => {
    const updatedContent = [...formData.course_content];
    updatedContent[sectionIndex].lessons = updatedContent[sectionIndex].lessons.filter((_, i) => i !== lessonIndex);
    
    setFormData(prev => ({
      ...prev,
      course_content: updatedContent
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
            thumbnail: 'Please select an image file (PNG, JPG, JPEG)'
        }));
        return;
    }

    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({
            ...prev,
            thumbnail: 'Image size should be less than 5MB'
        }));
        return;
    }

    // Clear any previous errors
    if (errors.thumbnail) {
        setErrors(prev => ({
            ...prev,
            thumbnail: null
        }));
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData(prev => ({
            ...prev,
            thumbnail: reader.result
        }));
    };
    reader.readAsDataURL(file);
};

const handleRemoveImage = () => {
  setFormData(prev => ({
      ...prev,
      thumbnail: null
  }));
  setImagePreview(null);
  if (fileInputRef.current) {
      fileInputRef.current.value = '';
  }
};

  const validateForm = () => {
    const newErrors = {};

    // Basic validation
    if (!formData.title.trim()) newErrors.title = 'Course title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.category.trim()) newErrors.category = 'Category is required';
    if (!formData.duration.trim()) newErrors.duration = 'Duration is required';
    if (formData.price < 0) newErrors.price = 'Price cannot be negative';
    if (formData.discounted_price > formData.price) newErrors.discounted_price = 'Discounted price cannot be higher than regular price';

    formData.course_content.every((section, sIdx) => {   
      return section.lessons.every((lesson, lIdx) => {   
        // lesson.title.trim() ? (!section.section_title.trim() &&  (newErrors[`section_${sIdx}`] = 'Section title is required')) : (section.section_title.trim() && ( newErrors[`lesson_${sIdx}_${lIdx}`] = 'Lesson title is required'))
        if(lesson.title.trim()){
           if(!section.section_title.trim()){
            newErrors[`section_${sIdx}`] = 'Section title is required';
            return false;
           }
           return true
        }else{
          if(section.section_title.trim()){
            newErrors[`lesson_${sIdx}_${lIdx}`] = 'Lesson title is required';
            return false;
          }
          return true;
        }
      });
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    //So that course_content with empty fields could be filtered
    let courseData=formData.course_content.filter((item)=>item.section_title);
    const finalData={...formData,course_content:courseData}

    try {
      let res;
      if (isEdit) {
        res = await axios.patch(`https://cwt-net-backend.vercel.app/api/v1/course/${initialData._id}`, finalData, { withCredentials: true });
      } else {
        res = await axios.post("https://cwt-net-backend.vercel.app/api/v1/course/add", finalData, { withCredentials: true });
      }
      
      if (res?.data) {
        toast.success(isEdit ? 'Course updated successfully!' : 'Course created successfully!');
        onClose();
        onSave();
        
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
      setErrors(prev => ({
        ...prev,
        submit: 'Failed to save course. Please try again.'
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center border-b p-4 sticky top-0 bg-white z-10">
          <h2 className="text-xl font-semibold">
            {isEdit ? 'Edit Course' : 'Add New Course'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        <div className="p-4">
          {/* Tab navigation */}
          <div className="flex border-b mb-4">
            <button
              className={`px-4 py-2 ${currentTab === 'basic' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
              onClick={() => setCurrentTab('basic')}
            >
              <div className="flex items-center gap-2">
                <FileText size={16} />
                <span>Basic Info</span>
              </div>
            </button>
            <button
              className={`px-4 py-2 ${currentTab === 'details' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
              onClick={() => setCurrentTab('details')}
            >
              <div className="flex items-center gap-2">
                <Tag size={16} />
                <span>Details</span>
              </div>
            </button>
            <button
              className={`px-4 py-2 ${currentTab === 'content' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
              onClick={() => setCurrentTab('content')}
            >
              <div className="flex items-center gap-2">
                <BookOpen size={16} />
                <span>Course Content</span>
              </div>
            </button>
            <button
              className={`px-4 py-2 ${currentTab === 'settings' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
              onClick={() => setCurrentTab('settings')}
            >
              <div className="flex items-center gap-2">
                <Award size={16} />
                <span>Settings</span>
              </div>
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Basic Info Tab */}
            {currentTab === 'basic' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Course Title*
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      className={`w-full p-2 border rounded-md ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="Enter course title"
                    />
                    {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Short Description
                    </label>
                    <input
                      type="text"
                      name="short_description"
                      value={formData.short_description}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      placeholder="Brief overview (max 200 characters)"
                      maxLength={200}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Description*
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={5}
                    className={`w-full p-2 border rounded-md ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Detailed course description"
                  ></textarea>
                  {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category*
                    </label>
                    <input
                      type="text"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className={`w-full p-2 border rounded-md ${errors.category ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="E.g., Artificial Intelligence"
                    />
                    {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Subcategory
                    </label>
                    <input
                      type="text"
                      name="subcategory"
                      value={formData.subcategory}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      placeholder="E.g., Machine Learning"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Duration*
                    </label>
                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-gray-400" />
                      <input
                        type="text"
                        name="duration"
                        value={formData.duration}
                        onChange={handleChange}
                        className={`w-full p-2 border rounded-md ${errors.duration ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="E.g., 8 weeks"
                      />
                    </div>
                    {errors.duration && <p className="text-red-500 text-xs mt-1">{errors.duration}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Total Hours
                    </label>
                    <input
                      type="number"
                      name="duration_hours"
                      value={formData.duration_hours}
                      onChange={handleNumberChange}
                      min="0"
                      className="w-full p-2 border border-gray-300 rounded-md"
                      placeholder="Total course hours"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price*
                    </label>
                    <div className="flex items-center gap-2">
                      <DollarSign size={16} className="text-gray-400" />
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleNumberChange}
                        min="0"
                        step="0.01"
                        className={`w-full p-2 border rounded-md ${errors.price ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="Regular price"
                      />
                    </div>
                    {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Discounted Price
                    </label>
                    <input
                      type="number"
                      name="discounted_price"
                      value={formData.discounted_price}
                      onChange={handleNumberChange}
                      min="0"
                      step="0.01"
                      className={`w-full p-2 border rounded-md ${errors.discounted_price ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="Sale price (if applicable)"
                    />
                    {errors.discounted_price && <p className="text-red-500 text-xs mt-1">{errors.discounted_price}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Currency
                    </label>
                    <select
                      name="currency"
                      value={formData.currency}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                      <option value="INR">INR (₹)</option>
                      <option value="CAD">CAD ($)</option>
                      <option value="AUD">AUD ($)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Details Tab */}
            {currentTab === 'details' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Course Level
                  </label>
                  <select
                    name="level"
                    value={formData.level}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                    <option value="all-levels">All Levels</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Language
                  </label>
                  <input
                    type="text"
                    name="language"
                    value={formData.language}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="Primary language of instruction"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tags
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formData.tags.map((tag, index) => (
                      <div key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md flex items-center gap-1">
                        <span>{tag}</span>
                        <button 
                          type="button" 
                          onClick={() => handleRemoveArrayItem('tags', index)}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      id="tag-input"
                      className="w-full p-2 border border-gray-300 rounded-md"
                      placeholder="Add a tag and press Enter"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleArrayInput('tags', e.target.value);
                          e.target.value = '';
                        }
                      }}
                    />
                    <button
                      type="button"
                      className="bg-blue-500 text-white p-2 rounded-md"
                      onClick={() => {
                        const input = document.getElementById('tag-input');
                        handleArrayInput('tags', input.value);
                        input.value = '';
                      }}
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Prerequisites
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formData.prerequisites.map((prereq, index) => (
                      <div key={index} className="bg-gray-100 text-gray-800 px-2 py-1 rounded-md flex items-center gap-1">
                        <span>{prereq}</span>
                        <button 
                          type="button" 
                          onClick={() => handleRemoveArrayItem('prerequisites', index)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      id="prereq-input"
                      className="w-full p-2 border border-gray-300 rounded-md"
                      placeholder="Add a prerequisite and press Enter"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleArrayInput('prerequisites', e.target.value);
                          e.target.value = '';
                        }
                      }}
                    />
                    <button
                      type="button"
                      className="bg-blue-500 text-white p-2 rounded-md"
                      onClick={() => {
                        const input = document.getElementById('prereq-input');
                        handleArrayInput('prerequisites', input.value);
                        input.value = '';
                      }}
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Learning Outcomes
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formData.learning_outcomes.map((outcome, index) => (
                      <div key={index} className="bg-green-100 text-green-800 px-2 py-1 rounded-md flex items-center gap-1">
                        <span>{outcome}</span>
                        <button 
                          type="button" 
                          onClick={() => handleRemoveArrayItem('learning_outcomes', index)}
                          className="text-green-500 hover:text-green-700"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      id="outcome-input"
                      className="w-full p-2 border border-gray-300 rounded-md"
                      placeholder="Add a learning outcome and press Enter"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleArrayInput('learning_outcomes', e.target.value);
                          e.target.value = '';
                        }
                      }}
                    />
                    <button
                      type="button"
                      className="bg-blue-500 text-white p-2 rounded-md"
                      onClick={() => {
                        const input = document.getElementById('outcome-input');
                        handleArrayInput('learning_outcomes', input.value);
                        input.value = '';
                      }}
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                </div>



                    {/* Course Thumbnail Image */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Thumbnail Image
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
                            <p className="text-red-500 text-xs mt-1">{errors.thumbnail}</p>
                        )}
                    </div>


                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Promotional Video URL
                    </label>
                    <input
                      type="text"
                      name="promotional_video"
                      value={formData.promotional_video}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      placeholder="URL to promotional video"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Course Content Tab */}
            {currentTab === 'content' && (
              <div className="space-y-6">
                {formData.course_content.map((section, sectionIndex) => (
                  <div key={sectionIndex} className="border rounded-md p-4 bg-gray-50">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Book size={18} className="text-blue-500" />
                          <input
                            type="text"
                            value={section.section_title}
                            onChange={(e) => handleSectionChange(sectionIndex, 'section_title', e.target.value)}
                            className={`w-full p-2 border rounded-md ${errors[`section_${sectionIndex}`] ? 'border-red-500' : 'border-gray-300'}`}
                            placeholder="Section Title"
                          />
                        </div>
                        {errors[`section_${sectionIndex}`] && (
                          <p className="text-red-500 text-xs mt-1">{errors[`section_${sectionIndex}`]}</p>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => removeSection(sectionIndex)}
                        className="text-red-500 hover:text-red-700 p-1"
                        disabled={formData.course_content.length <= 1}
                      >
                        <Minus size={18} />
                      </button>
                    </div>

                    <div className="pl-6 space-y-3">
                      {section.lessons.map((lesson, lessonIndex) => (
                        <div key={lessonIndex} className="border rounded-md p-3 bg-white">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-sm font-medium">Lesson {lessonIndex + 1}</h4>
                            <button
                              type="button"
                              onClick={() => removeLesson(sectionIndex, lessonIndex)}
                              className="text-red-500 hover:text-red-700 p-1"
                              disabled={section.lessons.length <= 1}
                            >
                              <X size={16} />
                            </button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                            <div className="md:col-span-2">
                              <input
                                type="text"
                                value={lesson.title}
                                onChange={(e) => handleLessonChange(sectionIndex, lessonIndex, 'title', e.target.value)}
                                className={`w-full p-2 border rounded-md ${errors[`lesson_${sectionIndex}_${lessonIndex}`] ? 'border-red-500' : 'border-gray-300'}`}
                                placeholder="Lesson Title"
                              />
                              {errors[`lesson_${sectionIndex}_${lessonIndex}`] && (
                                <p className="text-red-500 text-xs mt-1">{errors[`lesson_${sectionIndex}_${lessonIndex}`]}</p>
                              )}
                            </div>
                            <div>
                              <select
                                value={lesson.type}
                                onChange={(e) => handleLessonChange(sectionIndex, lessonIndex, 'type', e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md"
                              >
                                <option value="video">Video</option>
                                <option value="quiz">Quiz</option>
                                <option value="assignment">Assignment</option>
                                <option value="text">Text</option>
                                <option value="downloadable">Downloadable</option>
                              </select>
                            </div>
                            <div>
                              <input
                                type="number"
                                value={lesson.duration_minutes}
                                onChange={(e) => handleLessonChange(sectionIndex, lessonIndex, 'duration_minutes', e.target.value)}
                                min="0"
                               className='w-full p-2 border border-gray-300 rounded-md'
                                placeholder="Duration (minutes)"
                              />
                            </div>
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                checked={lesson.is_free_preview}
                                onChange={(e) => handleLessonChange(sectionIndex, lessonIndex, 'is_free_preview', e.target.checked)}
                                className="mr-2"
                              />
                              <label className="text-sm">Free Preview</label>
                            </div>
                          </div>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => addLesson(sectionIndex)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <Plus size={16} /> Add Lesson
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addSection}
                  className="text-blue-500 hover:text-blue-700"
                >
                  <Plus size={16} /> Add Section
                </button>
              </div>
            )}

            {/* Settings Tab */}
            {currentTab === 'settings' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Certificate Available
                  </label>
                  <input
                    type="checkbox"
                    name="certificate_available"
                    checked={formData.certificate_available}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <span>Enable certificate for this course</span>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Access Period
                  </label>
                  <select
                    name="access_period"
                    value={formData.access_period}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="lifetime">Lifetime</option>
                    <option value="6-months">6 Months</option>
                    <option value="1-year">1 Year</option>
                    <option value="2-years">2 Years</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                    <option value="under_review">Under Review</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Featured
                  </label>
                  <input
                    type="checkbox"
                    name="is_featured"
                    checked={formData.is_featured}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <span>Mark this course as featured</span>
                </div>
              </div>
            )}

            {/* Submit Button */}
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
                {isSubmitting ? 'Saving...' : isEdit ? 'Save Changes' : 'Add Course'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddEditCourse;