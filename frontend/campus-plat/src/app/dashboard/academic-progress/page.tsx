import BarChart from '../../../components/charts/BarChart';
import LineChart from '../../../components/charts/LineChart';

import { useAcademicStore } from '../../../stores/academicStore';

const AcademicPage: React.FC = () => {
  const { performance } = useAcademicStore();
  
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Academic Progress</h1>
      {!performance ? (
        <div className="flex flex-col items-center justify-center h-64">
          <p className="animate-bounce rounded-full h-12 border-gray-900 mb-4 text-gray-600 text-lg">No data to show</p>
        </div>
      ) : (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4">Grade Trend</h2>
          <LineChart data={performance.courses} />
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4">Attendance</h2>
          <BarChart data={performance.attendance} />
        </div>

        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4">Course Breakdown</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {performance.courses.map(course => (
              <div key={course.id} className="p-4 border rounded-lg">
                <h3 className="font-medium">{course.name}</h3>
                <p>Grade: {course.grade}</p>
                <p>Attendance: {course.attendance}%</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    
  )}
  </div>
  );
};

export default AcademicPage;