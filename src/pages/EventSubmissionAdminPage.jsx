import Sidebar from '../components/admin/Sidebar'
import EventSubmissionAdminContent from '../components/admin/EventSubmissionAdminContent';
const EventSubmissionAdminPage = () => {
    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar Component */}
            <Sidebar />

            <EventSubmissionAdminContent />
        </div>
    )
}

export default EventSubmissionAdminPage;