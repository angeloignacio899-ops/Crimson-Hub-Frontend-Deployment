import Sidebar from '../components/admin/Sidebar'
import AdminSettingContent from '../components/admin/AdminSettingContent';
const Settings = () => {
    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar Component */}
            <Sidebar />

            <AdminSettingContent />
        </div>
    )
}

export default Settings;