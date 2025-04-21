import { useEffect, useState } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { useClubsStore } from '../../stores';

const AdminDashboard = () => {
  const { user } = useAuthStore();
  const { clubs, fetchClubs, createClub } = useClubsStore();
  const [activeTab, setActiveTab] = useState('users');
  const [showClubModal, setShowClubModal] = useState(false);
  const [newClub, setNewClub] = useState({
    name: '',
    description: '',
    category: '',
    meetingLocation: '',
    facultyAdvisor: ''
  });

  useEffect(() => {
    fetchClubs();
  }, []); // Remove clubs dependency to prevent infinite loop

  const handleClubInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewClub(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreateClub = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createClub(newClub);
      setShowClubModal(false);
      setNewClub({
        name: '',
        description: '',
        category: '',
        meetingLocation: '',
        facultyAdvisor: ''
      });
    } catch (error) {
      console.error("Failed to create club:", error);
    }
  };

  // Rest of the component remains the same...
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Administrator Dashboard</h1>
      
      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('users')}
            className={`pb-4 px-1 ${
              activeTab === 'users'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            } font-medium`}
          >
            User Management
          </button>
          <button
            onClick={() => setActiveTab('clubs')}
            className={`pb-4 px-1 ${
              activeTab === 'clubs'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            } font-medium`}
          >
            Club Management
          </button>
          <button
            onClick={() => setActiveTab('resources')}
            className={`pb-4 px-1 ${
              activeTab === 'resources'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            } font-medium`}
          >
            Resource Management
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`pb-4 px-1 ${
              activeTab === 'settings'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            } font-medium`}
          >
            System Settings
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {/* User Management Section */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-800">User Accounts</h3>
              <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                Create New User
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">John Doe</td>
                    <td className="px-6 py-4 whitespace-nowrap">john@example.com</td>
                    <td className="px-6 py-4 whitespace-nowrap">Faculty</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button className="text-blue-600 hover:text-blue-900 mr-4">Edit</button>
                      <button className="text-red-600 hover:text-red-900">Delete</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Resource Management Section */}
        {activeTab === 'resources' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h4 className="text-lg font-semibold mb-2">Seminar Hall</h4>
              <p className="text-gray-600 mb-4">Capacity: 100 people</p>
              <div className="flex space-x-2">
                <button className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">
                  Edit
                </button>
                <button className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700">
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Club Management Section */}
        {activeTab === 'clubs' && (
          <div className="grid grid-cols-1 gap-6">
            <div className="flex items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-800">Club Management</h3>
              <button 
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mx-5" 
                onClick={() => setShowClubModal(true)}
              >
                Add New Club
              </button>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              {clubs?.map(club => (
                <div key={club.id} className="flex items-center mb-4 last:mb-0">
                  <div className="flex-1">
                    <h4 className="font-medium">{club.name}</h4>
                    <p className="text-sm text-gray-600">{club.description}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button className="text-blue-600 hover:text-blue-800">Edit</button>
                    <button className="text-red-600 hover:text-red-800">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* System Settings Section */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-lg shadow p-6 max-w-2xl">
            <h3 className="text-xl font-semibold mb-4">System Configuration</h3>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Academic Year
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  placeholder="2024-2025"
                />
              </div>
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Save Changes
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Stats Overview */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h4 className="text-gray-500 font-medium">Total Users</h4>
          <p className="text-3xl font-bold text-gray-800 mt-2">1,234</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h4 className="text-gray-500 font-medium">Active Resources</h4>
          <p className="text-3xl font-bold text-gray-800 mt-2">45</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h4 className="text-gray-500 font-medium">Pending Approvals</h4>
          <p className="text-3xl font-bold text-gray-800 mt-2">12</p>
        </div>
      </div>

      
    </div>
  );
};

export default AdminDashboard;
