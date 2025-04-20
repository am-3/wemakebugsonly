import { useAuthStore } from '../../stores';
import { useCourseStore } from '../../stores/coursesStore';

const FacultyDashboard = () => {
  const { user } = useAuthStore();
  const { courses } = useCourseStore();

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Faculty Dashboard</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Teaching Courses */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-semibold mb-4">Your Courses</h3>
            {/* Course list with grade input */}
          </div>
        </div>

        {/* Club Advisory */}
        {user.advisorClubs?.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-semibold mb-4">Advised Clubs</h3>
            {/* Club management components */}
          </div>
        )}

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
          <button className="w-full mb-2 btn-primary">Create Event</button>
          <button className="w-full mb-2 btn-secondary">Input Grades</button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold mb-4">Upcoming Deadlines</h3>
          {/* Deadline list component */}
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold mb-4">Student Alerts</h3>
          {/* Alert system component */}
        </div>
      </div>
    </div>
  );
};

export default FacultyDashboard;