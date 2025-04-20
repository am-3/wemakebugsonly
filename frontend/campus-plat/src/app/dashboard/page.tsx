import { useAuthStore } from '../../stores/authStore';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const Dashboard: React.FC = () => {
  const { tokenData, logout, isAuthenticated, loading } = useAuthStore();
  const navigate = useNavigate();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, loading, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="text-blue-600 text-xl">Loading dashboard...</span>
      </div>
    );
  }

  if (!isAuthenticated) return null; // Prevents flash before redirect

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-200">
      <header className="flex items-center justify-between px-8 py-6 bg-white shadow">
        <h1 className="text-2xl font-bold text-blue-700">Smart Campus OS Dashboard</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-700 font-medium">
            Welcome, {tokenData?.username || 'User'}!
          </span>
          <button
            onClick={logout}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto mt-12 p-6 bg-white rounded-xl shadow-lg">
        <h2 className="text-xl font-semibold text-blue-600 mb-4">Your Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Example cards - replace with real data/components */}
          <div className="p-6 bg-blue-100 rounded-lg shadow text-center" onClick={() => navigate('/dashboard/upcoming-events')}>
            <h3 className="text-lg font-bold text-blue-700">Upcoming Events</h3>
            <p className="text-gray-600 mt-2">Check out what's happening on campus!</p>
          </div>
          <div className="p-6 bg-green-100 rounded-lg shadow text-center" onClick={() => navigate('/dashboard/academic-progress')}>
            <h3 className="text-lg font-bold text-green-700">Academic Progress</h3>
            <p className="text-gray-600 mt-2">View your grades and attendance.</p>
          </div>
          <div className="p-6 bg-yellow-100 rounded-lg shadow text-center" onClick={() => navigate('/dashboard/resource-bookings')}>
            <h3 className="text-lg font-bold text-yellow-700">Book Resources</h3>
            <p className="text-gray-600 mt-2">Reserve seminar halls, labs, and more.</p>
          </div>
          <div className="p-6 bg-purple-100 rounded-lg shadow text-center" onClick={() => navigate('/dashboard/club-activities')}>
            <h3 className="text-lg font-bold text-purple-700">Club Activities</h3>
            <p className="text-gray-600 mt-2">Manage your club memberships and events.</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
