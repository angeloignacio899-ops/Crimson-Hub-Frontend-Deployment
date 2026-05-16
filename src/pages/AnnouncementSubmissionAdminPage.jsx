import Sidebar from '../components/admin/Sidebar'
import AnnouncementSubmissionAdminContent from '../components/admin/AnnouncementSubmissionAdminContent';
const AnnouncementSubmissionAdminPage = () => {
    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar Component */}
            <Sidebar />

            <AnnouncementSubmissionAdminContent />
        </div>
    )
}

export default AnnouncementSubmissionAdminPage;