import { useEffect, useState } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { useClubsStore } from '../../stores';
import { format } from 'date-fns';
import { Club } from '../../types';
import { useNavigate } from 'react-router-dom';

const FacultyDashboard = () => {
  const router = useNavigate();
  const { user, logout } = useAuthStore();
  const { clubs, fetchClubs, createClub, deleteClub, updateClub } = useClubsStore();
  const [activeTab, setActiveTab] = useState('clubs');
  const [showClubModal, setShowClubModal] = useState(false);
  const [newClub, setNewClub] = useState({
    name: '',
    description: '',
    category: '',
    meetingLocation: '',
    facultyAdvisor: '',
    creation_date: format(new Date(), 'yyyy-MM-dd'),
  });
  const [isEditMode, setIsEditMode] = useState(false);

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

  const handleCreateEditClub = async (e: React.FormEvent, isEdit: boolean, clubId?: number) => {
    e.preventDefault();
    try {
      newClub.creation_date = format(new Date(), 'yyyy-MM-dd');
      isEdit ? await updateClub(clubId!, newClub) : await createClub(newClub);
      setShowClubModal(false);
      setNewClub({
        name: '',
        description: '',
        category: '',
        meetingLocation: '',
        facultyAdvisor: '',
        creation_date: '',
      });
    } catch (error) {
      console.error("Failed to create club:", error);
    }
  };

  const handleClubDelete = async (club: Partial<Club>) => {
    try {
      await deleteClub(club);
      fetchClubs(); // Refresh the list of clubs
    } catch (error) {
      console.error("Failed to delete club:", error);
    }
  };

  const handleClubEdit = async (clubId: number) => {
    // TODO: Implement club editing
  };

  const showClubDetails = (clubId: number) => {
    router(`/clubs/${clubId}`);
  };

  // Rest of the component remains the same...
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className='flex justify-between items-center mb-6'>
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Faculty Dashboard</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        onClick={() => logout()}>
          Logout
        </button>
      </div>
      
      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          
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
          
        </nav>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {/* User Management Section */}
        

        {/* Resource Management Section */}
        

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
                <div key={club.id} className="flex items-center mb-4 last:mb-0" onClick={() => showClubDetails(club.id)}>
                  <div className="flex-1">
                    <h4 className="font-medium">{club.name}</h4>
                    <p className="text-sm text-gray-600">{club.description}</p>
                  </div>
                  {club.faculty_advisor === user?.id && (
                    <div className="flex space-x-2">
                      {/* <button className="text-blue-600 hover:text-blue-800" onClick={(e)=>{
                        setShowClubModal(true);
                        setIsEditMode(true);
                        setNewClub({
                          name: club.name,
                          description: club.description,
                          category: club.category,
                          meetingLocation: club.meeting_location,
                          facultyAdvisor: club.faculty_advisor!,
                        });

                      }}>Edit</button> */}
                      <button className="text-red-600 hover:text-red-800" onClick={() => handleClubDelete(club)}>Delete</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        </div>

      {/* Stats Overview */}
      {/* <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
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
      </div> */}
      {showClubModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Create New Club</h3>
              <button 
                onClick={() => setShowClubModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={(e)=>handleCreateEditClub(e, false)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Club Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={newClub.name}
                  onChange={handleClubInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={newClub.description}
                  onChange={handleClubInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  rows={3}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <input
                  type="text"
                  name="category"
                  value={newClub.category}
                  onChange={handleClubInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Meeting Location
                </label>
                <input
                  type="text"
                  name="meetingLocation"
                  value={newClub.meetingLocation}
                  onChange={handleClubInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Faculty Advisor
                </label>
                <input
                  type="text"
                  name="facultyAdvisor"
                  value={newClub.facultyAdvisor}
                  onChange={handleClubInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowClubModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Create Club
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      
    </div>
  );
};

export default FacultyDashboard;
