import Sidebar from '../components/admin/Sidebar'
import ViewEventContent from '../components/admin/ViewEventContent';
const ViewEventPage = () => {
    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar Component */}
            <Sidebar />

            <ViewEventContent />
        </div>
    )
}

export default ViewEventPage;