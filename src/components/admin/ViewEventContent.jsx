import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Download, Calendar, Clock, MapPin, Users, Link as LinkIcon, FileText } from 'lucide-react';

const ViewEventContent = () => {
    const navigate = useNavigate();
    const { eventId } = useParams();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEventDetails = async () => {
            try {
                const token = localStorage.getItem("token");

                const response = await fetch(`${window.API_BASE}/api/events/${eventId}`, {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                });

                if (!response.ok) throw new Error("Event not found");

                const data = await response.json();
                setEvent(data);
            } catch (err) {
                console.error(err);
                alert("Failed to fetch event details.");
            } finally {
                setLoading(false);
            }
        };
        fetchEventDetails();
    }, [eventId]);

    const handleBack = () => navigate('/admin/eventPage');

    const getStatusColor = (status) => {
        const colors = {
            'Active': 'bg-green-100 text-green-800',
            'Upcoming': 'bg-blue-100 text-blue-800',
            'Ongoing': 'bg-purple-100 text-purple-800',
            'Past': 'bg-gray-100 text-gray-800',
            'Archived': 'bg-orange-100 text-orange-800'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    const getApprovalColor = (status) => {
        const colors = {
            'Approved': 'bg-green-100 text-green-800',
            'Pending': 'bg-yellow-100 text-yellow-800',
            'Rejected': 'bg-red-100 text-red-800'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    return (
        <div className="flex-1 p-6 sm:p-10 overflow-y-auto bg-gray-50 min-h-screen">
            {/* Back Button */}
            <button
                onClick={handleBack}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg mb-6 transition"
            >
                <ArrowLeft size={18} />
                Back to Events
            </button>

            {loading ? (
                <div className="text-center text-gray-500 text-lg">Loading event details...</div>
            ) : event ? (
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    {/* Event Cover Image */}
                    {event.event_image && (
                        <div className="w-full h-64 sm:h-96 overflow-hidden bg-gray-200">
                            <img
                                src={`${window.API_BASE}/uploads/events/${event.event_image}`} 
                                alt="Event Cover"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}

                    <div className="p-6 sm:p-10">
                        {/* Event Title */}
                        <h1 className="text-4xl font-bold text-gray-800 mb-4">{event.title}</h1>

                        {/* Status Badges */}
                        <div className="flex flex-wrap gap-3 mb-8">
                            <span className={`px-4 py-2 rounded-full font-semibold text-sm ${getApprovalColor(event.approval_status)}`}>
                                {event.approval_status}
                            </span>
                            <span className={`px-4 py-2 rounded-full font-semibold text-sm ${getStatusColor(event.status)}`}>
                                {event.status}
                            </span>
                        </div>

                        {/* Main Details Table */}
                        <div className="mb-8 border-t border-b border-gray-200">
                            <table className="w-full">
                                <tbody>
                                    <tr className="border-b border-gray-200 hover:bg-gray-50">
                                        <td className="py-4 px-4 font-semibold text-gray-700 bg-gray-50 w-1/3 flex items-center gap-2">
                                            <Calendar size={18} className="text-red-600" />
                                            Event Date
                                        </td>
                                        <td className="py-4 px-4 text-gray-700">{new Date(event.start_date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} - {new Date(event.end_date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</td>
                                    </tr>
                                    <tr className="border-b border-gray-200 hover:bg-gray-50">
                                        <td className="py-4 px-4 font-semibold text-gray-700 bg-gray-50 flex items-center gap-2">
                                            <Clock size={18} className="text-red-600" />
                                            Event Time
                                        </td>
                                        <td className="py-4 px-4 text-gray-700">{event.start_time || 'N/A'} - {event.end_time || 'N/A'}</td>
                                    </tr>
                                    <tr className="border-b border-gray-200 hover:bg-gray-50">
                                        <td className="py-4 px-4 font-semibold text-gray-700 bg-gray-50 flex items-center gap-2">
                                            <MapPin size={18} className="text-red-600" />
                                            Location
                                        </td>
                                        <td className="py-4 px-4 text-gray-700">{event.location || 'N/A'}</td>
                                    </tr>
                                    <tr className="border-b border-gray-200 hover:bg-gray-50">
                                        <td className="py-4 px-4 font-semibold text-gray-700 bg-gray-50 flex items-center gap-2">
                                            <Users size={18} className="text-red-600" />
                                            Audience
                                        </td>
                                        <td className="py-4 px-4 text-gray-700">{event.audience}</td>
                                    </tr>
                                    <tr className="border-b border-gray-200 hover:bg-gray-50">
                                        <td className="py-4 px-4 font-semibold text-gray-700 bg-gray-50">Max Registrations</td>
                                        <td className="py-4 px-4 text-gray-700">{event.number_of_registration || 'Unlimited'}</td>
                                    </tr>
                                    <tr className="border-b border-gray-200 hover:bg-gray-50">
                                        <td className="py-4 px-4 font-semibold text-gray-700 bg-gray-50">Organizer</td>
                                        <td className="py-4 px-4 text-gray-700">{event.organizer_name}</td>
                                    </tr>
                                    <tr className="border-b border-gray-200 hover:bg-gray-50">
                                        <td className="py-4 px-4 font-semibold text-gray-700 bg-gray-50">Category</td>
                                        <td className="py-4 px-4 text-gray-700">{event.category_name}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        {/* Event Link */}
                        {event.event_link && (
                            <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                <div className="flex items-center gap-2 mb-2">
                                    <LinkIcon size={18} className="text-blue-600" />
                                    <h3 className="font-semibold text-gray-700">Event Link</h3>
                                </div>
                                <a
                                    href={event.event_link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:text-blue-800 break-all hover:underline transition"
                                >
                                    {event.event_link}
                                </a>
                            </div>
                        )}

                        {/* Description */}
                        <div className="mb-8">
                            <div className="flex items-center gap-2 mb-3">
                                <FileText size={18} className="text-red-600" />
                                <h3 className="font-semibold text-gray-700 text-lg">Description</h3>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                <p className="text-gray-700 whitespace-pre-line leading-relaxed">{event.description}</p>
                            </div>
                        </div>

                        {/* Event Attachment */}
                        {event.file_name && (
                            <div className="mb-8">
                                <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                    <Download size={18} className="text-red-600" />
                                    Attachment
                                </h3>
                                <a
                                    href={`${window.API_BASE}/uploads/events/${event.file_name}`}
                                    download
                                    className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition font-medium"
                                >
                                    <Download size={18} />
                                    Download File
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div className="text-center text-gray-500 text-lg">Event not found.</div>
            )}
        </div>
    );
};

export default ViewEventContent;


