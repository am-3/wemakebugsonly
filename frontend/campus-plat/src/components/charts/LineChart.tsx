import React, { useMemo } from 'react';
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface CourseData {
  course_code: string;
  name: string;
  grade_point: number;
  attendance: number;
}

interface LineChartProps {
  data: CourseData[];
}

const LineChart: React.FC<LineChartProps> = ({ data }) => {
  const chartData = useMemo(() => {
    return data.map(course => ({
      name: course.course_code,
      gradePoint: course.grade_point,
      attendance: course.attendance,
      fullName: course.name
    }));
  }, [data]);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <RechartsLineChart
        data={chartData}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
        <XAxis dataKey="name" />
        <YAxis yAxisId="left" domain={[0, 10]} />
        <YAxis yAxisId="right" orientation="right" domain={[0, 100]} />
        <Tooltip
          content={({ active, payload, label }) => {
            if (active && payload && payload.length) {
              const course = data.find(c => c.course_code === label);
              return (
                <div className="bg-white p-3 border rounded shadow-lg">
                  <p className="font-medium">{course?.name}</p>
                  <p className="text-blue-600">Grade: {payload[0].value}</p>
                  <p className="text-green-600">Attendance: {payload[1].value}%</p>
                </div>
              );
            }
            return null;
          }}
        />
        <Legend />
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="gradePoint"
          stroke="#3b82f6"
          activeDot={{ r: 8 }}
          name="Grade Points"
        />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="attendance"
          stroke="#10b981"
          name="Attendance %"
        />
      </RechartsLineChart>
    </ResponsiveContainer>
  );
};

export default React.memo(LineChart);
