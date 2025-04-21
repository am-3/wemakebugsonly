import { useState, useEffect } from 'react';
import { useAuthStore, useClubsStore } from '../../stores';
// import { useEventStore, useCourseStore, useResourceStore} from '../../stores';
import { Calendar, Trello } from 'react-feather';
import { useNavigate } from 'react-router-dom';
import { useEventStore } from '../../stores/eventStore';

const StudentDashboard = () => {
  const navigate  = useNavigate();
  const { user, logout } = useAuthStore();
  const { clubs, fetchClubs } = useClubsStore();
  const { events, fetchEvents } = useEventStore();
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  useEffect(() => {
    Promise.all([
      fetchClubs(),
      fetchEvents(),
    ]);
  }, []);

  const showClubDetails = (clubId: number) => {
    navigate(`/clubs/${clubId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Dashboard Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Welcome back, {user?.first_name}</h1>
          <p className="text-gray-600 mt-2">Here's your academic overview</p>
        </div>
        
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={() => logout()}>
          Logout
        </button>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Academic Overview */}
        <div className="lg:col-span-3 space-y-6">
          {/* Upcoming Events Section */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center mb-4">
              <Calendar className="w-6 h-6 text-purple-600 mr-2" />
              <h3 className="text-lg font-semibold">Upcoming Events</h3>
            </div>
            <div className="space-y-4">
              {/* {events.slice(0, 3).map(event => (
                <div key={event.id} className="flex items-center p-4 hover:bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium">{event.title}</h4>
                    <p className="text-sm text-gray-600">{event.location}</p>
                  </div>
                  <button className="px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200">
                    Register
                  </button>
                </div>
              ))} */}
            </div>
          </div>

          {/* Clubs Section */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center mb-4">
              <Trello className="w-6 h-6 text-purple-600 mr-2" />
              <h3 className="text-lg font-semibold">Clubs</h3>
            </div>
            <div className="space-y-4">
              {clubs.slice(0, 3).map(club => (
                <div key={club.id} className="flex items-center p-4 hover:bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium">{club.name}</h4>
                    <p className="text-sm text-gray-600">{club.description}</p>
                  </div>
                  <button className="px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200" onClick={() => showClubDetails(club.id)}>
                    View
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Resource Booking Modal */}
      {isBookingModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-full max-w-md">
            {/* <h3 className="text-xl font-semibold mb-4">Book {selectedResource?.name}</h3> */}
            {/* Booking form elements */}
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setIsBookingModalOpen(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Confirm Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
