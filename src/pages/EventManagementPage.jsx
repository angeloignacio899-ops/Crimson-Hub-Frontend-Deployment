import Sidebar from '../components/admin/Sidebar'
import EventManagementContent from '../components/admin/EventManagementContent';
const EventManagementPage = () => {
    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar Component */}
            <Sidebar />

            <EventManagementContent />
        </div>
    )
}

export default EventManagementPage;