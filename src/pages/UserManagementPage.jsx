import Sidebar from '../components/admin/Sidebar'
import UserManagementContent from '../components/admin/UserManagementContent';
const UserManagementPage = () => {
    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar Component */}
            <Sidebar />

            <UserManagementContent />
        </div>
    )
}

export default UserManagementPage;