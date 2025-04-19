// src/services/AcademicService.ts
import api from './api';
import { AcademicPerformance, CoursePerformance } from '../types';

// Fetch the current user's academic performance dashboard
export const AcademicService = {
  getPerformance: async (): Promise<AcademicPerformance> => {
    const response = await api.get<AcademicPerformance>('/student/performance/');
    return response.data;
  },

  getGrades: async (): Promise<CoursePerformance[]> => {
    const response = await api.get<CoursePerformance[]>('/student/grades/');
    return response.data;
  },

  getAttendance: async (): Promise<any> => {
    const response = await api.get('/student/attendance/');
    return response.data;
  },

  // Add more methods as needed, e.g., for assessments, analytics, etc.
};
