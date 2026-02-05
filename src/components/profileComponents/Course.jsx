import axios from "axios";
import { BookOpen, Calendar, DollarSign, Edit2Icon, LoaderCircleIcon, PlusIcon, Trash2Icon, Users } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import AddEditCourse from "./AddEditCourse";


const Course = ({ user, isOwnProfile }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [loading, setLoading] = useState(false);

    const getCourses = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`https://cwt-net-backend.vercel.app/api/v1/course/${user._id}`, { withCredentials: true });
            setCourses(res.data.courses || []);
        } catch (error) {
            console.error("Error fetching courses:", error);
            toast.error("Failed to load courses");
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (course) => {
        setSelectedCourse(course);
        setIsOpen(true);
    };

    const handleAdd = () => {
        setSelectedCourse(null);
        setIsOpen(true);
    };

    const formatPrice = (price, currency = "USD") => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency
        }).format(price);
    };

    const formatDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    };

    const deleteCourse = async (course) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            html: `You are about to delete the course <b>${course.title}</b>. This action cannot be undone.`,
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
            await axios.delete(`https://cwt-net-backend.vercel.app/api/v1/course/${course._id}`, { withCredentials: true });
            toast.success("Course deleted successfully");
            getCourses();
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong. Try again");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getCourses();
    }, []);

    return (
        <div className="mt-2 bg-white p-2 px-4 rounded-lg shadow-sm">
            <div className="flex justify-between items-center">
                <h1 className="text-xl font-semibold">Courses</h1>
                {isOwnProfile && <button
                    onClick={handleAdd}
                    className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-600 px-3 py-2 rounded-md transition-colors"
                >
                    <PlusIcon size={18} />
                    <span>Add Course</span>
                </button>}
            </div>
            <p className="w-full border-2 border-b-gray-500 mt-2"></p>
            <div className="mt-6 space-y-6">
                {courses.length > 0 ? (
                    courses.map((course) => (
                        <div key={course._id} className="relative border-b pb-6 last:border-b-0">
                            <div className="flex justify-between items-start group">
                                <div className="flex-1">
                                    <div className="flex items-start gap-4">
                                        <div className="w-24 h-16 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                                            <img
                                                src={course.thumbnail || "/default-course-thumbnail.jpg"}
                                                alt={course.title}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-semibold text-gray-900 text-lg">{course.title}</h3>
                                                <span className={`text-xs px-2 py-1 rounded-full ${course.status === 'published' ? 'bg-green-100 text-green-800' :
                                                    course.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                                                        course.status === 'under_review' ? 'bg-yellow-100 text-yellow-800' :
                                                            'bg-red-100 text-red-800'
                                                    }`}>
                                                    {course.status.charAt(0).toUpperCase() + course.status.slice(1)}
                                                </span>
                                            </div>
                                            <p className="text-gray-700 font-medium">{course.category} {course.subcategory ? `• ${course.subcategory}` : ''}</p>
                                            <p className="text-sm text-gray-600">Level: {course.level.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
                                            <div className="flex items-center gap-4 text-sm text-gray-600 mt-2">
                                                <div className="flex items-center gap-1">
                                                    <BookOpen size={14} />
                                                    <span>{course.duration}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <DollarSign size={14} />
                                                    <span>{formatPrice(course.price, course.currency)}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Users size={14} />
                                                    <span>{course.enrollment_count} students</span>
                                                </div>
                                            </div>
                                            {course.short_description && (
                                                <p className="mt-3 text-gray-600 text-sm">{course.short_description}</p>
                                            )}
                                            <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
                                                <Calendar size={12} />
                                                <span>Created: {formatDate(course.createdAt)}</span>
                                            </div>
                                        </div>

                                        {/* {
                                            course.course_content && course.course_content.length > 0 && course.course_content.map((item,i)=>{
                                                // console.log("course.course_countent.map :",item)
                                                return(
                                                    <div key={i}>
                                                    <div>
                                                        <h1>{item.section_title}</h1>
                                                        {
                                                            item.lessons.map((lession,i)=>{
                                                                return(
                                                                    <div key={i}>
                                                                        <p>{lession.title}</p>
                                                                        <p>{lession.type}</p>
                                                                        <p>{lession.duration_minutes}</p>
                                                                    </div>
                                                                )
                                                            })
                                                        }
                                                    </div>
                                                </div>
                                                )
                                            })
                                        } */}

                                    </div>
                                </div>
                                {isOwnProfile && <div className="flex gap-1">
                                    <button onClick={() => handleEdit(course)} className="p-2 hover:bg-gray-100 rounded" title="Edit Course">
                                        <Edit2Icon size={16} className="text-gray-600" />
                                    </button>
                                    <button onClick={() => deleteCourse(course)} className="p-2 hover:bg-red-50 rounded" title="Delete Course">
                                        <Trash2Icon size={16} className="text-red-500" />
                                    </button>
                                </div>}
                            </div>


                            <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
                                <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
                                    Course Content
                                </h1>

                                {course.course_content && course.course_content.length > 0 ? (
                                    course.course_content.map((item, i) => (
                                        <div key={i} className="mb-8">
                                            {/* Section Title */}
                                            <h2 className="text-xl font-semibold text-gray-700 mb-3 border-b pb-2">
                                                {item.section_title}
                                            </h2>

                                            {/* Lessons Table */}
                                            <div className="overflow-x-auto">
                                                <table className="min-w-full bg-white border border-gray-200 shadow-sm">
                                                    <thead>
                                                        <tr className="bg-gray-100 text-gray-700 text-left">
                                                            <th className="py-2 px-4 border">Lesson Title</th>
                                                            <th className="py-2 px-4 border">Type</th>
                                                            <th className="py-2 px-4 border">Duration (mins)</th>
                                                            <th className="py-2 px-4 border">Free Preview</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {item.lessons.map((lesson, j) => (
                                                            <tr
                                                                key={j}
                                                                className="hover:bg-gray-50 transition duration-300"
                                                            >
                                                                <td className="py-2 px-4 border">{lesson.title}</td>
                                                                <td className="py-2 px-4 border capitalize">
                                                                    {lesson.type}
                                                                </td>
                                                                <td className="py-2 px-4 border">{lesson.duration_minutes}</td>
                                                                <td className="py-2 px-4 border">
                                                                    {lesson.is_free_preview ? (
                                                                        <span className="text-green-600 font-semibold">
                                                                            ✅ Yes
                                                                        </span>
                                                                    ) : (
                                                                        <span className="text-red-600 font-semibold">
                                                                            ❌ No
                                                                        </span>
                                                                    )}
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-center text-gray-500">No course content available.</p>
                                )}
                            </div>

                        </div>
                    ))
                ) : (
                    <div className="text-center py-10 text-gray-500">
                        {isOwnProfile ? <p>No courses found. Click <button onClick={handleAdd} className="text-blue-600">Add Course</button> to create your first one.</p>
                            : <p>No courses found.</p>
                        }
                    </div>
                )}
            </div>
            {/* Note: You'll need to create the AddEditCourse component separately */}
            {isOpen && (
                <AddEditCourse
                    isOpen={isOpen}
                    setIsOpen={setIsOpen}
                    onClose={() => setIsOpen(false)}
                    initialData={selectedCourse}
                    onSave={getCourses}
                />
            )}

            {loading && (
                <div className="fixed inset-0 flex justify-center items-center bg-gray-200 bg-opacity-10 backdrop-blur-sm z-50">
                    <LoaderCircleIcon className="animate-spin text-blue-600" size={36} />
                </div>
            )}
        </div>
    );
};

export default Course;