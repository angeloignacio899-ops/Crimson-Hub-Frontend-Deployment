import { Search, Plus, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useError } from '../../context/ErrorContext';

// ----- Category & Status Tags -----
const CategoryTag = ({ category }) => {
    const isAcademic = category === 'Non-Academic' || category === 'Non-academic';
    return (
        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap ${
            isAcademic 
                ? 'bg-blue-100 text-blue-800' 
                : 'bg-red-100 text-red-800'
        }`}>
            {category}
        </span>
    );
};

const StatusTag = ({ status }) => {
    return (
        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap ${
            status === 'approved' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
        }`}>
            {status}
        </span>
    );
};

// ----- Delete Modal -----
function DeleteEventModal({ event, onConfirm, onCancel }) {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-96">
                <h2 className="text-lg font-semibold mb-4 text-gray-800">
                    Confirm Delete
                </h2>
                <p className="text-gray-600 mb-6">
                    Are you sure you want to delete{" "}
                    <span className="font-medium text-red-600">{event.title}</span>?
                </p>
                <div className="flex justify-end space-x-3">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}

// ----- Event Row -----
const EventRow = ({ event, isHighlighted, onDelete }) => {
    const navigate = useNavigate();

    const eventDate = event.event_date
        ? new Date(event.event_date).toLocaleDateString("en-PH")
        : "N/A";

    const createdDate = event.created_at
        ? new Date(event.created_at).toLocaleString("en-PH", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
            hour12: true
        })
        : "N/A";

    const timeValue = event.event_time || "N/A";

    const handleViewEvent = () => {
        navigate(`/admin/eventpage/${event.event_id}`);
    };

    return (
        <div className={`grid grid-cols-6 gap-3 items-center p-3 text-sm border-b last:border-b-0 ${isHighlighted ? 'bg-red-50' : 'hover:bg-gray-50'}`}>

            <div className="col-span-1 ml-10 font-semibold text-gray-800">{event.title}</div>

            <div className="col-span-1 ml-10 text-gray-600 text-xs">{event.category_name}</div>

            <div className="col-span-1 ml-10 text-gray-600 text-xs">{event.organizer_name}</div>

            <div className="col-span-1 ml-10 text-gray-600 text-xs">{createdDate}</div>

            <div className="col-span-1 text-center">
                <StatusTag status={event.status} />
            </div>

            <div className="col-span-1 flex justify-center space-x-2">
                <button 
                    onClick={handleViewEvent}
                    className="text-gray-500 hover:text-blue-600 p-1 rounded-full hover:bg-blue-50 transition" 
                    title="View"
                >
                    <Eye size={16} />
                </button>
            </div>

        </div>
    );
};

// ----- Event Management Content -----
const EventManagementContent = () => {
    const { showError } = useError();
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All Categories');

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("token");
                const headers = token ? { Authorization: `Bearer ${token}` } : {};

                const [eventsResponse, categoriesResponse] = await Promise.all([
                    fetch(`${window.API_BASE}/api/events`, { headers }),
                    fetch(`${window.API_BASE}/api/categories`, { headers }),
                ]);

                if (!eventsResponse.ok) throw new Error("Failed to fetch events");
                if (!categoriesResponse.ok) throw new Error("Failed to fetch categories");

                const [eventsData, categoriesData] = await Promise.all([
                    eventsResponse.json(),
                    categoriesResponse.json(),
                ]);

                setEvents(Array.isArray(eventsData) ? eventsData : []);
                setCategories(Array.isArray(categoriesData) ? categoriesData : []);
            } catch (err) {
                console.error(err);
                setEvents([]);
                setCategories([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);


    const handleCreateEvent = () => navigate('/admin/eventpage/eventsubmission');

    const filteredEvents = events.filter(event => {
        const search = searchTerm.toLowerCase();

        const matchesSearch =
            event.title?.toLowerCase().includes(search) ||
            event.organizer_name?.toLowerCase().includes(search);

        const matchesCategory =
            categoryFilter.toLowerCase() === 'all categories' ||
            event.category_name?.toLowerCase() === categoryFilter.toLowerCase();

        return matchesSearch && matchesCategory;
    });


    const handleDeleteEvent = async (eventId) => {
        try {
            const response = await fetch(`${window.API_BASE}/api/events/${eventId}`, {
                method: 'DELETE',
            });

            if (!response.ok) throw new Error("Failed to delete event");

            setEvents(events.filter(e => e.event_id !== eventId));
        } catch (err) {
            showError("Failed to delete event");
        } finally {
            setShowDeleteModal(false);
            setSelectedEvent(null);
        }
    };

    return (
        <div className="flex-1 p-8 overflow-y-auto">

            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Event Management</h1>
                <button
                    className="flex items-center space-x-2 bg-red-700 text-white px-5 py-2 rounded-lg font-semibold shadow-md hover:bg-red-800 transition"
                    onClick={handleCreateEvent}
                >
                    <Plus size={20} />
                    <span>Create Event</span>
                </button>
            </div>

            <div className="flex space-x-4 mb-8">
                <div className="flex-1 relative">
                    <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search events or Organizer..."
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500 transition"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <select
                    className="px-4 py-3 border border-gray-300 rounded-lg appearance-none focus:ring-red-500 focus:border-red-500 transition"
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                >
                    <option value="All Categories">All Categories</option>
                    {categories.map((category) => (
                        <option key={category.category_id} value={category.category_name}>
                            {category.category_name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden">

                {/* Table Header */}
                <div className="grid grid-cols-6 gap-5 bg-red-700 text-white font-semibold text-sm p-4 sticky top-0">
                    <div className="text-center">Event Title</div>
                    <div className="text-center">Category</div>
                    <div className="text-center"> Organizer</div>
                    <div className="text-center">Created At</div>
                    <div className="text-center">Status</div>
                    <div className="text-center">Action</div>
                </div>


                {/* Table Body */}
                <div className="divide-y divide-gray-100">
                    {loading ? (
                        <div className="p-4 text-center text-gray-500">Loading events...</div>
                    ) : filteredEvents.length === 0 ? (
                        <div className="p-4 text-center text-gray-500">No events found</div>
                    ) : (
                        filteredEvents.map((event, index) => (
                            <EventRow
                                key={event.event_id || index}
                                event={event}
                                isHighlighted={index % 2 === 0}
                                onDelete={(event) => {
                                    setSelectedEvent(event);
                                    setShowDeleteModal(true);
                                }}
                            />
                        ))
                    )}
                </div>
            </div>

            {showDeleteModal && selectedEvent && (
                <DeleteEventModal
                    event={selectedEvent}
                    onConfirm={() => handleDeleteEvent(selectedEvent.event_id)}
                    onCancel={() => {
                        setShowDeleteModal(false);
                        setSelectedEvent(null);
                    }}
                />
            )}
        </div>
    );
};

export default EventManagementContent;
