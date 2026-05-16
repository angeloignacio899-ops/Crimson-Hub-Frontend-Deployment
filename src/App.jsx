import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import HomePage from "./pages/HomePage";
import EventDetails from "./pages/EventDetails";
import AboutPage from "./pages/AboutPage";
import UserPage from "./pages/UserPage";
import EditProfilePage from "./pages/EditprofilePage";
import SearchPage from "./pages/SearchPage";
import OrganizerPage from "./pages/OrganizerPage";
import ProtectedRoute from "./components/common/ProtectedRoute";
import AdminPage from "./pages/AdminPage";
import EventManagementPage from "./pages/EventManagementPage";
import AnnouncementManagementPage from "./pages/AnnouncementManagementPage";
import UserManagementPage from "./pages/UserManagementPage";
import { UserProvider } from "./context/UserContext";
import { ErrorProvider } from "./context/ErrorContext";
import ErrorBoundary from "./components/common/ErrorBoundary";
import ErrorNotification from "./components/common/ErrorNotification";
import EventSubmissionAdminPage from "./pages/EventSubmissionAdminPage";
import AnnouncementSubmissionAdminPage from "./pages/AnnouncementSubmissionAdminPage";
import ViewEventPage from "./pages/ViewEventPage";
import CalendarPage from "./pages/CalendarPage";
import OrganizerDashboard from "./pages/OrganizerDashboard";
import OrganizerEventManagement from "./pages/OrganizerEventManagement";
import OrganizerEventSubmission from "./pages/OrganizerEventManagementSubmission";
import OrganizerAnnouncementManagement from "./pages/OrganizerAnnouncementManagement";
import OrganizerAnnouncementSubmission from "./pages/OrganizerAnnouncementManagementSubmission";
import OrganizerRegistration from "./pages/OrganizerRegistrationManagement";
import OrganizerPensingApproval from "./pages/OrganizerPendingApproval";
import OrganizerNotificationPage from "./pages/OrganizerNotificationPage";
import OrganizerSettings from "./pages/OrganizerSettings";
import AdminPendingApprovals from "./pages/AdminPendingApprovals";
import AdminSettingPage from "./pages/AdminSettingPage";
export default function App() {
  return (
    <ErrorProvider>
      <ErrorBoundary>
        <UserProvider>
          <Router>
            <ErrorNotification />
            <Routes>
              <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/homepage" element={<HomePage />} />
          <Route path="/events/:id" element={<EventDetails />} />
          <Route path="/events" element={<SearchPage />} />
          
          {/* User routes */}
          <Route
            path="/user/profile"
            element={
              <ProtectedRoute allowedRoles={[1]}>
                <UserPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/editProfile"
            element={
              <ProtectedRoute allowedRoles={[1]}>
                <EditProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/calendar"
            element={
              <ProtectedRoute allowedRoles={[1]}>
                <CalendarPage />
              </ProtectedRoute>
            }
          />

          {/* Organizer route */}
          <Route
            path="/organizer/dashboard"
            element={
              <ProtectedRoute allowedRoles={[2]}>
                <OrganizerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/organizer/eventmanagement"
            element={
              <ProtectedRoute allowedRoles={[2]}>
                <OrganizerEventManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/organizer/eventmanagement/submission"
            element={
              <ProtectedRoute allowedRoles={[2]}>
                <OrganizerEventSubmission />
              </ProtectedRoute>
            }
          />
          <Route
            path="/organizer/announcementmanagement"
            element={
              <ProtectedRoute allowedRoles={[2]}>
                <OrganizerAnnouncementManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/organizer/announcementmanagement/submission"
            element={
              <ProtectedRoute allowedRoles={[2]}>
                <OrganizerAnnouncementSubmission />
              </ProtectedRoute>
            }
          />
          <Route
            path="/organizer/registrationmanagement"
            element={
              <ProtectedRoute allowedRoles={[2]}>
                <OrganizerRegistration />
              </ProtectedRoute>
            }
          />
          <Route
            path="/organizer/pending_approval"
            element={
              <ProtectedRoute allowedRoles={[2]}>
                <OrganizerPensingApproval />
              </ProtectedRoute>
            }
          />
          <Route
            path="/organizer/notification"
            element={
              <ProtectedRoute allowedRoles={[2]}>
                <OrganizerNotificationPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/organizer/settings"
            element={
              <ProtectedRoute allowedRoles={[2]}>
                <OrganizerSettings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/organizer/profile"
            element={
              <ProtectedRoute allowedRoles={[2]}>
                <OrganizerPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/organizer/editProfile"
            element={
              <ProtectedRoute allowedRoles={[2]}>
                <EditProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={[3]}>
                <AdminPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/eventpage"
            element={
              <ProtectedRoute allowedRoles={[3]}>
                <EventManagementPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/eventpage/:eventId"
            element={
              <ProtectedRoute allowedRoles={[3]}>
                <ViewEventPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/eventpage/eventsubmission"
            element={
              <ProtectedRoute allowedRoles={[3]}>
                <EventSubmissionAdminPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/announcementpage"
            element={
              <ProtectedRoute allowedRoles={[3]}>
                <AnnouncementManagementPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/announcementpage/announcementsubmission"
            element={
              <ProtectedRoute allowedRoles={[3]}>
                <AnnouncementSubmissionAdminPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/userpage"
            element={
              <ProtectedRoute allowedRoles={[3]}>
                <UserManagementPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/settingspage"
            element={
              <ProtectedRoute allowedRoles={[3]}>
                <AdminSettingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/archivedpage"
            element={
              <ProtectedRoute allowedRoles={[3]}>
                <AdminSettingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/pendingapprovalpage"
            element={
              <ProtectedRoute allowedRoles={[3]}>
                <AdminPendingApprovals />
              </ProtectedRoute>
            }
          />


          {/* About / public pages */}
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </Router>
        </UserProvider>
      </ErrorBoundary>
    </ErrorProvider>
  );
}
