import { useEffect, useState } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { useClubsStore } from '../../stores';
import { format } from 'date-fns';
import { Club } from '../../types';
import { useNavigate } from 'react-router-dom';
import { useEventStore } from '../../stores/eventStore';

const FacultyDashboard = () => {
  const router = useNavigate();
  const { user, logout } = useAuthStore();
  const { clubs, fetchClubs, createClub, deleteClub, updateClub } = useClubsStore();
  const { createEvent } = useEventStore();
  const [activeTab, setActiveTab] = useState('clubs');
  const [showClubModal, setShowClubModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedClub, setSelectedClub] = useState<number | null>(null);
  const [newEvent, setNewEvent] = useState({
    name: '',
    description: '',
    date: "",
    registration_deadline: "",
    max_participants: 0,
  });
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
  }, []); 

  const handleClubInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewClub(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEventInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewEvent(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // TODO: Implement event creation logic here
      newEvent.date = new Date(newEvent.date).toISOString();
      newEvent.registration_deadline = new Date(newEvent.registration_deadline).toISOString();
      await createEvent(newEvent)
      console.log("Creating event for club:", selectedClub, newEvent);
      setShowEventModal(false);
      setNewEvent({
        name: '',
        description: '',
        date: new Date().toISOString(),
        registration_deadline: new Date().toISOString(),
        max_participants: 0,
      });
    } catch (error) {
      console.error("Failed to create event:", error);
    }
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
      fetchClubs();
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
                      {/* <button 
                        className="text-green-600 hover:text-green-800"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedClub(club.id);
                          setShowEventModal(true);
                        }}
                      >
                        Create Event
                      </button> */}
                      <button 
                        className="text-red-600 hover:text-red-800" 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleClubDelete(club);
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Club Modal */}
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

      {/* Event Modal */}
      {showEventModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Create New Event</h3>
              <button 
                onClick={() => setShowEventModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleCreateEvent} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Event Title
                </label>
                <input
                  type="text"
                  name="name"
                  value={newEvent.name}
                  onChange={handleEventInputChange}
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
                  value={newEvent.description}
                  onChange={handleEventInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  rows={3}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <input
                  type="datetime-local"
                  name="date"
                  value={newEvent.date}
                  onChange={handleEventInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Registration Deadline
                </label>
                <input
                  type="datetime-local"
                  name="registration_deadline"
                  value={newEvent.registration_deadline}
                  onChange={handleEventInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  required
                />
              </div>

              {/* <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Time
                </label>
                <input
                  type="time"
                  name="time"
                  value={newEvent.time}
                  onChange={handleEventInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  required
                />
              </div> */}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max Participants
                </label>
                <input
                  type="number"
                  name="max_participants"
                  value={newEvent.max_participants}
                  onChange={handleEventInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  required
                />
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowEventModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                {/* <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Create Event
                </button> */}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FacultyDashboard;
