// src/types/index.ts
export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: 'student' | 'faculty' | 'admin';
  profile_picture?: string;
}

export interface Club {
  id: number;
  name: string;
  description: string;
  status: 'active' | 'inactive';
  member_count: number;
  logo?: string;
}

export interface Resource {
  id: number;
  name: string;
  type: string;
  capacity: number;
  status: 'available' | 'occupied' | 'maintenance';
}

export interface AcademicPerformance {
  cgpa: number;
  total_credits: number;
  courses: CoursePerformance[];
}

export interface CoursePerformance {
  course_code: string;
  course_name: string;
  credits: number;
  grade: string;
  grade_point: number;
  attendance_percentage: number;
}
