import { useAuthStore } from '../../stores';
import {useCourseStore} from '../../stores/coursesStore';

const StudentDashboard = () => {
  const { user } = useAuthStore();
  const { courses } = useCourseStore();

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Student Dashboard</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Academic Summary */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-semibold mb-4">Academic Overview</h3>
            {/* Grades and attendance components */}
          </div>
        </div>

        {/* Quick Links */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold mb-4">Quick Access</h3>
          <button className="w-full mb-2 btn-primary">Book Resource</button>
          <button className="w-full mb-2 btn-secondary">Join Club</button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold mb-4">Upcoming Events</h3>
          {/* Event calendar component */}
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold mb-4">Club Memberships</h3>
          {/* Club participation component */}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;