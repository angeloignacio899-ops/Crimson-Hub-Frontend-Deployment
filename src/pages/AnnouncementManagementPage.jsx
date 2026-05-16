import Sidebar from '../components/admin/Sidebar'
import AnnouncementManagementContent from '../components/admin/AnnouncementManagementContent';
const AnnouncementManagementPage = () => {
    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar Component */}
            <Sidebar />

            <AnnouncementManagementContent />
        </div>
    )
}

export default AnnouncementManagementPage;