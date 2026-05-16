import Sidebar from '../components/admin/Sidebar'
import PendingApprovalsContent from '../components/admin/PendingApprovalContent';
const PendingApprovalPage = () => {
    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar Component */}
            <Sidebar />

            <PendingApprovalsContent />
        </div>
    )
}

export default PendingApprovalPage;