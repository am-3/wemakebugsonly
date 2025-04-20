import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import AdminDashboard from '../app/dashboard/AdminDashboard';
import FacultyDashboard from '../app/dashboard/FacultyDashboard';
import StudentDashboard from '../app/dashboard/StudentDashboard';

const DashboardRouter = () => {
  const { isAuthenticated, role } = useAuthStore();

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  switch (role) {
    case 'admin':
      return <AdminDashboard />;
    case 'faculty':
      return <FacultyDashboard />;
    case 'student':
      return <StudentDashboard />;
    default:
      return <div className="p-8 text-red-600">Unauthorized</div>;
  }
};

export default DashboardRouter;
