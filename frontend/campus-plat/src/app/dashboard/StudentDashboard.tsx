import { useState, useEffect } from 'react';
import { useAuthStore, useClubsStore } from '../../stores';
// import { useEventStore, useCourseStore, useResourceStore} from '../../stores';
import { CartesianGrid, Line, LineChart, PieChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { Calendar, BookOpen, Award, Clock, Trello } from 'react-feather';

const StudentDashboard = () => {
  const { user } = useAuthStore();
  const { clubs, fetchClubs } = useClubsStore();
  // const { events } = useEventStore();
  // const { courses } = useCourseStore();
  // const { resources } = useResourceStore();
  // const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  // Mock data for charts (replace with real data from stores)
  const gradeData = [
    { month: 'Jan', grade: 75 },
    { month: 'Feb', grade: 82 },
    { month: 'Mar', grade: 20 },
  ];

  const attendanceData = [
    { name: 'Present', value: 85 },
    { name: 'Absent', value: 15 },
  ];

  useEffect(() => {
    Promise.all([
      fetchClubs(),
      // useEventStore.getState().fetchEvents(),
      // useCourseStore.getState().fetchCourses(),
      // useResourceStore.getState().fetchResources(),
    ]);
    // Fetch initial data on component mount
    // useEventStore.getState().fetchEvents();
    // useCourseStore.getState().fetchCourses();
    // useResourceStore.getState().fetchResources();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Dashboard Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Welcome back, {user?.first_name}</h1>
        <p className="text-gray-600 mt-2">Here's your academic overview</p>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Academic Overview */}
        <div className="lg:col-span-2 space-y-6">
          {/* Performance Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Grade Trend Card */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center mb-4">
                <Award className="w-6 h-6 text-blue-600 mr-2" />
                <h3 className="text-lg font-semibold">Grade Trend</h3>
              </div>
              <ResponsiveContainer width="100%" aspect={1.8}>
              <LineChart
                data={gradeData}
                margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                style={{color:"black"}}
              >
                <Line type="monotone" dataKey="grade" stroke="#8884d8" strokeWidth={3} />
                <CartesianGrid stroke="#eee" />
                <XAxis dataKey="month" />
                <YAxis />
              </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Attendance Card */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center mb-4">
                <Clock className="w-6 h-6 text-green-600 mr-2" />
                <h3 className="text-lg font-semibold">Attendance</h3>
              </div>
              <PieChart width={400} height={200}>
                {/* Pie chart configuration */}
              </PieChart>
            </div>
          </div>

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
                  <button className="px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200">
                    Register
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Quick Actions */}
        <div className="space-y-6">
          {/* Quick Access Card */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center mb-4">
              <BookOpen className="w-6 h-6 text-orange-600 mr-2" />
              <h3 className="text-lg font-semibold">Quick Access</h3>
            </div>
            <div className="space-y-3">
              <button className="w-full p-3 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200">
                Book Study Room
              </button>
              <button className="w-full p-3 bg-green-100 text-green-600 rounded-lg hover:bg-green-200">
                Submit Assignment
              </button>
              <button className="w-full p-3 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200">
                View Course Materials
              </button>
            </div>
          </div>

          {/* Course Progress */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Course Progress</h3>
            <div className="space-y-4">
              {/* {courses.slice(0, 3).map(course => (
                <div key={course.id} className="flex items-center">
                  <div className="flex-1">
                    <h4 className="font-medium">{course.name}</h4>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-sm text-gray-600 ml-2">{course.progress}%</span>
                </div>
              ))} */}
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
