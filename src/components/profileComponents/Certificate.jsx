
import axios from "axios";
import { Calendar, Edit2Icon, Eye, EyeOff, LoaderCircleIcon, PlusIcon, Trash2Icon, XIcon } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import AddEditCertificate from "./AddEditCertificate";

const Certificate = ({user,isOwnProfile}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [certificates, setCertificates] = useState(null);
    const [selectedCertificate, setSelectedCertificate] = useState(null);
    const [largeImage, setLargeImage] = useState(null);
    const [loading, setLoading] = useState(false);

    const getCertificates = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/api/v1/certificate/${user._id}`, { withCredentials: true });
            if (res) {
                setCertificates(res.data.certificates);
            }
        } catch (error) {
            console.log("Error fetching certificates:", error);
        }
    };

    const handleEdit = (cert) => {
        setSelectedCertificate(cert);
        setIsOpen(true);
    };

    function handleAdd() {
        setSelectedCertificate(null);
        setIsOpen(true);
    }

    const formatDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            month: "short",
            year: "numeric",
        });
    };

    const getVisibilityIcon = (visibility) => {
        if (visibility === "public") {
            return <Eye size={16} className="text-green-600" />;
        } else if (visibility === "connections") {
            return <Eye size={16} className="text-blue-600" />;
        } else {
            return <EyeOff size={16} className="text-gray-600" />;
        }
    };

    const getVisibilityText = (visibility) => {
        if (visibility === "public") {
            return "Public";
        } else if (visibility === "connections") {
            return "Connections Only";
        } else {
            return "Private";
        }
    };

    const deleteCertificate = async (cert) => {
        // Show confirmation dialog
        const result = await Swal.fire({
            title: "Are you sure?",
            html: `You are about to delete the certificate <b>${cert.title}</b> issued by <b>${cert.issuer}</b>.<br/>This action cannot be undone.`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "Cancel",
            reverseButtons: true,
            focusCancel: true, // Focus on cancel button by default for safety
        });
        if (!result.isConfirmed) return;

        try {
            setLoading(true);
            let res = await axios.delete(`http://localhost:5000/api/v1/certificate/${cert._id}`, { withCredentials: true });
            if (res) {
                console.log("Deleted certificate:", res);
                toast.success(res.data?.message);
                setLoading(false);
                getCertificates();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong. Try again");
            setLoading(false);
        }
    };

    function onClose() {
        setIsOpen(false);
    }

    useEffect(() => {
        getCertificates();
    }, []);

    return (
        <div className="mt-2 bg-white p-2 px-4 rounded-lg shadow-sm">
            <div className="flex justify-between items-center">
                <h1 className="text-xl font-semibold">Certificates</h1>
               {isOwnProfile && <div className="flex items-center gap-4">
                    <button
                        onClick={handleAdd}
                        className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-600 px-3 py-2 rounded-md transition-colors"
                    >
                        <PlusIcon size={18} />
                        <span>Add Certificate</span>
                    </button>
                </div>}
            </div>
            <p className="w-full border-2 border-b-gray-500 mt-2"></p>
            <div className="mt-6 space-y-6">
                {certificates && certificates.length > 0 ? (
                    certificates.map((cert) => (
                        <div key={cert._id} className="relative border-b pb-6 last:border-b-0">
                            <div className="flex justify-between items-start group">
                                <div className="flex gap-4">
                                    {/* Certificate Image or Fallback Icon */}
                                    {cert.image ? (
                                        <div className="w-20 h-20 flex-shrink-0 rounded overflow-hidden border border-gray-200">
                                            <img
                                                src={cert.image}
                                                alt={cert.title}
                                                className="w-full h-full object-cover cursor-pointer"
                                                onClick={() => setLargeImage(cert.image)}
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = `https://placehold.co/100x100/e2e8f0/64748b?text=${cert.title?.charAt(0)}`;
                                                }}
                                            />
                                        </div>
                                    ) : (
                                        <div className="w-20 h-20 bg-gray-100 rounded flex items-center justify-center flex-shrink-0 border border-gray-200">
                                            <span className="text-2xl font-semibold text-gray-600">
                                                {cert.title?.charAt(0)}
                                            </span>
                                        </div>
                                    )}

                                    {/* Certificate Details */}
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h3 className="font-semibold text-gray-900 text-lg">{cert.title}</h3>
                                                <p className="text-gray-700 font-medium">{cert.issuer}</p>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                <div className="flex items-center gap-1 text-gray-600 bg-gray-50 px-2 py-1 rounded-full">
                                                    {getVisibilityIcon(cert.visibility)}
                                                    <span>{getVisibilityText(cert.visibility)}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 text-sm text-gray-600 mt-2">
                                            <Calendar size={14} />
                                            <span>
                                                {formatDate(cert.issue_date)} - {" "}
                                                {cert.expiration_date ? formatDate(cert.expiration_date) : "No Expiration"}
                                            </span>
                                        </div>

                                        {cert.credential_id && (
                                            <p className="text-gray-700 mt-2 text-sm">
                                                <span className="font-medium">Credential ID:</span> {cert.credential_id}
                                            </p>
                                        )}

                                        {cert.credential_url && (
                                            <p className="text-gray-700 mt-2 text-sm">
                                                <a
                                                    href={cert.credential_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 hover:underline flex items-center gap-1"
                                                >
                                                    View Certificate
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                                                        <polyline points="15 3 21 3 21 9"></polyline>
                                                        <line x1="10" y1="14" x2="21" y2="3"></line>
                                                    </svg>
                                                </a>
                                            </p>
                                        )}

                                        {cert.description && (
                                            <p className="mt-3 text-gray-600 whitespace-pre-line text-sm">{cert.description}</p>
                                        )}
                                    </div>
                                </div>
                                {isOwnProfile && <div className="flex gap-1">
                                    {/* Edit Button */}
                                    <button
                                        onClick={() => handleEdit(cert)}
                                        className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-gray-100 rounded"
                                        title="Edit Certificate"
                                    >
                                        <Edit2Icon size={16} className="text-gray-600" />
                                    </button>

                                    {/* Delete Button */}
                                    <button
                                        onClick={() => deleteCertificate(cert)}
                                        className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-red-50 rounded"
                                        title="Delete Certificate"
                                    >
                                        <Trash2Icon size={16} className="text-red-500" />
                                    </button>
                                </div>}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-10 text-gray-500">
                        {
                            isOwnProfile ? <p>No certificates found. Click <button onClick={handleAdd} className="text-blue-600">Add Certificate</button> to create your first one.</p>
                            : <p>No certificates available.</p>
                        }
                    </div>
                )}
            </div>
            <AddEditCertificate
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                onClose={onClose}
                initialData={selectedCertificate}
                onSave={getCertificates} // Refresh the list after save
            />

            {largeImage && (
                <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-70 z-50">
                    <div className="relative p-4 bg-white rounded-lg">
                        <button className="absolute top-2 right-2 cursor-pointer" onClick={() => setLargeImage(null)}>
                            <XIcon size={24} className="text-gray-700 hover:text-gray-900" />
                        </button>
                        <img src={largeImage} alt="Certificate" className="max-w-[90vw] max-h-[90vh] rounded-lg" />
                    </div>
                </div>
            )}

            {loading && (
                <div className="w-[100vw] h-[100vh] fixed inset-0 flex justify-center items-center bg-gray-200 bg-opacity-10 backdrop-blur-sm z-50">
                    <LoaderCircleIcon className="animate-spin text-blue-600" size={36} />
                </div>
            )}
        </div>
    );
};

export default Certificate;
