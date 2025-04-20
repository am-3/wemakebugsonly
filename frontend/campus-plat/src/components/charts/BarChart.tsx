import React, { useMemo } from 'react';
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface AttendanceData {
  course_code: string;
  name: string;
  present: number;
  absent: number;
  total: number;
  percentage: number;
}

interface BarChartProps {
  data: AttendanceData[];
}

const BarChart: React.FC<BarChartProps> = ({ data }) => {
  const chartData = useMemo(() => {
    return data.map(item => ({
      name: item.course_code,
      present: item.present,
      absent: item.absent,
      percentage: item.percentage,
      fullName: item.name
    }));
  }, [data]);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <RechartsBarChart
        data={chartData}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip
          content={({ active, payload, label }) => {
            if (active && payload && payload.length) {
              const course = data.find(c => c.course_code === label);
              return (
                <div className="bg-white p-3 border rounded shadow-lg">
                  <p className="font-medium">{course?.name}</p>
                  <p className="text-green-600">Present: {payload[0].value} classes</p>
                  <p className="text-red-600">Absent: {payload[1].value} classes</p>
                  <p className="font-semibold">Attendance: {course?.percentage}%</p>
                </div>
              );
            }
            return null;
          }}
        />
        <Legend />
        <Bar dataKey="present" fill="#10b981" name="Present" />
        <Bar dataKey="absent" fill="#ef4444" name="Absent" />
      </RechartsBarChart>
    </ResponsiveContainer>
  );
};

export default React.memo(BarChart);
